import * as THREE from "three";
import GSAP from "gsap";
import Animations from "./Animations";
import SmoothScroll from "./SmoothScroll";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import "../styles/base.css";
import "../styles/shaders-on-scroll.sass";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import "./gold.glb";
import "./fire.glb";
import "./aqua.glb";
import "./wood.glb";
import "./dirt.glb";
// import * as dat from 'dat.gui';
import { Vector3 } from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Timeline } from "gsap/gsap-core";
import  fragmentShader2  from "./fragment.glsl";
import  vertexShader2 from "./vertex.glsl";
//import sky from "./sky.png";


export default class ScrollStage {
  constructor() {
    this.element = document.querySelector(".content");

    this.time = 0;
    this.modelMaterial = new THREE.ShaderMaterial({
      extensions: {
        derivatives: "#extension GL_OES_standard_derivatives : enable"
      },
    
      side: THREE.DoubleSide,
    
      uniforms: {
        time: { type: "f", value: 0 },
        sky: { type: "t", value: new THREE.TextureLoader().load("/sky.png") },
        resolution: { type: "v4", value: new THREE.Vector4() },
        uvRate1: {
          value: new THREE.Vector2(1, 1)
        },
      },
    
      vertexShader: vertexShader2,
    
      fragmentShader: fragmentShader2,
    });

    // this.gui = new dat.GUI();

    this.elements = {
      line: this.element.querySelector(".layout__line"),
    };

    this.viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    this.mouse = {
      x: 0,
      y: 0,
    };

    this.scroll = {
      height: 0,
      limit: 0,
      hard: 0,
      soft: 0,
      ease: 0.05,
      normalized: 0,
      running: false,
    };

    this.settings = {
      // vertex
      uFrequency: {
        start: 0,
        end: 4,
      },
      uAmplitude: {
        start: 4,
        end: 4,
      },
      uDensity: {
        start: 1,
        end: 1,
      },
      uStrength: {
        start: 0,
        end: 1.1,
      },
      // fragment
      uDeepPurple: {
        // max 1
        start: 1,
        end: 0,
      },
      uOpacity: {
        // max 1
        start: 0.1,
        end: 0.66,
      },
    };

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    this.canvas = this.renderer.domElement;

    this.camera = new THREE.PerspectiveCamera(
      60,
      this.viewport.width / this.viewport.height,
      0.1,
      10
    );

    this.clock = new THREE.Clock();

    this.smoothScroll = new SmoothScroll({
      element: this.element,
      viewport: this.viewport,
      scroll: this.scroll,
    });

    this.updateScrollAnimations = this.updateScrollAnimations.bind(this);
    this.update = this.update.bind(this);

    this.init();
  }

  
  _loadingPromise = function () {
    this.GLTFLoader = new GLTFLoader();

    this.sections = [];
    GSAP.utils.toArray(".section").forEach((section, i) => {
      this.sections.push(section);
    });
    console.log(this.sections);

    const resourceDatas = {
      name: ["gold", "wood", "aqua", "fire", "dirt"],

      Rot: [
        new Vector3(13, 101, 181),
        new Vector3(-27, -42, 0),
        new Vector3(6.5, 0, 0),
        new Vector3(30, -170, 0),
        new Vector3(46, -18.6, 0),
      ],
      ToPos: [
        new Vector3(-1, 0, 2.3),
        new Vector3(1, 0, 2.3),
        new Vector3(-1, 0, 2.3),
        new Vector3(1, 0, 2.3),
        new Vector3(-1, 0, 2.3),
      ],
      ToRot: [
        new Vector3(13, 106, 181),
        new Vector3(-27, -37, 0),
        new Vector3(6.5, 5, 0),
        new Vector3(30, -165, 0),
        new Vector3(46, -12.6, 0),
      ],
    };

    this.pointLight = new THREE.PointLight(0xffffff, 1, 100);
    this.pointLight.position.set(3, 2.5, 4.5);
    this.scene.add(this.pointLight);

    this.dict = [];






    for (let i = 0; i < resourceDatas.name.length; i++) {
      // let resourceData = resourceDatas[i];

      let sModelName = "/model/" + resourceDatas.name[i] + ".glb";

      this.loadModel(this.GLTFLoader, sModelName).then((gltf) => {
        var model = gltf.scene;

        model.traverse((object) => {
          if (object.isMesh) {

      
            object.material = this.modelMaterial;
            object.position.set(0, 0, 0);
            object.rotation.set(
              resourceDatas.Rot[i].x,
              resourceDatas.Rot[i].y,
              resourceDatas.Rot[i].z
            );
            object.scale.set(0.2, 0.2, 0.2);

            this.dict.push(object);
            this.scene.add(object);

           
            ScrollTrigger.create({
              // animation: tl,
              trigger: this.sections[i + 1],
              start: "top 80px",
              end: "bottom bottom",
              scrub: true,
              onEnter: () => {
                console.log("onEnter");
                object.material.opacity = 1;
              },
              onLeave: () => {
                console.log("onLeave");
                object.material.opacity = 0;
              },
              onEnterBack: () => {
                console.log("onEnterBack");
                object.material.opacity = 1;
              },
              onLeaveBack: () => {
                console.log("onLeaveBack");
                object.material.opacity = 0;
              },
              onUpdate: (self) => {
                object.rotation.y = 2 * 3.14 * self.progress;
                object.position.z = -3.6 * Math.sin(3.14 * self.progress);
              },
            });
          }
        });
      });
    }


    this.initGSAP();




    
 

    document.addEventListener("DOMContentLoaded", function() {
      GSAP.utils.toArray(".gs_reveal").forEach(function(elem) {
        console.log(elem);
        GSAP.set(elem, {autoAlpha: 0});
        //this.hide(elem); // assure that the element is hidden when scrolled into view
        

        function animateFrom(elem, direction) {
          direction = direction || 1;
          var x = 0,
              y = direction * 100;
          if(elem.classList.contains("gs_reveal_fromLeft")) {
            x = -100;
            y = 0;
          } else if (elem.classList.contains("gs_reveal_fromRight")) {
            x = 100;
            y = 0;
          }
          elem.style.transform = "translate(" + x + "px, " + y + "px)";
          elem.style.opacity = "0";
          GSAP.fromTo(elem, {x: x, y: y, autoAlpha: 0}, {
            duration: 3, 
            x: 0,
            y: 0, 
            autoAlpha: 1, 
            ease: "expo", 
            overwrite: "auto"
          });
        }

        ScrollTrigger.create({
          trigger: elem,
          onEnter: function() { animateFrom(elem) }, 
          onEnterBack: function() { animateFrom(elem, -1) },
          onLeave: function() {  GSAP.set(elem, {autoAlpha: 0}); } // assure that the element is hidden when scrolled into view
        });
      });
    });
  }

