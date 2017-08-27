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

    // Call the custom init function
    Init();

    // Start the render cycle
    RenderLoop();
}

//
function RenderLoop()
{
    // Start timing this render cycle
    var StartTime = new Date();

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

    // End time
    var EndTime = new Date();

    // Measure the difference
    // Note that "value of" returns millis, we divide back into seconds
    var TimeElapsed = (EndTime.valueOf() - StartTime.valueOf()) / 1000;
    var SleepTime = TargetFrameTime - TimeElapsed;

    // If target sleep time is negative, simply don't sleep
    // This is in cases where we take longer than intended to render a scene
    if (SleepTime < 0)
        SleepTime = 0;

    // Calculate the cycle time of how long it took to execute this frame
    var CycleTime = TimeElapsed + SleepTime;

    // Calculate FPS when needed
    FrameRateTime += CycleTime;
    if (FrameRateTime >= FrameRateRefresh)
    {
        // Post FPS
        var FPS = FrameRateCount / FrameRateRefresh;
        document.getElementById("FPSTextBox").innerHTML = FPS + " / " + (1 / TargetFrameTime);

        // Reset time and frame count
        FrameRateTime = 0;
        FrameRateCount = 0;
    }

    // Grow frame count
    FrameRateCount++;

    // Callback to self after sleep-off time
    // Note that we convert back to seconds and then set this sleeping function
    TotalTime += CycleTime;
    // timer = setTimeout(RenderLoop, SleepTime * 1000);
}

//
function RenderBackground(r, g, b) {
    BackContextHandle.fillRect(0, 0, CanvasWidth, CanvasHeight);
}
