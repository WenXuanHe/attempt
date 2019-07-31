/**
 * 接下来的任务
 * 1. 操作按钮，控制车辆运动
 * 2. 碰撞检测
 * 3. 阴影控制
 * 4. 摄像机跟随
 * 5. 轮胎细节
 * 6. 飘逸
 */
// import * as THREE from 'three'
// import OrbitControls from 'three-orbitcontrols'
const THREE = require('three')
window.THREE = THREE
const OrbitControls = require('three-orbitcontrols')
import objLoader from './js/loader/addObjLoader'
import objMtlLoader from './js/loader/addObjMtlLoader'

class Car {
  constructor() {
    this.init()
    this.addLight()
    this.loadCar()
    this.loadGround()
    this.render()
    document.addEventListener("resize", this.onWindowResize)
  }

  loadCar(){
    let self = this
    objMtlLoader('../src/obj/car/', 'car4', 'car4').then((car) => {
      car.children.forEach(function(item) {
          item.castShadow = true;
      });
      car.position.z = -20;
      car.position.y = -5;
      var axisHelper = new THREE.AxisHelper(1);
      axisHelper.visible=true;
      car.add(axisHelper);
      self.scene.add(car);
      self.car = car;
      TweenMax.to(this.camera.rotation, 1, {
        x: car.rotation.x ,
        y: car.rotation.y,
        z: -car.rotation.z,
        ease:Expo.easeInOut
      });
      // TweenMax.to(this.camera.position, 1, {
      //   x: car.rotation.x ,
      //   y: car.rotation.y,
      //   z: car.rotation.z,
      //   ease:Expo.easeInOut
      // })
    })
  }

  loadGround(){
    objLoader('../src/obj/car/ground.obj').then(object => {
      object.children.forEach(function(item) {
        item.receiveShadow = true;
      });
      object.position.y = -5;
      
      this.scene.add(object);
    })
  }

  init() {
    // 获取浏览器窗口的宽高，后续会用
    var width = window.innerWidth
    var height = window.innerHeight
    // 创建一个场景
    this.scene = new THREE.Scene()
    window.scene = this.scene
    // 创建一个具有透视效果的摄像机
    this.camera = new THREE.PerspectiveCamera(40, width / height, 1, 3000)
    // 设置摄像机位置，并将其朝向场景中心
    this.camera.position.z = 100;
    this.camera.position.x = 0;
    this.camera.position.y = 0;
    this.camera.speed = {
        z: 0,
        x: 0,
    };
    this.camera.lookAt(this.scene.position)
    // 创建一个 CSS3D 渲染器，
    this.renderer = new THREE.WebGLRenderer()
    this.renderer.setSize(width, height);
    this.renderer.setClearColor(0x0077ec, 1);
    // 初始化摄像机插件（用于拖拽旋转摄像机，产生交互效果）
    var orbitControls = new OrbitControls(this.camera, this.renderer.domElement)
    orbitControls.addEventListener('change', this.render.bind(this));
    orbitControls.autoRotate = true
    orbitControls.enablePan = false;
    orbitControls.rotateSpeed = 1;
    orbitControls.staticMoving = true;
    orbitControls.minDistance = 50;
    orbitControls.maxDistance = 6000;
    // 设置渲染器的清除颜色（即绘制下一帧前填充的颜色）和输出的 canvas 的尺寸
    // 将渲染器的输出（此处是 canvas 元素）插入到 body
    document.body.appendChild(this.renderer.domElement)
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.render();
  }

  render() {
    // 渲染，即摄像机拍下此刻的场景
    this.renderer.render(this.scene, this.camera)
    requestAnimationFrame(this.render.bind(this))
  }

  addLight() {
    let scene = this.scene
    var pointLight = new THREE.PointLight(0xccbbaa, 1, 0, 0);  
        pointLight.position.set(-10, 20, -20);
        pointLight.castShadow = true;
        scene.add(pointLight);
        var light = new THREE.AmbientLight( 0xccbbaa, 0.1 );
        scene.add( light );
  }

  operate(){
    document.body.addEventListener('keydown', function(e) {
      switch(e.keyCode) {
          case 87: // w
              car.run = true;
              break;
          case 65: // a
              car.rSpeed = 0.02;
              break;
          case 68: // d
              car.rSpeed = -0.02;
              break;
          case 32: // space
              car.run = false;
              break;
      }
    });
  }
}


new Car()