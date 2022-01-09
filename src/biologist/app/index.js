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

  async setup() {
    this.scrollStage = new ScrollStage();
    await this.scrollStage.waitForLoad();  
  }
}


new Main();

