import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';


let width;
let height;
let canvas;
let renderer;
let scene;
let camera;
let controls;
const field_width = 256;
let meshFloor;

const listeners = [];
export function addEventListener(func){
    listeners.push(func);
}

export function initialize() {
    // サイズを指定
    width = parent.innerWidth;
    height = parent.innerHeight;
    canvas = document.getElementById('myCanvas');

    // レンダラーを作成
    renderer = new THREE.WebGLRenderer({
        canvas: canvas,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    //シャドウを有効にする
    renderer.shadowMap.enabled = true;

    // シーンを作成
    scene = new THREE.Scene();

    // カメラを作成
    camera = new THREE.PerspectiveCamera(45, width / height);
    camera.position.set(-100, 150, 0);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    /*
    // カメラコントローラーを作成
    controls = new OrbitControls(camera, canvas);
    // 滑らかにカメラコントローラーを制御する
    controls.enableDamping = true;
    controls.dampingFactor = 0.2;
    */

    // 床を作成
    meshFloor = new THREE.Mesh(
        new THREE.BoxGeometry(field_width, 8, field_width),
        new THREE.MeshStandardMaterial(),
    );
    meshFloor.position.y = -4;
    // 影を受け付ける
    meshFloor.receiveShadow = true;
    scene.add(meshFloor);

    // 環境光源を作成
    const light = new THREE.AmbientLight(0xFFFFFF, 0.2);
    scene.add(light);
    // 平行光源
    const directionalLight = createDirectionalLight(Math.PI / 5, field_width, 30);
    scene.add(directionalLight);
    //light helper
    const helper = new THREE.CameraHelper(directionalLight.shadow.camera);
    //scene.add(helper);


    tick();
    // 毎フレーム時に実行されるループイベント
    function tick() {
        for(const func of listeners) {
            func();
        }

        renderer.render(scene, camera); // レンダリング
        requestAnimationFrame(tick);
    }
}

// 平行光源
function createDirectionalLight(theta, field_width, field_height) {
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);
    const r = 0.5 * field_width * sin;
    const z = r * sin + field_height * Math.tan(theta);
    const y = r * cos + field_height;
    const h = field_height / cos + field_width * sin;

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, y, z);
    directionalLight.castShadow = true;
    directionalLight.shadow.radius = true;

    directionalLight.shadow.camera.right = field_width / 2;
    directionalLight.shadow.camera.left = -field_width / 2;
    directionalLight.shadow.camera.top = -field_width * cos / 2;
    directionalLight.shadow.camera.bottom = field_width * cos / 2 +
        field_height * sin;

    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0;
    directionalLight.shadow.camera.far = h;

    return directionalLight;
}

//TANK
const tanks = new Map();
export function addTank (player) {
    if(tanks.has(player.id)){return;}
    const tank = TankMesh();
    tanks.set(player.id, tank);
    scene.add(tank);
}
export function delTank(players){
    for(const tank_key of tanks.keys()) {
        if(!players.has(tank_key)){
            console.log('del',tank_key);
            const mesh = tanks.get(tank_key);
            scene.remove(mesh);
            mesh.material.dispose();
            mesh.geometry.dispose();
            tanks.delete(tank_key);
        }
    }
}
export function setMyTankPos(player) {
    const myTank = tanks.get(player.id);
    myTank.position.x = player.position.x;
    myTank.position.z = player.position.z;
    myTank.rotation.y = -player.angle;
}
export function setMyTankColor(player, color){
    const tank = tanks.get(player.id);
    if(!tank){return;}
    tank.material.setValues({color: color});
}
function TankMesh(){
    //TANK!
    //const material = new THREE.MeshNormalMaterial();
    //const material = new THREE.MeshBasicMaterial( {color: 0x6699FF} );
    //const material = new THREE.MeshToonMaterial({color: 0x6699FF});
    const geometry = TankGeometry(10);
    const material = new THREE.MeshStandardMaterial({ color: 0x6699FF });
    const tank = new THREE.Mesh(geometry, material);
    tank.castShadow = true;
    return tank;
}

function TankGeometry(size) {
    const caterpillar = CaterpillarGeometry(size);
    const cannon = CanonGeometry(size);
    return BufferGeometryUtils.mergeGeometries([caterpillar, cannon]);
}

function CaterpillarGeometry(size) {
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

    // ジオメトリ生成
    return BufferGeometryUtils.mergeGeometries(geometries);
}

function CanonGeometry(size) {
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

    const cylinder2 = new THREE.CylinderGeometry(
        size / 20,
        size / 20,
        size,
        10,
    );
    cylinder2.rotateZ(Math.PI / 2);
    cylinder2.translate(size / 2, size / 2 + cannon_height / 2, 0);
    geometries.push(cylinder2);

    // ジオメトリ生成
    return BufferGeometryUtils.mergeGeometries(geometries);
}

//bullet
const bullets = new Map();
function addBullet (id) {
    const b = BulletMesh(10);
    bullets.set(id, b);
    scene.add(b);
}
function delBullet(model_bullets){
    for(const bullet_key of bullets.keys()) {
        if(!model_bullets.has(bullet_key)){
            const mesh = bullets.get(bullet_key);
            scene.remove(mesh);
            mesh.material.dispose();
            mesh.geometry.dispose();
            bullets.delete(bullet_key);
        }
    }
}
export function updateBullets(model_bullets) {
    //削除
    delBullet(model_bullets);
    //追加
    for(const b of model_bullets.keys()){
        if(!bullets.has(b)){
            addBullet(b);
        }
    }
    //座標更新
    for(const b of model_bullets.values()){
        const bullet = bullets.get(b.id);
        bullet.position.x = b.x;
        bullet.position.z = b.z;
    }
}
function BulletMesh(size){
    const geometry = new THREE.SphereGeometry(size/20, 16, 8);
    const material = new THREE.MeshStandardMaterial({ color: 0x6699FF });
    const bullet = new THREE.Mesh(geometry, material);
    bullet.position.y = size * 2 / 3;
    return bullet;
}

export function setCamera(player){
    //console.log('camera')
    const x = player.position.x;
    const z = player.position.z;
    const dx = 100 * Math.cos(player.angle + Math.PI);
    const dz = 100 * Math.sin(player.angle + Math.PI);
    const x1 = x + dx;
    const z1 = z + dz;
    const prex = camera.position.x;
    const prez = camera.position.z;
    const alpha = 0.1; 
    camera.position.x = prex - (prex - x1)*alpha;
    camera.position.z = prez - (prez - z1)*alpha;
    camera.lookAt(new THREE.Vector3(x - dx/4, 0, z - dz/4));
}