function FindSolutions() {
    var taken = [];
    for (var x = 0; x <= size; x++) {
        taken[x] = [];
        for (var y = 0; y <= size; y++) {
            taken[x][y] = [];
            for (var z = 0; z <= size; z++) {
                taken[x][y][z] = false;
            }
        }
    }

    FindValid(0, StartLocation, taken);
}

function FindValid(index, loc, taken) {
    var piece = Puzzle[index];
    console.log("FindValid "+index);
    console.log("piece "+JSON.stringify(piece));
    console.log("location "+JSON.stringify(loc));

    // For each of four possible rotations
    for (var r = 0; r < 4; r++) {
        console.log("Rotation "+r);

        //Rotate
        var rot = {};
        var sx = piece.s.x;
        var sy = piece.s.y;
        var px = piece.p.x;
        var py = piece.p.y;
        var dx = piece.d.x;
        var dy = piece.d.y;
        var t;
        for (var i = 0; i < r; i++) {
            // Rotate blocks
            t = sx;
            sx = sy;
            sy = neg(t);

            // Rotate next location
            t = px;
            px = py;
            py = neg(t);

            // Rotate next direction
            t = dx;
            dx = dy;
            dy = neg(t);
        }
        rot.s = {x:sx, y:sy, z:piece.s.z};
        rot.p = {x:px, y:py, z:piece.p.z};
        rot.d = {x:dx, y:dy, z:piece.d.z};

        //Face correct direction
        console.log("Direction");
        var rot2 = {};
        if (rot.d.x == 1){
            rot2.s = {x:rot.s.z, y:rot.s.y, z:neg(rot.s.x)};
            rot2.p = {x:rot.p.z, y:rot.p.y, z:neg(rot.p.x)};
        } else if (rot.d.x == -1) {
            rot2.s = {x:neg(rot.s.z), y:rot.s.y, z:rot.s.x};
            rot2.p = {x:neg(rot.p.z), y:rot.p.y, z:rot.p.x};
        } else if (rot.d.y == 1) {
            rot2.s = {x:rot.s.x, y:rot.s.z, z:neg(rot.s.y)};
            rot2.p = {x:rot.p.x, y:rot.p.z, z:neg(rot.p.y)};
        } else if (rot.d.y == -1) {
            rot2.s = {x:rot.s.x, y:neg(rot.s.z), z:rot.s.y};
            rot2.p = {x:rot.p.x, y:neg(rot.p.z), z:rot.p.y};
        } else if (rot.d.z == 1) {
            rot2.s = {x:rot.s.x, y:rot.s.y, z:rot.s.z};
            rot2.p = {x:rot.p.x, y:rot.p.y, z:rot.p.z};
        } else if (rot.d.z == -1) {
            rot2.s = {x:neg(rot.s.x), y:neg(rot.s.y), z:rot.s.z};
            rot2.p = {x:neg(rot.p.x), y:neg(rot.p.y), z:rot.p.z};
        }

        //Translate
        console.log("Translate");
        var tran = {
            s:{},
            p:{},
        };
        tran.s.x = rot2.s.x.map(function(val) {
            return val + loc.x;
        });
        tran.s.y = rot2.s.y.map(function(val) {
            return val + loc.y;
        });
        tran.s.z = rot2.s.z.map(function(val) {
            return val + loc.z;
        });
        tran.p = {
            x: loc.x + rot2.p.x,
            y: loc.y + rot2.p.y,
            z: loc.z + rot2.p.z,
        };

        // For each block in piece
        var valid = true;
        var newTaken = taken.map(function(y) {
            return y.map(function(z) {
                return z.slice();
            });
        });
        console.log("Checking");
        $.each(tran.s.x, function (i, x) {
            $.each(tran.s.y, function (j, y) {
                $.each(tran.s.z, function (k, z) {
                    if (taken[x][y][z]) {
                        valid = false;;
                    } else {
                        newTaken[x][y][z] = piece.c;
                    }
                });
            });
        });

        // Just for final piece, check endpoints
        if (index > Puzzle.length) {
            if (!(tran.p.x == 0 &&
                  tran.p.y == 0 &&
                  tran.p.z == -1 &&
                  tran.p.d == 4))
            {
                valid = false;
            }
        }

        // Add all soltuions from here...
        if (valid) {
            console.log("-------------VALID");
            UpdateSolution(newTaken);

            setTimeout(function() {
                FindValid(++index, tran.p, newTaken);
            }, 1000);
        }
    }
}

function UpdateSolution(t) {
    blocks = [];
    $.each(t, function (i, x) {
        $.each(x, function (j, y) {
            $.each(y, function (k, z) {
                if (z) {
                    blocks.push({
                        x: i,
                        y: j,
                        z: k,
                        c: z
                    });
                }
            });
        });
    });

    //Center all the blocks
    var minX, maxX, minY, maxY, minZ, maxZ;
    $.each(blocks, function (index, block) {
        if (!index) {
            minX = maxX = block.x;
            minY = maxY = block.y;
            minZ = maxZ = block.z;
        } else {
            minX = block.x < minX ? minX : block.x;
            maxX = block.x < maxX ? block.x : maxX;
            minY = block.y < minY ? minY : block.y;
            maxY = block.y < maxY ? block.y : maxY;
            minZ = block.z < minZ ? minZ : block.z;
            maxZ = block.z < maxZ ? block.z : maxZ;
        }
    });
    var recenter = {
        x: (minX+maxX)/2,
        y: (minY+maxY)/2,
        z: (minZ+maxZ)/2,
    };

    // Convert blocks to squares
    Squares = [];
    $.each(blocks, function (index, block) {
        var newSquares = BlockToSquares(block, recenter);
        Squares.push.apply(Squares, newSquares);
    });

    UpdateRender();
}

function BlockToSquares(block, recenter) {
    //Size cube
    var SizedVertex = [];
    $.each(CubeVertex, function(index, vertex) {
        var vertexOffset = .5;
        var newVertex = {
            x: vertex.x + block.x - recenter.x - vertexOffset,
            y: vertex.y + block.y - recenter.y - vertexOffset,
            z: vertex.z + block.z - recenter.z - vertexOffset,
        };
        SizedVertex[index] = newVertex;
    });

    // Make squares
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

function neg(array) {
    if (Array.isArray(array)) {
        var n = [];
        $.each(array, function (i, v) {
            n.push(-1 * v);
        });
        return n;
    }
    return -1 * array;
}
