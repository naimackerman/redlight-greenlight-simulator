import * as THREE from "https://cdn.skypack.dev/three";
import { FBXLoader } from "https://cdn.skypack.dev/three/examples/jsm/loaders/FBXLoader.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";

let isStart = 0;
const fbxLoader = new FBXLoader();
const clock = new THREE.Clock();

// Scene
const scene = new THREE.Scene();
const color = 0xffffff;
const near = 5;
const far = 30;
// scene.fog = new THREE.Fog(color, near, far);

// Camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);

// Render
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(new THREE.Color(1, 1, 1));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.render(scene, camera);
document.body.appendChild(renderer.domElement);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

const listener = new THREE.AudioListener();
camera.add( listener );

// Musics
const bgMusic = new Audio("assets/musics/bg.mp3");
bgMusic.volume = 0.2;
bgMusic.loop = true;

let speedUp = 1;
const soundBack = new Audio("assets/musics/robot-back.mp3");
const soundFront = new Audio("assets/musics/robot-front.mp3");
const countDown1 = new Audio("assets/musics/countdown-1.wav");
const countDown2 = new Audio("assets/musics/countdown-2.wav");
soundBack.playbackRate = speedUp;

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
    countDown1.play();
    title.innerText = "3";
    await delay(1000);
    countDown1.play();
    title.innerText = "2";
    await delay(1000);
    countDown1.play();
    title.innerText = "1";
    await delay(1000);
    countDown2.play();
    title.innerText = "Ayooo!!!";
    await delay(1000);
    title.innerText = "";
    lookBackward();
    isStart = 1;
    bgMusic.play();

}
let dallFacingBack = true;

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
  ctLoader.setPath("assets/images/sky/");

  ctLoader.load(
    ["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"],
    (cubeTexture) => {
      scene.background = cubeTexture;
      loadedAssets++;
    }
  );
}

function onStartSoldier() {
    fbxLoader.load("assets/models/squid-game-guards/source/guards.fbx", (model) => {
        model.name = 'Soldier1';
        model.position.set(-20, -0.1, -40);
        model.scale.multiplyScalar(0.08);
        model.castShadow = true;
        model.receiveShadow = true;
        scene.add(model);
        loadedAssets++;
    });

    fbxLoader.load("assets/models/squid-game-guards/source/guards.fbx", (model) => {
        model.name = 'Soldier2';
        model.position.set(20, -0.1, -40);
        model.scale.multiplyScalar(0.08);
        model.castShadow = true;
        model.receiveShadow = true;
        scene.add(model);
        loadedAssets++;
    });
}

function onStartFloor() {
    const textureLoader = new THREE.TextureLoader();

    const textureRepeat = 100;
    textureLoader.load('./assets/images/sand/albedo.jpg', (albedo) => {
        loadedAssets++;
        albedo.wrapS = THREE.RepeatWrapping;
        albedo.wrapT = THREE.RepeatWrapping;
        albedo.repeat.multiplyScalar(textureRepeat);
        textureLoader.load('./assets/images/sand/normal.jpg', (normal) => {
            loadedAssets++;
            normal.wrapS = THREE.RepeatWrapping;
            normal.wrapT = THREE.RepeatWrapping;
            normal.repeat.multiplyScalar(textureRepeat);
            const geometry = new THREE.PlaneGeometry( 1, 1 );
            const material = new THREE.MeshStandardMaterial( {
                map: albedo,
                normalMap: normal
            } );
            const plane = new THREE.Mesh( geometry, material );
            plane.scale.multiplyScalar(100);
            plane.rotation.x = THREE.Math.degToRad(-90);
            scene.add( plane );
        });
    });

    const geometry = new THREE.BoxGeometry( 100, 0.1, 0.1 );
    const material1 = new THREE.MeshBasicMaterial( {color: "green"} );
    const material2 = new THREE.MeshBasicMaterial( {color: "red"} );
    const cube1 = new THREE.Mesh( geometry, material1 );
    const cube2 = new THREE.Mesh( geometry, material2 );
    cube1.position.set(0, 0, -25);
    cube2.position.set(0, 0, 45);
    scene.add( cube1 );
    scene.add( cube2 );
}

function onStartDoll() {
    fbxLoader.load("assets/models/squid-game-giant-doll/source/squidGame_Doll.fbx", (model) => {
        model.name = 'Doll';
        model.position.set(0, 4.5, -30);
        model.rotation.y = THREE.Math.degToRad(180);
        model.scale.multiplyScalar(0.01);
        model.castShadow = true;
        model.receiveShadow = true;
        doll.handler = model;
        scene.add(model);
        loadedAssets++;
    });
}

function onStartTree() {
    fbxLoader.load("assets/models/treea/source/heroTree.fbx", (model) => {
        model.name = 'Tree';
        model.position.set(0, 0, -40);
        model.scale.multiplyScalar(0.1);
        model.castShadow = true;
        model.receiveShadow = true;
        scene.add(model);
        loadedAssets++;
    });
}

function onStartPlayer() {
  fbxLoader.load("assets/models/player/character.fbx", (model) => {
    model.name = "Player";
    model.scale.multiplyScalar(0.03);
    model.position.set(0, 0, 47);

    player.handler = model;
    player.mixer = new THREE.AnimationMixer(model);

    fbxLoader.load("assets/models/player/animations/walking.fbx", (asset) => {
      const walkingAnimation = asset.animations[0];
      player.actions.walking = player.mixer.clipAction(walkingAnimation);
      loadedAssets++;
    });

    fbxLoader.load("assets/models/player/animations/idle.fbx", (asset) => {
      const idleAnimation = asset.animations[0];
      player.actions.idle = player.mixer.clipAction(idleAnimation);
      player.actions.idle.play();
      loadedAssets++;
    });

    fbxLoader.load("assets/models/player/animations/death.fbx", (asset) => {
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
    // Lights
    const ambientLight = new THREE.AmbientLight("white", 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight("white", 1);
    directionalLight.position.set(20, 40, 80);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Audio
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load('./assets/sfx/gun.wav', (buffer) => {
        gunSound.setBuffer(buffer);
        loadedAssets++;
    });

    audioLoader.load('./assets/sfx/victory.wav', (buffer) => {
        victorySound.setBuffer(buffer);
        loadedAssets++;
    });

    onStartSkybox();
    onStartFloor();
    onStartSoldier();
    onStartDoll();
    onStartPlayer();
    onStartTree();

    camera.position.set(0, 20, 100);
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
    camera.lookAt(player.handler.position);
  }
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
