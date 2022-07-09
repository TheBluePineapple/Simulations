const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

const width = canvas.width;
const height = canvas.height;

var mouse = {
    x: null,
    y: null,
    pressed: false,
    clicked: false,
};
canvas.onmousedown = function () {
    mouse.pressed = true;
};
canvas.onmouseup = function () {
    mouse.clicked = true;
    mouse.pressed = false;
};
var rect = canvas.getBoundingClientRect();
canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
});

var keys = [];
document.addEventListener("keydown", (e) => {
    keys[e.key.charCodeAt(0)] = true;
});
document.addEventListener("keyup", (e) => {
    keys[e.key.charCodeAt(0)] = false;
});
var pressed = function (key) {
    //console.log(String.fromCharCode("a".charCodeAt(0)));
    if (keys[key.charCodeAt(0)]) {
        return true;
    }
    return false;
}

var constrain = function (aNumber, aMin, aMax) {
    return aNumber > aMax ? aMax : aNumber < aMin ? aMin : aNumber;
};
var min = function (n, n2) {
    return n < n2 ? n : n2;
}
var max = function (n, n2) {
    return n < n2 ? n2 : n;
}

var lineLine = function (x1, y1, x2, y2, x3, y3, x4, y4) {
    var uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

    var uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
        var interX = x1 + (uA * (x2 - x1));
        var interY = y1 + (uA * (y2 - y1));
        return [interX, interY];
    }
    return false;
};
var pointRect = function (px, py, x2, y2, w, h) {
    if (px < x2 + w && px > x2 && py < y2 + h && py > y2) {
        return true;
    }
    return false;
};
var rectRect = function (x, y, w, h, x2, y2, w2, h2) {
    if (x + w > x2 && x < x2 + w2 && y + h > y2 && y < y2 + h2) {

    }
}

var dist = function (x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};
var circleCircle = function (x, y, r, x2, y2, r2) {
    return dist(x, y, x2, y2) < r + r2;
}
// var random = function (min, max) {
//     return Math.floor(Math.random() * (max - min + 1) + min)
// }

random = function () {
    if (arguments.length === 0) {
        return Math.random();
    }
    if (arguments.length === 1) {
        return Math.random() * arguments[0];
    }
    var aMin = arguments[0], aMax = arguments[1];
    return Math.random() * (aMax - aMin) + aMin;
};

