const THREE = require('three')
const OrbitControls =  require('three-orbitcontrols')

import loader from './js/loader/index'
import addMouseListener from './js/addMouseListener'
window.THREE = THREE
require("./js/loader/FBXLoader.js")
require("script-loader!./js/THREEx.KeyboardState.js")
require("script-loader!./js/loader/inflate.min.js")
let fbxLoader = new THREE.FBXLoader();
var module = {
  scene: null,
  camera: null,
  renderer: null,
  maxers:[],
  cameraPosition: [-100, -100, 50],
  round: false,
  init(){
    var self = this
    // 获取浏览器窗口的宽高，后续会用
    var width = window.innerWidth
    var height = window.innerHeight
    this.clock = new THREE.Clock();
    this.keyboard = new THREEx.KeyboardState();
    // 创建一个场景
    this.scene = new THREE.Scene()
    window.scene = this.scene;
    // 创建一个具有透视效果的摄像机
    this.camera = new THREE.PerspectiveCamera(35, width / height, 1, 10000)
    // 设置摄像机位置，并将其朝向场景中心
    this.camera.position.set(0, 0, 500)
    this.camera.lookAt(this.scene.position)

    // 创建一个 WebGL 渲染器，Three.js 还提供 <canvas>, <svg>, CSS3D 渲染器。
    this.renderer = new THREE.WebGLRenderer({
        antialias: true  // 开启抗齿锯
    })

    // 设置渲染器的清除颜色（即绘制下一帧前填充的颜色）和输出的 canvas 的尺寸
    this.renderer.setClearColor(0x75C3FF)
    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;
    // 初始化摄像机插件（用于拖拽旋转摄像机，产生交互效果）
    this.orbitControls = new OrbitControls(this.camera)
    // orbitControls.autoRotate = true
    // orbitControls.addEventListener( 'change', render );
    // orbitControls.minDistance = 20;
    // orbitControls.maxDistance = 500;
    // orbitControls.enablePan = false;
    this.container = document.body;
    // 将渲染器的输出（此处是 canvas 元素）插入到 body
    this.container.appendChild(this.renderer.domElement)
    this.methods.createGeometry(this.scene)
    // this.scene.add(new THREE.Mesh(new THREE.SphereGeometry(100, 100, 100), new THREE.MeshBasicMaterial(0x0000ff)))
    this.methods.addLight(this.scene)
    this.addListener = addMouseListener(this.scene, this.renderer, this.camera, this.container)
    // this.methods.addMesh(this.scene)
    // 加载模型
    loader.addGLTFModel("../Flamingo.glb")
    .then(gltf => {
      let gltfMesh = gltf.scene.children[ 0 ];
      let scaleRate = 0.5;
      let {x, y, z, theta, phi} = this.methods.getPosi();
      gltfMesh.scale.x = scaleRate
      gltfMesh.scale.y = scaleRate
      gltfMesh.scale.z = scaleRate
      gltfMesh.position.x = x
      gltfMesh.position.y = y
      gltfMesh.position.z = z
      gltfMesh.theta = theta
      gltfMesh.phi = phi
      gltfMesh.rotation.y = - 1;
      gltfMesh.castShadow = true;
      gltfMesh.receiveShadow = true;
      var box = new THREE.BoxHelper( gltfMesh, 0xffff00 );
      gltfMesh.name="gltfMesh_bird"
      this.scene.add(gltfMesh);
      this.scene.add(box);
      var mixer = new THREE.AnimationMixer(gltfMesh)
      mixer.clipAction(gltf.animations[0]).setDuration(1).play();
      this.maxers.push(mixer);
      this.addListener().then(() => {
        gltfMesh.on('click', () => {
          this.round = !this.round;
        })
      })
    })

    fbxLoader.load("../src/obj/bird.FBX", (mesh) => {
      
      var robot = mesh.children[0];
      let {x, y, z} = this.methods.getPosi();
      robot.scale.x = 0.08
      robot.scale.y = 0.08
      robot.scale.z = 0.08
      // bird.rotateX(-Math.PI / 2);
      robot.position.x = x;
      robot.position.y = y;
      robot.position.z = z;
      robot.rotation.y = - 1;

      this.addListener().then(() => {
        robot.on('click', () => {
          if(!robot.isClicked){
            robot.isClicked = true;
            // 1.得到这个robot的position数据，然后将camera设置为position
            let xx = robot.position.x
            let yy = robot.position.y
            let zz = robot.position.z
            // 得到robot的最大最小坐标，来计算大小，
            robot.geometry.computeBoundingBox();
            let sizeZ = robot.geometry.boundingBox.max.z - robot.geometry.boundingBox.min.z
            // robot.geometry.center();  这个可以让物体居中
            // robot.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(-450, -300, 0));  这个可以以y轴和x轴移动
            // 以动画的方式移动摄像机，物体的位置仍保持不变，之后再把摄像机看向robot
            // 在点击的一瞬间会闪动，再看一下这个问题, 去掉lookAt方法就可以解决
            TweenMax.to(this.camera.position, 1, {
              x: xx ,
              y: yy,
              z: zz + sizeZ / 2,
              ease:Expo.easeInOut,
              onComplete:  () => {
                robot.isClicked = false;
              } 
            })
          }
        })
      })

      var box = new THREE.BoxHelper( robot, 0xffff00 );
      this.scene.add(robot);
      this.scene.add(box);
    })
    var helper = new THREE.AxesHelper(10);
    this.scene.add(helper);
    let maxers = this.maxers;
    render()
    function render() {
        var delta = self.clock.getDelta();
        // 渲染，即摄像机拍下此刻的场景
        self.renderer.render(self.scene, self.camera)
        self.orbitControls.update(delta);
        maxers.forEach((item) => {
          item.update(delta);
        })
        
        if(self.round){
          
          let gltfMesh_bird = self.scene.children.find(item => item.name === 'gltfMesh_bird')
          let theta1 = gltfMesh_bird.theta + 0.01
          let {x, y, z, theta, phi} = self.methods.getPosi(theta1, gltfMesh_bird.phi)
          gltfMesh_bird.theta = theta
          gltfMesh_bird.phi = phi
          gltfMesh_bird.position.x = x
          gltfMesh_bird.position.y = y
          gltfMesh_bird.position.z = z
        }
        var moveDistance = 20 * delta;
        var rotateAngle = Math.PI / 2 * delta;
        let movingCube = self.scene.children.find(item => item.name === 'mesh_01')
        if (self.keyboard.pressed("A")) {
            movingCube.rotation.y += rotateAngle;
        }
        if (self.keyboard.pressed("D")) {
            movingCube.rotation.y += rotateAngle;
        }
        if (self.keyboard.pressed("left")) {
            movingCube.position.x -= moveDistance;
        }
        if (self.keyboard.pressed("right")) {
            movingCube.position.x += moveDistance;
        }
        if (self.keyboard.pressed("up")) {
            movingCube.position.z -= moveDistance;
        }
        if (self.keyboard.pressed("down")) {
            movingCube.position.z += moveDistance;
        }

        requestAnimationFrame(render)
    }
  },
  methods: {

    createGeometry(scene){
      let geo = new THREE.BoxGeometry(10, 10, 10)
      let material = new THREE.MeshBasicMaterial(0xffff00)
      let mesh = new THREE.Mesh(geo, material)
      mesh.name="mesh_01"
      mesh.position.x = 0;
      mesh.position.y = 0;
      mesh.position.z = 0;
      scene.add(mesh)
    },

    getPosi(theta, phi){
      // 球体表面的3维向量
      var radius = 100;
      var theta = theta || (Math.random() * Math.PI * 2);
      var phi = phi || (Math.random() * Math.PI);
      var x = radius * Math.cos( theta ) * Math.sin( phi );
			var z = radius * Math.cos( phi );
      var y = radius * Math.sin( theta ) * Math.sin( phi );
      return {
        x, y, z, theta, phi
      }
    },
    // 添加光源
    addLight(scene){
      var light = new THREE.AmbientLight( 0x111111, 0.1)
      scene.add(light)
      // 添加半球光源
      var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
      hemiLight.color.setHSL( 0.6, 1, 0.6 );
      hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
      hemiLight.position.set( 0, 50, 0 );
      scene.add( hemiLight );
      var hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
      scene.add( hemiLightHelper );
      // 添加平行光源
      var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
      dirLight.color.setHSL( 0.1, 1, 0.95 );
      dirLight.position.set( - 1, 1.75, 1 );
      dirLight.position.multiplyScalar( 30 );
      scene.add( dirLight );
      var dirLightHeper = new THREE.DirectionalLightHelper( dirLight, 10 );
      scene.add( dirLightHeper );
    }
  }
}

module.init();