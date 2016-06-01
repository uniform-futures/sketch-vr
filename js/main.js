const sketchDstH = 1024;
const sketchDstW = 2048;

var cameraInput;

$( document ).ready(function() {
  cameraInput = document.getElementById("file-input");
  cameraInput.addEventListener('change', uploadPic, false);
  window.addEventListener('hashchange', hashChange, false);
});

function hashChange(){
  if (location.hash === '') {
    window.location.href = "/";
  }
}

function uploadPic() {
    $("#fakeLoader").fakeLoader({
        timeToHide:320000,
        zIndex:"999999",
        spinner:"spinner1",
        bgColor:"#fff",
      });

    var img = document.createElement("img");
    img.src = window.URL.createObjectURL(cameraInput.files[0]);
    img.onload = function(){
      var c = document.createElement("canvas")
      c.width = sketchDstW; //Resize
      c.height = sketchDstH; //Resize
      var ctx = c.getContext("2d");
      ctx.drawImage(img, 0, 0, c.width, c.height);
      var imgData = ctx.getImageData(0, 0, c.width, c.height);
      var i;
      for (i = 0; i < imgData.data.length; i += 4) {
        if (between(imgData.data[i], 150, 256) ||
            between(imgData.data[i+1], 90, 256) ||
            between(imgData.data[i+2], 90, 256)){
              imgData.data[i+3] = 0;
            }else{
              imgData.data[i] = 255;
              imgData.data[i+1] = 255;
              imgData.data[i+2] = 255;
            }
      }
      ctx.putImageData(imgData, 0, 0);
      var dataurl = c.toDataURL("image/png");

      $.get("vr.html", function( data ) {
        var vrScene = $(data); //TODO change name of vrScene

        var img = vrScene.find("#vr-sketch")[0];
        img.setAttribute("src", dataurl)
        $("#content-wrapper").replaceWith(vrScene);
        window.location.hash = 'vr';

        // Scene loaded event
        var scene = document.querySelector('a-scene');
        if (scene.hasLoaded) {
          sceneLoaded();
        } else {
          scene.addEventListener('loaded', sceneLoaded);
        }
      });
    }
}
function between(input, min, max){
  if (input > min && input < max){
    return true;
  }
  return false;
}

function sceneLoaded(){
  setTimeout( function(){
    $("#fakeLoader").fadeOut();
  }, 500);
}