let frameCount = 0;
var Vector = Vector = (function () {
    function Vector(x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    Vector.fromAngle = function (angle, v) {
        if (v === undefined || v === null) {
            v = new Vector();
        }
        // XXX(jeresig)
        v.x = Math.cos(angle);
        v.y = Math.sin(angle);
        return v;
    };

    Vector.random2D = function (v) {
        return Vector.fromAngle(Math.random() * 360, v);
    };

    Vector.random3D = function (v) {
        var angle = Math.random() * 360;
        var vz = Math.random() * 2 - 1;
        var mult = Math.sqrt(1 - vz * vz);
        // XXX(jeresig)
        var vx = mult * Math.cos(angle);
        var vy = mult * Math.sin(angle);
        if (v === undefined || v === null) {
            v = new Vector(vx, vy, vz);
        } else {
            v.set(vx, vy, vz);
        }
        return v;
    };

    Vector.dist = function (v1, v2) {
        return v1.dist(v2);
    };

    Vector.dot = function (v1, v2) {
        return v1.dot(v2);
    };

    Vector.cross = function (v1, v2) {
        return v1.cross(v2);
    };

    Vector.sub = function (v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    };

    Vector.angleBetween = function (v1, v2) {
        // XXX(jeresig)
        return Math.acos(v1.dot(v2) / (v1.mag() * v2.mag()));
    };

    Vector.lerp = function (v1, v2, amt) {
        // non-static lerp mutates object, but this version returns a new vector
        var retval = new Vector(v1.x, v1.y, v1.z);
        retval.lerp(v2, amt);
        return retval;
    };

    // Common vector operations for Vector
    Vector.prototype = {
        set: function (v, y, z) {
            if (arguments.length === 1) {
                this.set(v.x || v[0] || 0,
                    v.y || v[1] || 0,
                    v.z || v[2] || 0);
            } else {
                this.x = v || 0;
                this.y = y || 0;
                this.z = z || 0;
            }
        },
        get: function () {
            return new Vector(this.x, this.y, this.z);
        },
        mag: function () {
            var x = this.x,
                y = this.y,
                z = this.z;
            return Math.sqrt(x * x + y * y + z * z);
        },
        magSq: function () {
            var x = this.x,
                y = this.y,
                z = this.z;
            return (x * x + y * y + z * z);
        },
        setMag: function (v_or_len, len) {
            if (len === undefined) {
                len = v_or_len;
                this.normalize();
                this.mult(len);
            } else {
                var v = v_or_len;
                v.normalize();
                v.mult(len);
                return v;
            }
        },
        add: function (v, y, z) {
            if (arguments.length === 1) {
                this.x += v.x;
                this.y += v.y;
                this.z += v.z;
            } else {
                this.x += v;
                this.y += y;
                this.z += z;
            }
        },
        sub: function (v, y, z) {
            if (arguments.length === 1) {
                this.x -= v.x;
                this.y -= v.y;
                this.z -= v.z;
            } else {
                this.x -= v;
                this.y -= y;
                this.z -= z;
            }
        },
        mult: function (v) {
            if (typeof v === 'number') {
                this.x *= v;
                this.y *= v;
                this.z *= v;
            } else {
                this.x *= v.x;
                this.y *= v.y;
                this.z *= v.z;
            }
        },
        div: function (v) {
            if (typeof v === 'number') {
                this.x /= v;
                this.y /= v;
                this.z /= v;
            } else {
                this.x /= v.x;
                this.y /= v.y;
                this.z /= v.z;
            }
        },
        rotate: function (angle) {
            var prev_x = this.x;
            var c = Math.cos(angle);
            var s = Math.sin(angle);
            this.x = c * this.x - s * this.y;
            this.y = s * prev_x + c * this.y;
        },
        dist: function (v) {
            var dx = this.x - v.x,
                dy = this.y - v.y,
                dz = this.z - v.z;
            return Math.sqrt(dx * dx + dy * dy + dz * dz);
        },
        dot: function (v, y, z) {
            if (arguments.length === 1) {
                return (this.x * v.x + this.y * v.y + this.z * v.z);
            }
            return (this.x * v + this.y * y + this.z * z);
        },
        cross: function (v) {
            var x = this.x,
                y = this.y,
                z = this.z;
            return new Vector(y * v.z - v.y * z,
                z * v.x - v.z * x,
                x * v.y - v.x * y);
        },
        lerp: function (v_or_x, amt_or_y, z, amt) {
            var lerp_val = function (start, stop, amt) {
                return start + (stop - start) * amt;
            };
            var x, y;
            if (arguments.length === 2) {
                // given vector and amt
                amt = amt_or_y;
                x = v_or_x.x;
                y = v_or_x.y;
                z = v_or_x.z;
            } else {
                // given x, y, z and amt
                x = v_or_x;
                y = amt_or_y;
            }
            this.x = lerp_val(this.x, x, amt);
            this.y = lerp_val(this.y, y, amt);
            this.z = lerp_val(this.z, z, amt);
        },
        normalize: function () {
            var m = this.mag();
            if (m > 0) {
                this.div(m);
            }
        },
        limit: function (high) {
            if (this.mag() > high) {
                this.normalize();
                this.mult(high);
            }
        },
        heading: function () {
            // XXX(jeresig)
            return -Math.atan2(-this.y, this.x);
        },
        heading2D: function () {
            return this.heading();
        },
        toString: function () {
            return "[" + this.x + ", " + this.y + ", " + this.z + "]";
        },
        array: function () {
            return [this.x, this.y, this.z];
        }
    };

    function createVectorMethod(method) {
        return function (v1, v2) {
            var v = v1.get();
            v[method](v2);
            return v;
        };
    }

    // Create the static methods of Vector automatically
    // We don't do toString because it causes a TypeError
    //  when attempting to stringify Vector
    for (var method in Vector.prototype) {
        if (Vector.prototype.hasOwnProperty(method) && !Vector.hasOwnProperty(method) &&
            method !== "toString") {
            Vector[method] = createVectorMethod(method);
        }
    }

    return Vector;
}());
var updateLoop = function () {
    this.clicked = false;
    frameCount++;
    requestAnimationFrame(loop);
}

/*// (function () {
var Vector;
Vector = (function () {
    Vector.prototype.x = 0;
    Vector.prototype.y = 0;
    Vector.prototype.z = 0;
    function Vector(x, y, z) {
        this.set(x, y, z);
    }
    Vector.prototype.add = function (v) {
        this.x += v.x;
        this.y += v.y;
        return this.z += v.z;
    };
    Vector.prototype.get = function () {
        return new Vector(this.x, this.y, this.z);
    };
    Vector.prototype.cross = function (v) {
        return new Vector(this.y * v.z - v.y * this.z, this.z * v.x - v.z * this.x, this.x * v.y - v.x * this.y);
    };
    Vector.prototype.div = function (v) {
        if (typeof v === 'number') {
            v = new Vector(v, v, v);
        }
        this.x /= v.x;
        this.y /= v.y;
        return this.z /= v.z;
    };
    Vector.prototype.dist = function (v) {
        var dx, dy, dz;
        if (typeof v === 'number') {
            v = new Vector(v, v, v);
        }
        dx = v.x - this.x;
        dy = v.y - this.y;
        dz = v.z - this.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    };
    Vector.prototype.dot = function (v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    };
    Vector.prototype.heading2D = function () {
        return -Math.atan2(-this.y, this.x);
    };
    Vector.prototype.limit = function (high) {
        if (this.mag() > high) {
            this.normalize();
            return this.mult(high);
        }
    };
    Vector.prototype.mag = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    };
    Vector.prototype.mult = function (v) {
        this.x *= v.x;
        this.y *= v.y;
        return this.z *= v.z;
    };
    Vector.prototype.normalize = function () {
        var m;
        m = this.mag();
        if (m > 0) {
            return this.div(m);
        }
    };
    Vector.prototype.set = function (x, y, z) {
        var _ref;
        return _ref = [x, y, z], this.x = _ref[0], this.y = _ref[1], this.z = _ref[2], _ref;
    };
    Vector.prototype.sub = function (v) {
        this.x -= v.z;
        this.y -= v.y;
        return this.z -= v.z;
    };
    Vector.prototype.toArray = function () {
        return [this.x, this.y, this.z];
    };
    Vector.prototype.toString = function () {
        return "x:@x, y:@y, z:@z";
    };
    return Vector;
})();
Vector.dist = function (v1, v2) {
    return v1.dist(v2);
};
Vector.dot = function (v1, v2) {
    return v1.dot(v2);
};
Vector.cross = function (v1, v2) {
    return v1.cross(v2);
};
Vector.angleBetween = function (v1, v2) {
    return Math.acos(v1.dot(v2) / (v1.mag() * v2.mag()));
};
if (typeof exports !== "undefined" && exports !== null) {
    exports.Vector = Vector;
}
// }).call(this);*/