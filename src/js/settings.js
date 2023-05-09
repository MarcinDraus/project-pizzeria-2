export const select = {
  templateOf: {
    menuProduct: '#template-menu-product',
    cartProduct: '#template-cart-product', // CODE ADDED
    bookingWidget: '#template-booking-widget',//10.4
    homepage: '#template-homepage-widget',//home
  },
  containerOf: {
    menu: '#product-list',
    cart: '#cart',
    pages: '#pages',//10.4
    booking: '.booking-wrapper',//10.4
    tables: '.floor-plan',
    homepage: '.home-wrapper',//home
    carousel: '.main-carousel',//home/carousel
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
    datePicker: {
      wrapper: '.date-picker',
      input: `input[name="date"]`,
    },
    hourPicker: {
      wrapper: '.hour-picker',
      input: 'input[type="range"]',
      output: '.output',
    },
  },
  booking: {
    peopleAmount: '.people-amount',
    hoursAmount: '.hours-amount',
    tables: '.floor-plan .table',
    form: '.booking-form',
    phone: '.order-confirmation [name="phone"]',
    address: '.order-confirmation [name="address"]',
    duration: 'input[name="hours"]',
    people: 'input[name="people"]',
    starters: 'input[name="starter"]',
  },
  nav: {
    links: '.main-nav a',
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
  
export const classNames = {
  menuProduct: {
    wrapperActive: 'active',
    imageVisible: 'active',
  },
  // CODE ADDED START
  cart: {
    wrapperActive: 'active',
  },
  // CODE ADDED END
  booking: {
    loading: 'loading',
    tableBooked: 'booked',
    tableSelected: 'selected',
  },
  nav: {
    active: 'active',
  },
  pages: {
    active: 'active',
  }//10.4
};
  
export const settings = {
  amountWidget: {
    defaultValue: 1,
    defaultMin: 1,
    defaultMax: 10,
  }, // CODE CHANGED
  // CODE ADDED START
  hours: {
    open: 12,
    close: 24,
  },
  datePicker: {
    maxDaysInFuture: 14,
  },
  booking: {
    tableIdAttribute: 'data-table',
  },
  cart: {
    defaultDeliveryFee: 20,
  },
  db: {
    url: '//localhost:3131',
    products: 'products',
    homepage: 'homepage',//home
    orders: 'orders',
    bookings: 'bookings',
    events: 'events',
    dateStartParamKey: 'date_gte',
    dateEndParamKey: 'date_lte',
    notRepeatParam: 'repeat=false',
    repeatParam: 'repeat_ne=false'
  },
  // CODE ADDED END
  
};
  
export const templates = {
  menuProduct: Handlebars.compile(
    document.querySelector(select.templateOf.menuProduct).innerHTML
  ), // CODE ADDED START
  cartProduct: Handlebars.compile(
    document.querySelector(select.templateOf.cartProduct).innerHTML
  ),
  // CODE ADDED END
  bookingWidget: Handlebars.compile(document.querySelector(select.templateOf.bookingWidget).innerHTML
  ),
  homepage: Handlebars.compile(document.querySelector(select.templateOf.homepage).innerHTML
  ),
};
// export const dataSource = {};
// dataSource.image =[
//   {
//     id: 1,
//     image: './images/home/pizza-1.jpg',
//   },
//   {
//     id: 2,
//     image: './images/home/pizza-2.jpg',
//   },
//   {
//     id: 3,
//     image: './images/home/pizza-3.jpg',
//   },
//   {
//     id: 4,
//     image: './images/home/pizza-4.jpg',
//   },
//   {
//     id: 5,
//     image: './images/home/pizza-5.jpg',
//   },
//   {
//     id: 6,
//     image: './images/home/pizza-6.jpg',
//   },
// ];

export default settings;