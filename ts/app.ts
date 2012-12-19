///<reference path="lib/jquery.d.ts"/>
///<reference path="sillypog/geom/Vector.ts"/>
///<reference path="sillypog/geom/Rectangle.ts"/>
///<reference path="sillypog/display/Circle.ts"/>

module physicstest{

	// Imports
	import geom = sillypog.geom;
	import display = sillypog.display;
	
	var circles:display.Circle[] = [],
		timer,
		mouse:geom.Vector;
	
	function update(){
		for (var i=0, l=circles.length; i<l; i++){
			var circle = circles[i];
			var direction = geom.Vector.applyCalculation(mouse, circle.physics.location, 'sub');
			direction.scale(0.01);
			circle.physics.applyForce(direction);
			
			var friction = circle.physics.calculateFriction(0.5);
			circle.physics.applyForce(friction);
			circle.update();
		}
	}
	
	function addCircle(x,y){
		console.log('addCircle',x,y);
		var circle = new display.Circle(x,y);
		$('#stage').append(circle.$);
		circle.physics.setBounds(new geom.Rectangle(50, 50, $('.area').width() - 50, $('.area').height() - 50));
		circle.physics.mass = Math.ceil(Math.random() * 10);
		circles.push(circle);
	}
	
	export function init(){
		console.log('init');
		
		for (var i =0; i < 5; i++){
			addCircle($('#stage').width()/2, $('#stage').height()/2);
		}
		
		mouse = new geom.Vector(0,0);
		
		$('#stage').on('mousemove',function(e){
			mouse.x = e.pageX;
			mouse.y = e.pageY;
		});
		
		timer = setInterval(update, 1000 / 60);
	};
}

// Launch app
$(physicstest.init);