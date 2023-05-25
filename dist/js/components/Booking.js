import { templates, select, settings, classNames } from '../settings.js';
import utils from '../utils.js';
import AmountWidget from '../components/AmountWidget.js';
import DatePicker from '../components/DatePicker.js';
import HourPicker from '../components/HourPicker.js';
class Booking {
  constructor(element) {
    const thisBooking = this;
    thisBooking.render(element);
    thisBooking.initWidgets();
    thisBooking.getData();
    thisBooking.selectedTable = null; //table
  }
  getData() {
    const thisBooking = this;
    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);
    const params = {
      booking: [
        startDateParam,
        endDateParam,
        // settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate),
        // settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate),
      ],
      eventsCurrent: [
        startDateParam,
        endDateParam,
        settings.db.repeatParam,
      ],
      eventsRepeat: [
        settings.db.notRepeatParam, endDateParam,
      ],
    };
    //console.log('getData params', params);
    const urls = {
      booking: settings.db.url + '/' + settings.db.bookings + '?' + params.booking.join('&'),
      eventsCurrent: settings.db.url + '/' + settings.db.events + '?' + params.eventsCurrent.join('&'),
      eventsRepeat: settings.db.url + '/' + settings.db.events + '?' + params.eventsRepeat.join('&'),
    };
    //console.log(params, 'params');
    //console.log(urls, 'urls');
    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function (allResponses) {
        const bookingsResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function ([bookings, eventsCurrent, eventsRepeat]) {
        
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });

  }
  parseData(bookings, eventsCurrent, eventsRepeat) {
    const thisBooking = this;

    thisBooking.booked = {};

    for (let item of bookings) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }
    for (let item of eventsCurrent) {
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;

    for (let item of eventsRepeat) {
      if (item.repeat == 'daily') {
        for (let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)) {
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }
    }
    //console.log('thisBooking.booked', thisBooking.booked);
    thisBooking.updateDOM();
  }
  makeBooked(date, hour, duration, table) {
    const thisBooking = this;

    if (typeof thisBooking.booked[date] == 'undefined') {
      thisBooking.booked[date] = {};
    }
    const startHour = utils.hourToNumber(hour);

    for (let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5) {
      //console.log('loop', hourBlock);
      if (typeof thisBooking.booked[date][hourBlock] == 'undefined') {
        thisBooking.booked[date][hourBlock] = [];
      }

      thisBooking.booked[date][hourBlock].push(table);
    }//console.log(thisBooking.booked, 'thisBooking.booked');
  }

  updateDOM() {
    const thisBooking = this;

    // console.log(thisBooking.booked, 'thisBooking.booked');

    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);
    // console.log(thisBooking.hourPicker.value, 'thisBooking.hourPicker.value', typeof thisBooking.hourPicker.value);
    let allAvailable = false;

    if (typeof thisBooking.booked[thisBooking.date] == 'undefined' ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined') {
      allAvailable = true;
    }
    for (let table of thisBooking.dom.tables) {
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      //table.classList.remove(classNames.booking.tableSelected);
      // console.log('selected table', thisBooking.selectedTable);
      //table
      table.classList.remove(classNames.booking.tableSelected);
      //console.log('selected table', thisBooking.selectedTable);//table

      if (!isNaN(tableId)) {
        tableId = parseInt(tableId);
      }

      if (!allAvailable
        && thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ) {
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
  }
  //table
  initTables(event) {
    const thisBooking = this;

    const clickedElement = event.target;

    const selectedId = clickedElement.getAttribute(settings.booking.tableIdAttribute);

    // if clicked element is a table
    if (clickedElement.classList.contains('table')) {
      // check if table is booked alert user
      if (clickedElement.classList.contains('booked')) {
        alert('This table is already booked');
      } 
      // if table is not booked 
      // if it is selected remove selected class
      else if (clickedElement.classList.contains(classNames.booking.tableSelected)){
        clickedElement.classList.remove(classNames.booking.tableSelected);
        thisBooking.selectedTable = null;
        //console.log('remove from thisBooking.selectedTable', thisBooking.selectedTable);
      }
      else {
        // remove selected class from other tables
        for(let table of thisBooking.dom.tables){
          table.classList.remove(classNames.booking.tableSelected);
          //console.log('removed class selected from all tables');

        }
        // if table is not selected add selected class

        clickedElement.classList.add(classNames.booking.tableSelected);
        thisBooking.selectedTable = selectedId;
        //console.log('added to thisBooking.selectedTable', thisBooking.selectedTable);
      }
    }
  

  }



  render(element) {
    const thisBooking = this;

    const generatedHTML = utils.createDOMFromHTML(templates.bookingWidget());
    thisBooking.dom = {};
    thisBooking.dom.wrapper = element;
    thisBooking.dom.wrapper.appendChild(generatedHTML);

    thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);

    thisBooking.dom.datePicker = document.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = document.querySelector(select.widgets.hourPicker.wrapper);
    thisBooking.dom.tables = document.querySelectorAll(select.booking.tables);
    //table
    thisBooking.dom.tablesWrapper = document.querySelector(select.containerOf.tables);

    //console.log('wrapper',select.widgets.amount.datePicker.wrapper);
    //server
    thisBooking.dom.form = document.querySelector(select.booking.form);
    thisBooking.dom.phone = document.querySelector(select.booking.phone);
    thisBooking.dom.address = document.querySelector(select.booking.address);
    thisBooking.dom.duration = document.querySelector(select.booking.duration);
    thisBooking.dom.people = document.querySelector(select.booking.people);
    thisBooking.dom.starters = document.querySelectorAll(select.booking.starters);
  }
  //server
  sendBooking(){
    const thisBooking = this;
    // path to bookings database
    const url = settings.db.url + '/' + settings.db.bookings;
    // booking order payload object
    const payload = {
      date: thisBooking.date,
      hour: utils.numberToHour(thisBooking.hour),
      table: parseInt(thisBooking.selectedTable),
      duration: parseInt(thisBooking.dom.duration.value),
      ppl: parseInt(thisBooking.dom.people.value),
      starters: [],
      phone: thisBooking.dom.phone.value,
      address: thisBooking.dom.address.value,
    }; 
  
    // loop through starters to perform checks
    for(let starter of thisBooking.dom.starters){
      // add to array if starter ischecked.
      if(starter.checked == true){
        payload.starters.push(starter.value);
      }
    }
    // console.log(payload);
  
    // send booking order to database
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    fetch(url, options)
      .then(function(response) {
        return response.json();
      })
      .then(function(parsedResponse) {
        thisBooking.makeBooked(parsedResponse.date, parsedResponse.hour, parsedResponse.duration, parsedResponse.table);
        thisBooking.updateDOM();
      });//server
    

  }
  initWidgets() {
    const thisBooking = this;
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
    thisBooking.dom.wrapper.addEventListener('updated', function () {
      thisBooking.updateDOM();
    });
    //table
    thisBooking.dom.tablesWrapper.addEventListener('click', function(event){
      thisBooking.initTables(event);
    });
    //server
    thisBooking.dom.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisBooking.sendBooking();
    });//server
  } 
  
}
export default Booking;
