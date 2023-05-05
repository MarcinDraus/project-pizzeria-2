import {select, settings} from '../settings.js';
import BaseWidget from './BaseWidget.js';
//class AmountWidget {
class AmountWidget extends BaseWidget{
  constructor(element) {
    super(element, settings.amountWidget.defaultValue);
    const thisWidget = this;
    thisWidget.getElements(element);
  
    //thisWidget.value = settings.amountWidget.defaultValue;
    /*Gdy produkt generuje swój HTML, to w inpucie od razu wstawia nam domyślną wartość.Chodzi o to, żeby nawet na samym starcie, kiedy nikt jeszcze nie zmienił wartości w inpucie, nasza instancja miała już informację co w tym inpucie jest */
    //thisWidget.setValue(thisWidget.input.value);
    
    //console.log('AmountWidget:', thisWidget);
    //console.log('constructor arguments:', element);
    //thisWidget.getElements(element);
    thisWidget.renderValue();
    thisWidget.initActions();

  }
  //getElements(element) {
  getElements(){  
    const thisWidget = this;
  
    // thisWidget.element = element;
    // thisWidget.input = thisWidget.element.querySelector(
    //   select.widgets.amount.input
    // );
    // thisWidget.linkDecrease = thisWidget.element.querySelector(
    //   select.widgets.amount.linkDecrease
    // );
    // thisWidget.linkIncrease = thisWidget.element.querySelector(
    //   select.widgets.amount.linkIncrease
    // );
    thisWidget.dom.input = thisWidget.dom.wrapper.querySelector(select.widgets.amount.input);
    thisWidget.dom.linkDecrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkDecrease);
    thisWidget.dom.linkIncrease = thisWidget.dom.wrapper.querySelector(select.widgets.amount.linkIncrease);
  }
  //   setValue(value) {
  //     const thisWidget = this;
  //     const newValue = parseInt(value);
  //     //thisWidget.value = settings.amountWidget.defaultValue;
  //     /*TODO: Add validation*/
  //     /*żeby nasza funkcja ustalała, czy to co wpisano w input jest faktycznie liczbą,newValue nie jest też null-em*/
  //     if (
  //       thisWidget.value !== newValue &&
  //           !isNaN(newValue) &&
  //           newValue >= settings.amountWidget.defaultMin &&
  //           newValue <= settings.amountWidget.defaultMax
  //     ) {
  //       thisWidget.value =
  //             newValue;
  //     }
  //     thisWidget.input.value = thisWidget.value;
  //     thisWidget.announce();
  isValid(value){
    return !isNaN(value)
    && value >= settings.amountWidget.defaultMin 
    && value <= settings.amountWidget.defaultMax;
  }
  renderValue(){
    const thisWidget = this;
    thisWidget.dom.input.value = thisWidget.value;
  
  }
  initActions() {
    const thisWidget = this;
    // thisWidget.input.addEventListener('change', () => {
    //   thisWidget.setValue(thisWidget.input.value);
    thisWidget.dom.input.addEventListener('change', () => {
      thisWidget.value = thisWidget.dom.input.value;
    });
    //thisWidget.linkDecrease.addEventListener('click', (event) => {
    thisWidget.dom.linkDecrease.addEventListener('click', (event)=>{
      event.preventDefault();
      thisWidget.setValue(thisWidget.imput.value - 1);
    });
    //thisWidget.linkIncrease.addEventListener('click', (event) => {
    thisWidget.dom.linkIncrease.addEventListener('click', (event)=>{
      event.preventDefault();
      thisWidget.setValue(thisWidget.value + 1);
    });
  }
  
}
export default AmountWidget;