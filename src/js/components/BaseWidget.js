class BaseWidget{
  constructor(wrapperElement, initialValue){
    const thisWidget = this;

    thisWidget.dom = {};
    thisWidget.dom.wrapper = wrapperElement;
    thisWidget.correctValue = initialValue;
  }

  get value(){
    const thisWidget = this;

    return thisWidget.correctValue;
  }
  
  set value(value){
    const thisWidget = this;
    
    const newValue = thisWidget.parseValue(value);
    if (newValue != thisWidget.correctValue && thisWidget.isValid(value)) {
      thisWidget.correctValue = newValue;
      thisWidget.announce(); // jakikolwiek event na dziecku który czeka na wywołanie w rodzicu na konkretnym elemencie
    }
    thisWidget.renderValue();
  }
  setValue(value){
    const thisWidget = this;
    // thisWidget.setValue(thisWidget.input.value || 1);
    thisWidget.value = value;
  }
  parseValue(value){
    return parseInt(value);
  }

  isValid(value){
    return !isNaN(value);
  }

  renderValue(){
    const thisWidget = this;

    thisWidget.dom.wrapper.innerHTML = thisWidget.value;
  }
  


  announce(){
    const thisWidget = this;

    const event = new CustomEvent('updated', {
      bubbles: true
    });
    thisWidget.dom.wrapper.dispatchEvent(event);
  }

}

export default BaseWidget;