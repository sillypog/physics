///<reference path="lib/jquery.d.ts"/>
///<reference path="sillypog/geom/Vector.ts"/>
///<reference path="sillypog/geom/Rectangle.ts"/>
///<reference path="sillypog/display/Circle.ts"/>

module physicstest{

	// Imports
	import geom = sillypog.geom;
	import display = sillypog.display;
	
	var circles:display.Circle[] = [],
		timer:number;
		
	
	function update(){
	console.log('up');
		for (var i=0, l=circles.length; i<l; i++){
			var circle = circles[i];
			
			var radius = circle.radius();
			// Do collision detection
			var hit = false;
			for (var j=i+1; j<l; j++){
				var circle2 = circles[j];
				var radius2 = circle2.radius();
				
				var difference = geom.Vector.applyCalculation(circle2.physics.location, circle.physics.location, 'sub');
				var distance = difference.mag();
				if (distance < radius + radius2){
					hit = true;
					
					// First need to move them so they're not going to collide again on next frame
					var angle = Math.atan2(difference.y, difference.x);
					var distanceToMove = (radius + radius2) - distance;
					console.log(distance, distanceToMove, angle);
					// Keep it simple and just move circle2
					var dX = Math.cos(angle) * distanceToMove;
					var dY = Math.sin(angle) * distanceToMove;
					console.log(dX, dY);
					circle.physics.location.x -= dX;
					circle.physics.location.y -= dY;
					circle2.physics.location.x += dX;
					circle2.physics.location.y += dY;
					 
					// To do a bounce, get the tangent that the circles touch at
					// This is perpendicular to the vector between the two centers
					var tangent = difference.clone();
					tangent.perpendicular();	// Gives the tangent
					tangent.normalise();
					
					// Want to calculate the normal force for each circle so we can reflect and apply it
					
					// Subtract one velocity from the other as that generalises the problem to a moving object hitting a static object.
					var relativeVelocity = geom.Vector.applyCalculation(circle.physics.velocity, circle2.physics.velocity, 'sub');
					
					// Project the vector using the dot product
					//var lengthOfVelocityParallelToTangent = geom.Vector.applyCalculation(relativeVelocity, tangent, 'dot');
					var relativeVelocityClone = relativeVelocity.clone();
					var lengthOfVelocityParallelToTangent:number = relativeVelocityClone.dot(tangent);
					
					var vectorParallelToTangent = geom.Vector.applyCalculation(tangent, lengthOfVelocityParallelToTangent, 'scale');
					
					var vectorPerpendicularToTangent = geom.Vector.applyCalculation(relativeVelocity, vectorParallelToTangent, 'sub');
					
					// Now we can do the collision bounce
					circle.physics.velocity.sub(vectorPerpendicularToTangent);
					circle2.physics.velocity.add(vectorPerpendicularToTangent);
				} 
			}
			
			var friction = circle.physics.calculateFriction(0);
			circle.physics.applyForce(friction);
			circle.update();
			
			/*if (hit){
				//clearInterval(timer);
				console.log(difference);
				console.log(relativeVelocity);
				console.log(circles);
				console.log(lengthOfVelocityParallelToTangent);
				console.log(vectorParallelToTangent);
				console.log(vectorPerpendicularToTangent);
			}*/
		}
	}
	
	function addCircle(x,y):display.Circle{
		console.log('addCircle',x,y);
		var circle = new display.Circle(x,y);
		$('#stage').append(circle.$);
		circle.physics.setBounds(new geom.Rectangle(50, 50, $('.area').width() - 50, $('.area').height() - 50));
		circle.physics.mass = 5;
		circles.push(circle);
		
		return circle;
	}
	
	
	export function init(){
		console.log('init');
		
		var stageWidth = $('#stage').width(),
			stageHeight = $('#stage').height(),
			centerX = stageWidth/2,
			centerY = stageHeight/2;
		
		/*addCircle(centerX - 200, centerY);
		addCircle(centerX + 200, centerY);
		
		circles[1].$.css({'background-color':'#00D'});*/
		
		for (var i=0; i<10; i++){
			addCircle(Math.random() * stageWidth, Math.random() * stageHeight);
			circles[i].$.css({'background-color':'#'+ Math.random() * 0xFFFFFF});
		}
		
		//circles[0].physics.applyForce(new geom.Vector(50,0));
		//circles[1].physics.applyForce(new geom.Vector(-50,0));
		
		
		timer = setInterval(update, 1000 / 30);
	};
}

// Launch app
$(physicstest.init);