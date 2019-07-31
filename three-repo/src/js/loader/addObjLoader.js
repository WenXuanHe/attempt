const THREE = require('three')
window.THREE = THREE
require("./OBJLoader.js")
let objLoader = new THREE.OBJLoader();
export default (path) => {
  return new Promise(function(resolve) {
    objLoader.load(path, (object) => {
        resolve(object);
    });
  });
}