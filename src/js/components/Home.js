import { templates, select,  dataSource } from '../settings.js';
import utils from '../utils.js';
class Home {
  constructor(element) {
    const thisHome = this;
    thisHome.render(element);
    thisHome.carousel();
    thisHome. gallery();
  }
  render(element) {
    const thisHome = this;

    const generatedHTML = utils.createDOMFromHTML(templates.homepage());//homepage: '#template-homepage-widget',
    thisHome.dom = {};
    thisHome.dom.wrapper = element;
    thisHome.dom.wrapper.appendChild(generatedHTML);
  }

   
  
  carousel() {
    // eslint-disable-next-line no-undef
    new Flickity(select.containerOf.carousel, {
      prevNextButtons: false,
      autoPlay: true,
      imagesLoaded: true,
      percentPosition: false,
    });
  }
  gallery(){

    const tplProductListSource = document.getElementById('#template-product-list').innerHTML;
    const tplProductList = Handlebars.compile(tplProductListSource);
    

    generatedHTML = tplProductList(dataSource.image);
    targetElement.insertAdjacentHTML('beforeend', generatedHTML);
  }
}
export default Home;