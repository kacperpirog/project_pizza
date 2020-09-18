import {settings, select} from '../settings.js';

class AmountWidget {
  constructor(element){
    const thisWidget = this;

    thisWidget.getElements(element);
    thisWidget.setValue(thisWidget.input.value || 1);
    thisWidget.initActions();
      
    console.log('AmountWidget:', thisWidget);
    console.log('constructor arguments:', element); 
  }
  getElements(element){
    const thisWidget = this;
    
    thisWidget.element = element;
    thisWidget.input = thisWidget.element.querySelector(select.widgets.amount.input);
    thisWidget.linkDecrease = thisWidget.element.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.linkIncrease = thisWidget.element.querySelector(select.widgets.amount.linkIncrease);
  }
  setValue(value) {
    const thisWidget = this;
      
    const newValue = thisWidget.parseValue(value);

    /*TODO: Add walidation*/
    if (newValue != thisWidget.value && thisWidget.isValid(newValue)) {
      thisWidget.value = newValue;
      thisWidget.announce();
    }
  
    thisWidget.renderValue();
    thisWidget.value = newValue;
    thisWidget.announce();
    thisWidget.input.value = thisWidget.value;
      
  }
  parseValue(value) {
    return parseInt(value);
  }
  
  isValid(newValue) {
    return !isNaN(newValue) && newValue >= settings.amountWidget.defaultMin && newValue <= settings.amountWidget.defaultMax;
  }
  
  renderValue() {
    const thisWidget = this;
  
    thisWidget.input.value = thisWidget.value;
  }
    
  initActions(){
    const thisWidget = this;
    thisWidget.input.addEventListener('change', function () {
      thisWidget.setValue(thisWidget.input.value);
    });
    thisWidget.linkDecrease.addEventListener('click', function (event) {
      event.preventDefault();
      thisWidget.setValue(thisWidget.value - 1); 
      
    });
    thisWidget.linkIncrease.addEventListener('click', function (event) {
      event.preventDefault();
      thisWidget.setValue(thisWidget.value + 1);
      
      console.log(thisWidget.value);
    });
  }
  announce(){
    const thisWidget = this;
    //const event = new Event('updated');
    const event = new CustomEvent('updated', {
      bubbles: true
    });
    thisWidget.element.dispatchEvent(event);
  }
    

}

export default AmountWidget;