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
camera.position.set(0, 50, 50);
// カメラコントローラーを作成
const controls = new OrbitControls(camera, canvas);
// 滑らかにカメラコントローラーを制御する
controls.enableDamping = true;
controls.dampingFactor = 0.2;

// 床を作成
const field_width = 256;
const meshFloor = new THREE.Mesh(
  new THREE.BoxGeometry(field_width, 8, field_width),
  new THREE.MeshStandardMaterial(),
);
meshFloor.position.y = -4;
// 影を受け付ける
meshFloor.receiveShadow = true;
scene.add(meshFloor);

//const material = new THREE.MeshNormalMaterial();
//const material = new THREE.MeshBasicMaterial( {color: 0x6699FF} );
//const material = new THREE.MeshToonMaterial({color: 0x6699FF});
const material = new THREE.MeshStandardMaterial({ color: 0x6699FF });

// 環境光源を作成
const light = new THREE.AmbientLight(0xFFFFFF, 0.2);
scene.add(light);
// 平行光源
function createDirectionalLight(theta, field_width, field_height) {
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);
    const r = 0.5 * field_width * sin;
    const z = r * sin + field_height * Math.tan(theta);
    const y = r * cos + field_height;
    const h = field_height/cos + field_width *sin;
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, y, z);
    directionalLight.castShadow = true;
    directionalLight.shadow.radius = true;
    
    directionalLight.shadow.camera.right = field_width / 2;
    directionalLight.shadow.camera.left = -field_width / 2;
    directionalLight.shadow.camera.top = -field_width * cos / 2;
    directionalLight.shadow.camera.bottom = field_width * cos / 2 + field_height * sin;
    
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0;
    directionalLight.shadow.camera.far = h;

    return directionalLight;
}
const directionalLight = createDirectionalLight(Math.PI/5, field_width, 30)
scene.add(directionalLight);

const helper = new THREE.CameraHelper(directionalLight.shadow.camera);
scene.add(helper);

//キャタピラ
const caterpillar = createCaterpillar(10);
caterpillar.castShadow = true;
scene.add(caterpillar);

//砲塔
const cannon = createCanon(10);
cannon.castShadow = true;
scene.add(cannon);

function createCaterpillar(size) {
  const geometries = [];
  const box = new THREE.BoxGeometry(size, size / 2, size);
  box.translate(0, size / 4, 0);
  geometries.push(box);

  const cylinder1 = new THREE.CylinderGeometry(size / 4, size / 4, size, 20);
  const cylinder2 = new THREE.CylinderGeometry(size / 4, size / 4, size, 20);
  cylinder1.rotateX(Math.PI / 2);
  cylinder2.rotateX(Math.PI / 2);
  cylinder1.translate(size / 2, size / 4, 0);
  cylinder2.translate(-size / 2, size / 4, 0);
  geometries.push(cylinder1);
  geometries.push(cylinder2);

  // ジオメトリ・マテリアル生成
  const geometry = BufferGeometryUtils.mergeGeometries(geometries);
  //const material = new THREE.MeshStandardMaterial({ color: 0x6699FF });
  // メッシュを作成
  return new THREE.Mesh(geometry, material);
}

function createCanon(size) {
  const geometries = [];
  const cannon_height = size / 3;

  const cylinder1 = new THREE.CylinderGeometry(
    size / 3,
    size / 3,
    cannon_height,
    20,
  );
  cylinder1.translate(0, size / 2 + cannon_height / 2, 0);
  geometries.push(cylinder1);

  const cylinder2 = new THREE.CylinderGeometry(size / 20, size / 20, size, 10);
  cylinder2.rotateZ(Math.PI / 2);
  cylinder2.translate(size / 2, size / 2 + cannon_height / 2, 0);
  geometries.push(cylinder2);

  // ジオメトリ・マテリアル生成
  const geometry = BufferGeometryUtils.mergeGeometries(geometries);
  //const material = new THREE.MeshStandardMaterial({ color: 0x6699FF });
  // メッシュを作成
  return new THREE.Mesh(geometry, material);
}

tick();

// 毎フレーム時に実行されるループイベント
function tick() {
  //box.rotation.y += 0.01;
  //box.rotation.x += 0.01;
  caterpillar.position.x += 0.1;
  cannon.position.x += 0.1;
  caterpillar.position.x %= 128;
  cannon.position.x %= 128;
  renderer.render(scene, camera); // レンダリング

  requestAnimationFrame(tick);
}

document.getElementById('wireframe_btn').onclick = () => {
  material.wireframe = !(material.wireframe);
};
document.getElementById('shadow_radius').onclick = () => {
  directionalLight.shadow.radius = !(directionalLight.shadow.radius);
};
