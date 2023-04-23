
import {select} from '../settings.js';
import AmountWidget from '../components/AmountWidget.js';
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
export default CartProduct;