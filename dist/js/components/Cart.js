import {templates, classNames, select, settings} from '../settings.js';
import utils from '../utils.js';
import CartProduct from '../components/CartProduct.js';
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
export default Cart;