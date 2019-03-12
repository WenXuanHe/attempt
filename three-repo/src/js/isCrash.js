export const isCrashed = function (sphereR) {
  //获取到底部cube的中心点坐标
  var originPoint = sphereR.position.clone();
  for(var vertexIndex = 0; vertexIndex < sphereR.geometry.vertices.length; vertexIndex++){
      //顶点原始坐标
      var localVertex = sphereR.geometry.vertices[vertexIndex].clone();
      //顶点经过变换后的坐标 =>将物体的本地坐标乘以变换矩阵，得到了这个物体在世界坐标系中的值
      var globaVertex = localVertex.applyMatrix4(sphereR.matrix);
      //获得由中心指向顶点的向量
      var directionVector = globaVertex.sub(sphereR.position);
      //将方向向量初始化
      var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
      //检测射线与多个物体相交的情况
      var collisionResults = ray.intersectObjects([sphereL]);
      //如果返回结果不为空，且交点与射线起点的距离小于物体中心至顶点的距离，则发生碰撞
      if(collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() + 1.2 ){
          return true
      }
  }
  return false
}