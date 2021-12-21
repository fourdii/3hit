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
import * as dat from "dat.gui";
import { Vector3 } from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Timeline } from "gsap/gsap-core";
import fragmentShader2 from "./fragment.glsl";
import vertexShader2 from "./vertex.glsl";

export default class ScrollStage {
  constructor() {
    this.element = document.querySelector(".content");

    this.resourceDatas = {
      name: ["gold", "wood", "aqua", "fire", "dirt"],

      mapUrl: ["/gold.png", "/wood.jpg", "/aqua.jpg", "/fire.jpg", "/dirt.jpg"],

      Pos: [
        new Vector3(2, 1, 0),
        new Vector3(-2, -1, 0),
        new Vector3(-2, 1, 0),
        new Vector3(2, -1, 0),
        new Vector3(0, 0, 0),
      ],

      Rot: [
        new Vector3(13, 101, 181),
        new Vector3(-27, -42, 0),
        new Vector3(6.5, 0, 0),
        new Vector3(30, -170, 0),
        new Vector3(46, -18.6, 0),
      ],

      ToPos: [
        new Vector3(-0.27, -0.4, 0),
        new Vector3(-0.5, -0.8, -4),
        new Vector3(-0.22, -0.55, 0),
        new Vector3(-0.3, -0.5, -1),
        new Vector3(-0.3, -0.7, -3),
      ],

      ToRot: [
        new Vector3(13, 106, 181),
        new Vector3(-27, -37, 0),
        new Vector3(6.5, 5, 0),
        new Vector3(30, -165, 0),
        new Vector3(46, -12.6, 0),
      ],
    };

    this.gui = new dat.GUI();

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
      100
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

    this.dict = [];
    this.materialDict = [];
    this.time = 0;
    for (let i = 0; i < this.resourceDatas.name.length; i++) {
      // let resourceData = resourceDatas[i];

      let sModelName = "/model/" + this.resourceDatas.name[i] + ".glb";

      this.loadModel(this.GLTFLoader, sModelName).then((gltf) => {
        var model = gltf.scene;

        const modelMaterial = new THREE.ShaderMaterial({
          extensions: {
            derivatives: "#extension GL_OES_standard_derivatives : enable",
          },

          side: THREE.DoubleSide,

          uniforms: {
            time: { type: "f", value: 0 },
            sky: {
              type: "t",
              value: new THREE.TextureLoader().load(
                this.resourceDatas.mapUrl[i]
              ),
            },
            resolution: { type: "v4", value: new THREE.Vector4() },
            uvRate1: {
              value: new THREE.Vector2(1, 1),
            },

            opacity: 0,
          },

          vertexShader: vertexShader2,

          fragmentShader: fragmentShader2,
        });

        this.materialDict.push(modelMaterial);

        model.traverse((object) => {
          if (object.isMesh) {
            object.material = modelMaterial;
            object.position.set(0, 0, -30);
            object.rotation.set(
              this.resourceDatas.Rot[i].x,
              this.resourceDatas.Rot[i].y,
              this.resourceDatas.Rot[i].z
            );
            object.scale.set(0.1, 0.1, 0.1);
            object.material.opacity = 0;

            this.dict.push(object);
            this.scene.add(object);

            let tl = GSAP.timeline({
              scrollTrigger: {
                trigger: this.sections[2 * (i + 1) - 1],
                start: "top top",
                endTrigger: this.sections[2 * (i + 1)],
                end: "bottom bottom",
                scrub: true,
              },
            });
            tl.fromTo(
              object.position,
              {
                x: 0,
                y: 0,
                z: -30,
              },
              {
                x: this.resourceDatas.ToPos[i].x,
                y: this.resourceDatas.ToPos[i].y,
                z: this.resourceDatas.ToPos[i].z,
              }
            )
              .fromTo(
                object.rotation,
                {
                  x: this.resourceDatas.Rot[i].x,
                  y: this.resourceDatas.Rot[i].y,
                  z: this.resourceDatas.Rot[i].z,
                },
                {
                  x: this.resourceDatas.ToRot[i].x,
                  y: this.resourceDatas.ToRot[i].y,
                  z: this.resourceDatas.ToRot[i].z,
                }
              )
              .fromTo(
                object,
                {
                  visible: true,
                },
                {
                  visible: false,
                }
              )
              .fromTo(
                object.material,
                {
                  opacity: 0,
                },
                {
                  opacity: 1,
                }
              )
              ;

            // ScrollTrigger.create({
            //   animation: tl,
            //   trigger: this.sections[i + 1],
            //   start: "top 80px",
            //   endTrigger: this.sections[i + 3],
            //   end: "bottom bottom",
            //   scrub: true,
            //   onEnter: () => {
            //     console.log("onEnter");
            //     object.material.opacity = 1;
            //   },
            //   onLeave: () => {
            //     console.log("onLeave");
            //     object.material.opacity = 0;
            //   },
            //   onEnterBack: () => {
            //     console.log("onEnterBack");
            //     object.material.opacity = 1;
            //   },
            //   onLeaveBack: () => {
            //     console.log("onLeaveBack");
            //     object.material.opacity = 0;
            //   },
            //   onUpdate: (self) => {
            //     object.rotation.y = 2 * 3.14 * self.progress;
            //     object.position.z = -3.6 * Math.sin(3.14 * self.progress);
            //     object.position.x = self.progress.toFixed(3) * this.resourceDatas.ToPos[i].x;
            //     object.position.y = self.progress.toFixed(3) * this.resourceDatas.ToPos[i].y;
            //     object.position.z = self.progress.toFixed(3) * this.resourceDatas.ToPos[i].z;
            //     object.rotation.x = self.progress * this.resourceDatas.ToRot[i].x;
            //     object.rotation.y = self.progress * this.resourceDatas.ToRot[i].y;
            //     object.rotation.z = self.progress * this.resourceDatas.ToRot[i].z;
            //   },
            // });

            // this.gui.add(object.position, "x", -100, 100, 0.01);
            // this.gui.add(object.position, "y", -100, 100, 0.01);
            // this.gui.add(object.position, "z", -100, 100, 0.01);
          }
        });
      });
    }

    const fontLoader = new THREE.FontLoader();

    this.loadModel(fontLoader, "/Olopus_Regular.json").then((font) => {
      const height = 0.05;
      const size = 0.5;

      const textGeometry = new THREE.TextGeometry("BI     GIST", {
        font: font,
        size: size,
        height: height,
        depth: 2,
        curveSegments: 6,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.05,
        bevelOffset: 0,
        bevelSegments: 20,
      });

      const textMaterial = new THREE.MeshStandardMaterial({
        color: 0x888888,
        metalness: 0.8,
        roughness: 0.4,
      });

      this.textMesh = new THREE.Mesh(textGeometry, textMaterial);

      textGeometry.computeBoundingBox();

      this.textMesh.position.set(-1.7, -1, -3);
      this.textMesh.rotation.set(0, 0, 0);

      this.scene.add(this.textMesh);

      const textGeometry2 = new THREE.TextGeometry("ELEMENT", {
        font: font,
        size: size,
        height: height,
        depth: 2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelOffset: 0,
        bevelSegments: 20,
      });

      const textMaterial2 = new THREE.MeshStandardMaterial({
        color: 0x888888,
        metalness: 0.8,
        roughness: 0.4,
      });

      this.textMesh2 = new THREE.Mesh(textGeometry2, textMaterial2);

      textGeometry2.computeBoundingBox();

      this.textMesh2.position.set(-1.5, 2, -6);
      this.textMesh2.rotation.set(0, 0, 0);

      this.scene.add(this.textMesh2);

      this.pointLight1 = new THREE.PointLight(0xffffff, 1, 100);
      this.pointLight1.position.set(-100, 0, 0);
      this.pointLight1.rotation.set(0.4, 0.8, 2);
      this.scene.add(this.pointLight1);

      this.pointLight2 = new THREE.PointLight(0xffffff, 1, 100);
      this.pointLight2.position.set(-2.9, 3.7, 0);
      this.pointLight2.rotation.set(0.4, 0.8, 2);
      this.scene.add(this.pointLight2);


      this.pointLight3 = new THREE.PointLight(0xffffff, 1, 100);
      this.pointLight3.position.set(-1.2, 0.7, 0.5);
      this.pointLight3.rotation.set(0, 233, 0);    
      this.scene.add(this.pointLight3);
      // let tl = GSAP.timeline({
      //   scrollTrigger: {
      //     trigger: this.sections[0],
      //     start: "top 80px",
      //     endTrigger: this.sections[10],
      //     end: "bottom bottom",
      //     scrub: true,
      //   },
      // });
      // tl.to(this.pointLight1.position, {
      //   x: 100,
      //   y: 0,
      //   z: 0,
      // })

      ScrollTrigger.create({
        // animation: tl,
        trigger: this.sections[0],
        start: "top 80px",
        endTrigger: this.sections[10],
        end: "center bottom",
        scrub: true,
        // onEnter: () => {
        //   console.log("onEnter");
        //   this.textMesh.material.opacity = 1;
        //   this.textMesh2 .material.opacity = 1;
        // },
        // onLeave: () => {
        //   console.log("onLeave");
        //   this.textMesh.material.opacity = 0;
        //   this.textMesh2 .material.opacity = 0;
        // },
        // onEnterBack: () => {
        //   console.log("onEnterBack");
        //   this.textMesh.material.opacity = 1;
        //   this.textMesh2 .material.opacity = 1;
        // },
        // onLeaveBack: () => {
        //   console.log("onLeaveBack");
        //   this.textMesh.material.opacity = 0;
        //   this.textMesh2 .material.opacity = 0;
        // },
        onUpdate: (self) => {
          this.pointLight1.position.x =
            100 * Math.sin(10 * self.progress.toFixed(3));
          // object.position.z = -3.6 * Math.sin(3.14 * self.progress);
        },
      });

      // this.gui.add(this.textMesh.position, 'x', -100, 100, 0.1);
      // this.gui.add(this.textMesh.position, 'y', -100, 100, 0.1);
      // this.gui.add(this.textMesh.position, 'z', -100, 100, 0.1);

      // this.gui.add(this.textMesh.rotation, 'x',  0, 360, 0.1);
      // this.gui.add(this.textMesh.rotation, 'y',  0, 360, 0.1);
      // this.gui.add(this.textMesh.rotation, 'z',  0, 360, 0.1);

      // this.gui.add(this.textMesh2.position, 'x', -100, 100, 0.1);
      // this.gui.add(this.textMesh2.position, 'y', -100, 100, 0.1);
      // this.gui.add(this.textMesh2.position, 'z', -100, 100, 0.1);

      // this.gui.add(this.textMesh2.rotation, 'x',  0, 360, 0.1);
      // this.gui.add(this.textMesh2.rotation, 'y',  0, 360, 0.1);
      // this.gui.add(this.textMesh2.rotation, 'z',  0, 360, 0.1);

      // this.gui.add(this.textMesh.material, 'roughness', 0, 1, 0.01);
      // this.gui.add(this.textMesh.material, 'metalness', 0, 1, 0.01);

      // this.gui.add(this.pointLight1.position, 'x', -100, 100, 0.1);
      // this.gui.add(this.pointLight1.position, 'y', -100, 100, 0.1);
      // this.gui.add(this.pointLight1.position, 'z', -100, 100, 0.1);

      // this.gui.add(this.pointLight2.position, 'x', -100, 100, 0.1);
      // this.gui.add(this.pointLight2.position, 'y', -100, 100, 0.1);
      // this.gui.add(this.pointLight2.position, 'z', -100, 100, 0.1);

      const videoDict = [
        "/gold.mov",
        "/wood.mov",
        "/aqua.mov",
        "/fire.mov",
        "/dirt.mov",
      ];

      this.videoBoxes = {
        videos: [],
        boxes: [],
      };

      for (let i = 0; i < videoDict.length; i++) {
        const video = document.createElement("video");
        video.src = videoDict[i];
        const texture = new THREE.VideoTexture(video);
        const boxGeometry = new THREE.BoxBufferGeometry(1, 1, 0.01);
        const boxMaterial = new THREE.MeshLambertMaterial({
          color: 0xffffff,
          map: texture,
        });

        const box = new THREE.Mesh(boxGeometry, boxMaterial);

        box.position.set(0, 0.4, -3);
        box.rotation.set(0, 10, 276.5);
      
        box.visible = false;

        this.scene.add(box);
        this.videoBoxes.videos.push(video);
        this.videoBoxes.boxes.push(box);

        ScrollTrigger.create({
          trigger: this.sections[2 * (i + 1) - 1],
          start: "top top",
          endTrigger: this.sections[2 * (i + 1)],
          end: "bottom bottom",
          scrub: true,
          onEnter: () => {
            console.log("onEnter");
            box.visible = true;
            video.play();
          },
          onLeave: () => {
            console.log("onLeave");
            box.visible = false;
            video.pause();
          },
          onEnterBack: () => {
            console.log("onEnterBack");
            box.visible = true;
            video.pause();
          },
          onLeaveBack: () => {
            console.log("onLeaveBack");
            box.visible = false;
            video.pause();
          },
        });

        this.gui.add(box.position, "x", -100, 100, 0.1);
        this.gui.add(box.position, "y", -100, 100, 0.1);
        this.gui.add(box.position, "z", -100, 100, 0.1);

        this.gui.add(box.rotation, "x", 0, 360, 0.1);
        this.gui.add(box.rotation, "y", 0, 360, 0.1);
        this.gui.add(box.rotation, "z", 0, 360, 0.1);
      }

      
    });

    this.initGSAP();

    document.addEventListener("DOMContentLoaded", function () {
      GSAP.utils.toArray(".gs_reveal").forEach(function (elem) {
        console.log(elem);
        GSAP.set(elem, { autoAlpha: 0 });
        //this.hide(elem); // assure that the element is hidden when scrolled into view

        function animateFrom(elem, direction) {
          direction = direction || 1;
          var x = 0,
            y = direction * 100;
          if (elem.classList.contains("gs_reveal_fromLeft")) {
            x = -100;
            y = 0;
          } else if (elem.classList.contains("gs_reveal_fromRight")) {
            x = 100;
            y = 0;
          }
          elem.style.transform = "translate(" + x + "px, " + y + "px)";
          elem.style.opacity = "0";
          GSAP.fromTo(
            elem,
            { x: x, y: y, autoAlpha: 0 },
            {
              //duration: 3,
              x: 0,
              y: 0,
              autoAlpha: 1,
              //ease: "expo",
              overwrite: "auto",
              scrub: true,
            }
          );
        }

        ScrollTrigger.create({
          trigger: elem,
          onEnter: function () {
            animateFrom(elem);
          },
          onEnterBack: function () {
            animateFrom(elem, -1);
          },
          onLeave: function () {
            GSAP.set(elem, { autoAlpha: 0 });
          }, // assure that the element is hidden when scrolled into view
        });
      });
    });

    this.update();
  };

