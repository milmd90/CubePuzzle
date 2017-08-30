// Global canvas dimensions
var CanvasWidth;
var CanvasHeight;
var CenterX;
var CenterY;

// Global canvas and graphics handles
var CanvasHandle = null;
var ContextHandle = null;
var BackCanvasHandle = null;
var BackContextHandle = null;

//
function Init() {
    // Get context handles
    CanvasHandle = document.getElementById("canvas");
    ContextHandle = CanvasHandle.getContext("2d");
    CanvasWidth = ContextHandle.canvas.clientWidth;
    CanvasHeight = ContextHandle.canvas.clientHeight;

    // Create an image backbuffer
    BackCanvasHandle = document.createElement("canvas");
    BackContextHandle = BackCanvasHandle.getContext("2d");
    BackCanvasHandle.width = CanvasWidth;
    BackCanvasHandle.height = CanvasHeight;

    // Set line style
    BackContextHandle.lineCap = "butt";
    BackContextHandle.lineJoin = "round";
    BackContextHandle.strokeStyle = "rgb(255, 255, 255)";

    // Get the canvas center
    CenterX = CanvasWidth / 2;
    CenterY = CanvasHeight / 2;
    Camera = {x:0, y:0, r:10};
}

// UpdateRender results
function UpdateRender()
{
    // Set background
    BackContextHandle.fillRect(0, 0, CanvasWidth, CanvasHeight);

    // RenderSquares
    RenderSquares();

    // Swap the backbuffer with the frontbuffer
    var ImageData = BackContextHandle.getImageData(0, 0, CanvasWidth, CanvasHeight);
    ContextHandle.putImageData(ImageData, 0, 0);
}
