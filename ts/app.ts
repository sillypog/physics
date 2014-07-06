///<reference path="lib/jquery.d.ts"/>
///<reference path="sillypog/geom/Vector.ts"/>
///<reference path="sillypog/geom/Rectangle.ts"/>
///<reference path="sillypog/display/Circle.ts"/>

module physicstest{

	// Imports
	import geom = sillypog.geom;
	import display = sillypog.display;
	
	var homeCircle:display.Circle,
		circles:display.Circle[] = [],
		timer,
		mouse:geom.Vector;
	
	function update(){
		for (var i=0, l=circles.length; i<l; i++){
			var circle = circles[i];
			
			var radius = circle.radius();
			// Do collision detection
			var hit = false;
			for (var j=i+1; j<l; j++){
				var circle2 = circles[j];
				var radius2 = circle2.radius();
				
				var difference = geom.Vector.applyCalculation(circle.physics.location, circle2.physics.location, 'sub');
				if (difference.mag() < radius + radius2){
					hit = true;
					
					// To do a bounce, get the tangent that the circles touch at
					// This is perpendicular to the vector between the two centers
					difference.perpendicular();	// Gives the tangent
					difference.normalise();
				} 
			}
			var color = hit ? '#00F' : '#F00';
			circle.$.css({'background-color':color});
			
			var friction = circle.physics.calculateFriction(0.5);
			circle.physics.applyForce(friction);
			circle.update();
		}
	}
	
	function addCircle(x,y):display.Circle{
		console.log('addCircle',x,y);
		var circle = new display.Circle(x,y);
		$('#stage').append(circle.$);
		circle.physics.setBounds(new geom.Rectangle(50, 50, $('.area').width() - 50, $('.area').height() - 50));
		circle.physics.mass = 10;
		circles.push(circle);
		
		return circle;
	}
	
	function homeClick(e){
		console.log('homeClick');
		
		// Reduce the mass of existing circles so new ones will knock them
		for (var i=0; i<circles.length; i++){
			circles[i].physics.mass = 1;
		}
		
		var center = homeCircle.physics.location.clone();
		
		var segmentRadians = (Math.PI * 2) / 6;
		
		for (var i =0; i < 6; i++){
			var circle = addCircle(center.x, center.y);
			
			// Find a point around the circle to aim the circle towards
			var direction = new geom.Vector();
			direction.rotate(segmentRadians * i);
			direction.scale(40);
			circle.physics.applyForce(direction);
		}
	}
	
	export function init(){
		console.log('init');
		
		var centerX = $('#stage').width()/2,
			centerY = $('#stage').height()/2;
		
		// Place a small circle in the middle of the stage.
		// the other circles will come from there.
		homeCircle = new display.Circle(centerX, centerY);
		homeCircle.$.css({'transform':'scale(0.9)'}).appendTo($('#stage')).on('click', homeClick);
		
		
		timer = setInterval(update, 1000 / 60);
	};
}

// Launch app
$(physicstest.init);