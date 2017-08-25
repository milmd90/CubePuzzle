var CubeVertex =
[
    {x:0, y:0, z:0},
    {x:0, y:0, z:1},
    {x:0, y:1, z:0},
    {x:0, y:1, z:1},
    {x:1, y:0, z:0},
    {x:1, y:0, z:1},
    {x:1, y:1, z:0},
    {x:1, y:1, z:1}
];

var CubeFaces =
[
    {a:0, b:1, c:2, i:0},
    {a:1, b:2, c:3, i:0},
    {a:4, b:5, c:6, i:1},
    {a:5, b:6, c:7, i:1},
    {a:0, b:1, c:5, i:2},
    {a:0, b:4, c:5, i:2},
    {a:2, b:3, c:7, i:3},
    {a:2, b:6, c:7, i:3},
    {a:1, b:3, c:7, i:4},
    {a:1, b:5, c:7, i:4},
    {a:0, b:2, c:6, i:5},
    {a:0, b:4, c:6, i:5}
];
