import * as THREE from 'three'
import OBJLoader from 'three-obj-loader'

export default (path) => {
  return new Promise(function(resolve) {
    OBJLoader(THREE)(path, (object) => {
      resolve(object);
    });
  });
}