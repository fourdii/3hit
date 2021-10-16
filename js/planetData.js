

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

const textures = ["../textures/gold.jpg", "../textures/wood.jpg", "..textures/aqua.jpg", "../textures/fire.jpg", "..textures/dirt.jpg"];
const meshes = ["../assets/gold.glb", "../assets/wood.glb", "../assets/aqua.glb", "../assets/fire.glb", "../assets/dirt.glb"];
const colors = [0xFF, 0xFF00, 0xFFFF, 0xFF0000, 0xFFFF00];

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
