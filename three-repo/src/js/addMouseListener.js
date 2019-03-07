const THREE = require('three')

export default (scene, renderer, camera, container) => {
  container = container || document.body;
  // 层层往上寻找模型的父级，直至它是场景下的直接子元素
  function parentUtilScene(obj) {
      if (obj.parent.type === 'Scene') return obj;
      while (obj.parent && obj.parent.type !== 'Scene') {
          obj = obj.parent;
      }
      return obj;
  }
  // 发射线
  function handleRaycasters(event, callback) {
    let mouse = new THREE.Vector2();
    let raycaster = new THREE.Raycaster();
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(scene.children, true)
    if (intersects.length > 0) {
        callback && callback(intersects[0].object);
    }
  }
  // canvas容器内鼠标点击事件添加
  container.addEventListener("mousedown", (event) => {
      handleRaycasters(event, (objTarget) => {
          // 寻找其对应父级为场景下的直接子元素
          let object = parentUtilScene(objTarget);
          // 调用拾取到的物体的点击事件
          object._click && object._click(event);
          // 遍历场景中除当前拾取外的其他物体，执行其未被点击到的事件回调
          scene.children.forEach((objItem) => {
                  if (objItem !== object) {
                  objItem._clickBack && objItem._clickBack();
              }
          });
      });
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

  return () => {
    return Promise.resolve();
  }
}