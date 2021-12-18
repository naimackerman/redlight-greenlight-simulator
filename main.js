import * as THREE from "https://cdn.skypack.dev/three";
import { FBXLoader } from "https://cdn.skypack.dev/three/examples/jsm/loaders/FBXLoader.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";
let isStart = 0;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
const ambientLight = new THREE.AmbientLight("white", 0.1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight("white", 0.1);
directionalLight.position.set(20, 40, 600);
directionalLight.castShadow = true;
scene.add(directionalLight);

const clock = new THREE.Clock();
const loader = new FBXLoader();

const listener = new THREE.AudioListener();
camera.add(listener);

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color(1, 1, 1));
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

//###############ADDITIONAL STYLE#####################
//Button Appearance
const title = document.querySelector(".title");
const startBtn = document.querySelector(".start-btn");
const creditBtn = document.querySelector(".credit-btn");
const backBtn = document.querySelector(".back-btn");
const playAgainBtn = document.querySelector(".play-again-btn");
const closeBtn = document.querySelector(".close-btn");
async function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

startBtn.addEventListener("click", () => {
  if (startBtn.innerText == "MULAI") {
    countTime();
    isStart = 1;
    document.querySelector(".modal").style.display = "none";
  }
});

creditBtn.addEventListener("click", () => {
  document.querySelector(".modal").style.display = "none";
  document.querySelector(".modal-credit").style.display = "flex";
});

backBtn.addEventListener("click", () => {
  document.querySelector(".modal").style.display = "flex";
  document.querySelector(".modal-credit").style.display = "none";
});

playAgainBtn.addEventListener("click", () => {
  window.location.reload();
});
closeBtn.addEventListener("click", () => {
  window.close();
});
const player = {
  mixer: null,
  handler: null,
  actions: {
    idle: null,
    walking: null,
    death: null,
  },
  victory: false,
  death: false,
};
async function countTime() {
  await delay(1000);
  title.innerText = "Dimulai dalam 3 hitungan mundur";
  await delay(3000);
  title.innerText = "3";
  await delay(1000);
  title.innerText = "2";
  await delay(1000);
  title.innerText = "1";
  await delay(1000);
  title.innerText = "Ayooo!!!";
  await delay(1000);

  title.innerText = "";

  bgMusic.play();
  start();
}
// Musics
const bgMusic = new Audio("assets/musics/bg.mp3");
bgMusic.volume = 0.2;
bgMusic.loop = true;

let speedUp = 1;
const soundBack = new Audio("assets/musics/robot-back.mp3");
const soundFront = new Audio("assets/musics/robot-front.mp3");
soundBack.playbackRate = speedUp;
//Doll Action
function lookBackward() {
  soundBack.play();
  title.innerText = "Green Light";
  title.style.backgroundColor = "green";
  setTimeout(() => (dallFacingBack = true), 5000 / speedUp);
}
function lookForward() {
  soundFront.play();
  title.innerText = "Red Light";
  title.style.backgroundColor = "red";
  setTimeout(() => (dallFacingBack = false), 7000);
}
function gameLose() {
  soundFront.play();
  title.innerText = "Anda Kalah";
  title.style.backgroundColor = "red";
  document.querySelector(".modal-lose").style.display = "flex";

  setTimeout(() => (dallFacingBack = false), 7000);
}
// #####################################

const gunSound = new THREE.Audio(listener);
const victorySound = new THREE.Audio(listener);

const doll = {
  handler: null,
};
const soldier = {
  handler: null,
};

const keys = {};

let loadedAssets = 0;
const totalAssets = 13;

function onStartSkybox() {
  const ctLoader = new THREE.CubeTextureLoader();
  ctLoader.setPath("textures/sky/");

  ctLoader.load(
    ["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"],
    (cubeTexture) => {
      scene.background = cubeTexture;
      loadedAssets++;
    }
  );
}

