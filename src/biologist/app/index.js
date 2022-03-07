import ScrollStage from './app.js';

import "../../css/base.css";
import "../../css/menu.css";
import "../../css/step.css";
import "../../js/main.js";


export default class Main {
  constructor(container = document.body) {
    this.container = container;
    this.setup();
  }

   setup() {
    this.scrollStage = new ScrollStage();
    this.scrollStage.loadAssets();  
    this.scrollStage.init(); 
  }
}


new Main();

