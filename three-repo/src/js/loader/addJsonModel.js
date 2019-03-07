var THREE = require("three");
var loader = require("three-json-loader")(THREE);

export default (path) => {
  return new Promise((resolve) => {
    loader(path, (mesh) => {
      resolve(mesh)
    })
  })
}