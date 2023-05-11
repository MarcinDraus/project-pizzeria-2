import { settings, select, classNames } from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';
import Home from './components/Home.js';
const app = {

  initHome: function(){
    const thisApp = this;
    thisApp.homeContainer = document.querySelector(select.containerOf.homepage);//homepage: '.home-wrapper',
    thisApp.home = new Home(thisApp.homeContainer);
  },

  initBooking: function(){
    const thisApp = this;
    thisApp.bookingContainer = document.querySelector(select.containerOf.booking);
    thisApp.booking = new Booking(thisApp.bookingContainer);

  },

  //   const thisApp = this;
      
  //   thisApp.pages = document.querySelector(select.containerOf.pages).children;

  //   thisApp.navLinks = document.querySelectorAll(select.nav.links);

  //   thisApp.activatePage(thisApp.pages[0].id);

  // },
  // activatePage: function(pageId){
  //   const thisApp = this;
  //   for(let page of thisApp.pages){
        
  //     page.classList.toggle(classNames.pages.active, page.id == pageId);
          
  //   }
  //   //navLinks = document.querySelectorAll(select.nav.links);
  //   for(let link of thisApp.navLinks){
  //     link.classList.toggle(
  //       classNames.nav.active,
  //       link.getAttribute('href') == '#' + pageId
  //     );
  //   }
  // },

  initPages: function() {
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);

    const idFromHash = window.location.hash.replace('#/', '');
    
    
    let pageMatchingHash = thisApp.pages[0].id;
    
    for(let page of thisApp.pages){
      if(page.id == idFromHash){
        pageMatchingHash = page.id;
        break;
        
      }
    }
    console.log('pageMatchingHash2', pageMatchingHash);
    thisApp.activatePage(pageMatchingHash);
    
    for(let link of thisApp.navLinks){
      link.addEventListener('click', (event)=>{

        const clickedElement = event.currentTarget;
        event.preventDefault();
       

        // get page ID from href attr.
        const id = clickedElement.getAttribute('href').replace('#', '');
        console.log(clickedElement,'clickedElement');
        // run thisApp.activatePage() with ID
        thisApp.activatePage(id);
        console.log(id, 'id');
        // change URL hash, add / to prevent scrolling to #

        window.location.hash = '#/' + id;

      });
    }

  },

  activatePage: function(pageId){
    const thisApp = this;
    
    /* add class 'active' to matching PAGES, remove from non-matching */
    for(let page of thisApp.pages) {
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }
    console.log('pageId',pageId);
    /* add class 'active' to matching LINKS, remove from non-matching */
    for(let link of thisApp.navLinks) {
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('href') == '#' + pageId
      );
    }
  },
 
  // initPages: function () {
  //   const thisApp = this;
  //   thisApp.pages = document.querySelector(select.containerOf.pages).children;//złapać <div id="pages"> i złapać wszystkie  dzieci czyli u nas <section id="order"> i <section id="booking">
  //   // w momencie otwarcia strony chcemy aby aktywowała sie pierwsza z postron i w tym celu uzyjemy metody activate pages będziemy przekazywać jej ID contenera podstrony.
  //   thisApp.navLinks = document.querySelectorAll(select.nav.links);
  //   console.log('page', thisApp.pages);
  //   const idFromHash = window.location.hash.replace('#/', '');
  //   //console.log('idFromHash', idFromHash );
  //   //thisApp.activatePage(thisApp.pages[0].id);
  //   //thisApp.activatePage(idFromHash);
  //   let pageMatchingHash = thisApp.pages[0].id;

  //   for(let page of thisApp.pages){
  //     if(page.id == idFromHash){
  //       pageMatchingHash = page.id;
  //       break;
  //     }
      
  //   }

  //   //thisApp.activatePage(idFromHash);

  //   thisApp.activatePage(pageMatchingHash);
    
  //   for(let link of thisApp.navLinks){
  //     link.addEventListener('click', function(event){
  //       //const clickedElement = event.target;
  //       event.preventDefault();
  //       const clickedElement  = this;
  //       //get page id from href attribute
  //       const id = clickedElement.getAttribute('href').replace('#', '');
  //       //run thisApp.activatePage with that id
  //       thisApp.activatePage(id);
  //       //change url hash
  //       window.location.hash = '#/' + id;
  //     });
  //   }
  // },

  //  activatePage: function(pageId){
  //    const thisApp = this;
            
  //   /* add class 'active' to matching PAGES, remove from non-matching */
  //   for(let page of thisApp.pages) {
  //    // page.classList.toggle(classNames.pages.active, page.id == pageId);
  //     if(page.Id = pageId){
  //       page.classList.add(classNames.pages.active);
  //     }else{
  //       page.classList.remove(classNames.pages.active);
  //     }
  //   }
  //   /* add class 'active' to matching LINKS, remove from non-matching */
  //   for(let link of thisApp.navLinks) {
  //     link.classList.toggle(
  //       classNames.nav.active,
  //       link.getAttribute('href') == '#' + pageId
  //     );
  //   }
  // },
        
    

  initCart: function () {
    const thisApp = this;
    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);
    thisApp.productList = document.querySelector(select.containerOf.menu);
    thisApp.productList.addEventListener('add-to-cart', function (event) {
      app.cart.add(event.detail.product);
    });
  },

  initData: function () {
    const thisApp = this;
    //console.log('thisApp.data:', thisApp.data);
    //thisApp.data = dataSource;
    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.products;

    fetch(url)
      .then(function (rawResponse) {
        return rawResponse.json();
      })
      .then(function (parsedResponse) {
        //console.log('parsedResponse', parsedResponse);
        //  save parsedResponse as thisApp.data.products
        thisApp.data.products = parsedResponse;

        //  execute initMenu
        app.initMenu();
      });
  },
  initMenu: function () {
    const thisApp = this;
    //console.log('thisApp.data:', thisApp.data);

    for (let productData in thisApp.data.products) {
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },
  
  init: function () {
    const thisApp = this;
    //console.log('*** App starting ***');
    //console.log('thisApp:', thisApp);
    //console.log('classNames:', classNames);
    //console.log('settings:', settings);
    //console.log('templates:', templates);
    //thisApp.initPages();
    //thisApp.activatePage();
    thisApp.initData();
    thisApp.initMenu();
    thisApp.initCart();
    thisApp.initHome();
    thisApp.initPages();
    thisApp.initBooking();
  },
  
};
app.init();