  initGSAP() {
    GSAP.registerPlugin(ScrollTrigger, Timeline);
    GSAP.defaults({
      //scrub: true,
      // ease: "power3",
      // duration: 6.6,
      //overwrite: true,
    });

    // let tl1 = GSAP.timeline({
    //   scrollTrigger: {
    //     trigger: this.sections[0],
    //     start: "top top",
    //     endTrigger: this.sections[4],
    //     end: "bottom bottom",
    //     scrub: 1,
    //   },
    // });
    // tl1
    //   .to(this.taichiCylinderMesh.position, {
    //     x: 0.5,
    //     y: 0,
    //     z: 0.4,
    //   })
    //   .to(this.taichiCylinderMesh.rotation, {
    //     x: 80,
    //     y: 0,
    //     z: 5,
    //   });

    // let tl2 = GSAP.timeline({
    //   scrollTrigger: {
    //     trigger: this.sections[4],
    //     start: "bottom bottom",
    //     endTrigger: this.sections[10],
    //     end: "bottom bottom",
    //     scrub: 1,
    //   },
    // });
    // tl2
    //   .to(this.taichiCylinderMesh.position, {
    //     x: -0.5,
    //     y: -0.8,
    //     z: 0.6,
    //   })
    //   .to(this.taichiCylinderMesh.rotation, {
    //     x: 80,
    //     y: 0,
    //     z: 10,
    //   });
  }

