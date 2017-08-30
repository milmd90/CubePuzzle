var Squares = [];

// Interface methods
function Init() {
    Camera = {x:0, y:0, r:10};

    // Convert blocks to squares
    $.each(Blocks, function (index, block) {
        var newSquares = BlockToSquares(block);
        Squares.push.apply(Squares, newSquares);
    });
    Squares.sort(SquareSort);
    console.log("Squares", Squares);

}

function RenderScene() {
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
    $.each(Squares, function (index, square) {
        RenderImage(ctx, SquareToImage(square));
    });

    // Revert context
    ctx.restore();
}

function BlockToSquares(block) {
    var size = 1;

    //Size cube
    var SizedVertex = [];
    $.each(CubeVertex, function(index, vertex) {
        var newVertex = {
            x: vertex.x * size + block.x,
            y: vertex.y * size + block.y,
            z: vertex.z * size + block.z,
        };
        SizedVertex[index] = newVertex;
    });

    //
    var squares = [];
    $.each(CubeFaces, function(index, face) {
        squares[index] = {
            points: [],
            c: block.c,
        };
        squares[index].points[0] = SizedVertex[face.a];
        squares[index].points[1] = SizedVertex[face.b];
        squares[index].points[2] = SizedVertex[face.c];
        squares[index].points[3] = SizedVertex[face.d];
    });

    return squares;
}

function SquareToImage(square) {
    var pi = Math.PI;
    var crx = Camera.x;
    var cry = Camera.y;
    var cpr = Camera.r;

    var image = {
        points: [],
        c: square.c,
    };

    $.each(square.points, function (index, point) {
        // X axis rot
        var px1 = point.x;
        var py1 = point.y * Math.cos(crx * pi) - point.z * Math.sin(crx * pi);
        var pz1 = point.y * Math.sin(crx * pi) + point.z * Math.cos(crx * pi);

        // Y axis rot
        var px2 = px1 * Math.cos(cry * pi) - pz1 * Math.sin(cry * pi);
        var py2 = py1;
        var pz2 = px1 * Math.sin(cry * pi) + pz1 * Math.cos(cry * pi);

        //Distance
        var fz = (cpr - pz2);

        // Projection
        image.points[index] = {};
        image.points[index].x = 800 * px2 / fz + CenterX;
        image.points[index].y = 800 * py2 / fz + CenterY;
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

function SquareSort(a, b) {
    // // X axis rot
    // var px1 = point.x;
    // var py1 = point.y * Math.cos(crx * pi) - point.z * Math.sin(crx * pi);
    // var pz1 = point.y * Math.sin(crx * pi) + point.z * Math.cos(crx * pi);
    //
    // // Y axis rot
    // var px2 = px1 * Math.cos(cry * pi) - pz1 * Math.sin(cry * pi);
    // var py2 = py1;
    // var pz2 = px1 * Math.sin(cry * pi) + pz1 * Math.cos(cry * pi);

    var camx = Camera.x;
    var camy = Camera.y;
    var camz = Camera.r;

    //Calc first square
    var x = 0;
    var y = 0;
    var z = 0;
    $.each(a.points, function (i, point) {
        x += point.x;
        y += point.y;
        z += point.z;
    });
    var f = Math.sqrt(
        Math.pow(x/4 - camx, 2) +
        Math.pow(y/4 - camy, 2) +
        Math.pow(z/4 - camz, 2));

    //Calc second square
    x = 0;
    y = 0;
    z = 0;
    $.each(b.points, function (i, point) {
        x += point.x;
        y += point.y;
        z += point.z;
    });
    var s = Math.sqrt(
        Math.pow(x/4 - camx, 2) +
        Math.pow(y/4 - camy, 2) +
        Math.pow(z/4 - camz, 2));

    return -(f - s);
}
