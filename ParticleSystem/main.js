// 页面交互逻辑
// 1、太阳左右运动， 10s后出第一个粒子圆球
// 2、粒子圆球一直膨胀，到一定大小，然后粒子变换成玩具的粒子
// 3、再变换成小提琴

class  WorldPoint{

    constructor(canvasContainer){
        this.container = canvasContainer || document.body;
        this.createScene();
        this.createLights();
        this.initStats();
        // 给物体添加点击事件
        this.addMouseListener();
        // this.addObjs();
        // this.addObj1();
        // this.addObjs2();
        this.addObjs3();
        // this.initModel();
        // this.initControls();
        // 轨道控制插件（鼠标拖拽视角、缩放等）
        this.orbitControls = new THREE.OrbitControls(this.camera);
        this.orbitControls.autoRotate = true;
        this.update();
    }

    createScene(){

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.fog = new THREE.Fog(0x090918, 1, 600);

        // 三剑客之场景
        this.scene = new THREE.Scene();
        // 三剑客之相机
        this.camera = new THREE.PerspectiveCamera( 50, this.width/this.height, 0.1, 1000);

        // 三剑客之渲染器
        this.renderer = new THREE.WebGLRenderer({
            // 在 css 中设置背景色透明显示渐变色
            alpha: true,
            // 开启抗锯齿
            antialias: true
        });

        // 设置相机位置
        this.camera.position.x = -100;
        this.camera.position.y = 100;
        this.camera.position.z = 50;

        this.renderer.setClearColor(this.fog.color);
        this.renderer.setSize(this.width, this.height);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.container.appendChild(this.renderer.domElement);
    }

    createLights(){
        // 户外光源
        this.hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xdedede, .9);
        // 环境光源
        this.ambientLight = new THREE.AmbientLight(0xdc8874, .2);
        // 方向光源
        this.shadowLight = new THREE.DirectionalLight(0xffffff, .6);

        this.pointLight = new THREE.PointLight("#ffffff");

        this.pointLight.position.set(0, 100, -80);
        // 开启阴影
        this.shadowLight.castShadow = true;

        // 定义可见域的投射阴影
        this.shadowLight.shadow.camera.left = -400;
        this.shadowLight.shadow.camera.right = 400;
        this.shadowLight.shadow.camera.top = 400;
        this.shadowLight.shadow.camera.bottom = -400;
        this.shadowLight.shadow.camera.near = 1;
        this.shadowLight.shadow.camera.far = 1000;

        // 定义阴影的分辨率；虽然分辨率越高越好，但是需要付出更加昂贵的代价维持高性能的表现。
        this.shadowLight.shadow.mapSize.width = 2048;
        this.shadowLight.shadow.mapSize.height = 2048;


        // 添加 lens flares
        // 添加光晕效果
        var textureLoader = new THREE.TextureLoader();
        var textureFlare0 = textureLoader.load("./img/lensflare0.png");
        var flareColor = new THREE.Color(0xffffff);
        flareColor.setHSL(0.55, 0.9, 1.0);
        var lensFlare = new THREE.LensFlare( textureFlare0, 500, 0.0, THREE.AdditiveBlending, flareColor );
        // 将光晕和pointLight重合
        lensFlare.position.copy(this.pointLight.position);

