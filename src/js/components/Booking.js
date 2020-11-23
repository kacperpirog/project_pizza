/* eslint-disable indent */
import {select, settings, templates, classNames} from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './AmountWidget.js';
import HourPicker from './HourPicker.js';
import DatePicker from './DatePicker.js';

class Booking {
  constructor(element) {
    const thisBooking = this;
    thisBooking.render(element);
    thisBooking.initWidget();
    thisBooking.getData();
  }
  render(element) {
    const thisBooking = this;
    const generatedHTML = templates.bookingWidget();
    thisBooking.dom = {};

    thisBooking.dom.wrapper = element;
    // thisBooking.generatedDOM = utils.createDOMFromHTML(generatedHTML);
    thisBooking.dom.wrapper.appendChild(utils.createDOMFromHTML(generatedHTML));
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
    thisBooking.dom.form = thisBooking.dom.wrapper.querySelector(select.booking.form);
    thisBooking.dom.starters = thisBooking.dom.wrapper.querySelectorAll(select.booking.starters);
    thisBooking.dom.phone = thisBooking.dom.wrapper.querySelector(select.booking.phone);
    thisBooking.dom.address = thisBooking.dom.wrapper.querySelector(select.booking.address);
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
  initWidget() {
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
    thisBooking.tableID = [];

    thisBooking.dom.wrapper.addEventListener('updated',function() {
      thisBooking.updateDOM();
    });
    thisBooking.tableReservation();
    thisBooking.dom.form.addEventListener('submit', function (event) {
      event.preventDefault();
      thisBooking.sendReservation();
    });
  }
  getData() {
    const thisBooking = this;
    const startEndDates = {};
    startEndDates[settings.db.dateStartParamKey] = utils.dateToStr(thisBooking.datePicker.minDate);
    startEndDates[settings.db.dateEndParamKey] = utils.dateToStr(thisBooking.datePicker.maxDate);
    const endDate = {};
    endDate[settings.db.dateEndParamKey] = startEndDates[settings.db.dateEndParamKey];
    const params = {
      booking: utils.queryParams(startEndDates),
      eventsCurrent: settings.db.notRepeatParam + '&' + utils.queryParams(startEndDates),
      eventsRepeat: settings.db.repeatParam + '&' + utils.queryParams(endDate),
    };
    console.log('getData params', params);

    const urls = {
      booking: settings.db.url + '/' + settings.db.booking + '?' + params.booking,
      eventsCurrent: settings.db.url + '/' + settings.db.event + '?' + params.eventsCurrent,
      eventsRepeat: settings.db.url + '/' + settings.db.event + '?' + params.eventsRepeat,
    };
    console.log('booking: settings.db.url + ', urls.booking);
    console.log('getData urls', urls);
    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function ([bookingsResponse, eventsCurrentResponse, eventsRepeatResponse]) {
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function ([bookings, eventsCurrent, eventsRepeat]) {

        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
        console.log('EVENTS_CURRENT', eventsCurrent);
      });

  }
  parseData(bookings, eventsCurrent, eventsRepeat) {
    const thisBooking = this;
    console.log('__', eventsRepeat);
    thisBooking.booked = {};
    console.log('eventsCurrent', eventsCurrent);
    for (const eventCurrent of eventsCurrent) {
      thisBooking.makeBooked(eventCurrent.date, eventCurrent.hour, eventCurrent.duration, eventCurrent.table);
    }
    for (const booking of bookings) {
      thisBooking.makeBooked(booking.date, booking.hour, booking.duration, booking.table);
    }
    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;

    for (let event of eventsRepeat) {
      if (event.repeat === 'daily') {
        for (let currentDate = minDate; currentDate < maxDate; currentDate = utils.addDays(currentDate, 1)) {
          thisBooking.makeBooked(utils.dateToStr(currentDate), event.hour, event.duration, event.table);
        }
      }
    }
    console.log('thisBooking', thisBooking.booked);
    console.log('bookings', bookings);
    thisBooking.updateDOM();
  }
  makeBooked(date, hour, duration, table) {
    const thisBooking = this;

    if (!thisBooking.booked[date]) {
      thisBooking.booked[date] = {};
    }

    const bookingHour = utils.hourToNumber(hour);

    const lastBookedHour = bookingHour + duration;

    for (
      let tableBlockedHour = bookingHour;
      tableBlockedHour < lastBookedHour;
      tableBlockedHour += 0.5
    ) {
      if (!thisBooking.booked[date][tableBlockedHour]) {
        thisBooking.booked[date][tableBlockedHour] = [];
      }
      //[1,2]

      for (let tab of table) {
        thisBooking.booked[date][tableBlockedHour].push(tab);
      }


    }
  }

  tableReservation() {
    const thisBooking = this;
    for(let reservedTable of thisBooking.dom.tables) {
      console.log('stoliki', reservedTable);


      reservedTable.addEventListener('click', function(event) {
        event.preventDefault();
        let tableID = [];
        if(reservedTable.classList.contains(classNames.booking.tableBooked)) {
          alert('This table is occupied at this hour! Pick a different table.');
        } else {
          reservedTable.classList.add(classNames.booking.tableBooked);
          alert('This table is unoccupied at requested date. Table was booked');
          thisBooking.tableID.push(parseInt(reservedTable.getAttribute('data-table')));
          console.log('tableID', tableID);
          console.log('____________', thisBooking.bookedTable);
        }
      });
    }

  }

  sendReservation() {
    const thisBooking = this;
    const url = settings.db.url + '/' + settings.db.booking;
    console.log('------------', thisBooking);

    const payload = {
      date: thisBooking.date,
      hour: thisBooking.hourPicker.value,
      table: thisBooking.tableID,
      duration: thisBooking.hoursAmount.value,
      ppl: thisBooking.peopleAmount.value,
      phone: thisBooking.dom.phone.value,
      mail: thisBooking.dom.address.value,
      starters: ['lemonWater']
    };
    console.log('payload-tableID', thisBooking.tableID);
    console.log('payload', payload);
    // for (let product in payload.products) {
    //   payload.products.push(product.getData());
    // }

    // console.log(payload);
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options).then(function (response) {
      return response.json();
    }).then(function (parsedResponse) {
      console.log('parsedResponse', parsedResponse);
      thisBooking.makeBooked(payload.date, payload.hour, payload.duration, payload.table);
    });
  }

  updateDOM(){
    const thisBooking = this;
    thisBooking.date = thisBooking.datePicker.value;
    console.log('thisBooking.datePicker.value', thisBooking.datePicker.value);
    thisBooking.hour = thisBooking.hourPicker.value;
    console.log('thisBooking.hour', thisBooking.hour);
    console.log(' utils.hourToNumber(thisBooking.hourPicker.value)', thisBooking.hour);
    console.log('++++++++++++++++++++++++=====================', thisBooking.booked);
    for(let table of thisBooking.dom.tables){
      let tableID = table.getAttribute(settings.booking.tableIdAttribute);
      tableID = parseInt(tableID);

      table.classList.remove(classNames.booking.tableSelected);

      if (thisBooking.booked[thisBooking.date] && thisBooking.booked[thisBooking.date][utils.hourToNumber(thisBooking.hour)] && thisBooking.booked[thisBooking.date][utils.hourToNumber(thisBooking.hour)].includes(tableID)){
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
    thisBooking.colorHourpicker();
  }
}
export default Booking;