  init() {
    this.addCanvas();
    this.addCamera();
    this.addMesh();
    this.addEventListeners();
    this.onResize();
    // this.update();
  }

  /**
   * STAGE
   */
  addCanvas() {
    this.canvas.classList.add("webgl");
    document.body.appendChild(this.canvas);
  }

  addCamera() {
    this.camera.position.set(0, 0, 3);
    this.scene.add(this.camera);

    // this.gui.add(this.camera.position, 'x', -100, 100, 0.1);
    // this.gui.add(this.camera.position, 'y', -100, 100, 0.1);
    // this.gui.add(this.camera.position, 'z', -100, 100, 0.1);
  }

  /**
   * OBJECT
   */
  addMesh() {
    this.geometry = new THREE.IcosahedronGeometry(15, 64);
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
    this.mesh.position.set(0, -0.5, 0);
    this.scene.add(this.mesh);



    // this.taichiGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);
    // const texture = new THREE.TextureLoader().load("taichi.png");
    // this.taichiMaterial = new THREE.MeshBasicMaterial({ map: texture });
    // this.taichiCylinderMesh = new THREE.Mesh(
    //   this.taichiGeometry,
    //   this.taichiMaterial
    // );


    // // this.taichiCylinderMesh.position.set(-0.5, 0.2, 1.5);
    // this.taichiCylinderMesh.position.set(-1, 1, 0.2);
    // this.taichiCylinderMesh.rotation.set(80, 0, 0);
    // this.taichiCylinderMesh.scale.set(0.3, 0.3, 0.3);

    // this.scene.add(this.taichiCylinderMesh);

    



const materials = [];
this.emojiGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.01, 32);
const taichiTexture = new THREE.TextureLoader().load("taichi.png");

const emojiTexture = new THREE.TextureLoader().load("emoji.png");
const top = new THREE.MeshBasicMaterial({ map: taichiTexture });
const side = new THREE.MeshBasicMaterial();
const bottom = new THREE.MeshBasicMaterial({ map: emojiTexture });

materials.push(side);
materials.push(top);
materials.push(bottom);

this.emojiMesh = new THREE.Mesh(this.emojiGeometry, materials);
this.emojiMesh.position.set(-0.25, -0.45, -0.5);
this.emojiMesh.rotation.set(241.18, 272, 0);
this.emojiMesh.scale.set(0.4, 0.4, 0.4);

this.scene.add(this.emojiMesh);

