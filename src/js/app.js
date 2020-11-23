import {settings, select, classNames} from './settings.js';
import Product from './components/Product.js';
import Cart from './components/Cart.js';
import Booking from './components/Booking.js';
// import RegisterForm from './components/RegisterForm.js';

const app = {
  initMenu: function () {
    const thisApp = this;
    //console.log('thisApp.data:', thisApp.data);
    for (let productData in thisApp.data.products) {
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
    //const testProduct = new Product();
    //console.log('testProduct:', testProduct);
  },
  // initData: function () {
  //   const thisApp = this;

  //   thisApp.data = {};
  //   const url = settings.db.url + '/' + settings.db.product;
  //   console.log('url', url);
  //   fetch(url)
  //     .then(function (rawResponse) {
  //       return rawResponse.json();
  //     })
  //     .then(function (parsedResponse) {
  //       console.log('parseResponse', parsedResponse);

  //       thisApp.data.products = parsedResponse; /* save parsedResponse as thisApp.data.products */

  //       thisApp.initMenu(); /* execute initMenu method */

  //     });
  //   console.log('this.data', JSON.stringify(thisApp.data));
  // },
  initData: function(){
    const thisApp = this;

    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.product;

    fetch(url)
      .then(function(rawResponse){
        return rawResponse.json();
      })
      .then(function(parsedResponse){
        thisApp.data.products = parsedResponse;
        thisApp.initMenu();
      });
  },
  initCart: function () {
    const thisApp = this;
    thisApp.productList = document.querySelector(select.containerOf.menu);
    thisApp.productList.addEventListener('add-to-cart', function(event){
      app.cart.add(event.detail.product);
    });
    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);
    console.log(thisApp);
  },
  initPages: function() {
    const thisApp = this;
    thisApp.pages = Array.from(document.querySelector(select.containerOf.pages).children);
    thisApp.navLinks = Array.from(document.querySelectorAll(select.nav.links));
    console.log(thisApp.pages);
    let pagesMatchingHash = [];

    if (window.location.hash.length > 2) {
      const idFromHash = window.location.hash.replace('#/', '');

      pagesMatchingHash = thisApp.pages.filter(function (page) {
        return page.id == idFromHash;
      });
    }

    thisApp.activatePage(pagesMatchingHash.length ? pagesMatchingHash[0].id : thisApp.pages[0].id);



    for (let link of thisApp.navLinks) {
      link.addEventListener('click', function (event) {
        const clickedElement = this;
        event.preventDefault();

        /* TODO: get page id from href*/
        const pageId = clickedElement.getAttribute('href');
        const href = pageId.replace('#', '');
        /* TODO activate page*/
        thisApp.activatePage(href);
      });
    }
  },

  activatePage: function (pageId) {
    const thisApp = this;

    for (let link of thisApp.navLinks) {
      link.classList.toggle(classNames.nav.active, link.getAttribute('href') == '#' + pageId);
      console.log('LINK', link);
    }
    for (let page of thisApp.pages) {
      page.classList.toggle(classNames.nav.active, page.getAttribute('id') == pageId);
      console.log('PAGE', page);
    }
    window.location.hash = '#/' + pageId;
    document.body.classList = pageId;
  },
  initBooking: function() {
    const thisApp = this;
    const reservationWidget = document.querySelector(select.containerOf.booking);

    thisApp.booking = new Booking(reservationWidget);

    console.log('BOOKING', thisApp.booking);
  },
  init: function () {
    const thisApp = this;
    // console.log('*** App starting ***');
    // console.log('thisApp:', thisApp);
    // console.log('classNames:', classNames);
    // console.log('settings:', settings);
    // console.log('templates:', templates);
    thisApp.initPages();
    thisApp.initData();
    // thisApp.initMenu();
    thisApp.initCart();
    thisApp.initBooking();
  },
};
app.init();