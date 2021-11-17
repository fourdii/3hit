const state = {
  top: 0,
  pages: 0,
  threshold: 4,
  mouse: [0, 0],
  content: [
    {
      tag: '00',
      text: `The Bacchic\nand Dionysiac\nRites`,
      images: ["/5f723cfcf9065062c01e.jpg", "/5f723cfcf9065062c01e.jpg", "/5f723cfcf9065062c01e.jpg"],
    },
    { tag: '01', text: `The Elysian\nMysteries`, images: ["/5f723cfcf9065062c01e.jpg", "/5f723cfcf9065062c01e.jpg", "/5f723cfcf9065062c01e.jpg"] },
    { tag: '02', text: `The Hiramic\nLegend`, images: ["/5f723cfcf9065062c01e.jpg", "/5f723cfcf9065062c01e.jpg", "/5f723cfcf9065062c01e.jpg"] },
  ],
  depthbox: [
    {
      depth: 0,
      color: '#cccccc',
      textColor: '#ffffff',
      text: 'In a void,\nno one could say\nwhy a thing\nonce set in motion\nshould stop anywhere.',
      image: "/5f723cfcf9065062c01e.jpg",
    },
    {
      depth: -5,
      textColor: '#272727',
      text: 'For why should it stop\nhere rather than here?\nSo that a thing\nwill either be at rest\nor must be moved\nad infinitum.',
      image: "/5f723cfcf9065062c01e.jpg",
    },
  ],
  lines: [
    { points: [[-20, 0, 0], [-9, 0, 0]], color: "black", lineWidth: 0.5 },
    { points: [[20, 0, 0], [9, 0, 0]], color: "black", lineWidth: 0.5 },
  ]
}

export default state
