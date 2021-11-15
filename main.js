import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/GLTFLoader.js";

/** @type {THREE.PerspectiveCamera} */
let camera;
/** @type {THREE.Scene} */
let scene;
/** @type {THREE.WebGLRenderer} */
let renderer;

let doll;

const startBtn = document.querySelector('.start-btn');

let init = function() {
    scene = new THREE.Scene();
    // const color = 0xffffff;
    // const near = 5;
    // const far = 30;
    // scene.fog = new THREE.Fog(color, near, far);

    // Musics
    const bgMusic = new Audio('assets/musics/bg.mp3');
    bgMusic.loop = true;

    async function playMusic() {
        bgMusic.play();
    }

    // Lights
    const ambientLight = new THREE.AmbientLight("white", 0.5);
    scene.add(ambientLight);


    const directionalLight = new THREE.DirectionalLight("white", 1);
    directionalLight.position.set(20, 40, 80);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 0, 30);

    // Background
    // const loader = new THREE.TextureLoader();
    // const texture = loader.load("assets/images/bg-6.jpg", () => {
    //     const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
    //     rt.fromEquirectangularTexture(renderer, texture);
    //     scene.background = rt.texture;
    // });

    scene.background = new THREE.Color('#66FF66');

    // Box
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
    scene.add(sand);

    const wallMaterial = new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        map: new THREE.TextureLoader().load("assets/images/wall.jpg"),
    });

    const wall1 = new THREE.Mesh(
        new THREE.PlaneGeometry(750, 150, 100, 100),
        wallMaterial
    );
    wall1.receiveShadow = true;
    wall1.rotation.y = -Math.PI / 2;
    wall1.position.x = 210;
    wall1.position.y = 60;
    wall1.position.z = 240;
    scene.add(wall1);

    const wall2 = new THREE.Mesh(
        new THREE.PlaneGeometry(450, 150, 100, 100),
        wallMaterial
    );
    wall2.receiveShadow = true;
    wall2.rotation.y = -Math.PI;
    wall2.position.x = 0;
    wall2.position.y = 60;
    wall2.position.z = -120;
    scene.add(wall2);

    const wall3 = new THREE.Mesh(
        new THREE.PlaneGeometry(750, 150, 100, 100),
        wallMaterial
    );
    wall3.receiveShadow = true;
    wall3.rotation.y = -Math.PI / 2;
    wall3.position.x = -210;
    wall3.position.y = 60;
    wall3.position.z = 240;
    scene.add(wall3);

    const wall4 = new THREE.Mesh(
        new THREE.PlaneGeometry(450, 150, 100, 100),
        wallMaterial
    );
    wall4.receiveShadow = true;
    wall4.rotation.y = -Math.PI;
    wall4.position.x = 0;
    wall4.position.y = 60;
    wall4.position.z = 600;
    scene.add(wall4);

    // Models
    const pinksoldier = new GLTFLoader();
    pinksoldier.load("assets/models/squid_game_pinksoldier/scene.gltf", (gltf) => {
        gltf.scene.traverse(function (node) {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
                node.position.set(0, 0, -12);
                node.scale.set(0.13, 0.13, 0.13);
                // node.rotation.z = Math.PI;
            }
        });
        scene.add(gltf.scene);
    });

    const pinksoldier_triangle1 = new GLTFLoader();
    pinksoldier_triangle1.load("assets/models/squid_game_pinksoldier_triangle/scene.gltf", (gltf) => {
        gltf.scene.traverse(function (node) {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
                node.position.set(12, 0, -12);
                node.scale.set(0.13, 0.13, 0.13);
                // node.rotation.z = Math.PI;
            }
        });
        scene.add(gltf.scene);
    });

    const pinksoldier_triangle2 = new GLTFLoader();
    pinksoldier_triangle2.load("assets/models/squid_game_pinksoldier_triangle/scene.gltf", (gltf) => {
        gltf.scene.traverse(function (node) {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
                node.position.set(-12, 0, -12);
                node.scale.set(0.13, 0.13, 0.13);
                // node.rotation.z = Math.PI;
            }
        });
        scene.add(gltf.scene);
    });

    const giant_doll = new GLTFLoader();
    giant_doll.load("assets/models/squid_game_giant_doll/scene.gltf", (gltf) => {
        gltf.scene.traverse(function (node) {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
                node.position.set(0, 12, -2.5);
                node.scale.set(2, 2, 2);
                // node.rotation.z = Math.PI;
            }
        });
        scene.add(gltf.scene);
        doll = gltf.scene;
    });

    const tree = new GLTFLoader();
    tree.load("assets/models/tree/scene.gltf", (gltf) => {
        gltf.scene.traverse(function (node) {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
                node.position.set(-6, -40, -60);
                node.scale.set(50, 50, 50);
                // node.rotation.z = Math.PI;
            }
        });
        scene.add(gltf.scene);
        startBtn.innerText = "start";
    });

    // Render
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.render(scene, camera);
    document.body.appendChild(renderer.domElement);

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    startBtn.addEventListener('click', () => {
        if(startBtn.innerText == "START"){
            playMusic();
            document.querySelector('.modal').style.display = "none";
        }
    });
};

let mainLoop = function() {
    renderer.render(scene, camera);
    requestAnimationFrame(mainLoop);
};

init();
mainLoop();