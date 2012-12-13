///<reference path="Vector.ts"/>
///<reference path="Rectangle.ts"/>

class Physics{
	
	public mass:number;
	public acceleration:geom.Vector;
	public velocity:geom.Vector;
	public location:geom.Vector;
	public bounds:geom.Rectangle;
	
	/**
	* Constructor
	*/
	constructor(x:number, y:number){
		this.mass = 1;
		this.acceleration = new geom.Vector(0,0);
		this.velocity = new geom.Vector(0,0);
		this.location = new geom.Vector(x,y);
	}
	
	applyForce(force:geom.Vector){
		var f = geom.Vector.applyCalculation(force, 1/this.mass, 'scale');
		this.acceleration.add(f);
	}
	
	setBounds(bounds:geom.Rectangle){
		this.bounds = bounds;
	}
	
	checkBounds(){
		var predictedLocation = geom.Vector.applyCalculation(this.location, this.velocity, 'add');
		if (!this.bounds.containsX(predictedLocation)){
			this.velocity.x *= -1;
		}
		if (!this.bounds.containsY(predictedLocation)){
			this.velocity.y *= -1;
		}
	}
	
	update(){
		this.velocity.add(this.acceleration);
		this.velocity.limit(10);
		
		// Check that we're not going to go out of bounds *before* we change the location
		this.checkBounds();	
		
		this.location.add(this.velocity);
		
		// Reset the acceleration so that we can use force accumulation
		this.acceleration.scale(0);
	}
	
	calculateGravity(gravity:geom.Vector):geom.Vector{
		gravity.scale(this.mass)
		return gravity;
	}
	
	/**
	* -μNv
	*/
	calculateFriction(mu:number):geom.Vector{
		// Get unit v
		var friction = this.velocity.clone();
		friction.normalise();
		friction.scale(-1);
		// Assume the normal is 1
		var mag = mu * 1;
		friction.scale(mag);
		return friction;
	}
}