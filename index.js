(function(window) {
  "use strict";

  const gatoBody = document.querySelector(".gato-body");
  const gatoEyeFrame = document.querySelector(".gato-eye-frame");
  const gatoEyeLeft = document.querySelector(".gato-eye-left");
  const leftEyeIrisWhite = document.querySelector(".left-iris-white");
  const rightEyeIrisWhite = document.querySelector(".right-iris-white");
  const gatoEyeRight = document.querySelector(".gato-eye-right");
  const gatoEyeBackground = document.querySelector(".gato-eye-background");
  const gato = document.querySelector(".gato");

  function move(element, x, y) {
    element.style.top = y + "rem";
    element.style.left = x + "rem";
  }

  function initGato() {
    move(gatoEyeLeft, 5.6, 6.6);
    move(gatoEyeRight, 13.8, 6.6);
    move(gatoEyeFrame, 3, 5);
    move(gatoEyeBackground, 4, 6);
    move(leftEyeIrisWhite, 7, 7.5);
    move(rightEyeIrisWhite, 15.5, 7.5);
  }

  initGato();

  // helper function to position objects
  //   document.body.addEventListener("mousemove", e => {
  //     const x = e.clientX / 16;
  //     const y = e.clientY / 16;
  //     console.log(`${x} ${y}`);
  //     move(gatoEyeRight, x, y);
  //   });

  let eyeX = -1;
  let timeStamp = 0;
  function animate(dt) {
    let ellapsed = dt - timeStamp;

    timeStamp = dt;
    eyeX = eyeX + ellapsed / 1000;
    if (eyeX > 1) eyeX = -1;

    move(gatoEyeLeft, Math.abs(eyeX) + 5, 6.6);
    move(gatoEyeRight, Math.abs(eyeX) + 13, 6.6);
    window.requestAnimationFrame(animate);
  }

  animate(0);
})(window);
