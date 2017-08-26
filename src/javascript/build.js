// Interface methods
function Init() {
    CameraPos = {x:0, y:0, z:100};
    CameraRot = {x:0, y:0, z:0};
}

function RenderScene() {
    // Shortext context handle
    var ctx = BackContextHandle;

    // Save context
    ctx.save();

    // Set width and cap style
    ctx.lineWidth = 1;
    ctx.lineCap = "butt";
    ctx.lineJoin = "round";

    // Render the background
    RenderBackground(0,0,0);

    //
    var squares = [];
    $.each(Objects, function (index, block) {
        var newSquares = BlockToSquares(block);
        console.log(newSquares.length);
        squares.push.apply(squares, newSquares);
    });

    //Sort squares by distance
    //TODO

    //
    $.each(squares, function (index, square) {
        RenderImage(ctx, SquareToImage(square));
    });

    // Revert context
    ctx.restore();
}

function BlockToSquares(block) {
    var size = 100;

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
    var Squares = [];
    $.each(CubeFaces, function(index, face) {
        Squares[index] = {
            points: [],
            color: block.color,
        };
        Squares[index].points[0] = SizedVertex[face.a];
        Squares[index].points[1] = SizedVertex[face.b];
        Squares[index].points[2] = SizedVertex[face.c];
        Squares[index].points[3] = SizedVertex[face.d];
    });

    return Squares;
}

function SquareToImage(square) {
    var cpx = CameraPos.x;
    var cpy = CameraPos.y;
    var cpz = CameraPos.z;


    var image = {
        points: [],
        color: square.color,
    };
    $.each(square.points, function (index, point) {
    console.log(" x: "+point.x+" y: "+point.y+" z: "+point.z);
        image.points[index] = {};
        image.points[index].x = (point.x - cpx) / (point.z - cpz);
        image.points[index].y = (point.y - cpy) / (point.z - cpz);
    });
    return image;
}

function RenderImage(ctx, image) {
    //
    var color = image.color;
    var points = image.points;

    // Set color
    if (color !== undefined) {
        ctx.fillStyle = "rgb(" + color.R + "," + color.G + "," + color.B + ")";
    } else {
        var R = Math.floor(Math.random() * 256);
        var G = Math.floor(Math.random() * 256);
        var B = Math.floor(Math.random() * 256);
        ctx.fillStyle = "rgb(" + R + "," + G + "," + B + ")";
    }

    // Draw from point to point
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
    ctx.lineTo(points[2].x, points[2].y);
    ctx.lineTo(points[3].x, points[3].y);
    ctx.closePath();
    ctx.fill();
}
