var Puzzle =
[
    {s:{x:[0],      y:[0],      z:[0,1]},       p:{x:1, y:0, z:1},  c:{r:0, g:0, b:0}},  //green
    {s:{x:[0],      y:[0,1],    z:[0,1]},       p:{x:1, y:0, z:1},  c:{r:0, g:0, b:0}},  //turqouise
    {s:{x:[0],      y:[0],      z:[0]},         p:{x:0, y:1, z:0},  c:{r:0, g:0, b:0}},  //purple
    {s:{x:[0],      y:[0],      z:[0,1]},       p:{x:1, y:0, z:1},  c:{r:0, g:0, b:0}},  //blue

    {s:{x:[0],      y:[0,1],    z:[0]},         p:{x:-1, y:0, z:0}, c:{r:0, g:0, b:0}},  //red
    {s:{x:[0,1],    y:[0],      z:[0,1]},       p:{x:2, y:0, z:2},  c:{r:0, g:0, b:0}},  //yellow
    {s:{x:[0],      y:[0,1],    z:[0]},         p:{x:0, y:2, z:0},  c:{r:0, g:0, b:0}},  //orange
    {s:{x:[0],      y:[0],      z:[0]},         p:{x:0, y:0, z:1},  c:{r:0, g:0, b:0}},  //dark orange

    {s:{x:[0,1],    y:[0,1],    z:[0]},         p:{x:0, y:2, z:0},  c:{r:0, g:0, b:0}},  //red
    {s:{x:[0],      y:[0,1],    z:[0]},         p:{x:1, y:0, z:0},  c:{r:0, g:0, b:0}},  //purple
    {s:{x:[0],      y:[0,1],    z:[0]},         p:{x:0, y:2, z:0},  c:{r:0, g:0, b:0}},  //lime
    {s:{x:[0],      y:[0],      z:[0]},         p:{x:0, y:1, z:0},  c:{r:0, g:0, b:0}},  //light green
];

var loc = {
    x: 0,
    y: 0,
    z: 0,
    d: 0
};
var taken = [];
var size = 5;

function FindSolutions() {
    console.log("FindSolutions");
    for (var x = -size; x <= size; x++) {
        console.log("FindSolutions x");
        taken[x] = [];
        for (var y = -size; y <= size; y++) {
            console.log("FindSolutions y");
            taken[x][y] = [];
            for (var z = -size; z <= size; z++) {
                console.log("FindSolutions z");
                taken[x][y][z] = false;
            }
        }
    }

    console.log("Calling FindValid");
    var solutions = FindValid(0, loc, taken);
}

function FindValid(index, loc, taken) {
    console.log("FindValid");
    var sol = [];
    var piece = Puzzle[index];

    // For each of four possible rotations
    for (var r = 0; r < 4; r++) {
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
            sy = -t;

            t = px;
            px = py;
            py = -t;
        }
        rot.s = {x:sx, y:sy, z:piece.s.z};
        rot.p = {x:px, y:py, z:piece.p.z};

        //Face correct direction
        console.log("Direction");
        var rot2 = {};
        switch(loc.d) {
            case 0:
                rot2.s = {x:rot.s.z, y:rot.s.y, z:-rot.s.x};
                rot2.p = {x:rot.p.z, y:rot.p.y, z:-rot.p.x};
                break;
            case 1:
                rot2.s = {x:-rot.s.z, y:rot.s.y, z:rot.s.x};
                rot2.p = {x:-rot.p.z, y:rot.p.y, z:rot.p.x};
                break;
            case 2:
                rot2.s = {x:rot.s.x, y:rot.s.z, z:-rot.s.y};
                rot2.p = {x:rot.p.x, y:rot.p.z, z:-rot.p.y};
                break;
            case 3:
                rot2.s = {x:rot.s.x, y:-rot.s.z, z:rot.s.y};
                rot2.p = {x:rot.p.x, y:-rot.p.z, z:rot.p.y};
                break;
            case 4:
                rot2.s = {x:rot.s.x, y:rot.s.y, z:rot.s.z};
                rot2.p = {x:rot.p.x, y:rot.p.y, z:rot.p.z};
                break;
            case 5:
                rot2.s = {x:-rot.s.x, y:-rot.s.y, z:rot.s.z};
                rot2.p = {x:-rot.p.x, y:-rot.p.y, z:rot.p.z};
                break;
        }

        //Translate
        console.log("Translate");
        rot2.s = {
            x: rot2.s.x + loc.x,
            x: rot2.s.y + loc.y,
            x: rot2.s.z + loc.z,
        };

        // For each block in piece
        var valid = true;
        $.each(rot2.s.x, function (i, x) {
            $.each(rot2.s.y, function (j, y) {
                $.each(rot2.s.z, function (k, z) {
                    if (taken[x][y][z]) {
                        valid = false;;
                    } else {
                        taken[x][y][z] = true;
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

        console.log("Direction");

        // Finally, set the direction
        $.each(dir, function (i, z) {
            if (z) {
                current = i;
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
            console.log("Push");
            sol.push(FindValid(index++, current, taken));
        }
    }

    return sol;
}
