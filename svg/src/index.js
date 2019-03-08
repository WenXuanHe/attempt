import anime from 'animejs'

var path = anime.path('#root path');
var updates = 0;
var canPlay = false;

let translateX = path('x')
let translateY = path('y')
translateX.svg.viewBox = translateX.svg.viewBox.map(item => item*2)
translateY.svg.viewBox = translateY.svg.viewBox.map(item => item*2)
var animation = anime({
  targets: '#root .el',
  translateX: translateX,
  translateY: translateY,
  rotate: path('angle'),
  easing: 'linear',
  duration: 20000,
  // autoplay: false,
  update: function(anim) {
    updates++;
    console.log('progress : '+Math.round(anim.progress)+'%', 'updates : '+updates);
    if([8, 30, 45, 60].indexOf(Math.round(anim.progress)) > -1 && !canPlay){
      anim.pause()
      canPlay = false;
    }
  }
});
document.querySelector("#root .el").addEventListener('click', function(){
  if(animation.paused){
    animation.play();
    canPlay = true;
  }
})
// var seekProgressEl = document.querySelector('.progress');
// seekProgressEl.oninput = function() {
//   console.log(animation.duration * (seekProgressEl.value / 100));
//   animation.seek(animation.duration * (seekProgressEl.value / 100));
// };