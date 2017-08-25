var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel"; //FF doesn't recognize mousewheel as of FF3.x

$( document ).ready(function() {
    var window = $( window );
    var $body = $('body');
    var $menu = $('.menu');
    var $canvas = $('#canvas');

    $body.on('keydown keyup',function(e){
        if (e.type==="keydown") {
            if (e.which===38) {
                CameraPos.z -= 1;
            } else if (e.which===40) {
                CameraPos.z += 1;
            }
        }
    });

    $canvas
        .mousedown(function(e) {
            var init_x = e.pageX;
            var init_y = e.pageY;

            $window.mousemove(function(e) {
                CameraChange.x = e.pageY - init_y;
                CameraChange.y = e.pageX - init_x;
            });

            return false;
        })
        .mouseup(function() {
            $window.unbind("mousemove");
            CameraChange.x = 0;
            CameraChange.y = 0;
            return false;
        });

    $canvas.bind(mousewheelevt, function(e){
        var evt = window.event || e; //equalize event object
        evt = evt.originalEvent ? evt.originalEvent : evt; //convert to originalEvent if possible
        var delta = evt.detail ? evt.detail*(-40) : evt.wheelDelta; //check for detail first, because it is used by Opera and FF
        if (delta > 1) {
            CameraPos.z -= 3;
        } else {
            CameraPos.z += 3;
        }
    });

    Main();
});

// Animation action
function cameraRotate(v){
    var pi = Math.PI;
    var cosX = Math.cos(CameraRot.x * pi);
    var cosY = Math.cos(CameraRot.y * pi);
    var cosZ = Math.cos(CameraRot.z * pi);
    var sinX = Math.sin(CameraRot.x * pi);
    var sinY = Math.sin(CameraRot.y * pi);
    var sinZ = Math.sin(CameraRot.z * pi);

    var Temp = v.z;
    v.z = -v.x * sinY - v.z * cosY;
    v.x = -v.x * cosY + Temp * sinY;

    Temp = v.z;
    v.z = -v.y * sinX + v.z * cosX;
    v.y = v.y * cosX + Temp * sinX;

    Temp = v.x;
    v.x = v.x * cosZ - v.y * sinZ;
    v.y = v.y * cosZ + Temp * sinZ;

    // Apply camera translation
    v.x -= CameraPos.x;
    v.y -= CameraPos.y;
    v.z -= CameraPos.z;
    return v;
}
