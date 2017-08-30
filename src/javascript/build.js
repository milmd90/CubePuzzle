function FindSolutions() {
    console.log("FindSolutions");

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

    console.log("Calling FindValid");
    return FindValid(0, loc, taken);
}

function FindValid(index, loc, taken) {
    console.log("FindValid");
    var sol = [];
    var piece = Puzzle[index];

    // For each of four possible rotations
    for (var r = 0; r < 1; r++) {                                            //4
        console.log("Rotation "+r);

        //Rotate
        var rot = {};
        var sx = piece.s.x;
        var sy = piece.s.y;
        var px = piece.p.x;
        var py = piece.p.y;
        var t;
        for (var i = 0; i < r; i++) {
            t = sx;
            sx = sy;
            sy = neg(t);

            t = px;
            px = py;
            py = neg(t);
        }
        rot.s = {x:sx, y:sy, z:piece.s.z};
        rot.p = {x:px, y:py, z:piece.p.z};

        //Face correct direction
        console.log("Direction");
        var rot2 = {};
        switch(loc.d) {
            case 0:
                rot2.s = {x:rot.s.z, y:rot.s.y, z:neg(rot.s.x)};
                rot2.p = {x:rot.p.z, y:rot.p.y, z:neg(rot.p.x)};
                break;
            case 1:
                rot2.s = {x:neg(rot.s.z), y:rot.s.y, z:rot.s.x};
                rot2.p = {x:neg(rot.p.z), y:rot.p.y, z:rot.p.x};
                break;
            case 2:
                rot2.s = {x:rot.s.x, y:rot.s.z, z:neg(rot.s.y)};
                rot2.p = {x:rot.p.x, y:rot.p.z, z:neg(rot.p.y)};
                break;
            case 3:
                rot2.s = {x:rot.s.x, y:neg(rot.s.z), z:rot.s.y};
                rot2.p = {x:rot.p.x, y:neg(rot.p.z), z:rot.p.y};
                break;
            case 4:
                rot2.s = {x:rot.s.x, y:rot.s.y, z:rot.s.z};
                rot2.p = {x:rot.p.x, y:rot.p.y, z:rot.p.z};
                break;
            case 5:
                rot2.s = {x:neg(rot.s.x), y:neg(rot.s.y), z:rot.s.z};
                rot2.p = {x:neg(rot.p.x), y:neg(rot.p.y), z:rot.p.z};
                break;
        }

        //Translate
        console.log("Translate");
        rot2.s.x.map(function (val) {
            return val + loc.x;
        });
        rot2.s.y.map(function (val) {
            return val + loc.y;
        });
        rot2.s.z.map(function (val) {
            return val + loc.z;
        });

        // For each block in piece
        var valid = true;
        var newTaken = taken.slice();
        $.each(rot2.s.x, function (i, x) {
            $.each(rot2.s.y, function (j, y) {
                $.each(rot2.s.z, function (k, z) {
                    if (taken[x][y][z]) {
                        valid = false;;
                    } else {
                        newTaken[x][y][z] = piece.c;
                    }
                });
            });
        });

        // Set next loc
        var current = {
            x:rot2.p.x,
            y:rot2.p.y,
            z:rot2.p.z,
        };

        // Find the next direction
        var dir = [true, true, true, true, true, true];
        $.each(rot2.s.x, function (i, x) {
            if (x == rot2.p.x) {
                dir[0] = false;
                dir[1] = false;
            } else if (x > rot2.p.x) {
                dir[0] = false;
            } else {
                dir[1] = false;
            }
        });
        $.each(rot2.s.y, function (i, y) {
            if (y == rot2.p.y) {
                dir[2] = false;
                dir[3] = false;
            } else if (y > rot2.p.y) {
                dir[2] = false;
            } else {
                dir[3] = false;
            }
        });
        $.each(rot2.s.z, function (i, z) {
            if (z == rot2.p.z) {
                dir[4] = false;
                dir[5] = false;
            } else if (z > rot2.p.z) {
                dir[4] = false;
            } else {
                dir[5] = false;
            }
        });

        // Finally, set the direction
        $.each(dir, function (i, z) {
            if (z) {
                current.d = i;
            }
        });

        // Just for final piece, check endpoints
        if (index > Puzzle.length) {
            if (!(current.x == 0 &&
                  current.y == 0 &&
                  current.z == -1 &&
                  current.d == 4))
            {
                valid = false;
            }
        }

        // Add all soltuions from here...
        if (valid) {
            console.log("-------------VALID");
            // sol.push(FindValid(index++, current, newTaken));
        } else {
            console.log("-------------INVALID");
        }

        UpdateSolution(newTaken);
    }

    return sol;
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

    // Convert blocks to squares
    Squares = [];
    $.each(blocks, function (index, block) {
        var newSquares = BlockToSquares(block);
        Squares.push.apply(Squares, newSquares);
    });
    RenderSquares();
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
