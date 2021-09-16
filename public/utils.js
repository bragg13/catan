const values = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12];
const canvasH = 800;
const canvasW = 800;
const hexSize = 50;

const resourceTypes = [
    "sheep", "sheep", "sheep", "sheep",
    "wood", "wood", "wood", "wood",
    "wheat", "wheat", "wheat", "wheat",
    "clay", "clay", "clay",
    "rock", "rock", "rock", "bandits"
];

const resourcecolorMap = {
  "sheep": "#fdf5e6",
  "wood": "darkgreen",
  "wheat": "#f0e68c",
  "clay": "#ff5722",
  "rock": "darkgrey",
  "bandits": "red"
};

const playerGUIcoords = {
  1: {
    "x": 25,
    "y": 25
  },

  2: {
    "x": canvasW-25,
    "y": 25
  },

  3: {
    "x": 25,
    "y": canvasH-25
  },

  4: {
    "x": canvasW-25,
    "y": canvasH-25
  },
}

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const getRandomGameID = () => {
  return Math.floor(Math.random()*6000);
}
