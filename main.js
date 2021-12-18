import * as THREE from "https://cdn.skypack.dev/three";
import { FBXLoader } from "https://cdn.skypack.dev/three/examples/jsm/loaders/FBXLoader.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";

let isStart = 0;
let isPause = 0;
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
const playAgainBtnWin = document.querySelector(".play-again-btn-win");
const closeBtnWin = document.querySelector(".close-btn-win");
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
    document.querySelector(".modal-lose").style.display = "none";
    title.style.backgroundColor = "#19caca";
    title.innerText = "";
    scene.remove(player.handler);
    delayRestart();
    isStart = 1;
    onStartPlayer();
    playerLastPosition.copy(player.handler.position);
    player.death = false;
    player.victory = false;
    lastState = "idle";
    light = "Green";
    gsap.to(doll.handler.rotation, { duration: 0.45, y: -3.15 });
});

closeBtn.addEventListener("click", () => {
    document.querySelector(".modal-credit-last").style.display = "flex";
});

playAgainBtnWin.addEventListener("click", () => {
    document.querySelector(".modal-victory").style.display = "none";
    title.style.backgroundColor = "#19caca";
    title.innerText = "";
    delayRestart();
    isStart = 1;
    player.handler.position.z = 42;
    player.handler.position.y = 0;
    player.handler.position.x = 0;
    playerLastPosition.copy(player.handler.position);
    player.death = false;
    player.victory = false;
    lastState = "idle";
    light = "Green";
    gsap.to(doll.handler.rotation, { duration: 0.45, y: -3.15 });
});

