import {templates, select} from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';
class Booking {
  constructor(element) {
    const thisBooking = this;

    thisBooking.render(element);
    thisBooking.initWidgets();
  }
  render(element){
    const thisBooking = this;

    /* generate HTML from the template */
    const generatedHTML = templates.bookingWidget();
    /* create empty object thisBooking.dom*/
    thisBooking.dom = {};
    /* add wrapper to thisBooking.dom */
    thisBooking.dom.wrapper = element;
    /* change generatedHTML to DOM object and add it to wrapper */
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);
    thisBooking.dom.wrapper.appendChild(generatedDOM);
    /* PeopleAmount selector */
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    /* hoursAmount selector */
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
    thisBooking.dom.starters = thisBooking.dom.wrapper.querySelectorAll(select.booking.starters);
    thisBooking.dom.phone = thisBooking.dom.wrapper.querySelector(select.booking.phone);
    thisBooking.dom.address = thisBooking.dom.wrapper.querySelector(select.booking.address);
    thisBooking.dom.form = thisBooking.dom.wrapper.querySelector(select.booking.form);
  }

  initWidgets(){
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);

    thisBooking.dom.wrapper.addEventListener('updated', function(){
      thisBooking.updateDOM();
    });
  }
}





export default Booking;