function onStartMap() {
  loader.load("assets/models/soldier/source/resources/squid3.fbx", (model) => {
    model.name = "Soldier";
    model.position.set(0, -3, 25);
    model.rotation.y = THREE.Math.degToRad(180);
    model.rotation.x = THREE.Math.degToRad(90);
    model.rotation.z = THREE.Math.degToRad(90);
    model.scale.multiplyScalar(0.1);
    soldier.handler = model;
    scene.add(model);
    loadedAssets++;
  });
}

function onStartFloor() {
  const sandMaterial = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    map: new THREE.TextureLoader().load("assets/images/sand-2.jpg"),
  });
  const sand = new THREE.Mesh(
    new THREE.PlaneGeometry(800, 800, 100, 100),
    sandMaterial
  );
  sand.receiveShadow = true;
  sand.rotation.x = -Math.PI / 2;
  sand.position.y = -12;
  sand.position.z = 240;
  loadedAssets++;
  scene.add(sand);

  const wallMaterial = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    map: new THREE.TextureLoader().load("assets/images/wall.jpg"),
  });

  const wall1 = new THREE.Mesh(
    new THREE.PlaneGeometry(750, 250, 100, 100),
    wallMaterial
  );
  wall1.receiveShadow = true;
  wall1.rotation.y = -Math.PI / 2;
  wall1.position.x = 210;
  wall1.position.y = 60;
  wall1.position.z = 240;
  scene.add(wall1);
  loadedAssets++;

  const wall2 = new THREE.Mesh(
    new THREE.PlaneGeometry(450, 250, 100, 100),
    wallMaterial
  );
  wall2.receiveShadow = true;
  wall2.rotation.y = -Math.PI;
  wall2.position.x = 0;
  wall2.position.y = 60;
  wall2.position.z = -120;
  scene.add(wall2);
  loadedAssets++;

  const wall3 = new THREE.Mesh(
    new THREE.PlaneGeometry(750, 250, 100, 100),
    wallMaterial
  );
  wall3.receiveShadow = true;
  wall3.rotation.y = -Math.PI / 2;
  wall3.position.x = -210;
  wall3.position.y = 60;
  wall3.position.z = 240;
  scene.add(wall3);
  loadedAssets++;

  const wall4 = new THREE.Mesh(
    new THREE.PlaneGeometry(450, 250, 100, 100),
    wallMaterial
  );
  wall4.receiveShadow = true;
  wall4.rotation.y = -Math.PI;
  wall4.position.x = 0;
  wall4.position.y = 60;
  wall4.position.z = 600;
  scene.add(wall4);
}

function onStartDoll() {
  loader.load("models/doll/doll.fbx", (model) => {
    model.name = "Doll";
    model.position.set(0, -15, -2.5);
    model.rotation.y = THREE.Math.degToRad(180);
    model.scale.multiplyScalar(10);

    doll.handler = model;
    scene.add(model);
    loadedAssets++;
  });
}

function onStartPlayer() {
  loader.load("models/player/character.fbx", (model) => {
    model.name = "Player";
    model.scale.multiplyScalar(0.1);

    player.handler = model;
    player.mixer = new THREE.AnimationMixer(model);
    player.handler.position.y = -10;
    player.handler.position.z = 500;

    loader.load("models/player/animations/walking.fbx", (asset) => {
      const walkingAnimation = asset.animations[0];
      player.actions.walking = player.mixer.clipAction(walkingAnimation);
      loadedAssets++;
    });

    loader.load("models/player/animations/idle.fbx", (asset) => {
      const idleAnimation = asset.animations[0];
      player.actions.idle = player.mixer.clipAction(idleAnimation);
      player.actions.idle.play();
      loadedAssets++;
    });

    loader.load("models/player/animations/death.fbx", (asset) => {
      const deathAnimation = asset.animations[0];
      player.actions.death = player.mixer.clipAction(deathAnimation);
      player.actions.death.clampWhenFinished = true;
      player.actions.death.loop = THREE.LoopOnce;
      loadedAssets++;
    });

    scene.add(player.handler);
    loadedAssets++;
  });
}