        this.scene.add(this.hemisphereLight);
        this.scene.add(this.ambientLight);
        this.scene.add(this.pointLight);
        this.scene.add(this.shadowLight);
        this.scene.add(lensFlare);
    }

    initStats(){
        this.stats = new Stats();

        this.stats.domElement.style.position = "fixed";
        this.stats.domElement.style.bottom = "0";
        this.stats.domElement.style.zIndex = "100";

        this.container.appendChild(this.stats.domElement);
    }

    addObjs2(){
        this.loader(['obj/robot.fbx', 'obj/Guitar/Guitar.fbx']).then(result =>{
            var robot = result[0].children[1].geometry;
            var guitarObj = result[1].children[0].geometry;
            // 放大1.5倍
            guitarObj.scale(1.5, 1.5, 1.5)
            guitarObj.rotateX(-Math.PI / 2);
            robot.scale(0.08, 0.08, 0.08);
            robot.rotateX(-Math.PI / 2);

            this.addPartices(robot, guitarObj)
        })
    }

    onShadow(obj) {
        if (obj.type === 'Mesh') {
            obj.castShadow = true;
            obj.receiveShadow = true;
        }
        if (obj.children && obj.children.length > 0) {
            obj.children.forEach((item) => {
                this.onShadow(item);
        })
        }
        return;
    }

    // 生成纹理
     generateSprite() {

        var canvas = document.createElement('canvas');
        canvas.width = 16;
        canvas.height = 16;

        var context = canvas.getContext('2d');
        var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.2, 'rgba(0,255,255,1)');
        gradient.addColorStop(0.4, 'rgba(0,0,64,1)');
        gradient.addColorStop(1, 'rgba(0,0,0,1)');

        context.fillStyle = gradient;
        context.fillRect(0, 0, canvas.width, canvas.height);

        var texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;

    }

    initControls() {
        this.clock = new THREE.Clock();
        this.controls = new THREE.FlyControls( this.camera );
        this.controls.movementSpeed = 10; //设置移动的速度
        this.controls.rollSpeed = Math.PI / 12; //设置旋转速度
        this.controls.autoForward = false;
        this.controls.dragToLook = false;
    }
    // 初始化文字
    initModel() {
        var font;
        var loader = new THREE.FontLoader();
        var self = this;
        loader.load("lib/fonts/gentilis_regular.typeface.json", function (res) {
            font = new THREE.TextBufferGeometry("he wen xuan", {
                font: res,
                size: 100,
                height: 60,
                curveSegments: 10
            });

            font.computeBoundingBox(); // 运行以后设置font的boundingBox属性对象，如果不运行无法获得。
            //font.computeVertexNormals();

            var map = new THREE.TextureLoader().load("img/UV_Grid_Sm.jpg");
            var material = new THREE.MeshLambertMaterial({map:map,side:THREE.DoubleSide});

            self.fontModel = new THREE.Mesh(font,material);

            //设置位置
            self.fontModel.position.x = - (font.boundingBox.max.x - font.boundingBox.min.x)/2; //计算出整个模型的宽度的一半
            self.fontModel.position.y = - 50;
            self.fontModel.position.z = - 30;

            var geometry1 = new THREE.SphereGeometry( 100, 50, 50 );

            var material = new THREE.PointsMaterial({
                size: 10,
                color: 0xffffff,
                transparent: true,
                opacity: 1,
                // 指定纹理
                map: self.getTexture(64),
                // 粒子的大小是否和其与摄像机的距离有光，默认值 true
                sizeAttenuation: true,
                // 用于去除纹理的黑色背景，关于 depthTest 和 depthWrite 的详细解释，请查看https://stackoverflow.com/questions/37647853/three-js-depthwrite-vs-depthtest-for-transparent-canvas-texture-map-on-three-p
                depthWrite: false
            });

            self.fontModel.on("click", function () {
                self.scene.remove(this);
                let material1 = new THREE.PointsMaterial({
                    color: 0xffffff,
                    size: 5,
                    // 使用 opacity 的前提是开启 transparent
                    opacity: 0.6,
                    transparent: true,
                    // 设置元素与背景的融合模式
                    blending: THREE.AdditiveBlending,
                    // 指定粒子的纹理
                    map: self.generateSprite(),
                    // 用于去除纹理的黑色背景，关于 depthTest 和 depthWrite 的详细解释，请查看https://stackoverflow.com/questions/37647853/three-js-depthwrite-vs-depthtest-for-transparent-canvas-texture-map-on-three-p
                    depthTest: false
                });
                let points = new THREE.Points(self.fontModel.geometry, material1)
                let points1 = new THREE.Points(geometry1, material1)
                self.scene.add(points1);
                self.scene.add(points);
            });


            self.scene.add(self.fontModel);
        });
    }

    addObjs3() {
        this.loader(['obj/bumblebee/bumblebee.FBX', 'obj/teapot.js', 'https://res.cloudinary.com/dgnx97ptu/raw/upload/v1506569170/chahu_xlo7pg.obj', 'obj/monu9.objmtl']).then((result) => {
            let bumblebee = result[0];
        // 加载的js/json格式需手动mesh
        let teapot = new THREE.Mesh(result[1].geometry, result[1].material);
        // let chahu = result[2];
        let monu = result[3];
        // 按场景要求缩放及位移

        bumblebee.scale.x = 0.01;
        bumblebee.scale.y = 0.01;
        bumblebee.scale.z = 0.01;
        bumblebee.rotateX(-Math.PI / 2);
        bumblebee.position.y -= 30;
        bumblebee.position.z += 30;
        // teapot.applyMatrix(new THREE.Matrix4().makeTranslation(0, -30, 20));
        teapot.scale.x = 0.2;
        teapot.scale.y = 0.2;
        teapot.scale.z = 0.2;
        teapot.position.z += 50;
        teapot.position.y -= 30;

        monu.applyMatrix(new THREE.Matrix4().makeTranslation(0, -30, 0));
        // 大黄蜂模型被点击时向z轴移动一段距离
        bumblebee.on("click", function() {
            let tween = new TWEEN.Tween(this.position).to({
                z: bumblebee.position.z-10
            }, 200).easing(TWEEN.Easing.Quadratic.InOut).start();
        });
        let self = this;

        // chahu.on("click", function () {
        //     var material = new THREE.PointsMaterial({
        //         color: 0xffffff,
        //         size: 0.4,
        //         // 使用 opacity 的前提是开启 transparent
        //         opacity: 0.6,
        //         transparent: true,
        //         // 设置元素与背景的融合模式
        //         blending: THREE.AdditiveBlending,
        //         // 指定粒子的纹理
        //         map: self.generateSprite(),
        //         // 用于去除纹理的黑色背景，关于 depthTest 和 depthWrite 的详细解释，请查看https://stackoverflow.com/questions/37647853/three-js-depthwrite-vs-depthtest-for-transparent-canvas-texture-map-on-three-p
        //         depthTest: false
        //     })
        //     self.scene.remove(this);
        //     let robotGeometry = bumblebee.children[0].geometry;
        //     robotGeometry.scale(0.03, 0.03, 0.03);
        //     self.addPartices(this.children[0].geometry, robotGeometry)

        //     // this.children.forEach(function (child) {
        //     //     let points = new THREE.Points(child.geometry, material)
        //     //     self.scene.add(points);
        //     // })
        // });

        // 茶壶模型在鼠标悬浮时放大，鼠标离开时缩小
        teapot.on("click", function() {
            let tween = new TWEEN.Tween(this.scale).to({
                x: teapot.scale.x * 1.5,
                y: teapot.scale.y * 1.5,
                z: teapot.scale.z * 1.5
            }, 200).easing(TWEEN.Easing.Quadratic.InOut).start();
        });

        // 开启投影
        this.onShadow(bumblebee);
        this.onShadow(teapot);
        // this.onShadow(chahu);
        this.onShadow(monu);
        // 添加至场景
        this.scene.add(bumblebee);
        this.scene.add(teapot);
        // this.scene.add(chahu);
        this.scene.add(monu);
        })
    }

    addObjs(){
        // 加载一个普通的物体
        var cube = new THREE.BoxGeometry(20, 20, 20);
        var material = new THREE.MeshPhongMaterial({
            color: new THREE.Color(0xffffff),
            // 导入纹理贴图
            map: THREE.ImageUtils.loadTexture('./img/crate.jpg')
        });

        this.m_cube = new THREE.Mesh(cube, material);

        this.m_cube.castShadow = true;
        this.scene.add(this.m_cube);
    }

    addObj1(){

        var group = new THREE.Object3D();
        let mat = new THREE.MeshPhongMaterial({
            color: new THREE.Color(0xffffff),
            // 导入纹理贴图
            map: THREE.ImageUtils.loadTexture('img/crate.jpg')
        });

        let radius = 40;
        let m_cube_1;
        for (let deg = 0; deg < 360; deg += 30) {
            // 创建白色方块的mesh
            m_cube_1 = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), mat);
            // 设置它可以产生投影
            m_cube_1.castShadow = true;
            // 设置它可以接收其他物体在其表面的投影
            m_cube_1.receiveShadow = true;
            // 用方块画个圈
            m_cube_1.position.x = radius * Math.cos(Math.PI * deg / 180);
            m_cube_1.position.y = radius * Math.sin(Math.PI * deg / 180);
            // z轴位置错落摆放
            m_cube_1.position.z = deg % 60 ? 5 : -5;
            // 放入容器
            group.add(m_cube_1);
        }

        this.scene.add(group);
    }


    // 循环更新渲染
    update() {
        // var delta = this.clock.getDelta();
        TWEEN.update();
        // this.controls.update(delta);
        this.stats.update();
        let time = Date.now() * 0.005;
        if (this.particleSystem) {
            let bufferObj = this.particleSystem.geometry;
            this.particleSystem.rotation.y = 0.01 * time;
            let sizes = bufferObj.attributes.size.array;
            let len = sizes.length;
            for (let i = 0; i < len; i++) {
                sizes[i] = 1.5 * (2.0 + Math.sin(0.02 * i + time));

            }
            bufferObj.attributes.size.needsUpdate = true;
        }
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => {
            this.update()
        });
    }

    // 自定义模型加载器
    loader(pathArr) {
        // 各类loader实例
        let jsonLoader = new THREE.JSONLoader();
        let fbxLoader = new THREE.FBXLoader();
        let mtlLoader = new THREE.MTLLoader();
        let objLoader = new THREE.OBJLoader();
        let basePath, pathName, pathFomat;
        if (Object.prototype.toString.call(pathArr) !== '[object Array]') {
            pathArr = new Array(1).fill(pathArr.toString());
        }
        let promiseArr = pathArr.map((path) => {
            // 模型基础路径
            basePath = path.substring(0, path.lastIndexOf('/') + 1);
        // 模型名称
        pathName = path.substring(path.lastIndexOf('/') + 1, path.lastIndexOf('.'));
        // 后缀为js或json的文件统一当做js格式处理
        pathName = pathName === 'json' ? 'js' : pathName;
        // 模型格式
        pathFomat = path.substring(path.lastIndexOf('.') + 1).toLowerCase();
        switch (pathFomat) {
            case 'js':
                return new Promise(function(resolve) {
                    jsonLoader.load(path, (geometry, material) => {
                        resolve({
                                    // 对于js文件，加载到的模型与材质分开放置
                                    geometry: geometry,
                                    material: material
                                })
                    });
                });
                break;
            case 'fbx':
                return new Promise(function(resolve) {
                    fbxLoader.load(path, (object) => {
                        resolve(object);
                });
                });
                break;
            case 'obj':
                return new Promise(function(resolve) {
                    objLoader.load(path, (object) => {
                        resolve(object);
                });
                });
                break;
            case 'mtl':
                return new Promise(function(resolve) {
                    mtlLoader.setPath(basePath);
                    mtlLoader.load(pathName + '.mtl', (mtl) => {
                        resolve(mtl);
                });
                });
                break;
            case 'objmtl':
                return new Promise(function(resolve, reject) {
                    mtlLoader.setPath(basePath);
                    mtlLoader.load(`${pathName}.mtl`, (mtl) => {
                        mtl.preload();
                    objLoader.setMaterials(mtl);
                    objLoader.setPath(basePath);
                    objLoader.load(pathName + '.obj', resolve, undefined, reject);
                });
                });
                break;
            default:
                return '';
        }
    });
        return Promise.all(promiseArr);
    }



    // 通过射线的方式来控制物体的动作
    addMouseListener(){

        // 1、鼠标点击位置和canvas内位置的转换
        // 2、向上查找， 直到找到container下的直接子元素
        // 3,对相应物体做相应变换

        THREE.Object3D.prototype.on = function (eventName, touchCallback, notTouchCallback) {
            switch(eventName){
                case 'click':
                    this._click = touchCallback ? touchCallback : undefined;
                    this._clickBack = notTouchCallback ? notTouchCallback : undefined;
                    break;
                case 'hover':
                    this._hover = touchCallback ? touchCallback : undefined;
                    this._hoverBack = notTouchCallback ? notTouchCallback : undefined;
                    break;
                default:;
            }
        }

        // 找到Scene下的直接子元素
        function  parentUtilScene(obj) {
            if(obj.parent.type ==='Scene'){
                return obj;
            }

            while(obj.parent && obj.parent.type !== 'Scene'){
                obj = obj.parent;
            }

            return obj;
        }

        this.container.addEventListener('mousedown', (event) => {
            this.handleRaycasters(event,  (objTarget) => {
                let object = parentUtilScene(objTarget);
                object._click && object._click();

                // 遍历场景中除当前拾取外的其他物体，执行其未被点击到的事件回调
                this.scene.children.forEach((objItem) => {
                        if (objItem !== object) {
                        objItem._clickBack && objItem._clickBack();
                    }
                });
            })
        })

        //
        // this.container.addEventListener('mousemove', (event) => {
        //     this.handleRaycasters(event, (objTarget) => {
        //         let object = parentUtilScene(objTarget);
        //         // 鼠标移动到拾取物体上且未离开时时，仅调用一次其悬浮事件方法
        //         !object._hover_enter && object._hover && object._hover();
        //         object._hover_enter = true;
        //         // 遍历场景中除当前拾取外的其他物体，执行其未被点击到的事件回调
        //         this.scene.children.forEach((objItem) => {
        //                 if (objItem !== object) {
        //                 objItem._hoverBack && objItem._hoverBack();
        //             }
        //         });
        //     })
        // })

    }

    handleRaycasters(event, callback){
        // 建一个二维向量
        let mouse = new THREE.Vector2();
        // 实例化射线小能手
        let raycaster = new THREE.Raycaster();
        // 转换
        mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, this.camera);

        let intersects = raycaster.intersectObjects(this.scene.children, true);

        if(intersects.length > 0){
            callback && callback(intersects[0].object);
        }
    }

    // 几何模型转缓存几何模型
    toBufferGeometry(geometry){
        if(geometry.type === 'BufferGeometry') return geometry
        return new THREE.BufferGeometry().fromGeometry(geometry)
    }

    // 粒子变换
    addPartices(obj1, obj2){
        obj1 = this.toBufferGeometry(obj1)
        obj2 = this.toBufferGeometry(obj2)

        let moreObj = obj1;
        let lessObj = obj2;

        // 找到顶点数量较多的模型
        if(obj2.attributes.position.array.length > obj1.attributes.position.array.length){
            [moreObj, lessObj] = [obj2, obj1]
        }

        let morePos = moreObj.attributes.position.array
        let lessPos = lessObj.attributes.position.array
        let moreLen = morePos.length
        let lessLen = lessPos.length
        // 根据最大的顶点数开辟数组空间，同于存放顶点较少的模型顶点数据
        let position2 = new Float32Array(moreLen)
        // 先把顶点较少的模型顶点坐标放进数组
        position2.set(lessObj)
        // 剩余空间重复赋值
        for(let i = lessLen, j = 0; i < moreLen; i++, j++){
            j = j % lessLen
            position2[i] = lessPos[j]
            // position2[i+1] = lessPos[j+1]
            // position2[i+2] = lessPos[j+2]
        }

        // 控制每个顶多的尺寸， 先设定为4
        let sizes = new Float32Array(moreLen)
        for(let i = 0; i < moreLen.length; i++){
            sizes[i] = 4
        }

        // 挂载属性值 如果这个属性存储一个3个分量的向量(例如位置、法线或颜色)，则itemSize应该是3。
        moreObj.addAttribute('size', new THREE.BufferAttribute(sizes, 1))
        moreObj.addAttribute('position2', new THREE.BufferAttribute(position2, 3))

         // 传递给shader共享的的属性值
        let uniforms = {
            color: {
                type: 'v3',
                value: new THREE.Color(0x1890ff)
            },
            // 顶点切图
            texture: {
                value: this.generateSprite()
            },
            // 传递val值，用于shader计算顶点位置
            val: {
                value: 1.0
            }
        }
        // 着色器材料
        let shaderMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: document.getElementById('vertexshader').textContent,
            fragmentShader: document.getElementById('fragmentshader').textContent,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true
        })

        // 创建粒子系统
        let particleSystem = new THREE.Points(moreObj, shaderMaterial)
        let pos = {
            val: 1
        };
        // 粒子动画
        let tween = new TWEEN.Tween(pos).to({
            val:0
        }, 1500).easing(TWEEN.Easing.Quadratic.InOut).delay(2000).onUpdate(updateCallback).onComplete(completeCallBack.bind(pos, 'go'));
        let tweenBack = new TWEEN.Tween(pos).to({
            val: 1
        }, 1500).easing(TWEEN.Easing.Quadratic.InOut).delay(2000).onUpdate(updateCallback).onComplete(completeCallBack.bind(pos, 'back'));
        tween.chain(tweenBack);
        tweenBack.chain(tween);
        tween.start();

        // 动画持续更新的回调函数
        function updateCallback() {
            particleSystem.material.uniforms.val.value = this.val;
            // 颜色过渡
            if (this.nextcolor) {
                let val = this.order === 'back' ? (1 - this.val) : this.val;
                let uColor = particleSystem.material.uniforms.color.value;
                uColor.r = this.color.r + (this.nextcolor.r - this.color.r) * val;
                uColor.b = this.color.b + (this.nextcolor.b - this.color.b) * val;
                uColor.g = this.color.g + (this.nextcolor.g - this.color.g) * val;
            }
        }
        // 每轮动画完成时的回调函数
        function completeCallBack(order) {
            let uColor = particleSystem.material.uniforms.color.value;
            // 保存动画顺序状态
            this.order = order;
            // 保存旧的粒子颜色
            this.color = {
                r: uColor.r,
                b: uColor.b,
                g: uColor.g
            }
            // 随机生成将要变换后的粒子颜色
            this.nextcolor = {
                r: Math.random(),
                b: Math.random(),
                g: Math.random()
            }
        }

        this.scene.add(particleSystem);
        this.particleSystem = particleSystem;

    }


    getTexture(size){
        let canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        canvas.style.background = 'transparent'
        let context = canvas.getContext('2d')
        let gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, canvas.width / 8, canvas.width / 2, canvas.height / 2, canvas.width / 2);
        gradient.addColorStop(0, '#eee')
        gradient.addColorStop(1, 'transparent');
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2, true);
        context.fill();
        let texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    }
}

new WorldPoint(document.querySelector("#world"));