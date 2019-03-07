// import * as THREE from 'three'
// import OrbitControls from 'three-orbitcontrols'
const THREE = require('three')
const OrbitControls =  require('three-orbitcontrols')
window.THREE = THREE
var module = {
  scene: null,
  camera: null,
  renderer: null,
  cameraPosition: [0, 0, 30],
  init(){
    var self = this
    // 获取浏览器窗口的宽高，后续会用
    var width = window.innerWidth
    var height = window.innerHeight

    // 创建一个场景
    this.scene = new THREE.Scene()
    window.scene = this.scene;
    // 创建一个具有透视效果的摄像机
    this.camera = new THREE.PerspectiveCamera(35, width / height, 1, 1000)
    
    // 设置摄像机位置，并将其朝向场景中心
    this.camera.position.set(65, 8, -10)
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
    var orbitControls = new OrbitControls(this.camera)
    orbitControls.autoRotate = true
    orbitControls.addEventListener( 'change', render );
    orbitControls.minDistance = 20;
    orbitControls.maxDistance = 500;
    orbitControls.enablePan = false;
    // 将渲染器的输出（此处是 canvas 元素）插入到 body
    document.body.appendChild(this.renderer.domElement)
    this.methods.addLight(this.scene)
    this.methods.addMesh(this.scene)
    var helper = new THREE.AxisHelper(10);
    this.scene.add(helper);
    render()

    var step = 0
    
    function render() {
        // 渲染，即摄像机拍下此刻的场景
        self.renderer.render(self.scene, self.camera)

        // step += 0.004;

        // points.rotation.x = step;
        // points.rotation.z = step;
        requestAnimationFrame(render)
    }
  },
  methods: {
    // 通过自定义 canvas 生成纹理
    getTexture () {
      var canvas = document.createElement('canvas')
      canvas.width = 32
      canvas.height = 32

      var ctx = canvas.getContext('2d')
      // the body
      ctx.translate(-81, -84)

      ctx.fillStyle = "orange"
      ctx.beginPath()
      ctx.moveTo(83, 116)
      ctx.lineTo(83, 102)
      ctx.bezierCurveTo(83, 94, 89, 88, 97, 88)
      ctx.bezierCurveTo(105, 88, 111, 94, 111, 102)
      ctx.lineTo(111, 116)
      ctx.lineTo(106.333, 111.333)
      ctx.lineTo(101.666, 116)
      ctx.lineTo(97, 111.333)
      ctx.lineTo(92.333, 116)
      ctx.lineTo(87.666, 111.333)
      ctx.lineTo(83, 116)
      ctx.fill()

      // the eyes
      ctx.fillStyle = "white"
      ctx.beginPath()
      ctx.moveTo(91, 96)
      ctx.bezierCurveTo(88, 96, 87, 99, 87, 101)
      ctx.bezierCurveTo(87, 103, 88, 106, 91, 106)
      ctx.bezierCurveTo(94, 106, 95, 103, 95, 101)
      ctx.bezierCurveTo(95, 99, 94, 96, 91, 96)
      ctx.moveTo(103, 96)
      ctx.bezierCurveTo(100, 96, 99, 99, 99, 101)
      ctx.bezierCurveTo(99, 103, 100, 106, 103, 106)
      ctx.bezierCurveTo(106, 106, 107, 103, 107, 101)
      ctx.bezierCurveTo(107, 99, 106, 96, 103, 96)
      ctx.fill()

      // the pupils
      ctx.fillStyle = "blue"
      ctx.beginPath()
      ctx.arc(101, 102, 2, 0, Math.PI * 2, true)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(89, 102, 2, 0, Math.PI * 2, true)
      ctx.fill()


      var texture = new THREE.Texture(canvas)
      texture.needsUpdate = true
      return texture
    },
    // 添加三角形纹理
    getTriangleTexture(){
      var canvas = document.createElement('canvas')
      canvas.width = 32
      canvas.height = 32

      var ctx = canvas.getContext('2d')
      ctx.fillStyle="#ffffff"
      ctx.beginPath();
      ctx.moveTo(0, 10);
      ctx.lineTo(10, 10);
      ctx.lineTo(10, 0);
      ctx.closePath();
      ctx.fill();
      var texture = new THREE.Texture(canvas)
      texture.needsUpdate = true
      return texture
    },
    // 添加粒子
    addPointMesh () {
      var geometry = new THREE.Geometry()
      var material = new THREE.PointsMaterial({
          size: 10,
          transparent: true,
          opacity: 1,
          // 指定纹理
          map: this.getTriangleTexture(),
          // 粒子的大小是否和其与摄像机的距离有光，默认值 true
          sizeAttenuation: true,
          // 用于去除纹理的黑色背景，关于 depthTest 和 depthWrite 的详细解释，请查看https://stackoverflow.com/questions/37647853/three-js-depthwrite-vs-depthtest-for-transparent-canvas-texture-map-on-three-p
          depthWrite: false
      })

      var range = 500

      for (var i = 0; i < 5000; i++) {
          var particle = new THREE.Vector3(
              Math.random() * range - range / 2,
              Math.random() * range - range / 2,
              Math.random() * range - range / 2)

          geometry.vertices.push(particle)
      }

      var points = new THREE.Points(geometry, material)
      return points;
    },

    addMesh(scene){
      var geometry = new THREE.BoxGeometry(10,10,10);
      var material = new THREE.MeshLambertMaterial({
        color: 0xFFF57C,
        // vertexColors: THREE.VertexColors,//以顶点颜色为准
      });
      var mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = 10
      mesh.position.y = 10
      mesh.position.z = 10
      console.log(mesh.faces)
      // 手动设置顶点颜色
      for(var i =0; i < mesh.geometry.faces.length; i++){
        let face = mesh.geometry.faces[i]
        
        // 设置顶点的颜色
        face.vertexColors = [new THREE.Color( 0xff0000 ),new THREE.Color( 0x00ff00 ),new THREE.Color( 0x0000ff )]
      }
      this.mesh = mesh;
      var helper = new THREE.VertexNormalsHelper( mesh, 2, 0x00ff00, 1 );
      scene.add(mesh)
      scene.add(helper)
    },
    // 添加4大光源
    addLight(scene){
      var light = new THREE.AmbientLight( 0x433535, 0.1)
      scene.add(light)
      // 添加聚光灯光源
      var spotLight = new THREE.SpotLight( 0xA867CB, 1)
      spotLight.position.set( 50, 50, 50 )
      var spotLightHelper = new THREE.SpotLightHelper( spotLight )
      scene.add(spotLight)
      scene.add( spotLightHelper );
      // 添加camerahelper
      shadowCameraHelper = new THREE.CameraHelper( spotLight.shadow.camera );
      scene.add( shadowCameraHelper );
      scene.add( new THREE.AxesHelper( 10 ) );
      // // 添加半球光源
      // hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
      // hemiLight.color.setHSL( 0.6, 1, 0.6 );
      // hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
      // hemiLight.position.set( 0, 50, 0 );
      // scene.add( hemiLight );
      // hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
      // scene.add( hemiLightHelper );
      // // 添加平行光源
      dirLight = new THREE.DirectionalLight( 0x00ff00, 1 );
      dirLight.position.set( - 1, 1.75, 1 );
      dirLight.position.multiplyScalar( 30 );
      scene.add( dirLight );
      let dirLightRight = new THREE.DirectionalLight( 0x0000ff, 1 );
      dirLightRight.position.set( 1, 1.75, 1 );
      dirLightRight.position.multiplyScalar( 30 );
      scene.add( dirLightRight );
      scene.add( new THREE.DirectionalLightHelper( dirLight, 10 ) );
      scene.add( new THREE.DirectionalLightHelper( dirLightRight, 10 ) );
      // scene.add( spotLight.target );
    },
    // 添加聚光灯helper 
    addLightHelper(scene, spotLight){
    }
  }
}

module.init();