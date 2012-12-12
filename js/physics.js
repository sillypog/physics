var Physics = (function(){
	
	/**
	* Constructor
	*/
	var Physics = function(x,y){
		this.mass = 1;
		this.acceleration = new Vector(0,0);
		this.velocity = new Vector(0,0);
		this.location = new Vector(x,y);
	}
	
	Physics.prototype.applyForce = function(force){
		var f = Vector.applyCalculation(force, 1/this.mass, 'scale');
		this.acceleration.add(f);
	}
	
	Physics.prototype.setBounds = function(bounds){
		this.bounds = bounds;
	}
	
	Physics.prototype.checkBounds = function(){
		var predictedLocation = Vector.applyCalculation(this.location, this.velocity, 'add');
		if (!this.bounds.containsX(predictedLocation)){
			this.velocity.x *= -1;
		}
		if (!this.bounds.containsY(predictedLocation)){
			this.velocity.y *= -1;
		}
	}
	
	Physics.prototype.update = function(){
		this.velocity.add(this.acceleration);
		this.velocity.limit(10);
		
		// Check that we're not going to go out of bounds *before* we change the location
		this.checkBounds();	
		
		this.location.add(this.velocity);
		
		// Reset the acceleration so that we can use force accumulation
		this.acceleration.scale(0);
	}
	
	Physics.prototype.calculateGravity = function(gravity){
		return gravity.scale(this.mass);
	}
	
	/**
	* -μNv
	*/
	Physics.prototype.calculateFriction = function(mu){
		// Get unit v
		var friction = this.velocity.clone();
		friction.normalise();
		friction.scale(-1);
		// Assume the normal is 1
		var mag = mu * 1;
		friction.scale(mag);
		return friction;
	}
	
	return Physics;
	
})();