  initGSAP() {
    GSAP.registerPlugin(ScrollTrigger, Timeline);
    GSAP.defaults({
      //scrub: true,
      // ease: "power3",
      // duration: 6.6,
      //overwrite: true,
    });

    let tl1 = GSAP.timeline({
      scrollTrigger: {
        trigger: this.sections[0],
        start: "top top",
        endTrigger: this.sections[2],
        end: "bottom bottom",
        scrub: true
      }}
    );
    tl1.to(this.taichiCylinderMesh.position, {
      x: 1,
      y: 0,
      z: 0.4,
    }).to(this.taichiCylinderMesh.rotation, {
      x: 80,
      y: 0,
      z: 5,
    });

    let tl2 = GSAP.timeline({
      scrollTrigger: {
        trigger: this.sections[2],
        start: "bottom bottom",
        endTrigger: this.sections[5],
        end: "bottom bottom",
        scrub: true
      }}
    );
    tl2.to(this.taichiCylinderMesh.position, {
      x: -1,
      y: -0.8,
      z: 0.6,
    }).to(this.taichiCylinderMesh.rotation, {
      x: 80,
      y: 0,
      z: 10,
    });
     
  
  }

Z

  init() {
    this.addCanvas();
    this.addCamera();
    this.addMesh();
    this.addEventListeners();
    this.onResize();
    //this.initGSAP();
    this.update();
  }

  /**
   * STAGE
   */
  addCanvas() {
    this.canvas.classList.add("webgl");
    document.body.appendChild(this.canvas);
  }

  addCamera() {
    this.camera.position.set(0, 0, 2.5);
    this.scene.add(this.camera);
  }

