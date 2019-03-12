import anime from 'animejs'

var path = anime.path('#root path');
var updates = 0;
var canPlay = false;

let translateX = path('x')
let translateY = path('y')
let rate = window.outerWidth / 750
translateX.svg.viewBox = translateX.svg.viewBox.map(item => (item / rate) + 5)
translateY.svg.viewBox = translateY.svg.viewBox.map(item => (item / rate) + 5)
var animation = anime({
  targets: '#root .el',
  translateX: translateX,
  translateY: translateY,
  rotate: path('angle'),
  easing: 'linear',
  duration: 50000,
  // autoplay: false,
  update: function(anim) {

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