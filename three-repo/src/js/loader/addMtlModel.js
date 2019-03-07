var MTLLoader = require('three-mtl-loader');
var mtlLoader = new MTLLoader();

export default (basePath, name) => {
  return new Promise(function(resolve) {
    mtlLoader.setBaseUrl(basePath);
    mtlLoader.load(name, function(matl) {
      //do something with matl
      resolve(matl);
    });
  });
}