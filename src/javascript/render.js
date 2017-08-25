function RenderCube(x1, y1, x2, y2, x3, y3, x4, y4, width, color) {
    // Shortext context handle
    var ctx = BackContextHandle;

    // Save context
    ctx.save();

    // Set width and cap style
    ctx.lineWidth = width;
    ctx.lineCap = "butt";
    ctx.lineJoin = "round";

    // Set color
    if (color !== undefined) {
        ctx.fillStyle = "rgb(" + color.R + "," + color.G + "," + color.B + ")";
    } else {
        ctx.fillStyle = "rgb(0, 0, 0)";
    }

    // Draw from point to point
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.lineTo(x4, y4);
    ctx.closePath();
    ctx.fill();

    // Revert context
    ctx.restore();
}
