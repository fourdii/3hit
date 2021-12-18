import * as THREE from 'three';
import ScrollStage from './app.js';

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

