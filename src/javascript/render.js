// Interface methods
function Init() {
    Camera = {x:0, y:0, r:10};
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

    // Convert Objects to blocks
    var blocks = []
    $.each(Objects, function (index, object) {
        var newBlocks = ObjectToBlocks(object);
        blocks.push.apply(blocks, newBlocks);
    });

    // Convert blocks to squares
    var squares = [];
    $.each(blocks, function (index, block) {
        var newSquares = BlockToSquares(block);
        squares.push.apply(squares, newSquares);
    });

    //Sort squares by distance
    //TODO

    // Convert squares to images
    $.each(squares, function (index, square) {
        $.each(square.points, function (index, point) {
        });
        RenderImage(ctx, SquareToImage(square));
    });

    // Revert context
    ctx.restore();
}

function ObjectToBlocks(object) {
    return [object];
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
    var pi = Math.PI;
    var crx = Camera.x;
    var cry = Camera.y;
    var cpr = Camera.r;

    var image = {
        points: [],
        color: square.color,
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
    var color = image.color;
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
    // ctx.fillStyle = c;
    // ctx.fill();

    //Lines
    ctx.strokeStyle = c;
    ctx.stroke();
}
