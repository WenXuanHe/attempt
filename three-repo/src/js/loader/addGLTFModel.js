import GLTFLoader from 'three-gltf-loader';
const  gltfLoader = new GLTFLoader();

export default (url) => {
  return new Promise((resolve, reject) => {
    gltfLoader.load(url, (gltf) => {
      resolve(gltf)
    }, ( xhr ) => {
      // called while loading is progressing
      console.log( `${( xhr.loaded / xhr.total * 100 )}% loaded` );
    },
    ( error ) => {
        // called when loading has errors
        console.error( 'An error happened', error );
        reject(error)
    })
  })
}