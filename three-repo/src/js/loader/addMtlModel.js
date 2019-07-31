const THREE = require('three')
window.THREE = THREE
require("./MTLLoader.js")
var mtlLoader = new THREE.MTLLoader();

export default (basePath, name) => {
  return new Promise(function(resolve) {
    mtlLoader.setPath(basePath);
    mtlLoader.load(name, function(matl) {
      //do something with matl
      resolve(matl);
    });
  });
}