// Global timer used for animations; grows over time
// Measured as fractions of seconds
var TotalTime = 0.0;

// Camera parameters
var Camera = {x: 0, y: 0, z:0};
var RatioConst = 800;//320

// Target frames per second, measured in fractions of seconds
var TargetFrameTime = 1.0 / 60.0;

// Global canvas width and heights
var CanvasWidth;
var CanvasHeight;

// Global screen centers
var CenterX;
var CenterY;

// FPS counter, refresh rate, and internal timer
var FrameRateTime = 0;        // Seconds elapsed since last FPS post
var FrameRateCount = 0;       // Number of frames since last FPS post
var FrameRateRefresh = 1;     // Time interval between each FPS post

// Global canvas and graphics handle
var CanvasHandle = null;
var ContextHandle = null;

// Backbuffer canvas handle
var BackCanvasHandle = null;
var BackContextHandle = null;

//
function Main() {
    // Get context handles
    CanvasHandle = document.getElementById("canvas");
    ContextHandle = CanvasHandle.getContext("2d");

    // Get the canvas size
    CanvasWidth = ContextHandle.canvas.clientWidth;
    CanvasHeight = ContextHandle.canvas.clientHeight;

    // Get the canvas center
    CenterX = CanvasWidth / 2;
    CenterY = CanvasHeight / 2;

    // Create an image backbuffer
    BackCanvasHandle = document.createElement("canvas");
    BackCanvasHandle.width = CanvasWidth;
    BackCanvasHandle.height = CanvasHeight;
    BackContextHandle = BackCanvasHandle.getContext("2d");

    // Init and render
    Init();
    Render();
}

// Render results
function Render()
{
    // Clear backbuffer
    BackContextHandle.clearRect(0, 0, CanvasWidth, CanvasHeight);

    // Save context state
    BackContextHandle.save();

    // Render the scene
    RenderScene(BackContextHandle);

    // Restore the context state
    BackContextHandle.restore();

    // Swap the backbuffer with the frontbuffer
    // We take the contents of the backbuffer and draw onto the front buffer
    var ImageData = BackContextHandle.getImageData(0, 0, CanvasWidth, CanvasHeight);
    ContextHandle.putImageData(ImageData, 0, 0);
}

//
function RenderBackground(r, g, b) {
    BackContextHandle.fillRect(0, 0, CanvasWidth, CanvasHeight);
}
