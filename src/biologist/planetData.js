import  "../model/gold.glb";
import "../model/wood.glb";
import "../model/aqua.glb";
import "../model/fire.glb";
import "../model/dirt.glb";
import "../model/shoe.glb";



const random = (a, b) => a + Math.random() * b;
const randomInt = (a, b) => Math.floor(random(a, b));
const randomColor = () =>
  `rgb(${randomInt(80, 50)}, ${randomInt(80, 50)}, ${randomInt(80, 50)})`;
const shuffle = (a) => {
  const temp = a.slice(0);
  for (let i = temp.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [temp[i], temp[j]] = [temp[j], temp[i]];
  }
  return temp;
};

const textures = [
  "/biologist/gold_tex.jpg",
  "/biologist/wood_tex.jpg",
  "/biologist/aqua_tex.jpg",
  "/biologist/fire_tex.jpg",
  "/biologist/dirt_tex.jpg",
];
const meshes = [
  "model/gold.glb",
  "model/wood.glb",
  "model/aqua.glb",
  "model/fire.glb",
  "model/dirt.glb",
];
const colors = [0xff, 0xff00, 0xffff, 0xff0000, 0xffff00];

const planetData = [];
const totalPlanets = 5;
for (let index = 0; index < totalPlanets; index++) {
  planetData.push({
    id: index,
    color: randomColor(),
    xRadius: (index + 1.5) * 4,
    zRadius: (index + 1.5) * 2,
    size: random(0.5, 1),
    speed: random(0.05, 0.06),
    offset: random(0, Math.PI * 2),
    rotationSpeed: random(0.008, 0.004),
    textureMap: textures[index],
    meshMap: meshes[index],
    name: (Math.random() + 1).toString(36).substring(7).toUpperCase(),
    gravity: random(2, 5).toFixed(2),
    orbitalPeriod: randomInt(50, 500),
    surfaceArea: random(100, 1000).toFixed(2),
    colorMap: colors[index],
  });
}

export default planetData;
