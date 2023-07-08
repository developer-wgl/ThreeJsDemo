import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let scene, camera, renderer, analyser, group;

const startButton = document.getElementById('startButton');
startButton.addEventListener('click', init);

// startButton.click();

function init() {

    startButton.hidden = true

    const container = document.getElementById('container');

    let N = 512;

    // 1，创建场景
    scene = new THREE.Scene();
    // 2, 创建多个网格模型组成组对象
    group = new THREE.Group();
    var material = new THREE.MeshPhongMaterial({ color: 0xffffff });
    for (let index = 0; index < N / 2; index++) {
        var box = new THREE.BoxGeometry(5, 100, 5);
        var mesh = new THREE.Mesh(box, material);
        mesh.position.set(20 * index - N / 2 * 10, 0, 0);
        group.add(mesh);
    }
    scene.add(group);
    // 加载音乐部分
    var listener = new THREE.AudioListener(); // 创建音频监听器
    var audio = new THREE.Audio(listener) // 创建音频，参数是音频监听器

    var file = "./Honor.mp3"

    if (/(iPad|iPhone|iPod)/g.test(navigator.userAgent)) {

        const loader = new THREE.AudioLoader();
        loader.load(file, function (buffer) {
            audio.setBuffer(buffer);
            audio.loop = true
            audio.play();
        });

    } else {
        const mediaElement = new Audio(file);
        mediaElement.loop = true
        mediaElement.play();

        audio.setMediaElementSource(mediaElement);
    }
    // 创建音频分析器；参数是音频
    analyser = new THREE.AudioAnalyser(audio, N);

    // 3,创建灯光
    var ambient = new THREE.AmbientLight(0xffffff);
    scene.add(ambient);

    // 4,创建相机对象
    var width = window.innerWidth;
    var height = window.innerHeight;
    var k = width / height;
    var s = 1000;
    camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, -2000, 2000);
    camera.position.set(500, 100, 500);
    camera.lookAt(scene.position);

    camera.add(listener);

    // 5，创建渲染器
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    var controls = new OrbitControls(camera, renderer.domElement);

    window.addEventListener('resize', onWindowResize);
    render();

}

function onWindowResize() {

    renderer.setSize(window.innerWidth, window.innerHeight);

}
function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);

    group.rotation.x += 0.005;
    group.rotation.y += 0.0005;

    if (analyser) {
        var arr = analyser.getFrequencyData(); // 获得频率数据
        // console.log(arr);
        // 遍历组数据，设置每个mesh的 y 方向数值，颜色的 r 值
        group.children.forEach((ele, index) => {
            ele.scale.y = arr[index] / 30;
            ele.material.color.r = arr[index];
        });
    }
}