function onStart() {
  const light = new THREE.AmbientLight(0xffffff, 0.75); // soft white light
  scene.add(light);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  scene.add(directionalLight);

  const audioLoader = new THREE.AudioLoader();
  audioLoader.load("sfx/gun.wav", (buffer) => {
    gunSound.setBuffer(buffer);
    loadedAssets++;
  });

  audioLoader.load("sfx/victory.wav", (buffer) => {
    victorySound.setBuffer(buffer);
    loadedAssets++;
  });

  onStartSkybox();
  onStartFloor();
  onStartMap();
  onStartDoll();
  onStartPlayer();

  camera.position.set(0, 25, 550);
}

let lastState = "idle";
function onUpdatePlayer(dt) {
  let state = "idle";
  const playerSpeed = 25;

  player.mixer.update(dt);

  if (!player.death) {
    if (keys["w"]) {
      player.handler.position.z -= playerSpeed * dt;
      player.handler.rotation.y = THREE.Math.degToRad(180);
      state = "walking";
    }
    if (keys["s"]) {
      player.handler.position.z += playerSpeed * dt;
      player.handler.rotation.y = THREE.Math.degToRad(0);
      state = "walking";
    }

    const crossFadeTime = 0.2;
    if (lastState != state) {
      const lastAnimation = player.actions[lastState];
      const newAnimation = player.actions[state];

      lastAnimation.reset();
      newAnimation.reset();

      lastAnimation.crossFadeTo(newAnimation, crossFadeTime).play();

      lastState = state;
    }
  }

  if (player.handler.position.z <= doll.handler.position.z && !player.victory) {
    player.victory = true;
    victorySound.play();
  }
}

let light = "Green";
let greenTimer = THREE.Math.randFloat(3, 5);
let redTimer = 3;
let toleranceTimer = 0.4;
let playerLastPosition = new THREE.Vector3();
function onUpdateDoll(dt) {
  if (light === "Green") {
    if (greenTimer <= 0) {
      if (toleranceTimer <= 0) {
        // Turn Red
        redTimer = 3;
        light = "Red";

        playerLastPosition.copy(player.handler.position);
      } else {
        toleranceTimer -= dt;
      }

      gsap.to(doll.handler.rotation, { duration: 0.45, y: 0 });
      if (isStart == 1) {
        lookForward();
      }
    } else {
      greenTimer -= dt;
    }
  } else {
    if (redTimer <= 0) {
      // Turn green
      toleranceTimer = 0.4;
      greenTimer = THREE.Math.randFloat(3, 5);
      light = "Green";
      gsap.to(doll.handler.rotation, { duration: 0.45, y: -3.15 });
      if (isStart == 1) {
        lookBackward();
      }
      // doll.handler.rotation.y = THREE.Math.degToRad(180);
    } else {
      // Check if the player moves
      if (
        !playerLastPosition.equals(player.handler.position) &&
        !player.death &&
        !player.victory
      ) {
        // The player dies
        killPlayer();
      }

      redTimer -= dt;
    }
  }
  console.log(light);
}

async function killPlayer() {
  console.log("Player is death");
  gunSound.play();
  player.death = true;
  player.mixer.stopAllAction();
  player.actions.death.play();
  await delay(2000);
  isStart = 0;
  gameLose();
}

function onUpdate(dt) {
  if (isStart == 1) {
    onUpdateDoll(dt);
    onUpdatePlayer(dt);
  }
  // camera.position.set(0, 15, player.handler.position.z + 15);
}

function render() {
  requestAnimationFrame(render);

  const dt = clock.getDelta();
  if (loadedAssets >= totalAssets) {
    onUpdate(dt);
    startBtn.innerText = "MULAI";

    renderer.render(scene, camera);
  }
}

document.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});

onStart();
render();