  /**
   * OBJECT
   */
  addMesh() {
    this.geometry = new THREE.IcosahedronGeometry(1, 64);

    this.material = new THREE.ShaderMaterial({
      wireframe: true,
      blending: THREE.AdditiveBlending,
      transparent: true,
      vertexShader,
      fragmentShader,
      uniforms: {
        uFrequency: { value: this.settings.uFrequency.start },
        uAmplitude: { value: this.settings.uAmplitude.start },
        uDensity: { value: this.settings.uDensity.start },
        uStrength: { value: this.settings.uStrength.start },
        uDeepPurple: { value: this.settings.uDeepPurple.start },
        uOpacity: { value: this.settings.uOpacity.start },
      },
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.taichiGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);

    const texture = new THREE.TextureLoader().load("taichi.png");
    this.taichiMaterial = new THREE.MeshBasicMaterial({ map: texture });

    this.taichiCylinderMesh = new THREE.Mesh(
      this.taichiGeometry,
      this.taichiMaterial
    );

   // this.taichiCylinderMesh.position.set(-0.5, 0.2, 1.5);
    this.taichiCylinderMesh.position.set(-1, 1, 0.2);
    this.taichiCylinderMesh.rotation.set(80, 0, 0);
    this.taichiCylinderMesh.scale.set(0.3, 0.3, 0.3);

    this.scene.add(this.taichiCylinderMesh);
    this.scene.add(this.mesh);


  }

  waitForLoad() {
    return this._loadingPromise();
  }

  loadModel(loader, url) {
    return new Promise((resolve, reject) => {
      loader.load(
        url,

        (gltf) => {
          resolve(gltf);
        },

        undefined,

        (error) => {
          console.error("An error happened.", error);
          reject(error);
        }
      );
    });
  }

  /**
   * SCROLL BASED ANIMATIONS
   */
  updateScrollAnimations() {
    this.scroll.running = false;
    this.scroll.normalized = this.scroll.hard / this.scroll.limit;
    GSAP.to(this.mesh.rotation, {
      x: this.scroll.normalized * Math.PI,
    });
    GSAP.to(this.elements.line, {
      scaleX: this.scroll.normalized,
      transformOrigin: "left",
      duration: 1.5,
      ease: "ease",
    });
    // GSAP.to(this.taichiCylinderMesh.rotation, {
    //   z: this.scroll.normalized * Math.PI,
    // });

    for (const key in this.settings) {
      if (this.settings[key].start !== this.settings[key].end) {
        GSAP.to(this.mesh.material.uniforms[key], {
          value:
            this.settings[key].start +
            this.scroll.normalized *
              (this.settings[key].end - this.settings[key].start),
        });
      }
    }
  }

  /**
   * EVENTS
   */
  addEventListeners() {
    window.addEventListener("load", this.onLoad.bind(this));

    // window.addEventListener('mousemove', this.onMouseMove.bind(this))  // enable for soundcheck (→ console)

    window.addEventListener("scroll", this.onScroll.bind(this));

    window.addEventListener("resize", this.onResize.bind(this));
  }

  onLoad() {
    document.body.classList.remove("loading");

    this.animations = new Animations(this.element, this.camera);
  }

  onMouseMove(event) {
    // play with it!
    // enable / disable / change x, y, multiplier …

    this.mouse.x = (event.clientX / this.viewport.width).toFixed(2) * 4;
    this.mouse.y = (event.clientY / this.viewport.height).toFixed(2) * 2;

    GSAP.to(this.mesh.material.uniforms.uFrequency, { value: this.mouse.x });
    GSAP.to(this.mesh.material.uniforms.uAmplitude, { value: this.mouse.x });
    GSAP.to(this.mesh.material.uniforms.uDensity, { value: this.mouse.y });
    GSAP.to(this.mesh.material.uniforms.uStrength, { value: this.mouse.y });
    // GSAP.to(this.mesh.material.uniforms.uDeepPurple, { value: this.mouse.x })
    // GSAP.to(this.mesh.material.uniforms.uOpacity, { value: this.mouse.y })

    console.info(`X: ${this.mouse.x}  |  Y: ${this.mouse.y}`);
  }

  onScroll() {
    if (!this.scroll.running) {
      window.requestAnimationFrame(this.updateScrollAnimations);

      this.scroll.running = true;
    }
  }

  onResize() {
    this.viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    this.smoothScroll.onResize();

    if (this.viewport.width < this.viewport.height) {
      this.mesh.scale.set(0.75, 0.75, 0.75);
    } else {
      this.mesh.scale.set(1, 1, 1);
    }

    this.camera.aspect = this.viewport.width / this.viewport.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.viewport.width, this.viewport.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  }

  /**
   * LOOP
   */
  update() {
    const elapsedTime = this.clock.getElapsedTime();
    this.mesh.rotation.y = elapsedTime * 0.05;

    this.smoothScroll.update();

   

    this.time += 0.05;
    this.modelMaterial.uniforms.time.value = this.time;

    this.render();

    window.requestAnimationFrame(this.update);
  }

  /**
   * RENDER
   */
  render() {
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
  }
}
