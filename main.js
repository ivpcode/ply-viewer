import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FlyControls } from 'three/examples/jsm/controls/FlyControls'


import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader'
import Stats from 'three/examples/jsm/libs/stats.module'

const scene = new THREE.Scene()
let controls = {}
let camera = {}
const renderer = new THREE.WebGLRenderer()
const stats = Stats()

addEventListener('DOMContentLoaded', (event) => {

    scene.add(new THREE.AxesHelper(5))

    const light = new THREE.SpotLight()
    light.position.set(20, 20, 20)
    scene.add(light)

    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    )
    camera.position.z = 40

    controls = new OrbitControls(camera, renderer.domElement)

    renderer.outputEncoding = THREE.sRGBEncoding
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.querySelector(".scene_container").appendChild(renderer.domElement)
 
    document.querySelector(".scene_container").appendChild(stats.dom)
 
    controls.enableDamping = true

    document.querySelector("input").addEventListener("change",loadFile)

    animate()
});

window.addEventListener('resize', ()=>{
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}, false)

function loadFile(evt) {
    
    const file = evt.currentTarget.files.item(0);
    const reader = new FileReader();
    reader.onload = (r_evt) => {
        const contents = r_evt.target.result;

        const geometry = new PLYLoader().parse( contents );
        console.log("Points count: "+ geometry.attributes.position.count)
        let object;

        const material = new THREE.PointsMaterial( { size: 0.01 } );
        material.vertexColors = geometry.hasAttribute( 'color' );

        object = new THREE.Points( geometry, material );
        object.name = "PointCLoud";

        let selectedObject = scene.getObjectByName("PointCLoud");
        if (selectedObject != null)
            scene.remove( selectedObject );
        scene.add(object);
    
    }

    reader.readAsArrayBuffer(file);

}

function animate() {
    requestAnimationFrame(animate)

    controls.update()

    render()

    stats.update()
}

function render() {
    renderer.render(scene, camera)
}

