var sillypog;
(function (sillypog) {
    (function (geom) {
        var Vector = (function () {
            function Vector(x, y) {
                if (typeof x === "undefined") { x = 0; }
                if (typeof y === "undefined") { y = 0; }
                this.x = x;
                this.y = y;
            }
            Vector.createRandom = function createRandom() {
                var v = new Vector(0.5 - Math.random(), 0.5 - Math.random());
                v.normalise();
                return v;
            }
            Vector.applyCalculation = function applyCalculation(a, b, calc) {
                var v = a.clone();
                v[calc](b);
                return v;
            }
            Vector.prototype.add = function (v) {
                this.x += v.x;
                this.y += v.y;
            };
            Vector.prototype.sub = function (v) {
                this.x -= v.x;
                this.y -= v.y;
            };
            Vector.prototype.scale = function (n) {
                this.x *= n;
                this.y *= n;
            };
            Vector.prototype.mag = function () {
                return Math.sqrt(this.x * this.x + this.y * this.y);
            };
            Vector.prototype.normalise = function () {
                var m = this.mag();
                if(m != 0) {
                    this.scale(1 / m);
                }
            };
            Vector.prototype.limit = function (max) {
                if(this.mag() > Math.abs(max)) {
                    this.normalise();
                    this.scale(max);
                }
            };
            Vector.prototype.angle = function () {
                return Math.atan2(this.y, this.x);
            };
            Vector.prototype.rotate = function (radians) {
                this.x += Math.cos(radians);
                this.y += Math.sin(radians);
            };
            Vector.prototype.clone = function () {
                return new Vector(this.x, this.y);
            };
            return Vector;
        })();
        geom.Vector = Vector;        
    })(sillypog.geom || (sillypog.geom = {}));
    var geom = sillypog.geom;
})(sillypog || (sillypog = {}));
var sillypog;
(function (sillypog) {
    (function (geom) {
        var Rectangle = (function () {
            function Rectangle(x, y, width, height) {
                this.x = x;
                this.y = y;
                this.width = width;
                this.height = height;
            }
            Rectangle.prototype.containsX = function (p) {
                if(p.x < this.x || p.x > this.width) {
                    return false;
                }
                return true;
            };
            Rectangle.prototype.containsY = function (p) {
                if(p.y < this.y || p.y > this.height) {
                    return false;
                }
                return true;
            };
            return Rectangle;
        })();
        geom.Rectangle = Rectangle;        
    })(sillypog.geom || (sillypog.geom = {}));
    var geom = sillypog.geom;
})(sillypog || (sillypog = {}));
var sillypog;
(function (sillypog) {
    (function (physics) {
        var Physics = (function () {
            function Physics(x, y) {
                this.mass = 1;
                this.acceleration = new sillypog.geom.Vector(0, 0);
                this.velocity = new sillypog.geom.Vector(0, 0);
                this.location = new sillypog.geom.Vector(x, y);
            }
            Physics.prototype.applyForce = function (force) {
                var f = sillypog.geom.Vector.applyCalculation(force, 1 / this.mass, 'scale');
                this.acceleration.add(f);
            };
            Physics.prototype.setBounds = function (bounds) {
                this.bounds = bounds;
            };
            Physics.prototype.checkBounds = function () {
                var predictedLocation = sillypog.geom.Vector.applyCalculation(this.location, this.velocity, 'add');
                if(!this.bounds.containsX(predictedLocation)) {
                    this.velocity.x *= -1;
                }
                if(!this.bounds.containsY(predictedLocation)) {
                    this.velocity.y *= -1;
                }
            };
            Physics.prototype.update = function () {
                this.velocity.add(this.acceleration);
                this.velocity.limit(10);
                if(this.velocity.mag() < 0.01) {
                    this.velocity.scale(0);
                }
                this.checkBounds();
                this.location.add(this.velocity);
                this.acceleration.scale(0);
            };
            Physics.prototype.calculateGravity = function (gravity) {
                gravity.scale(this.mass);
                return gravity;
            };
            Physics.prototype.calculateFriction = function (mu) {
                var friction = this.velocity.clone();
                friction.normalise();
                friction.scale(-1);
                var mag = mu * 1;
                friction.scale(mag);
                return friction;
            };
            return Physics;
        })();
        physics.Physics = Physics;        
    })(sillypog.physics || (sillypog.physics = {}));
    var physics = sillypog.physics;
})(sillypog || (sillypog = {}));
var sillypog;
(function (sillypog) {
    (function (display) {
        var physics = sillypog.physics;
        var Circle = (function () {
            function Circle(x, y) {
                console.log('Circle: constructor', x, y);
                this.physics = new physics.Physics(x, y);
                this.$ = $('<div class="movable circle" />').css({
                    left: x,
                    top: y
                });
            }
            Circle.prototype.radius = function () {
                return this.$.width() / 2;
            };
            Circle.prototype.update = function () {
                this.physics.update();
                this.$.css({
                    left: this.physics.location.x,
                    top: this.physics.location.y
                });
            };
            return Circle;
        })();
        display.Circle = Circle;        
    })(sillypog.display || (sillypog.display = {}));
    var display = sillypog.display;
})(sillypog || (sillypog = {}));
var physicstest;
(function (physicstest) {
    var geom = sillypog.geom;
    var display = sillypog.display;
    var homeCircle, circles = [], timer, mouse;
    function update() {
        for(var i = 0, l = circles.length; i < l; i++) {
            var circle = circles[i];
            var radius = circle.radius();
            var hit = false;
            for(var j = i + 1; j < l; j++) {
                var circle2 = circles[j];
                var radius2 = circle2.radius();
                var difference = geom.Vector.applyCalculation(circle.physics.location, circle2.physics.location, 'sub');
                if(difference.mag() < radius + radius2) {
                    hit = true;
                }
            }
            var color = hit ? '#00F' : '#F00';
            circle.$.css({
                'background-color': color
            });
            var friction = circle.physics.calculateFriction(0.5);
            circle.physics.applyForce(friction);
            circle.update();
        }
    }
    function addCircle(x, y) {
        console.log('addCircle', x, y);
        var circle = new display.Circle(x, y);
        $('#stage').append(circle.$);
        circle.physics.setBounds(new geom.Rectangle(50, 50, $('.area').width() - 50, $('.area').height() - 50));
        circle.physics.mass = 10;
        circles.push(circle);
        return circle;
    }
    function homeClick(e) {
        console.log('homeClick');
        for(var i = 0; i < circles.length; i++) {
            circles[i].physics.mass = 1;
        }
        var center = homeCircle.physics.location.clone();
        var segmentRadians = (Math.PI * 2) / 6;
        for(var i = 0; i < 6; i++) {
            var circle = addCircle(center.x, center.y);
            var direction = new geom.Vector();
            direction.rotate(segmentRadians * i);
            direction.scale(40);
            circle.physics.applyForce(direction);
        }
    }
    function init() {
        console.log('init');
        var centerX = $('#stage').width() / 2, centerY = $('#stage').height() / 2;
        homeCircle = new display.Circle(centerX, centerY);
        homeCircle.$.css({
            'transform': 'scale(0.9)'
        }).appendTo($('#stage')).on('click', homeClick);
        timer = setInterval(update, 1000 / 60);
    }
    physicstest.init = init;
    ; ;
})(physicstest || (physicstest = {}));
$(physicstest.init);
