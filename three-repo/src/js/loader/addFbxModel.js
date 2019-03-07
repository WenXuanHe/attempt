var FBXLoader = require('three-fbx-loader');
var loader = new FBXLoader();
// 加载器有问题
export default (path) => {
  return new Promise(function(resolve) {
    loader.load(path, (object) => {
      resolve(object);
    });
  });
}