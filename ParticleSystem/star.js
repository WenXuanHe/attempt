

var renderer;

function initRender() {

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(new THREE.Color(0xffffff)); //设置背景颜色
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

var camera;

function initCamera() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(20, 0, 100);
}

var scene;

function initScene() {
    scene = new THREE.Scene();
}


var light;
function initLight() {
    scene.add(new THREE.AmbientLight(0x404040));
    light = new THREE.DirectionalLight(0xffffff);
    light.position.set(1, 1, 1);
    scene.add(light);
}

function initModel() {
    //轴辅助 （每一个轴的长度
    var object = new THREE.AxesHelper(500);
    scene.add(object);
}
//随机生成颜色
function randomColor() {
    var arrHex = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"],
        strHex = "0x",
        index;
    for (var i = 0; i < 6; i++) {
        index = Math.round(Math.random() * 15);
        strHex += arrHex[index];
    }
    return strHex;
}

//初始化性能插件
var stats;
function initStats() {
    stats = new Stats();
    document.body.appendChild(stats.dom);
}

//用户交互插件 鼠标左键按住旋转，右键按住平移，滚轮缩放
var controls
function initControls() {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    // 如果使用animate方法时，将此函数删除
    //controls.addEventListener( 'change', render );
    // 使动画循环使用时阻尼或自转 意思是否有惯性


    controls.enableDamping = true;


    //动态阻尼系数 就是鼠标拖拽旋转灵敏度


    //controls.dampingFactor = 0.25;


    //是否可以缩放


    controls.enableZoom = true;


    //是否自动旋转


    controls.autoRotate = false;


    //设置相机距离原点的最远距离


    controls.minDistance = 20;


    //设置相机距离原点的最远距离


    controls.maxDistance = 10000;


    //是否开启右键拖拽


    controls.enablePan = true;


}





//生成gui设置配置项


var gui;





//生成纹理图形


function getTexture() {


    var canvas = document.createElement('canvas');


    canvas.width = 32;


    canvas.height = 32;





    var ctx = canvas.getContext('2d');


    // 绘制身体


    ctx.translate(-81, -84);





    ctx.fillStyle = "orange";


    ctx.beginPath();


    ctx.moveTo(83, 116);


    ctx.lineTo(83, 102);


    ctx.bezierCurveTo(83, 94, 89, 88, 97, 88);


    ctx.bezierCurveTo(105, 88, 111, 94, 111, 102);


    ctx.lineTo(111, 116);


    ctx.lineTo(106.333, 111.333);


    ctx.lineTo(101.666, 116);


    ctx.lineTo(97, 111.333);


    ctx.lineTo(92.333, 116);


    ctx.lineTo(87.666, 111.333);


    ctx.lineTo(83, 116);


    ctx.fill();





    // 绘制眼睛


    ctx.fillStyle = "white";


    ctx.beginPath();


    ctx.moveTo(91, 96);


    ctx.bezierCurveTo(88, 96, 87, 99, 87, 101);


    ctx.bezierCurveTo(87, 103, 88, 106, 91, 106);


    ctx.bezierCurveTo(94, 106, 95, 103, 95, 101);


    ctx.bezierCurveTo(95, 99, 94, 96, 91, 96);


    ctx.moveTo(103, 96);


    ctx.bezierCurveTo(100, 96, 99, 99, 99, 101);


    ctx.bezierCurveTo(99, 103, 100, 106, 103, 106);


    ctx.bezierCurveTo(106, 106, 107, 103, 107, 101);


    ctx.bezierCurveTo(107, 99, 106, 96, 103, 96);


    ctx.fill();





    // 绘制眼球


    ctx.fillStyle = "blue";


    ctx.beginPath();


    ctx.arc(101, 102, 2, 0, Math.PI * 2, true);


    ctx.fill();


    ctx.beginPath();


    ctx.arc(89, 102, 2, 0, Math.PI * 2, true);


    ctx.fill();





    var texture = new THREE.Texture(canvas);


    texture.needsUpdate = true;


    return texture;


}





var cloud;


function initGui() {


    //声明一个保存需求修改的相关数据的对象


    gui = {


        "size": 4,


        "transparent": true,


        "opacity": 0.6,


        "vertexColors": true,


        "color": 0xffffff,


        "sizeAttenuation": true,


        "rotateSystem": true,


        redraw: function () {


            if (cloud) {


                scene.remove(cloud);


            }


            createParticles(gui.size, gui.transparent, gui.opacity, gui.vertexColors, gui.sizeAttenuation, gui.color);


            //设置是否自动旋转


            controls.autoRotate = gui.rotateSystem;


        }


    };


    // var datGui = new dat.GUI();


    // //将设置属性添加到gui当中，gui.add(对象，属性，最小值，最大值）gui.add(controls, 'size', 0, 10).onChange(controls.redraw);


    // datGui.add(gui, 'transparent').onChange(gui.redraw);


    // datGui.add(gui, 'opacity', 0, 1).onChange(gui.redraw);


    // datGui.add(gui, 'vertexColors').onChange(gui.redraw);


    // datGui.addColor(gui, 'color').onChange(gui.redraw);


    // datGui.add(gui, 'sizeAttenuation').onChange(gui.redraw);


    // datGui.add(gui, 'rotateSystem').onChange(gui.redraw);





    gui.redraw();


}





//生成粒子的方法


function createParticles(size, transparent, opacity, vertexColors, sizeAttenuation, color) {





    //存放粒子数据的网格


    var geom = new THREE.Geometry();


    //样式化粒子的THREE.PointCloudMaterial材质


    var material = new THREE.PointsMaterial({


        size: size,


        transparent: transparent,


        opacity: opacity,


        vertexColors: vertexColors,


        sizeAttenuation: sizeAttenuation,


        color: color,


        map:getTexture(),


        depthTest: false  //设置解决透明度有问题的情况


    });








    var range = 500;


    for (var i = 0; i < 15000; i++) {


        var particle = new THREE.Vector3(Math.random() * range - range / 2, Math.random() * range - range / 2, Math.random() * range - range / 2);


        geom.vertices.push(particle);


        var color = new THREE.Color(+randomColor());


        //.setHSL ( h, s, l ) h — 色调值在0.0和1.0之间 s — 饱和值在0.0和1.0之间 l — 亮度值在0.0和1.0之间。 使用HSL设置颜色。


        //随机当前每个粒子的亮度


        //color.setHSL(color.getHSL().h, color.getHSL().s, Math.random() * color.getHSL().l);


        geom.colors.push(color);


    }





    //生成模型，添加到场景当中


    cloud = new THREE.Points(geom, material);





    scene.add(cloud);


}





function render() {


    renderer.render(scene, camera);


}





//窗口变动触发的函数


function onWindowResize() {


    camera.aspect = window.innerWidth / window.innerHeight;


    camera.updateProjectionMatrix();


    render();


    renderer.setSize(window.innerWidth, window.innerHeight);





}





function animate() {


    //更新控制器


    controls.update();


    render();





    //更新性能插件


    stats.update();


    requestAnimationFrame(animate);


}




draw();
function draw() {


    initRender();


    initScene();


    initCamera();


    initLight();


    initModel();


    initControls();


    initStats();


    initGui();





    animate();


    window.onresize = onWindowResize;


}