closeBtnWin.addEventListener("click", () => {
    document.querySelector(".modal-credit-last").style.display = "flex";
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

async function delayRestart() {
    await delay(5000);
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
  title.innerText = "Anda Kalah";
  title.style.backgroundColor = "red";
  document.querySelector(".modal-lose").style.display = "flex";
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
const totalAssets = 25;

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

    fbxLoader.load("assets/models/mountain-terrain/source/Mountain_Final_fbx_.fbx", (model) => {
        model.name = 'Mountain1';
        model.position.set(-1075, 0, 0);
        model.scale.multiplyScalar(0.1);
        model.castShadow = true;
        model.receiveShadow = true;
        scene.add(model);
        loadedAssets++;
    });

    fbxLoader.load("assets/models/mountain-terrain/source/Mountain_Final_fbx_.fbx", (model) => {
        model.name = 'Mountain2';
        model.position.set(1075, 0, 0);
        model.scale.multiplyScalar(0.1);
        model.castShadow = true;
        model.receiveShadow = true;
        scene.add(model);
        loadedAssets++;
    });

    fbxLoader.load("assets/models/mountain-terrain/source/Mountain_Final_fbx_.fbx", (model) => {
        model.name = 'Mountain3';
        model.position.set(0, 0, -1075);
        model.scale.multiplyScalar(0.1);
        model.castShadow = true;
        model.receiveShadow = true;
        scene.add(model);
        loadedAssets++;
    });

    fbxLoader.load("assets/models/mountain-terrain/source/Mountain_Final_fbx_.fbx", (model) => {
        model.name = 'Mountain4';
        model.position.set(0, 0, 1075);
        model.scale.multiplyScalar(0.1);
        model.castShadow = true;
        model.receiveShadow = true;
        scene.add(model);
        loadedAssets++;
    });
}

function onStartSoldier() {
    fbxLoader.load("assets/models/squid-game-guards/source/guards.fbx", (model) => {
        model.name = 'Soldier1';
        model.position.set(-20, -0.1, -40);
        model.scale.multiplyScalar(0.035);
        model.castShadow = true;
        model.receiveShadow = true;
        scene.add(model);
        loadedAssets++;
    });

    fbxLoader.load("assets/models/squid-game-guards/source/guards.fbx", (model) => {
        model.name = 'Soldier2';
        model.position.set(20, -0.1, -40);
        model.scale.multiplyScalar(0.035);
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

    textureLoader.load('./assets/images/wall.jpg', (albedo) => {
        loadedAssets++;
        albedo.wrapS = THREE.RepeatWrapping;
        albedo.wrapT = THREE.RepeatWrapping;
        albedo.repeat.multiplyScalar(10);
        textureLoader.load('./assets/images/wall-text.jpg', (normal) => {
            loadedAssets++;
            normal.wrapS = THREE.RepeatWrapping;
            normal.wrapT = THREE.RepeatWrapping;
            normal.repeat.multiplyScalar(10);
            const geometry = new THREE.PlaneGeometry( 1, 1 );
            const material = new THREE.MeshStandardMaterial( {
                map: albedo,
                normalMap: normal
            } );
            const plane = new THREE.Mesh( geometry, material );
            plane.scale.multiplyScalar(100);
            plane.rotation.x = THREE.Math.degToRad(0);
            plane.position.z = -50;
            plane.position.y = -35;
            scene.add( plane );
        });
    });

    textureLoader.load('./assets/images/wall.jpg', (albedo) => {
        loadedAssets++;
        albedo.wrapS = THREE.RepeatWrapping;
        albedo.wrapT = THREE.RepeatWrapping;
        albedo.repeat.multiplyScalar(10);
        textureLoader.load('./assets/images/wall-text.jpg', (normal) => {
            loadedAssets++;
            normal.wrapS = THREE.RepeatWrapping;
            normal.wrapT = THREE.RepeatWrapping;
            normal.repeat.multiplyScalar(10);
            const geometry = new THREE.PlaneGeometry( 1, 1 );
            const material = new THREE.MeshStandardMaterial( {
                map: albedo,
                normalMap: normal
            } );
            const plane = new THREE.Mesh( geometry, material );
            plane.scale.multiplyScalar(100);
            plane.rotation.x = THREE.Math.degToRad(0);
            plane.position.z = 50;
            plane.position.y = -35;
            scene.add( plane );
        });
    });

    textureLoader.load('./assets/images/wall.jpg', (albedo) => {
        loadedAssets++;
        albedo.wrapS = THREE.RepeatWrapping;
        albedo.wrapT = THREE.RepeatWrapping;
        albedo.repeat.multiplyScalar(10);
        textureLoader.load('./assets/images/wall-text.jpg', (normal) => {
            loadedAssets++;
            normal.wrapS = THREE.RepeatWrapping;
            normal.wrapT = THREE.RepeatWrapping;
            normal.repeat.multiplyScalar(10);
            const geometry = new THREE.PlaneGeometry( 1, 1 );
            const material = new THREE.MeshStandardMaterial( {
                map: albedo,
                normalMap: normal
            } );
            const plane = new THREE.Mesh( geometry, material );
            plane.scale.multiplyScalar(100);
            plane.rotation.y = THREE.Math.degToRad(90);
            plane.position.x = -50;
            plane.position.y = -35;
            scene.add( plane );
        });
    });

    textureLoader.load('./assets/images/wall.jpg', (albedo) => {
        loadedAssets++;
        albedo.wrapS = THREE.RepeatWrapping;
        albedo.wrapT = THREE.RepeatWrapping;
        albedo.repeat.multiplyScalar(10);
        textureLoader.load('./assets/images/wall-text.jpg', (normal) => {
            loadedAssets++;
            normal.wrapS = THREE.RepeatWrapping;
            normal.wrapT = THREE.RepeatWrapping;
            normal.repeat.multiplyScalar(10);
            const geometry = new THREE.PlaneGeometry( 1, 1 );
            const material = new THREE.MeshStandardMaterial( {
                map: albedo,
                normalMap: normal
            } );
            const plane = new THREE.Mesh( geometry, material );
            plane.scale.multiplyScalar(100);
            plane.rotation.y = THREE.Math.degToRad(90);
            plane.position.x = 50;
            plane.position.y = -35;
            scene.add( plane );
        });
    });

    const geometry = new THREE.BoxGeometry( 100, 0.1, 0.1 );
    const material1 = new THREE.MeshBasicMaterial( {color: "green"} );
    const material2 = new THREE.MeshBasicMaterial( {color: "red"} );
    const cube1 = new THREE.Mesh( geometry, material1 );
    const cube2 = new THREE.Mesh( geometry, material2 );
    cube1.position.set(0, 0, -25);
    cube2.position.set(0, 0, 40);
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
    model.position.set(0, 0, 42);

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

    camera.position.set(0, 6, 49.5);
    camera.lookAt(0, 5, 42);
}

let lastState = "idle";
function onUpdatePlayer(dt) {
    let state = "idle";
    const playerSpeed = 5;

    player.mixer.update(dt);

    if (!player.death) {
        if (keys["w"] && player.handler.position.z < 50 && player.handler.position.z > -50) {
            player.handler.position.z -= playerSpeed * dt;
            player.handler.rotation.y = THREE.Math.degToRad(180);
            state = "walking";
            if (player.handler.position.z <= -50) {
                player.handler.position.z = -49.9;
            }
        }
        if (keys["s"] && player.handler.position.z < 50 && player.handler.position.z > -50) {
            player.handler.position.z += playerSpeed * dt;
            player.handler.rotation.y = THREE.Math.degToRad(0);
            state = "walking";
            if (player.handler.position.z >= 50) {
                player.handler.position.z = 49.9;
            }
        }
        if (keys["a"] && player.handler.position.x < 50 && player.handler.position.x > -50) {
            player.handler.position.x -= playerSpeed * dt;
            player.handler.rotation.y = THREE.Math.degToRad(270);
            state = "walking";
            if (player.handler.position.x <= -50) {
                player.handler.position.x = -49.9;
            }
        }
        if (keys["d"] && player.handler.position.x < 50 && player.handler.position.x > -50) {
            player.handler.position.x += playerSpeed * dt;
            player.handler.rotation.y = THREE.Math.degToRad(90);
            state = "walking";
            if (player.handler.position.x >= 50) {
                player.handler.position.x = 49.9;
            }
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

    if (player.handler.position.z <= -25 && !player.victory) {
        player.victory = true;
        player.handler.position.z = 42;
        player.handler.position.y = 0;
        player.handler.position.x = 0;
        isStart = 0;
        victorySound.play();
        delayRestart();
        isStart = 1;
    }
}

let light = "Green";
let greenTimer = 5 / speedUp;
let redTimer = 7;
let toleranceTimer = 0.3;
let playerLastPosition = new THREE.Vector3();
function onUpdateDoll(dt) {
  if (light === "Green") {
    if (greenTimer <= 0) {
      if (toleranceTimer <= 0) {
        // Turn Red
        redTimer = 7;
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
      toleranceTimer = 0.3;
      speedUp = THREE.Math.randFloat(1, 2);
      soundBack.playbackRate = speedUp;
      greenTimer = 5 / speedUp;
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
  if (player.victory) {
    title.innerText = "Anda Berhasil";
    title.style.backgroundColor = "green";
    document.querySelector(".modal-victory").style.display = "flex";
  }
  console.log(light);
}

async function killPlayer() {
  console.log("Player is death");
  gunSound.play();
  player.death = true;
  player.mixer.stopAllAction();
  player.actions.death.play();
  await delay(7000);
  isStart = 0;
  loadedAssets -= 4;
  gameLose();
}

function onUpdate(dt) {
    if (isStart == 1) {
        onUpdateDoll(dt);
        onUpdatePlayer(dt);
        // camera.position.set(player.handler.position.x, 6, player.handler.position.z + 7.5);
        camera.lookAt(player.handler.position.x, player.handler.position.y + 5, player.handler.position.z);
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
