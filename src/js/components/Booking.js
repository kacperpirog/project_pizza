/* eslint-disable indent */
import {select, templates} from '../settings.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

class Booking{
  constructor(element){
    const thisBooking = this;

    thisBooking.render(element);
    thisBooking.initWidgets();


    thisBooking.selectedTable = [];
  }



  render(element){
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = {};
    thisBooking.dom.wrapper = element;
    thisBooking.dom.wrapper.innerHTML = generatedHTML;
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);

    thisBooking.dom.phone = thisBooking.dom.wrapper.querySelector(select.booking.phone);
    thisBooking.dom.address = thisBooking.dom.wrapper.querySelector(select.booking.address);
    thisBooking.dom.hourPicker.output = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.output);
    thisBooking.dom.starters = thisBooking.dom.wrapper.querySelectorAll('.checkbox input');
    thisBooking.dom.peopleAmount.input = thisBooking.dom.wrapper.querySelector('.people-amount input.amount');
    thisBooking.dom.hoursAmount.input = thisBooking.dom.wrapper.querySelector('.hours-amount input.amount');

    // console.log(thisBooking.dom.datePicker.value, 'thisBooking.dom.datePicker');

  }

  initWidgets(){
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

    // thisBooking.dom.wrapper.addEventListener('updated', function(){
    //   thisBooking.updateDOM();
    // });
  }

  
}

export default Booking;