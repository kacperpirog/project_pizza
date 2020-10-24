/* eslint-disable indent */
import {select, settings, templates, classNames} from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';
import DatePicker from './DatePicker.js';
import HourPicker from './HourPicker.js';

class Booking {
  constructor(element){
    const thisBooking = this;

    thisBooking.render(element);
    thisBooking.initWidgets();
    thisBooking.getData();
    thisBooking.initTableListeners();
    thisBooking.clickedTable();
  }

  colorHourpicker(){
    const thisBooking = this;

    thisBooking.dom.rangeslider = thisBooking.dom.form.querySelector('.rangeSlider');
    thisBooking.dom.rangesliderBcg = thisBooking.dom.form.querySelector('.rangeSlider__fill');
    let startHour = 12;
    let closingHour = 24;
    let allAvailableHours = [];
    let colors = [];
    let linearStyle = [];

    for(let i = startHour; i < closingHour; i += 0.5){
      allAvailableHours.push(i);
      let tableAmount = 0;
      if(!thisBooking.booked[thisBooking.date][i]){
        tableAmount = 0;
      } else {
        tableAmount = thisBooking.booked[thisBooking.date][i].length;
      }
      if (tableAmount >= 3) {
        colors.push('red');
      } else if (tableAmount == 2) {
        colors.push('orange');
      } else if (tableAmount <= 1) {
        colors.push('green');
      }
    }

    let begin = 0;
    let end = Math.round(100/colors.length);
    let helper = Math.round(100/colors.length);

    for (let color of colors) {
      linearStyle.push(color + ' ' + begin + '%' + ' ' + end + '%');
      begin += helper;
      end += helper;
    }
    const finalStyle = linearStyle.join(', ');

    thisBooking.dom.rangeslider.style.background = 'linear-gradient(to right, ' + finalStyle + ')';
    thisBooking.dom.rangesliderBcg.style.background = 'none';
    //console.log(thisBooking.booked);
  }



  submitAction(){
    const thisBooking = this;

    thisBooking.dom.form.addEventListener('submit', function(event){

      event.preventDefault();
      thisBooking.sendBooking();
    });
  }

  clickedTable(){
    const thisBooking = this;

    for(let table of thisBooking.dom.tables) {
      table.addEventListener('click', function(){
        table.classList.add(classNames.booking.tableBooked);
        let clickedTableId = table.getAttribute(settings.booking.tableIdAttribute);
        thisBooking.chosenTable = clickedTableId;
      });
      
    } 
  }