    // this.gui.add(this.emojiMesh.position, 'x', -100, 100, 0.01);
    // this.gui.add(this.emojiMesh.position, 'y', -100, 100, 0.01);
    // this.gui.add(this.emojiMesh.position, 'z', -100, 100, 0.01);
    // this.gui.add(this.emojiMesh.rotation, 'x',  0, 360, 0.01);
    // this.gui.add(this.emojiMesh.rotation, 'y',  0, 360, 0.01);
    // this.gui.add(this.emojiMesh.rotation, 'z',  0, 360, 0.01);

    // this.gui.add(this.mesh.position, 'x', -100, 100, 0.1);
    // this.gui.add(this.mesh.position, 'y', -100, 100, 0.1);
    // this.gui.add(this.mesh.position, 'z', -100, 100, 0.1);
    // this.gui.add(this.mesh.rotation, 'x',  0, 360, 0.1);
    // this.gui.add(this.mesh.rotation, 'y',  0, 360, 0.1);
    // this.gui.add(this.mesh.rotation, 'z',  0, 360, 0.1);

    // this.gui.add(this.taichiCylinderMesh.position, 'x', -100, 100, 0.1);
    // this.gui.add(this.taichiCylinderMesh.position, 'y', -100, 100, 0.1);
    // this.gui.add(this.taichiCylinderMesh.position, 'z', -100, 100, 0.1);
    // this.gui.add(this.taichiCylinderMesh.rotation, 'x',  0, 360, 0.1);
    // this.gui.add(this.taichiCylinderMesh.rotation, 'y',  0, 360, 0.1);
    // this.gui.add(this.taichiCylinderMesh.rotation, 'z',  0, 360, 0.1);
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
      scrub: true,
      // duration: 1.5,
      // ease: "ease",
    });

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

    // for (let i = 0; i < 5; i++) {
    //   this.materialDict[i].uniforms.time.value = this.time;
    // }

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
