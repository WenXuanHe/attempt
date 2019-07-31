import objMtlLoader from './js/loader/addObjMtlLoader'

class Motor {

  constructor(){
    super();
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

  wheel(){

  }
}