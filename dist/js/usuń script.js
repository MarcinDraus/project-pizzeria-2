/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars
{
  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
      cartProduct: '#template-cart-product', // CODE ADDED
    },
    containerOf: {
      menu: '#product-list',
      cart: '#cart',
    },
    all: {
      menuProducts: '#product-list > .product',
      menuProductsActive: '#product-list > .product.active',
      formInputs: 'input, select',
    },
    menuProduct: {
      clickable: '.product__header',
      form: '.product__order',
      priceElem: '.product__total-price .price',
      imageWrapper: '.product__images',
      amountWidget: '.widget-amount',
      cartButton: '[href="#add-to-cart"]',
    },
    widgets: {
      amount: {
        input: 'input.amount', // CODE CHANGED
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
    // CODE ADDED START
    cart: {
      productList: '.cart__order-summary',
      toggleTrigger: '.cart__summary',
      totalNumber: `.cart__total-number`,
      totalPrice:
        '.cart__total-price strong, .cart__order-total .cart__order-price-sum strong',
      subtotalPrice: '.cart__order-subtotal .cart__order-price-sum strong',
      deliveryFee: '.cart__order-delivery .cart__order-price-sum strong',
      form: '.cart__order',
      formSubmit: '.cart__order [type="submit"]',
      phone: '[name="phone"]',
      address: '[name="address"]',
    },
    cartProduct: {
      amountWidget: '.widget-amount',
      price: '.cart__product-price',
      edit: '[href="#edit"]',
      remove: '[href="#remove"]',
    },
    // CODE ADDED END
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
    // CODE ADDED START
    cart: {
      wrapperActive: 'active',
    },
    // CODE ADDED END
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 10,
    }, // CODE CHANGED
    // CODE ADDED START
    cart: {
      defaultDeliveryFee: 20,
    },
    db: {
      url: '//localhost:3131',
      products: 'products',
      orders: 'orders',
    },
    // CODE ADDED END
  };

  const templates = {
    menuProduct: Handlebars.compile(
      document.querySelector(select.templateOf.menuProduct).innerHTML
    ),
    // CODE ADDED START
    cartProduct: Handlebars.compile(
      document.querySelector(select.templateOf.cartProduct).innerHTML
    ),
    // CODE ADDED END
  };

  class Product {
    constructor(id, data) {
      const thisProduct = this;
      //żeby wszystkie referencje do elementów DOM były 'schowane' w dodatkowym obiekcie thisProduct.dom.
      thisProduct.dom = {};
      thisProduct.id = id;
      thisProduct.data = data;
      thisProduct.renderInMenu();
      thisProduct.getElements();
      thisProduct.initAccordion();
      thisProduct.initOrderForm();
      thisProduct.initAmountWidget();
      thisProduct.processOrder();

      //app      //console.log('new Product:', thisProduct);
    }
    renderInMenu() {
      const thisProduct = this;
      /*generate HTML based on template*/
      const generatedHTML = templates.menuProduct(thisProduct.data);
      //console.log(generatedHTML);
      /*create element using utils.createElementFromHTML*/
      thisProduct.element = utils.createDOMFromHTML(generatedHTML);
      /*find menu container*/
      const menuContainer = document.querySelector(select.containerOf.menu);
      /*add element to menu*/
      menuContainer.appendChild(thisProduct.element);
    }
    getElements() {
      const thisProduct = this;

      thisProduct.accordionTrigger = thisProduct.element.querySelector(
        select.menuProduct.clickable
      );
      thisProduct.form = thisProduct.element.querySelector(
        select.menuProduct.form
      );
      thisProduct.formInputs = thisProduct.form.querySelectorAll(
        select.all.formInputs
      );
      thisProduct.cartButton = thisProduct.element.querySelector(
        select.menuProduct.cartButton
      );
      thisProduct.priceElem = thisProduct.element.querySelector(
        select.menuProduct.priceElem
      );
      thisProduct.imageWrapper = thisProduct.element.querySelector(
        select.menuProduct.imageWrapper
      );
      thisProduct.amountWidgetElem = thisProduct.element.querySelector(
        select.menuProduct.amountWidget
      );
    }
    initAccordion() {
      const thisProduct = this;
      /* find the clickable trigger (the element that should react to clicking) */
      //const clickableTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      /* START: add event listener to clickable trigger on event click */
      thisProduct.accordionTrigger.addEventListener('click', function (event) {
        //clickableTrigger.addEventListener('click', function(event) {
        /* prevent default action for event */
        event.preventDefault();
        /* find active product (product that has active class) */
        const activeProduct = document.querySelector(
          select.all.menuProductsActive
        );

        if (activeProduct && activeProduct !== thisProduct.element) {
          activeProduct.classList.remove(classNames.menuProduct.wrapperActive);
        }
        /* toggle active class on thisProduct.element */
        thisProduct.element.classList.toggle(
          classNames.menuProduct.wrapperActive
        );
      });
    }
    initOrderForm() {
      const thisProduct = this;
      //console.log('initOrderForm', this.initOrderForm);
      thisProduct.form.addEventListener('submit', function (event) {
        event.preventDefault();
        thisProduct.processOrder();
      });

      for (let input of thisProduct.formInputs) {
        input.addEventListener('change', function () {
          thisProduct.processOrder();
        });
      }

      thisProduct.cartButton.addEventListener('click', function (event) {
        event.preventDefault();
        thisProduct.processOrder();
        thisProduct.addToCart();
      });
    }
    initAmountWidget() {
      const thisProduct = this;

      thisProduct.amountWidget = new AmountWidget(thisProduct.amountWidgetElem);
      /* Nasłuchiwanie eventu. Drugą częścią informowania produktu, jak już wspomnieliśmy, jest nasłuchiwanie tego eventu w klasie Product. Co bowiem z tego, że event updated*/
      thisProduct.amountWidgetElem.addEventListener('updated', () => {
        thisProduct.processOrder();
      });
    }
    processOrder() {
      const thisProduct = this;
      // console.log('processOrder', this.processOrder);
      // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}
      const formData = utils.serializeFormToObject(thisProduct.form);
      //console.log('formData', formData);
      // set price to default price
      let price = thisProduct.data.price;
      // for every category (param)...
      for (let paramId in thisProduct.data.params) {
        // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
        const param = thisProduct.data.params[paramId];
        //console.log(paramId, param);
        // for every option in this category
        for (let optionId in param.options) {
          // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
          const option = param.options[optionId];
          //console.log(optionId, option);
          // check if there is param with a name of paramId in formData and if it includes optionId
          //if(formData[paramId] && formData[paramId].includes(optionId)) {
          const optionSelected =
            formData[paramId] && formData[paramId].includes(optionId);
          // find image by class paramId-optionId
          const optionImage = document.querySelector(
            `.${paramId}-${optionId}`
          ); /*thisProduct.imageWrapper.querySelector ('.' + paramId + '-' + optionId);*/
          //console.log('optionImage', optionImage);
          //image from DataSource.products.images
          if (optionImage) {
            //includes in param.options[optionId]
            if (optionSelected) {
              //Image add class active
              optionImage.classList.add(classNames.menuProduct.imageVisible);
            } else {
              //Image remove class active
              optionImage.classList.remove(classNames.menuProduct.imageVisible);
            }
            // eslint-disable-next-line no-empty
          } else {
          }
          if (optionSelected) {
            // check if the option is not default
            if (!option.default) {
              // add option price to price variable
              price += option.price;
            }
          }
          //}
          else {
            // check if the option is default
            if (option.default) {
              // reduce price variable
              price -= option.price;
            }
          }
        }
      }
      thisProduct.priceSingle = price;
      //  multiply price by amount
      price *= thisProduct.amountWidget.value;
      // update calculated price in the HTML
      thisProduct.priceElem.innerHTML = price;
    }
    prepareCartProduct() {
      const thisProduct = this;
      const productSummary = {
        id: thisProduct.id,
        name: thisProduct.data.name,
        amount: thisProduct.amountWidget.value,
        priceSingle: thisProduct.priceSingle,
        price: thisProduct.priceSingle * thisProduct.amountWidget.value,
        params: thisProduct.prepareCartProductParams(),
      };
      return productSummary;
    }
    prepareCartProductParams() {
      const thisProduct = this;
      // covert form to object structure e.g. { sauce: ['tomato'], toppings: ['olives', 'redPeppers']}
      const formData = utils.serializeFormToObject(thisProduct.form);
      let params = {};
      // for every category (param)...
      for (let paramId in thisProduct.data.params) {
        // determine param value, e.g. paramId = 'toppings', param = { label: 'Toppings', type: 'checkboxes'... }
        const param = thisProduct.data.params[paramId];
        params[paramId] = {
          label: param.label,
          options: {},
        };
        // for every option in this category
        for (let optionId in param.options) {
          // determine option value, e.g. optionId = 'olives', option = { label: 'Olives', price: 2, default: true }
          const option = param.options[optionId];
          const optionSelected =
            formData[paramId] && formData[paramId].includes(optionId);
          // check if optionId of paramId - any topping, crust, sauce  - is selected in formData
          if (optionSelected) {
            params[paramId].options[optionId] = option.label;
          }
        }
      }
      return params;
    }
    addToCart() {
      const thisProduct = this;
      app.cart.add(thisProduct.prepareCartProduct());
    }
  }
  class Cart {
    constructor(element) {
      const thisCart = this;
      thisCart.products = [];
      thisCart.getElements(element);
      // wysówa menu  koszyk z zamówieniem order
      thisCart.initActions();
      console.log('new Cart', thisCart);
      thisCart.dom.form = select.cart.form;
    }
    getElements(element) {
      const thisCart = this;
      thisCart.dom = {};
      thisCart.dom.wrapper = element;
      thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(
        select.cart.toggleTrigger
      );
      //9.4. Dodawanie produktów do koszyka,  kliknięcie buttona 'ADD TO CART' powinno wyświetlać produkt w koszyku!– powinien być równy odpowiedniemu elementowi z HTML-a. Dokładnie liście produktów.
      thisCart.dom.productList = thisCart.dom.wrapper.querySelector(
        select.cart.productList
      );
      //console.log(thisCart.dom.productList);
      //DOM elements for cart total, subtotal, delivery fee
      thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(
        select.cart.deliveryFee
      );
      thisCart.dom.subtotalPrice = thisCart.dom.wrapper.querySelector(
        select.cart.subtotalPrice
      );
      thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelectorAll(
        select.cart.totalPrice
      );
      thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(
        select.cart.totalNumber
      );
      thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
      thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);
      thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
    }

    initActions() {
      const thisCart = this;
      thisCart.dom.toggleTrigger.addEventListener('click', () => {
        thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
      });
      thisCart.dom.productList.addEventListener('updated', function () {
        thisCart.update();
      });
      thisCart.dom.productList.addEventListener('remove', function (event) {
        thisCart.remove(event.detail.cartProduct);
      });
      thisCart.dom.form.addEventListener('submit', function (event) {
        event.preventDefault();
        thisCart.sendOrder();
      });
    }
    // sendOrder(){
    //   const thisCart = this;
    //   const url = settings.db.url + '/' + settings.db.orders;
    //   const payload = {

    //   }
    //}
    add(menuProduct) {
      const thisCart = this;
      //console.log('adding product', menuProduct);
      const generatedHTML = templates.cartProduct(menuProduct);
      //console.log('html cart', generatedHTML);

      const generatedDOM = utils.createDOMFromHTML(generatedHTML);
      //console.log(generatedDOM);

      thisCart.dom.productList.appendChild(generatedDOM);

      //Jeśli każdorazowo przy dodawaniu produktu do koszyka, będziemy zapisywać obiekt jego podsumowania do tablicy thisCart.products, to będzie ona dla nas swego rodzaju podsumowaniem. Kiedy tylko będziemy mieli taką ochotę, będziemy mogli wejść do tej tablicy i sprawdzić, jakie aktualnie elementy są w naszym koszyku, włącznie z dokładnymi informacjami na ich temat, takich jak cena czy liczba sztuk.
      thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
      //console.log('thisCart.products', thisCart.products);

      thisCart.update();
    }
    update() {
      const thisCart = this;

      const deliveryFee = settings.cart.defaultDeliveryFee;
      thisCart.totalNumber = 0;
      thisCart.subtotalPrice = 0;
      if (thisCart.products.length == 0) {

        thisCart.totalPrice = 0;
        thisCart.dom.deliveryFee.innerHTML = 0;
        thisCart.dom.subtotalPrice.innerHTML = 0;
        thisCart.dom.totalNumber.innerHTML = 0;
      } else {
        for (const cartProduct of thisCart.products) {
          thisCart.totalNumber += cartProduct.amount;
          thisCart.subtotalPrice += cartProduct.price;

          thisCart.totalPrice = thisCart.subtotalPrice + deliveryFee;
          thisCart.dom.deliveryFee.innerHTML = deliveryFee;
          thisCart.dom.subtotalPrice.innerHTML = thisCart.subtotalPrice;
          thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;

        }
      }
      for (let totalpriceEl of thisCart.dom.totalPrice) {
        totalpriceEl.innerHTML = thisCart.totalPrice;
      }
    }
    // update() {
    //   const thisCart = this;
    //   const deliveryFee = settings.cart.defaultDeliveryFee;
    //   thisCart.totalNumber = 0;
    //   thisCart.subtotalPrice = 0;

    // for (const cartProduct of thisCart.products) {
    //   thisCart.totalNumber += cartProduct.amount;
    //   thisCart.subtotalPrice += cartProduct.price;
    // }
    // thisCart.dom.deliveryFee.innerHTML = deliveryFee;
    // if (thisCart.totalNumber !== 0) {
    //   thisCart.totalPrice = thisCart.subtotalPrice + deliveryFee;
    // }else if (thisCart.totalNumber == 0){
    //   thisCart.totalPrice = thisCart.subtotalPrice;
    //   thisCart.dom.deliveryFee.innerHTML = 0;
    // }

    // thisCart.dom.subtotalPrice.innerHTML = thisCart.subtotalPrice;
    // thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;

    // for (let totalPrice of thisCart.dom.totalPrice) {
    //   totalPrice.innerHTML = thisCart.totalPrice;
    // }
    //}
    // send order to database on json server
    sendOrder() {
      const thisCart = this;
      const url = settings.db.url + '/' + settings.db.orders;
      const payload = {
        address: thisCart.dom.address.value,
        phone: thisCart.dom.phone.value,
        totalPrice: thisCart.totalPrice,
        subtotalPrice: thisCart.subtotalPrice,
        totalNumber: thisCart.totalNumber,
        deliveryFee: settings.cart.defaultDeliveryFee,
        products: []
      };
      for (let prod of thisCart.products) {
        payload.products.push(prod.getData());
      }
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      };

      fetch(url, options);
    }
    // remove product from the cart
    remove(cartProduct) {
      const thisCart = this;
      const products = thisCart.products;
      // remove from html
      cartProduct.dom.wrapper.remove();
      const removedProduct = products.indexOf(cartProduct);
      products.splice(removedProduct, 1);
      thisCart.update();
    }
  }
  class CartProduct {
    constructor(menuProduct, element) {
      const thisCartProduct = this;

      thisCartProduct.id = menuProduct.id;
      thisCartProduct.name = menuProduct.name;
      thisCartProduct.amount = menuProduct.amount;
      thisCartProduct.price = menuProduct.price;
      thisCartProduct.priceSingle = menuProduct.priceSingle;
      thisCartProduct.params = menuProduct.params;

      thisCartProduct.getElements(element);
      thisCartProduct.AmountWidget();
      thisCartProduct.initActions();

      console.log('new CartProduct', thisCartProduct);
    }
    getElements(element) {
      const thisCartProduct = this;
      thisCartProduct.dom = {};

      thisCartProduct.dom.wrapper = element;
      console.log(thisCartProduct.dom.wrapper);
      thisCartProduct.dom.amountWidget =
        thisCartProduct.dom.wrapper.querySelector(
          select.cartProduct.amountWidget
        );
      thisCartProduct.dom.price = thisCartProduct.dom.wrapper.querySelector(
        select.cartProduct.price
      );
      thisCartProduct.dom.edit = thisCartProduct.dom.wrapper.querySelector(
        select.cartProduct.edit
      );
      thisCartProduct.dom.remove = thisCartProduct.dom.wrapper.querySelector(
        select.cartProduct.remove
      );
    }
    AmountWidget() {
      const thisCartProduct = this;

      thisCartProduct.amountWidget = new AmountWidget(
        thisCartProduct.dom.amountWidget
      );

      /* Nasłuchiwanie eventu. Drugą częścią informowania produktu, jak już wspomnieliśmy, jest nasłuchiwanie tego eventu w klasie Product. Co bowiem z tego, że event updated*/
      thisCartProduct.dom.amountWidget.addEventListener('updated', () => {
        thisCartProduct.amount = thisCartProduct.amountWidget.value;
        thisCartProduct.price =
          thisCartProduct.priceSingle * thisCartProduct.amount;
        // console.log(thisCartProduct.amount.value);
        // console.log(thisCartProduct.price);
        thisCartProduct.dom.price.innerHTML = thisCartProduct.price;
      });
    }
    remove() {
      const thisCartProduct = this;
      const event = new CustomEvent('remove', {
        bubbles: true,
        detail: {
          cartProduct: thisCartProduct,
        },
      });
      thisCartProduct.dom.wrapper.dispatchEvent(event);
    }
    initActions() {
      const thisCartProduct = this;

      thisCartProduct.dom.edit.addEventListener('click', function (bin) {
        // eslint-disable-next-line no-undef
        bin.preventDefault();
      });
      thisCartProduct.dom.remove.addEventListener('click', function (bin) {
        // eslint-disable-next-line no-undef
        bin.preventDefault();
        thisCartProduct.remove();
        // eslint-disable-next-line no-undef
        console.log(thisCartProduct.remove);
      });
    }
    getData() {
      const thisCartProduct = this;
      console.log(thisCartProduct);

      const cartProductSummary = {
        id: thisCartProduct.id,
        name: thisCartProduct.name,
        amount: thisCartProduct.amountWidget.value,
        priceSingle: thisCartProduct.priceSingle,
        price: thisCartProduct.price,
        params: thisCartProduct.params
      };
      return cartProductSummary;
    }
  }
  const app = {
    initCart: function () {
      const thisApp = this;
      const cartElem = document.querySelector(select.containerOf.cart);
      thisApp.cart = new Cart(cartElem);
    },
    
    initData: function () {
      const thisApp = this;
      //console.log('thisApp.data:', thisApp.data);
      //thisApp.data = dataSource;
      thisApp.data = {};
      const url = settings.db.url + '/' + settings.db.products;
      /*Połącz się z adresem url przy użyciu metody fetch.
Jeśli połączenie się zakończy, to wtedy (pierwsze .then) skonwertuj dane do obiektu JS-owego.
Kiedy i ta operacja się zakończy, to wtedy (drugie .then) pokaż w konsoli te skonwertowane dane.*/
      fetch(url)
        .then(function (rawResponse) {
          return rawResponse.json();
        })
        .then(function (parsedResponse) {
          console.log('parsedResponse', parsedResponse);
          //  save parsedResponse as thisApp.data.products
          thisApp.data.products = parsedResponse;

          //  execute initMenu
          app.initMenu();
        });

    },
    initMenu: function () {
      const thisApp = this;
      console.log('thisApp.data:', thisApp.data);

      for (let productData in thisApp.data.products) {
        new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
      }
    },

    init: function () {
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);
      thisApp.initData();
      //thisApp.initMenu();
      thisApp.initCart();
    },
  };
  class AmountWidget {
    constructor(element) {
      const thisWidget = this;
      thisWidget.getElements(element);

      thisWidget.value = settings.amountWidget.defaultValue;
      /*Gdy produkt generuje swój HTML, to w inpucie od razu wstawia nam domyślną wartość.Chodzi o to, żeby nawet na samym starcie, kiedy nikt jeszcze nie zmienił wartości w inpucie, nasza instancja miała już informację co w tym inpucie jest */
      thisWidget.setValue(thisWidget.input.value);
      thisWidget.initActions();
      //console.log('AmountWidget:', thisWidget);
      //console.log('constructor arguments:', element);
    }
    getElements(element) {
      const thisWidget = this;

      thisWidget.element = element;
      thisWidget.input = thisWidget.element.querySelector(
        select.widgets.amount.input
      );
      thisWidget.linkDecrease = thisWidget.element.querySelector(
        select.widgets.amount.linkDecrease
      );
      thisWidget.linkIncrease = thisWidget.element.querySelector(
        select.widgets.amount.linkIncrease
      );
    }
    setValue(value) {
      const thisWidget = this;
      const newValue = parseInt(value);
      //thisWidget.value = settings.amountWidget.defaultValue;
      /*TODO: Add validation*/
      /*żeby nasza funkcja ustalała, czy to co wpisano w input jest faktycznie liczbą,newValue nie jest też null-em*/
      if (
        thisWidget.value !== newValue &&
        !isNaN(newValue) &&
        newValue >= settings.amountWidget.defaultMin &&
        newValue <= settings.amountWidget.defaultMax
      ) {
        thisWidget.value =
          newValue;
      }
      thisWidget.input.value = thisWidget.value;
      thisWidget.announce();
    }
    initActions() {
      const thisWidget = this;
      thisWidget.input.addEventListener('change', () => {
        thisWidget.setValue(thisWidget.input.value);
      });
      thisWidget.linkDecrease.addEventListener('click', (event) => {
        event.preventDefault();
        thisWidget.setValue(thisWidget.input.value - 1);
      });
      thisWidget.linkIncrease.addEventListener('click', (event) => {
        event.preventDefault();
        thisWidget.setValue(thisWidget.value + 1);
      });
    }
    announce() {
      const thisWidget = this;
      //const event = new Event('updated');
      const event = new CustomEvent('updated', { bubbles: true });
      thisWidget.element.dispatchEvent(event);
    }
  }
  app.init();
}

