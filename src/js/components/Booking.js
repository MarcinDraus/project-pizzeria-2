import {templates,  select, /*settings*/} from '../settings.js';
import utils from '../utils.js';
import AmountWidget from '../components/AmountWidget.js';
import DatePicker from '../components/DatePicker.js';
import HourPicker from '../components/HourPicker.js';
class Booking{
  constructor(element){
    const thisBooking = this;
    thisBooking.render(element);
    thisBooking.initWidgets();
    //thisBooking.getData();
  }
  // getData(){
  //   const thisBooking = this;
  //   const params = {
  //     booking:[
  //       settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate),
  //       settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate),
  //     ],
  //     eventsCurrent:[

  //     ],
  //     eventsRepeat:[

  //     ],
  //   }
  //   console.log(params,'params');
  //   const urls = {
  //    //booking:        settings.db.url + '/' + settings.db.booking + '?' +  params.booking.join('&')
  //    //eventsCurrent:  settings.db.url + '/' + settings.db.event   + '?' +  params.eventsCurrent.join('&')
  //    //eventsRepeat:   settings.db.url + '/' + settings.db.event   + '?' +  params.eventsRepeat.join('&')
  //   };
            
  // }
  
  render(element){
    const thisBooking = this;
    
    const generatedHTML = utils.createDOMFromHTML(templates.bookingWidget());
    thisBooking.dom = {};
    thisBooking.dom.wrapper = element;
    thisBooking.dom.wrapper.appendChild(generatedHTML);

    thisBooking.dom.peopleAmount = document.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = document.querySelector(select.booking.hoursAmount);

    thisBooking.dom.datePicker = document.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = document.querySelector(select.widgets.hourPicker.wrapper);

    //console.log('wrapper',select.widgets.amount.datePicker.wrapper);
  }
  initWidgets(){
    const thisBooking = this;
    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);
  }
}
export default Booking;
