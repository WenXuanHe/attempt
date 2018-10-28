// 粒子系统代码

// 创建球体模型
let ball = new THREE.SphereGeometry(40, 30, 30);

// 创建粒子材质
let pMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 2
});

// 创建粒子系统
let particleSystem = new THREE.ParticleSystem(ball, pMaterial);

this.scene.add(particleSystem);

// 粒子系统读取vertices属性， 即所有的顶点信息， 结合粒子材质来创建粒子效果


// 粒子的变换

// gpu渲染 -》shader程序编写

