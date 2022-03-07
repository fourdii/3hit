import * as THREE from "three";
import GSAP from "gsap";
import Animations from "./Animations";
import SmoothScroll from "./SmoothScroll";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import "../styles/shaders-on-scroll.sass";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import "./gold.glb";
import "./fire.glb";
import "./aqua.glb";
import "./wood.glb";
import "./dirt.glb";
// import * as dat from "dat.gui";
import { Vector3, Vector2 } from "three";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Timeline } from "gsap/gsap-core";

export default class ScrollStage {
  constructor() {
    this.element = document.querySelector(".content");

    this.resourceDatas = {
      name: ["gold", "wood", "aqua", "fire", "dirt"],

      mapUrl: ["/gold.png", "/wood.jpg", "/aqua.jpg", "/fire.jpg", "/dirt.jpg"],

      Colors: ["#f9a602", "#855e42", "#2B65EC", "#b22222", "#9b7653"],

      PatternUrl: [
        "/biologist/gold_pattern.png",
        "/biologist/wood_pattern.png",
        "/biologist/aqua_pattern.png",
        "/biologist/fire_pattern.png",
        "/biologist/dirt_pattern.png",
      ],

      PatternSize: [
        new Vector2(1.6, 4),
        new Vector2(1.6, 5),
        new Vector2(1.6, 3.4),
        new Vector2(1.6, 4.6),
        new Vector2(1.6, 2.4),
      ],

      PatternPos: [
        new Vector3(-16, 3, 5),
        new Vector3(20, 3, 14),
        new Vector3(11, 18, -10),
        new Vector3(-12, -7, 15),
        new Vector3(-9, 15, -3),
      ],

      CameraPos: [
        new Vector3(0, 0, 30),
        new Vector3(-13.3, 1, 15),
        new Vector3(16, 0.3, 25),
        new Vector3(13, 16, 0),
        new Vector3(-8, -4, 28),
        new Vector3(-6.5, 13, 5),

        // new Vector3(-11, 1.5, 10),
        // new Vector3(18, -1, 15),
        // new Vector3(16, 17, -5),
        // new Vector3(-6, -4, 24),
        // new Vector3(-4, 13, -3),
      ],

      Pos: [
        new Vector3(-13, 1, 5),
        new Vector3(16, 0, 4),
        new Vector3(13, 15, -15),
        new Vector3(-8, -4, 15),
        new Vector3(-6, 13, -15),
      ],

      Rot: [
        new Vector3(13, 101, 181),
        new Vector3(-27, -42, 0),
        new Vector3(6.5, 0, 0),
        new Vector3(30, -170, 0),
        new Vector3(46, -18.6, 0),
      ],

      ToPos: [
        new Vector3(0, 0, 2),
        new Vector3(0, 0, 2),
        new Vector3(0, 0, 2),
        new Vector3(0, 0, 2),
        new Vector3(0, 0, 2),
      ],

      ToRot: [
        new Vector3(13, 106, 181),
        new Vector3(-27, -37, 0),
        new Vector3(6.5, 5, 0),
        new Vector3(30, -165, 0),
        new Vector3(46, -12.6, 0),
      ],
    };

    //  this.gui = new dat.GUI();

    GSAP.registerPlugin(ScrollTrigger, Timeline);

    ScrollTrigger.defaults({
      immediateRender: false,
      ease: "power1.inOut",
      scrub: 1,
    });

    this.sections = [];
    GSAP.utils.toArray(".section").forEach((section, i) => {
      this.sections.push(section);
    });

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
      antialias: false,
      alpha: true,
    });

    this.addCanvas();

    this.addCamera();

    this.clock = new THREE.Clock();

    this.smoothScroll = new SmoothScroll({
      element: this.element,
      viewport: this.viewport,
      scroll: this.scroll,
    });
  }


 

  loadAssets = function () {

    this.loadMainModel();
    this.loadDollModels();
    this.loadLights();
    this.loadTaichiModel();
    this.loadFontModels();
    this.loadVideoModels();
    this.loadPatternModels();

   
  
  };

  init(){
    this.addEventListeners();
    this.onResize();
    this.update();
  }

  loadFontModels() {
    const fontLoader = new THREE.FontLoader();

    this.loadModel(fontLoader, "/VAIO_CON_DIOS_Regular.json").then((font) => {
      const height = 0.05;
      const size = 0.5;

      const textGeometry = new THREE.TextGeometry("biologist", {
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
        emissive: 0x000000,
        metalness: 0.8,
        roughness: 0.4,
      });

      this.textMesh = new THREE.Mesh(textGeometry, textMaterial);

      this.textMesh.position.set(-2.5, -3, -20);
      this.textMesh.rotation.set(-1.5, 0, 0);
      this.textMesh.scale.set(1.8, 1.8, 1.8);

      this.scene.add(this.textMesh);

      let animateIn = GSAP.timeline({
        defaults: {
          ease: "expo",
        },
      });

      animateIn
        .fromTo(
          this.textMesh.position,
          {
            x: this.textMesh.position.x,
            y: this.textMesh.position.y,
            z: this.textMesh.position.z,
          },
          {
            x: this.textMesh.position.x,
            y: this.textMesh.position.y,
            z: 20,
            duration: 3,
          }
        )
        .fromTo(
          this.textMesh.rotation,
          {
            x: this.textMesh.rotation.x,
            y: this.textMesh.rotation.y,
            z: this.textMesh.rotation.z,
          },
          {
            x: 0,
            y: this.textMesh.rotation.y,
            z: this.textMesh.rotation.z,
            duration: 3,
          }
        );
   
    });

    this.loadModel(fontLoader, "/Disco_2000_Regular.json").then((font) => {
      const height = 0.05;
      const size = 0.5;

      const textGeometry2 = new THREE.TextGeometry("5 3l3m3nt", {
        font: font,
        size: size,
        height: height,
        depth: 2,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 0.05,
        bevelSize: 0.05,
        bevelOffset: 0,
        bevelSegments: 20,
      });

      textGeometry2.computeBoundingBox();

      const textMaterial2 = new THREE.MeshStandardMaterial({
        color: 0x888888,
        emissive: 0x000000,
        metalness: 0.8,
        roughness: 0.4,
      });

      this.textMesh2 = new THREE.Mesh(textGeometry2, textMaterial2);

      this.textMesh2.position.set(-0.9, 2.4, -20);
      this.textMesh2.rotation.set(1.5, 0, 0);
      this.textMesh2.scale.set(0.8, 0.8, 0.8);

      this.scene.add(this.textMesh2);

      let animateIn = GSAP.timeline({
        defaults: {
          ease: "expo",
        },
      });

      animateIn
        .fromTo(
          this.textMesh2.position,
          {
            x: this.textMesh2.position.x,
            y: this.textMesh2.position.y,
            z: this.textMesh2.position.z,
          },
          {
            x: this.textMesh2.position.x,
            y: this.textMesh2.position.y,
            z: 20,
            duration: 3,
          }
        )
        .fromTo(
          this.textMesh2.rotation,
          {
            x: this.textMesh2.rotation.x,
            y: this.textMesh2.rotation.y,
            z: this.textMesh2.rotation.z,
          },
          {
            x: 0,
            y: this.textMesh2.rotation.y,
            z: this.textMesh2.rotation.z,
            duration: 3,
          }
        );

    });
  }

  loadTaichiModel() {
    const materials = [];
    this.taichiGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.01, 32);
    const taichiTexture = new THREE.TextureLoader().load("taichi.png");
    const top = new THREE.MeshBasicMaterial({ map: taichiTexture });
    const side = new THREE.MeshBasicMaterial();
    const bottom = new THREE.MeshBasicMaterial({ map: taichiTexture });

    materials.push(side);
    materials.push(top);
    materials.push(bottom);

    this.taichiMesh = new THREE.Mesh(this.taichiGeometry, materials);
    this.taichiMesh.position.set(0, 0, -10);
    this.taichiMesh.rotation.set(1.5, 2.5, 0);
    this.taichiMesh.scale.set(8, 8, 8);

    this.scene.add(this.taichiMesh);


    GSAP.fromTo(
      this.taichiMesh.position,
      {
        x: 0,
        y: 0,
        z: -10,
      },
      {
        x: 0,
        y: 0,
        z: 0,
        duration: 3,
      }
    );

    let taichiTl = GSAP.timeline({
      scrollTrigger: {
        trigger: this.sections[0],
        start: "top top",
        endTrigger: this.sections[10],
        end: "bottom bottom",
      },
    });
    taichiTl.fromTo(
      this.taichiMesh.rotation,
      {
        x: 1.5,
        y: 2.5,
        z: 0,
      },
      {
        x: 1.5,
        y: 20,
        z: 20,
      }
    );
  }

  loadLights() {
    this.light = new THREE.AmbientLight(0x404040, 12);
    this.scene.add(this.light);

    this.pointLight1 = new THREE.PointLight(0xffffff, 1, 100);
    this.pointLight1.position.set(0, 0, 30);
    this.pointLight1.rotation.set(0, 0, 0);
    this.scene.add(this.pointLight1);

    this.pointLight2 = new THREE.PointLight(0xffffff, 1, 100);
    this.pointLight1.position.set(0, 0, 50);
    this.pointLight1.rotation.set(0, 0, 0);
    this.scene.add(this.pointLight2);


    ScrollTrigger.create({
      trigger: this.sections[0],
      start: "top 80px",
      endTrigger: this.sections[10],
      end: "center bottom",
      scrub: true,
      onUpdate: (self) => {
        this.pointLight2.position.x =
          100 * Math.sin(10 * self.progress.toFixed(3));
      },
    });
  }

  loadMainModel() {
    this.geometry = new THREE.IcosahedronGeometry(10, 64);
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
    this.mesh.position.set(0, 0, 0);
    this.scene.add(this.mesh);
  }

  loadDollModels() {
    this.GLTFLoader = new GLTFLoader();

    this.dict = [];
    this.materialDict = [];
    this.time = 0;

    for (let i = 0; i < this.resourceDatas.name.length; i++) {
      let sModelName = "/model/" + this.resourceDatas.name[i] + ".glb";

      const modelMaterial = new THREE.MeshStandardMaterial({
        color: this.resourceDatas.Colors[i],
        emissive: 0x000000,
        metalness: 0.8,
        roughness: 0.1,
        displacementMap: new THREE.TextureLoader().load("/disp-01.png"),
        displacementScale: 0,
      });

      this.loadModel(this.GLTFLoader, sModelName).then((gltf) => {
        var model = gltf.scene;

        this.materialDict.push(modelMaterial);

        model.traverse((object) => {
          if (object.isMesh) {
            object.material = modelMaterial;
            object.position.set(
              this.resourceDatas.Pos[i].x,
              this.resourceDatas.Pos[i].y,
              this.resourceDatas.Pos[i].z
            );
            object.rotation.set(
              this.resourceDatas.Rot[i].x,
              this.resourceDatas.Rot[i].y,
              this.resourceDatas.Rot[i].z
            );

            this.dict.push(object);
            this.scene.add(object);

          }
        });
      });
    }
  }

  loadPatternModels() {
    this.patterns = [];

    for (let i = 0; i < 5; i++) {
      const tex = new THREE.TextureLoader().load(
        this.resourceDatas.PatternUrl[i]
      );

      const geometry = new THREE.PlaneGeometry(
        this.resourceDatas.PatternSize[i].x,
        this.resourceDatas.PatternSize[i].y
      );
      const material = new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,
        map: tex,
        transparent: true,
        roughness: 0.3,
        metalness: 0.8,
      });
      const plane = new THREE.Mesh(geometry, material);
      plane.position.set(0, 0, 50);
      this.scene.add(plane);

      this.patterns.push(plane);

      const patternTl = GSAP.timeline();
      patternTl.to(this.patterns[i].position, {
        x: this.resourceDatas.PatternPos[i].x,
        y: this.resourceDatas.PatternPos[i].y,
        z: this.resourceDatas.PatternPos[i].z,
      });

      ScrollTrigger.create({
        animation: patternTl,
        trigger: this.sections[2 * (i + 1) - 1],
        start: "top center",
        endTrigger: this.sections[2 * (i + 1)],
        end: "top center",
      });

 
    }
  }

  loadVideoModels() {
    this.videoSources = [
      "/gold.mp4",
      "/wood.mp4",
      "/aqua.mp4",
      "/fire.mp4",
      "/dirt.mp4",
    ];

    this.video = document.createElement("video");
    this.video.setAttribute("src", this.videoSources[0]);
    this.video.setAttribute("type", "video/mp4");
    this.video.setAttribute("preload", "auto");
    this.video.setAttribute("playsinline", true);

    let isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS) {
      console.log("is IOS");
      this.video.setAttribute("muted", true);
    } else {
      this.video.setAttribute("muted", false);
    }

    this.video.load();

    this.video.onloadeddata = (e) => {
      console.log("video loaded");

      const videoTexture = new THREE.VideoTexture(e.target);
      videoTexture.minFilter = THREE.LinearFilter;
      videoTexture.magFilter = THREE.LinearFilter;
      videoTexture.needsUpdate = true;
      const videoGeometry = new THREE.PlaneGeometry(12, 12);
      videoGeometry.scale(0.5, 0.5, 0.5);
      const videomMaterial = new THREE.MeshBasicMaterial({
        map: videoTexture,
        side: THREE.DoubleSide,
      });
      videomMaterial.needsUpdate = true;

      const count = 128;
      const radius = 32;

      for (let i = 1, l = count; i <= l; i++) {
        const phi = Math.acos(-1 + (2 * i) / l);
        const theta = Math.sqrt(l * Math.PI) * phi;

        const mesh = new THREE.Mesh(videoGeometry, videomMaterial);
        mesh.position.setFromSphericalCoords(radius, phi, theta);
        mesh.lookAt(new Vector3(0, 0, 30));
        this.scene.add(mesh);
      }
    };

    for (let i = 0; i < this.videoSources.length; i++) {
      console.log("create scrolltrigger");

      ScrollTrigger.create({
        trigger: this.sections[2 * (i + 1) - 1],
        start: "top 80px",
        endTrigger: this.sections[2 * (i + 1)],
        end: "bottom bottom",
        scrub: true,
        onEnter: () => {
          console.log("onEnter");
          this.video.pause();
          this.video.setAttribute("src", this.videoSources[i]);
          this.video.setAttribute("type", "video/mp4");
          this.video.setAttribute("preload", "auto");
          this.video.setAttribute("playsinline", true);

          let isIOS =
            /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
          if (isIOS) {
            console.log("is IOS");
            this.video.setAttribute("muted", true);
          } else {
            this.video.setAttribute("muted", false);
          }

          this.video.load();
          this.video.onloadeddata = () => {
            this.video.play();
          };
        },
        onLeave: () => {
          console.log("onLeave");
          this.video.pause();
          this.video.load();
        },
        onEnterBack: () => {
          console.log("onEnterBack");
          this.video.src = this.videoSources[i];
          this.video.load();
          this.video.play();
        },
        onLeaveBack: () => {
          console.log("onLeaveBack");
          this.video.pause();
          this.video.load();
        },
      });
    }
  }

  addCanvas() {
    this.canvas = this.renderer.domElement;
    this.canvas.classList.add("webgl");
    document.body.appendChild(this.canvas);
  }

  addCamera() {
    this.camera = new THREE.PerspectiveCamera(
      60,
      this.viewport.width / this.viewport.height,
      0.1,
      100
    );

    this.scene.add(this.camera);

    // this.camera.position.set(0, 0, 30);

    for (let i = 0; i < 5; i++) {
      let tl = GSAP.timeline({
        scrollTrigger: {
          trigger: this.sections[2 * (i + 1) - 1],
          start: "top center",
          endTrigger: this.sections[2 * (i + 1)],
          end: "top center",
        },
      });
      tl.fromTo(
        this.camera.position,
        {
          x: this.resourceDatas.CameraPos[i].x,
          y: this.resourceDatas.CameraPos[i].y,
          z: this.resourceDatas.CameraPos[i].z,
        },
        {
          x: this.resourceDatas.CameraPos[i + 1].x,
          y: this.resourceDatas.CameraPos[i + 1].y,
          z: this.resourceDatas.CameraPos[i + 1].z,
        }
      );
    }

    GSAP.set(this.camera.position, { x: 0, y: 0, z: 30 });

    // this.gui.add(this.camera.position, "x", -100, 100, 0.1);
    // this.gui.add(this.camera.position, "y", -100, 100, 0.1);
    // this.gui.add(this.camera.position, "z", -100, 100, 0.1);

    // this.gui.add(this.camera.rotation, "x", -2, 2, 0.1);
    // this.gui.add(this.camera.rotation, "y", -2, 2, 0.1);
    // this.gui.add(this.camera.rotation, "z", -2, 2, 0.1);
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

  updateScrollAnimations() {

    this.scroll.running = false;
    this.scroll.normalized = this.scroll.hard / this.scroll.limit;

    GSAP.to(this.mesh.rotation, {
      x: this.scroll.normalized * Math.PI,
    });
    GSAP.to(this.elements.line, {
      scaleX: this.scroll.normalized,
      transformOrigin: "left",
      //scrub: true,
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

  addEventListeners() {
    this.updateScrollAnimations = this.updateScrollAnimations.bind(this);
    this.update = this.update.bind(this);

    window.addEventListener("load", this.onLoad.bind(this));

    window.addEventListener("scroll", this.onScroll.bind(this));

    window.addEventListener("resize", this.onResize.bind(this));

  }

  onLoad() {
    document.body.classList.remove("loading");

    // window.scrollTo({ top: 0, behavior: 'smooth' });

    // ScrollTrigger.refresh();

   
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

  update() {
    window.requestAnimationFrame(this.update);

    const elapsedTime = this.clock.getElapsedTime();


    this.modelMove(elapsedTime);

    this.smoothScroll.update();


    this.render();
  }

  modelMove(t) {

    this.mesh.rotation.y = t * 0.05;

    for (let i = 0; i < this.dict.length; i++) {
      this.dict[i].rotation.x = THREE.MathUtils.lerp(
        this.dict[i].rotation.x,
        Math.cos(t / 2) / 10 + 0.25,
        0.1
      );

      this.dict[i].rotation.y += 0.01;

      this.dict[i].rotation.x += 0.005;

      this.dict[i].rotation.z = THREE.MathUtils.lerp(
        this.dict[i].rotation.z,
        Math.sin(t / 4) / 20,
        0.1
      );
    }

  for (let i = 0; i < this.patterns.length; i++) {
    this.patterns[i].rotation.y += 0.01;
  }

  this.textMesh2.rotation.x += 0.05;
  }

  render() {
    this.renderer.clear();
    this.renderer.render(this.scene, this.camera);
  }
}
