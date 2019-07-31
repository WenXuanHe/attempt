const THREE = require('three')
window.THREE = THREE
require("./MTLLoader.js")
require("./OBJLoader.js")
const objLoader = new THREE.OBJLoader();
const mtlLoader = new THREE.MTLLoader();
export default (basePath, mtlName, objName) => {
    return new Promise(function(resolve, reject) {
        mtlLoader.setPath(basePath);
        mtlLoader.load(`${mtlName}.mtl`, (mtl) => {
          mtl.preload();
          objLoader.setMaterials(mtl);
          objLoader.setPath(basePath);
          objLoader.load(objName + '.obj', resolve, undefined, reject);
      });
  });
}