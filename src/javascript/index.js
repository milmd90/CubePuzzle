$( document ).ready(function() {
    var $window = $( window );
    var $body = $('body');
    var $menu = $('.menu');
    var $canvas = $('#canvas');

    $body.on('keydown keyup',function(e){
        if (e.type==="keydown") {
            if (e.which===38) {
                Camera.r -= 1;
            } else if (e.which===40) {
                Camera.r += 1;
            }
        }
    });

    $canvas
        .mousedown(function(e) {
            var init_x = e.pageX;
            var init_y = e.pageY;

            $window.mousemove(function(e) {
                Camera.y += (e.pageX - init_x)/10000;
                Camera.x += (e.pageY - init_y)/10000;
            });

            return false;
        })
        .mouseup(function() {
            $window.unbind("mousemove");
            return false;
        });

    CreateSolution();

    Main();
});
