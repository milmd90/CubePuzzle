$( document ).ready(function() {
    var $window = $( window );
    var $body = $('body');
    var $menu = $('.menu');
    var $canvas = $('#canvas');

    $body.on('keydown keyup',function(e){
        if (e.type==="keydown") {
            if (e.which===38) {
                Camera.r -= 1;
                UpdateRender();
            } else if (e.which===40) {
                Camera.r += 1;
                UpdateRender();
            }
        }
    });

    $canvas
        .mousedown(function(e) {
            var init_x = e.pageX;
            var init_y = e.pageY;
            var c_x = Camera.x;
            var c_y = Camera.y;

            $window.mousemove(function(e) {
                Camera.y = c_y + (init_x - e.pageX)/1000;
                Camera.x = c_x + (init_y - e.pageY)/1000;
                UpdateRender();
            });

            return false;
        })
        .mouseup(function() {
            $window.unbind("mousemove");
            return false;
        });

    Init();
    FindSolutions();
    UpdateRender();
});
