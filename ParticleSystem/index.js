class ThreeWorld {
    constructor(canvasContainer) {
        this.container = canvasContainer || document.body;

        this.createScene();

        this.createLights();

        this.initStats();

        this.addObjs();

        // 轨道控制插件（鼠标拖拽视角、缩放等）
        this.orbitControls = new THREE.OrbitControls(this.camera);
        this.orbitControls.autoRotate = true;
        // 循环更新渲染场景
        this.update();

    }

    createScene() {
        this.height = window.innerHeight;
        this.width = window.innerWidth;
        // 场景
        this.scene = new THREE.Scene();
        // 在场景中添加雾的效果，参数分别代表‘雾的颜色’、‘开始雾化的视线距离’、刚好雾化至看不见的视线距离’
        this.scene.fog = new THREE.Flg();
        // 创建相机
        let aspectRatio = this.WIDTH / this.HEIGHT;
        let fieldOfView = 60;
        let nearPlane = 1;
        let farPlane = 10000;
        // 透视相机
        this.camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane)
        // 设置相机的位置
        this.camera.position.x = 0;
        this.camera.position.z = 150;
        this.camera.position.y = 0;
        // 渲染器
        this.renderer = new THREE.WebGLRenderer({
            // 在 css 中设置背景色透明显示渐变色
            alpha: true,
            // 开启抗锯齿
            antialias: true
        });
        this.renderer.setClearColor(this.scene.fog.color);
        this.renderer.setSize(this.width, this.height);

        this.renderer.shadowMap.enabled = true;

        // this.renderer.shadowMapSoft = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        // 在 HTML 创建的容器中添加渲染器的 DOM 元素
        this.container.appendChild(this.renderer.domElement);
        // 监听屏幕，缩放屏幕更新相机和渲染器的尺寸
        window.addEventListener('resize', this.handleWindowResize.bind(this), false);

    }

    createLights() {

        // 户外光源
        // 第一个参数是天空的颜色，第二个参数是地上的颜色，第三个参数是光源的强度
        this.hemisphereLight = new THREE.HemisphereLight(0xaaaaaa, 0x000000, .9);

        // 环境光源
        this.ambientLight = new THREE.AmbientLight(0xdc8874, .2);

        // 方向光是从一个特定的方向的照射
        // 类似太阳，即所有光源是平行的
        // 第一个参数是关系颜色，第二个参数是光源强度
        this.shadowLight = new THREE.DirectionalLight(0xffffff, .9);

        // 设置光源的位置方向
        this.shadowLight.position.set(50, 50, 50);

        // 开启光源投影
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

        // 为了使这些光源呈现效果，需要将它们添加到场景中
        this.scene.add(this.hemisphereLight);
        this.scene.add(this.shadowLight);
        this.scene.add(this.ambientLight);

    }

    // 循环更新渲染
    update() {
        // 动画插件
        TWEEN.update();
        // 性能监测插件
        this.stats.update();
        // 渲染器执行渲染
        this.renderer.render(this.scene, this.camera);
        // 循环调用
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


    // 物体添加
    addObjs(){
        let cube = new THREE.BoxGeometry(20, 20, 20);
        // 使用Phong网孔材料
        let mat = new THREE.MeshPhongMaterial({
            color: new THREE.Color(0xffffff),
            // 导入纹理贴图
            map: THREE.ImageUtils.loadTexture('img/crate.jpg')
        });
        let m_cube = new THREE.Mesh(cube, mat);
        m_cube.castShadow = true;

        // 创建一个3D物体组合容器
        let group = new THREE.Object3D();
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

        this.scene.add(m_cube);
        this.scene.add(m_cube_1);
    }

    initStats() {
        this.stats = new Stats();
        // 将性能监控屏区显示在左上角
        this.stats.domElement.style.position = 'absolute';
        this.stats.domElement.style.bottom = '0px';
        this.stats.domElement.style.zIndex = 100;
        this.container.appendChild(this.stats.domElement);
    }


    handleWindowResize() {
        // 更新渲染器的高度和宽度以及相机的纵横比
        this.HEIGHT = window.innerHeight;
        this.WIDTH = window.innerWidth;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
    }

    addMouseListener() {
        // 层层往上寻找模型的父级，直至它是场景下的直接子元素
        function parentUtilScene(obj) {
            if (obj.parent.type === 'Scene') return obj;
            while (obj.parent && obj.parent.type !== 'Scene') {
                obj = obj.parent;
            }
            return obj;
        }
        // canvas容器内鼠标点击事件添加
        this.container.addEventListener("mousedown", (event) => {
            this.handleRaycasters(event, (objTarget) => {
            // 寻找其对应父级为场景下的直接子元素
            let object = parentUtilScene(objTarget);
        // 调用拾取到的物体的点击事件
        object._click && object._click(event);
        // 遍历场景中除当前拾取外的其他物体，执行其未被点击到的事件回调
        this.scene.children.forEach((objItem) => {
            if (objItem !== object) {
            objItem._clickBack && objItem._clickBack();
        }
    });
    });
    });
        // canvas容器内鼠标移动事件添加
        this.container.addEventListener("mousemove", (event) => {
            this.handleRaycasters(event, (objTarget) => {
            // 寻找其对应父级为场景下的直接子元素
            let object = parentUtilScene(objTarget);
        // 鼠标移动到拾取物体上且未离开时时，仅调用一次其悬浮事件方法
        !object._hover_enter && object._hover && object._hover(event);
        object._hover_enter = true;
        // 遍历场景中除当前拾取外的其他物体，执行其未有鼠标悬浮的事件回调
        this.scene.children.forEach((objItem) => {
            if (objItem !== object) {
            objItem._hover_enter && objItem._hoverBack && objItem._hoverBack();
            objItem._hover_enter = false;
        }
    });
    })
    });
        // 为所有3D物体添加上“on”方法，可监听物体的“click”、“hover”事件
        THREE.Object3D.prototype.on = function(eventName, touchCallback, notTouchCallback) {
            switch (eventName) {
                case "click":
                    this._click = touchCallback ? touchCallback : undefined;
                    this._clickBack = notTouchCallback ? notTouchCallback : undefined;
                    break;
                case "hover":
                    this._hover = touchCallback ? touchCallback : undefined;
                    this._hoverBack = notTouchCallback ? notTouchCallback : undefined;
                    break;
                default:;
            }
        }
    }
// 射线处理
    handleRaycasters(event, callback) {
        let mouse = new THREE.Vector2();
        let raycaster = new THREE.Raycaster();
        mouse.x = (event.clientX / this.renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / this.renderer.domElement.clientHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, this.camera);
        let intersects = raycaster.intersectObjects(this.scene.children, true)
        if (intersects.length > 0) {
            callback && callback(intersec

            ts[0].object);
        }
    }

}