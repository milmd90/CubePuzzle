// Interface methods
function Init() {
    CameraPos = {x:0, y:0, z:90};
    CameraRot = {x:0, y:0, z:0};
}

function RenderScene() {
    RenderBackground(200, 2, 2);
    RenderCube(-10, -10, 10, -10, 10, 10, -10, 10, 10, {R:255, G:0, B:0});
}
