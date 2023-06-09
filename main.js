
import * as THREE from 'three'
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"

//scene
const scene = new THREE.Scene();

//create our sphere
const geometry = new THREE.SphereGeometry(3,64,64)
const material = new THREE.MeshStandardMaterial({
  color: "magenta",
  roughness:0.4,
  opacity:0.7,
  transparent: true,
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

//sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

//light
const light = new THREE.PointLight(0xffffff, 1, 100)
//x,y,z position
light.position.set(0, 10, 10)
light.intensity = 1.25
scene.add(light)

//camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 20
scene.add(camera)

//renderer
const canvas = document.querySelector(".webgl")
canvas.width = sizes.width;
canvas.height = sizes.height;
const renderer = new THREE.WebGLRenderer({ canvas })
//create gradient background
const gradientTexture = new THREE.CanvasTexture(getGradientCanvas());
const gradientMaterial = new THREE.MeshBasicMaterial({
    map: gradientTexture,
    side: THREE.BackSide
});
const gradientGeometry = new THREE.SphereGeometry(25, 64, 64);
const gradientMesh = new THREE.Mesh(gradientGeometry, gradientMaterial);
scene.add(gradientMesh);

function getGradientCanvas() {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext("2d");

    const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, "darkred");
    //gradient.addColorStop(0.2, "lime");
    //gradient.addColorStop(0.5, "orange");
    //gradient.addColorStop(0.8, "pink");
    gradient.addColorStop(1, "darkblue");
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    return canvas;
}

//controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false
controls.enableZoom = false
controls.autoRotate = true
controls.autoRotateSpeed = 5 

//resize
window.addEventListener('resize', () => {
  //update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight
  //camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()
  renderer.setSize(sizes.width, sizes.height)
})

const loop = () => {
  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(loop)
}
loop()

//timeline + html element positioning
const tl = gsap.timeline({ defaults: { duration:1 }})
tl.fromTo(mesh.scale, { z:0, x:0, y:0 }, { z:1, x:1, y:1})
tl.fromTo("nav", {y:'-100%'}, {y:'0%'})
tl.fromTo(".title-container", { opacity: 0}, { opacity: 1})
tl.fromTo(".welcome", { opacity: 0}, { opacity: 1})
tl.fromTo("footer", { opacity: 0}, { opacity: 1})


//mouse animation color
let mouseDown = false
let rgb = []
window.addEventListener("mousedown", () => (mouseDown = true))
window.addEventListener("mouseup", () => (mouseDown = false))

window.addEventListener("mousemove", (e) => {
  if (mouseDown) {
    rgb = [
      Math.round((e.pageX / sizes.width) * 255),
      Math.round((e.pageY / sizes.height) * 255),
      150,
    ]
    //animate
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
    gsap.to(mesh.material.color, {
  r: newColor.r, 
  g: newColor.g, 
  b: newColor.b 
    })
  }
})

window.addEventListener("touchmove", (e) => {
  if (true) {
    rgb = [
      Math.round((e.touches[0].pageX / sizes.width) * 255),
      Math.round((e.touches[0].pageY / sizes.height) * 255),
      150,
    ];
    //animate
    let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
    gsap.to(mesh.material.color, {
      r: newColor.r, 
      g: newColor.g, 
      b: newColor.b 
    });
  }
});



const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');

menuToggle.addEventListener('click', () => {
  menu.classList.toggle('show-menu');
});
