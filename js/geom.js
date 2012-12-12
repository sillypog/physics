var Vector = (function(){
	/**
	* Constructor
	*/
	var Vector = function(_x, _y){
		//console.log('Vector: constructor',_x,_y);
		this.x = typeof _x === "undefined" ? 0 : _x;
		this.y = typeof _y === "undefined" ? 0 : _y;
		
		//console.log('Vector created with x:',this.x,', y:',this.y);
	};
	
	// Static
	Vector.createRandom = function(){
		// Create a random normalised vector
		var v= new Vector(0.5 - Math.random(), 0.5 - Math.random());
		v.normalise();
		return v;
	}
	
	/**
	* When you want to add 2 vectors without affecting either one.
	*/
	Vector.applyCalculation = function(a, b, calc){
		var v = a.clone();
		v[calc](b);
		return v;
	}
	
	Vector.prototype.add = function(v){
		this.x += v.x;
		this.y += v.y;
	}
	
	/**
	* Can get the vector required to connect to points
	*/
	Vector.prototype.sub = function(v){
		this.x -= v.x;
		this.y -= v.y;
	}
	
	/** 
	* Use for multiplication or division
	*/
	Vector.prototype.scale = function(n){
		this.x *= n;
		this.y *= n;
	}
	
	
	Vector.prototype.mag = function(){
		return Math.sqrt(this.x*this.x + this.y*this.y);
	}
	
	Vector.prototype.normalise = function(){
		var m = this.mag();
		// Can't divide by 0
		if (m != 0){
			// Divide by magnitude
			this.scale(1/m);	
		}
	}
	
	Vector.prototype.limit = function(max){
	  if (this.mag() > Math.abs(max)) {
		this.normalise();
		this.scale(max);
	  }
	}
	
	Vector.prototype.angle = function(){
		return Math.atan2(this.y, this.x);
	}

	Vector.prototype.clone = function(){
		return new Vector(this.x, this.y);
	}
	
	return Vector;
})();

var Rectangle = (function(){
	var Rectangle = function(x,y,width,height){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	};
	
	Rectangle.prototype.containsX = function(p){
		if (p.x < this.x || p.x > this.width){
			return false;
		}
		return true;
	};
	
	Rectangle.prototype.containsY = function(p){
		if (p.y < this.y || p.y > this.height){
			return false;
		}
		return true;
	};
	
	return Rectangle;
})();