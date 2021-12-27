import "../css/base.css";
import "../css/horizontal.css";
// import "./main.js";

import "../css/base2.css";
import "../css/menu.css";
import "../css/step.css";
import "../js/main.js";






(function() {


// Get the canvas node and the drawing context
const canvas = document.getElementById('canv');
const ctx = canvas.getContext('2d');

// set the width and height of the canvas
var w = canvas.width = document.body.offsetWidth;
var h = canvas.height = document.body.offsetHeight;

var cols = Math.floor(w / 20) + 1;
var ypos = Array(cols).fill(0);

// draw a black rectangle of width and height same as that of the canvas
ctx.fillStyle = '#000';
ctx.fillRect(0, 0, w, h);


  const wrapper = document.getElementById("fold-effect");

  const folds = Array.from(document.getElementsByClassName("fold"));

  const baseContent = document.getElementById("base-content");

  let state = {
    disposed: false,
    targetScroll: 0,
    scroll: 0
  };


  function matrix () {
    // Draw a semitransparent black rectangle on top of previous drawing
    ctx.fillStyle = '#0001';
    ctx.fillRect(0, 0, w, h);
  
    // Set color to green and font to 15pt monospace in the drawing context
    ctx.fillStyle = '#0f0';
    ctx.font = '15pt monospace';
  
    // for each column put a random character at the end
    ypos.forEach((y, ind) => {
      // generate a random character
      const text = String.fromCharCode(Math.random() * 128);
  
      // x coordinate of the column, y coordinate is already given
      const x = ind * 20;
      // render the character at (x, y)
      ctx.fillText(text, x, y);
  
      // randomly reset the end of the column if it's at least 100px high
      if (y > 100 + Math.random() * 10000) ypos[ind] = 0;
      // otherwise just move the y coordinate for the column 20px down,
      else ypos[ind] = y + 20;
    });
  }


  function lerp(current, target, speed = 0.1, limit = 0.001) {
    let change = (target - current) * speed;
    if (Math.abs(change) < limit) {
      change = target - current;
    }
    return change;
  }
  let scaleFix = 0.992;

  class FoldedDom {
    constructor(wrapper, folds = null, scrollers = null) {
      this.wrapper = wrapper;
      this.folds = folds;
      this.scrollers = [];
    }
    setContent(baseContent, createScrollers = true) {
      const folds = this.folds;
      if (!folds) return;

      let scrollers = [];

      for (let i = 0; i < folds.length; i++) {
        const fold = folds[i];
        const copyContent = baseContent.cloneNode(true);
        copyContent.id = "";
        let scroller;
        if (createScrollers) {
          let sizeFixEle = document.createElement("div");
          sizeFixEle.classList.add("fold-size-fix");
          // sizeFixEle.style.transform = `scaleY(${scaleFix})`;

          scroller = document.createElement("div");
          scroller.classList.add("fold-scroller");
          sizeFixEle.append(scroller);
          fold.append(sizeFixEle);
        } else {
          scroller = this.scrollers[i];
        }
        scroller.append(copyContent);

        scrollers[i] = scroller;
      }
      this.scrollers = scrollers;
    }
    updateStyles(scroll) {
      const folds = this.folds;
      const scrollers = this.scrollers;

      for (let i = 0; i < folds.length; i++) {
        const scroller = scrollers[i];

        // Scroller fixed so its aligned
        // scroller.style.transform = `translateY(${100 * -i}%)`;
        // And the content is the one that scrolls
        scroller.children[0].style.transform = `translateX(${scroll}px)`;
      }
    }
  }

  let insideFold;

  const mainFold = folds[folds.length - 1];
  let tick = () => {
    if (state.disposed) return;

    // Calculate the scroll based on how much the content is outside the mainFold

    // state.targetScroll = -(
    //   document.documentElement.scrollLeft || document.body.scrollLeft
    // );
    state.targetScroll = Math.max(
      Math.min(0, state.targetScroll),
      -insideFold.scrollers[0].children[0].clientWidth + mainFold.clientWidth
    );
    state.scroll += lerp(state.scroll, state.targetScroll, 0.1, 0.0001);

    insideFold.updateStyles(state.scroll);

    requestAnimationFrame(tick);
  };
  /** ATTACH EVENTS */
  let lastClientX = null;
  let isDown = false;

  let onDown = ev => {
    // console.log(
    //   Math.max(
    //     state.targetScroll,
    //     -insideFold.scrollers[0].children[0].clientWidth + mainFold.clientWidth
    //   )
    // );
    console.log(
      "s",
      -insideFold.scrollers[0].children[0].clientWidth + mainFold.clientWidth
    );
    isDown = true;
  };
  let onUp = ev => {
    isDown = false;
  };

  window.addEventListener("mousedown", onDown);
  window.addEventListener("mouseup", onUp);
  window.addEventListener("mouseout", ev => {
    var from = ev.relatedTarget || ev.toElement;
    if (!from || from.nodeName == "HTML") {
      // stop your drag event here
      // for now we can just use an alert
      isDown = false;
    }
  });
  // window.addEventListener("touchstart", onDown);
  // window.addEventListener("touchend", onUp);
  // window.addEventListener("touchcancel", onUp);

  window.addEventListener("mousemove", ev => {
    if (lastClientX && isDown) {
      state.targetScroll += ev.clientX - lastClientX;
    }
    lastClientX = ev.clientX;
  });

  window.addEventListener("touchmove", ev => {
    let touch = ev.touches[0];
    ev.preventDefault(); 
    if (lastClientX ) {
      state.targetScroll += touch.clientX - lastClientX;
    }
    lastClientX = touch.clientX;
  });



  window.addEventListener("wheel", ev => {
    // Fixefox delta is like 1px and chrome 100
    state.targetScroll += -Math.sign(ev.deltaY) * 30;
  });

  window.addEventListener("resize", (ev) => {
    // set the width and height of the canvas
     w = (canvas.width = document.body.offsetWidth);
     h = (canvas.height = document.body.offsetHeight);

     cols = Math.floor(w / 20) + 1;
     ypos = Array(cols).fill(0);

    // draw a black rectangle of width and height same as that of the canvas
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);
  });



setInterval(matrix, 50);
  
  /***********************************/
  /********** Preload stuff **********/

  // Preload images
  const preloadImages = () => {
    return new Promise((resolve, reject) => {
      imagesLoaded(document.querySelectorAll('.content__img'), resolve);
    });
  };
  
  // And then..
  preloadImages().then(() => {
    // Remove the loader
    document.body.classList.remove('loading');
    // INITIALIZE
    insideFold = new FoldedDom(wrapper, folds);
    insideFold.setContent(baseContent);

    tick();
  });
})();
