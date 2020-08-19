/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

//const { active } = require("browser-sync");

//const { utils } = require("stySlelint");

{
  'use strict';

  const select = {
    templateOf: {
      menuProduct: '#template-menu-product',
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
        input: 'input[name="amount"]',
        linkDecrease: 'a[href="#less"]',
        linkIncrease: 'a[href="#more"]',
      },
    },
  };

  const classNames = {
    menuProduct: {
      wrapperActive: 'active',
      imageVisible: 'active',
    },
  };

  const settings = {
    amountWidget: {
      defaultValue: 1,
      defaultMin: 1,
      defaultMax: 9,
    }
  };

  const templates = {
    menuProduct: Handlebars.compile(document.querySelector(select.templateOf.menuProduct).innerHTML),
  };
  
  class Product{
    constructor ( id, data){
      const thisProduct = this;
      thisProduct.id = id;
      thisProduct.data = data;

      thisProduct.renderInMenu();
      thisProduct.initAccordion();

      console.log('new Product:', thisProduct);
    }
    renderInMenu(){
      const thisProduct = this;

      /* [done] generate HTML Based on template */
      const generateHTML = templates.menuProduct(thisProduct.data);
      console.log('ganarate HTML =', generateHTML);
      /* [done] create element using utilis.createElementFromHTML */
      thisProduct.element = utils.createDOMFromHTML(generateHTML);
      /* [done] find menu conteiner */
      const menuContainer = document.querySelector(select.containerOf.menu);
      /* [done]add element to menu */
      menuContainer.appendChild(thisProduct.element);
    }
   
    initAccordion(){
      const thisProduct = this;
      thisProduct.accordionTrigger = thisProduct.element.querySelector(select.menuProduct.clickable);
      /* find the clickable trigger (the element that should react to clicking) */
      const clickableTrigger = thisProduct.accordionTrigger;
      
      /* START: click event listener to trigger */

      clickableTrigger.addEventListener('click', function(event){
        console.log('clicked');
       
        /* prevent default action for event */
        event.preventDefault();
        /* toggle active class on element of thisProduct */
        thisProduct.element.classList.toggle(classNames.menuProduct.wrapperActive);
        /* find all active products */
        const allActiveProducts = document.querySelectorAll('.product.active');
        /* START LOOP: for each active product */
        for(let allActiveProduct of allActiveProducts){
          /* START: if the active product isn't the element of thisProduct */
          if(allActiveProduct != thisProduct.element){
            /* remove class active for the active product */
            allActiveProduct.classList.remove(classNames.menuProduct.wrapperActive);
          /* END: if the active product isn't the element of thisProduct */
          }
        /* END LOOP: for each active product */
        }
      /* END: click event listener to trigger */
      });
    }
  } 
  const app = {
    initData: function(){
      const thisApp = this;

      thisApp.data = dataSource;
      console.log('thisApp.data:', thisApp.data);

      for(let productData in thisApp.data.products){
        new Product (productData, thisApp.data.products[productData]);
      }
    },
    initMenu: function(){
      const testProduct = new Product();
      console.log ('testProduct:' , testProduct);
    },
    init: function(){
      const thisApp = this;
      console.log('*** App starting ***');
      console.log('thisApp:', thisApp);
      console.log('classNames:', classNames);
      console.log('settings:', settings);
      console.log('templates:', templates);
      thisApp.initData();
      thisApp.initMenu();
    },
  };

  app.init();
}