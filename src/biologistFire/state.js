const state = {
  top: 0,
  pages: 0,
  threshold: 4,
  mouse: [0, 0],
  content: [
    {
      tag: '00',
      text: ``,
      images: ["/biologist/fire_char_nobg.png","/biologist/fire_char_nobg.png","/biologist/fire_char_nobg.png","/biologist/fire_char_nobg.png","/biologist/fire_char_nobg.png","/biologist/fire_char_nobg.png"],
      argsHeight: 5,
      argsWidth: 5
    },
    { tag: '01', text: ``, images: ["/biologist/fire_nobg.png"], argsHeight: 25,
    argsWidth: 25  },
    { tag: '02', text: ``, images: ["/biologist/fire_pattern.png"],  argsHeight: 57.8,
    argsWidth: 20   },
  ],
  depthbox: [
    {
      depth: 0,
      color: '#cccccc',
      textColor: '#ffffff',
      text: '',
      image: "/taichi.png",
    },
    {
      depth: -5,
      textColor: '#272727',
      text: '',
      image: "/database/金2.png",
    },
  ],
  lines: [
    { points: [[-20, 0, 0], [-9, 0, 0]], color: "black", lineWidth: 0.5 },
    { points: [[20, 0, 0], [9, 0, 0]], color: "black", lineWidth: 0.5 },
  ]
}

export default state