  sendBooking(){
    const thisBooking = this;

    const reservationInfo = {
      table: parseInt(thisBooking.tableNumber),
      date: thisBooking.DatePicker.value,
      hour: thisBooking.hourPicker.value,
      duration: thisBooking.hoursAmount.value,
      people: thisBooking.peopleAmount.value,
      phone: thisBooking.dom.phone.value,
      email: thisBooking.dom.email.value,
      starters: [],
    };

    for (let starter of thisBooking.dom.starters) {
      if (starter.checked == true) {
        reservationInfo.starters.push(starter.value);
      }
    }

    const sendBookingUrl = select.db.url + '/' + select.db.booking;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reservationInfo),
    };

    fetch(sendBookingUrl,options)
      .then(function(response) {
        return response.json();
      })
      .then(function() {
        thisBooking.getData();

      });

  }

  initTableListeners(){
    const thisBooking = this;

    for(let table of thisBooking.dom.tables){
      table.addEventListener('click', function(){
        thisBooking.pickTable(table);
      });
    }
  }

  pickTable(table){
    const thisBooking = this;

    if(table.classList.contains(classNames.booking.tableBooked)) {
      alert('Stolik niedostepny');
    } else {
      const activeTable = thisBooking.dom.wrapper.querySelector('.table.active');
      if(activeTable){
        activeTable.classList.remove('active');
      }
      table.classList.add('active');
      //table.classList.add(classNames.booking.tableBooked);
      thisBooking.tableId = table.getAttribute('data-table');
    }
  }

  getData(){
    const thisBooking = this;

    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);

    const params = {
      booking: [
        startDateParam,
        endDateParam,
      ],

      eventCurrent: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam,
      ],

      eventRepeat: [
        settings.db.repeatParam,
        endDateParam,
      ],
    };

    //console.log('getData params:', params);

    const urls = {
      booking:         settings.db.url + '/' + settings.db.booking
                                       + '?' + params.booking.join('&'),
      eventCurrent:    settings.db.url + '/' + settings.db.event
                                       + '?' + params.eventCurrent.join('&'),
      eventRepeat:     settings.db.url + '/' + settings.db.event
                                       + '?' + params.eventRepeat.join('&'),

    };
    //console.log(urls.eventCurrent);

    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventCurrent),
      fetch(urls.eventRepeat),

    ])
      .then(function(allResponses){
        const bookingResponse = allResponses[0];
        const eventCurrentResponse = allResponses[1];
        const eventRepeatResponse = allResponses[2];
        return Promise.all([
          bookingResponse.json(),
          eventCurrentResponse.json(),
          eventRepeatResponse.json(),
        ]);
      })
      .then(function([bookings, eventCurrent, eventRepeat]){
        //console.log(bookings);
        //console.log(eventCurrent);
        //console.log(eventRepeat);
        thisBooking.parseData(bookings, eventCurrent, eventRepeat);
      });

  }

  parseData(bookings, eventCurrent, eventRepeat){
    const thisBooking = this;

    thisBooking.booked = {};

    for(let item of eventCurrent){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }
    for(let item of bookings){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;

    for(let item of eventRepeat){
      if(item.repeat == 'daily'){
        for(let loopData = minDate; loopData <= maxDate; loopData = utils.addDays(loopData, 1))
          thisBooking.makeBooked(utils.dateToStr(loopData), item.hour, item.duration, item.table);
      }
    }
    console.log(thisBooking.booked);
    thisBooking.updateDOM();


    //console.log(thisBooking.booked);
  }

  makeBooked(date,hour,duration,table){
    const thisBooking = this;

    if(typeof thisBooking.booked[date] == 'undefined'){
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);

    for(let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5){

      if(typeof thisBooking.booked[date][hourBlock] == 'undefined'){
        thisBooking.booked[date][hourBlock] = [];
      }
      thisBooking.booked[date][hourBlock].push(table);
    }
  }
  updateDOM(){
    const thisBooking = this;

    const activeTable = thisBooking.dom.wrapper.querySelector('.table.active');
    if(activeTable){
      activeTable.classList.remove('active');
    }
    thisBooking.tableId = null;


    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

    let allAvailable = false;

    if(
      typeof thisBooking.booked[thisBooking.date] == 'undefined'
      ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ){
      allAvailable = true;
    }

    for(let table of thisBooking.dom.tables){
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if(!isNaN(tableId)) {
        tableId = parseInt(tableId);
      }
      if(
        !allAvailable
        &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ){
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
    thisBooking.colorHourpicker();
  }

  render(element){
    const thisBooking = this;

    const generatedHTML = templates.bookingWidget();

    thisBooking.dom = {};
    thisBooking.dom.wrapper = element;
    thisBooking.dom.wrapper.innerHTML = generatedHTML;
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    thisBooking.dom.reservationDuration = thisBooking.dom.hoursAmount.querySelector('[name="hours"]');
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
    thisBooking.dom.starters = thisBooking.dom.wrapper.querySelectorAll('.checkbox input');
    thisBooking.dom.form = thisBooking.dom.wrapper.querySelector('.booking-form');
    thisBooking.dom.phone = thisBooking.dom.form.querySelector('[name="phone"]');
    thisBooking.dom.address = thisBooking.dom.form.querySelector('[name="address"]');
  }

  initWidgets(){
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

    thisBooking.dom.wrapper.addEventListener('updated', function(){
      thisBooking.updateDOM();
    });
  }
}

export default Booking;