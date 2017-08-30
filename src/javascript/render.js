var Squares;

function RenderSquares() {
    // Shortext context handle
    var ctx = BackContextHandle;

    // Save context
    ctx.save();

    // Set width and cap style
    ctx.lineWidth = 5;
    ctx.lineCap = "butt";
    ctx.lineJoin = "round";

    // Render the background
    RenderBackground(0,0,0);

    // Convert squares to images
    var images = [];
    $.each(Squares, function (index, square) {
        images.push(SquareToImage(square));
    });

    images.sort(function(a, b) {
        return -(a.d - b.d);
    });
    $.each(images, function (index, image) {
        RenderImage(ctx, image);
    });

    // Revert context
    ctx.restore();
}

function SquareToImage(square) {
    var pi = Math.PI;
    var cx = Camera.x;
    var cy = Camera.y;
    var cr = Camera.r;

    var image = {
        points: [],
        c: square.c,
        d: 0
    };

    $.each(square.points, function (index, point) {
        // X axis rot
        var x1 = point.x;
        var y1 = point.y * Math.cos(cx * pi) - point.z * Math.sin(cx * pi);
        var z1 = point.y * Math.sin(cx * pi) + point.z * Math.cos(cx * pi);

        // Y axis rot
        var x2 = x1 * Math.cos(cy * pi) - z1 * Math.sin(cy * pi);
        var y2 = y1;
        var z2 = x1 * Math.sin(cy * pi) + z1 * Math.cos(cy * pi);

        //Distance
        var fz = (cr - z2);

        // Projection
        image.points[index] = {};
        image.points[index].x = 800 * x2 / fz + CenterX;
        image.points[index].y = 800 * y2 / fz + CenterY;
        image.d += fz;
    });

    return image;
}

function RenderImage(ctx, image) {
    // Set color
    var color = image.c;
    var c;
    if (color !== undefined) {
        c = ctx.fillStyle = "rgb(" + color.R + "," + color.G + "," + color.B + ")";
    } else {
        var R = Math.floor(Math.random() * 256);
        var G = Math.floor(Math.random() * 256);
        var B = Math.floor(Math.random() * 256);
        c = ctx.fillStyle = "rgb(" + R + "," + G + "," + B + ")";
    }

    // Draw from point to point
    var points = image.points;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
    ctx.lineTo(points[2].x, points[2].y);
    ctx.lineTo(points[3].x, points[3].y);
    ctx.closePath();

    //Solid
    ctx.fillStyle = c;
    ctx.fill();

    //Lines
    ctx.strokeStyle = "rgb(255, 255, 255)";
    ctx.stroke();
}
