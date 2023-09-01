import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
// サイズを指定
const width = parent.innerWidth;
const height = parent.innerHeight * 0.8;
const canvas = document.getElementById('myCanvas');

// レンダラーを作成
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(width, height);
//シャドウを有効にする
renderer.shadowMap.enabled = true;

// シーンを作成
const scene = new THREE.Scene();

// カメラを作成
const camera = new THREE.PerspectiveCamera(45, width / height);
camera.position.set(0, 0, 50);
// カメラコントローラーを作成
const controls = new OrbitControls(camera, canvas);
// 滑らかにカメラコントローラーを制御する
controls.enableDamping = true;
controls.dampingFactor = 0.2;

// 床を作成
const meshFloor = new THREE.Mesh(
  new THREE.BoxGeometry(2000, 0.1, 2000),
  new THREE.MeshStandardMaterial(),
);
meshFloor.position.y = -10;
// 影を受け付ける
meshFloor.receiveShadow = true;
scene.add(meshFloor);

// 箱を作成
//const size = (width > height ? height: width) * 0.3;
const size = 4;
//const geometry = new THREE.BoxGeometry(size, size, size);
const geometry = new THREE.CylinderGeometry(size, size, size, 10);
//const geometry = new THREE.TorusGeometry(size, size*0.4, 64, 50);

//const material = new THREE.MeshNormalMaterial();
//const material = new THREE.MeshBasicMaterial( {color: 0x6699FF} );
//const material = new THREE.MeshToonMaterial({color: 0x6699FF});
const material = new THREE.MeshStandardMaterial({ color: 0x6699FF });
const box = new THREE.Mesh(geometry, material);
box.position.y = 10;
// 影を落とす
box.castShadow = true;
scene.add(box);

//キャタピラ
const caterpillar = createCaterpillar(10);
scene.add(caterpillar);
function createCaterpillar(size) {
    const geometries = [];
    const box = new THREE.BoxGeometry(size, size/2, size);
    geometries.push(box);

    const cylinder1 = new THREE.CylinderGeometry(size/4, size/4, size, 20);
    const cylinder2 = new THREE.CylinderGeometry(size/4, size/4, size, 20);
    cylinder1.translate(size/2, 0, 0);
    cylinder2.translate(-size/2, 0, 0);
    cylinder1.rotateX(Math.PI/2);
    cylinder2.rotateX(Math.PI/2);
    geometries.push(cylinder1);
    geometries.push(cylinder2);


    // ジオメトリ・マテリアル生成
    const geometry = BufferGeometryUtils.mergeGeometries(geometries);
    const material = new THREE.MeshStandardMaterial({ color: 0x6699FF });
    // メッシュを作成
    return new THREE.Mesh(geometry, material);
}

// 環境光源を作成
const light = new THREE.AmbientLight(0xFFFFFF, 0.2);
scene.add(light);
// 平行光源
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(50, 50, 0);
directionalLight.castShadow = true;
directionalLight.shadow.radius = true;

const lightsize = 128;
directionalLight.shadow.camera.right = lightsize;
directionalLight.shadow.camera.left = -lightsize;
directionalLight.shadow.camera.top = -lightsize;
directionalLight.shadow.camera.bottom = lightsize;

directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 200;
scene.add(directionalLight);

const helper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(helper);

tick();

// 毎フレーム時に実行されるループイベント
function tick() {
  //box.rotation.y += 0.01;
  //box.rotation.x += 0.01;
  renderer.render(scene, camera); // レンダリング

  requestAnimationFrame(tick);
}

document.getElementById('wireframe_btn').onclick = () => {
  material.wireframe = !(material.wireframe);
};
document.getElementById('shadow_radius').onclick = () => {
  directionalLight.shadow.radius = !(directionalLight.shadow.radius);
};
