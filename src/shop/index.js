// import { Cursor } from './cursor.js';
import { Grid } from './grid.js';
import { preloadImages } from './utils.js';
import "../css/shop_base.css";

import "../css/base.css";
import "../css/menu.css";
import "../css/step.css";
import "../js/main.js";





// custom cursor
// const cursor = new Cursor(document.querySelector('.cursor'));

console.log("step0");


// Preload  images
preloadImages('.grid__item-img').then(() => {
    // Remove loader (loading class)
    document.body.classList.remove('loading');
    

console.log("step1");

    // Initialize grid
    const grid = new Grid(document.querySelector('.grid'));

    console.log("step2");

    
    // change cursor text status when hovering a grid item
    // grid.on('mouseEnterItem', itemTitle => cursor.DOM.text.innerHTML = itemTitle);
    // grid.on('mouseLeaveItem', _ => cursor.DOM.text.innerHTML = '');
});

// mouse effects on all links and others
// [...document.querySelectorAll('a, button, .grid__item')].forEach(link => {
//     link.addEventListener('mouseenter', () => cursor.enter());
//     link.addEventListener('mouseleave', () => cursor.leave());
// });