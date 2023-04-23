import {select, settings} from '../settings.js';
class AmountWidget {
  constructor(element) {
    const thisWidget = this;
    thisWidget.getElements(element);
  
    thisWidget.value = settings.amountWidget.defaultValue;
    /*Gdy produkt generuje swój HTML, to w inpucie od razu wstawia nam domyślną wartość.Chodzi o to, żeby nawet na samym starcie, kiedy nikt jeszcze nie zmienił wartości w inpucie, nasza instancja miała już informację co w tym inpucie jest */
    thisWidget.setValue(thisWidget.input.value);
    thisWidget.initActions();
    //console.log('AmountWidget:', thisWidget);
    //console.log('constructor arguments:', element);
  }
  getElements(element) {
    const thisWidget = this;
  
    thisWidget.element = element;
    thisWidget.input = thisWidget.element.querySelector(
      select.widgets.amount.input
    );
    thisWidget.linkDecrease = thisWidget.element.querySelector(
      select.widgets.amount.linkDecrease
    );
    thisWidget.linkIncrease = thisWidget.element.querySelector(
      select.widgets.amount.linkIncrease
    );
  }
  setValue(value) {
    const thisWidget = this;
    const newValue = parseInt(value);
    //thisWidget.value = settings.amountWidget.defaultValue;
    /*TODO: Add validation*/
    /*żeby nasza funkcja ustalała, czy to co wpisano w input jest faktycznie liczbą,newValue nie jest też null-em*/
    if (
      thisWidget.value !== newValue &&
          !isNaN(newValue) &&
          newValue >= settings.amountWidget.defaultMin &&
          newValue <= settings.amountWidget.defaultMax
    ) {
      thisWidget.value =
            newValue;
    }
    thisWidget.input.value = thisWidget.value;
    thisWidget.announce();
  }
  initActions() {
    const thisWidget = this;
    thisWidget.input.addEventListener('change', () => {
      thisWidget.setValue(thisWidget.input.value);
    });
    thisWidget.linkDecrease.addEventListener('click', (event) => {
      event.preventDefault();
      thisWidget.setValue(thisWidget.input.value - 1);
    });
    thisWidget.linkIncrease.addEventListener('click', (event) => {
      event.preventDefault();
      thisWidget.setValue(thisWidget.value + 1);
    });
  }
  announce() {
    const thisWidget = this;
    //const event = new Event('updated');
    const event = new CustomEvent('updated', { bubbles: true });
    thisWidget.element.dispatchEvent(event);
  }
}
export default AmountWidget;