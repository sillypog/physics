module geom{
	export class Vector{
		
		constructor(public x?:number = 0, public y?:number = 0){}
		
		static createRandom():Vector{
			var v= new Vector(0.5 - Math.random(), 0.5 - Math.random());
			v.normalise();
			return v;
		}
		
		/**
		* When you want to add 2 vectors without affecting either one.
		*/
		static applyCalculation(a:Vector, b, calc:string){
			var v = a.clone();
			v[calc](b);
			return v;
		}
		
		add(v:Vector){
			this.x += v.x;
			this.y += v.y;
		}
		
		/**
		* Can get the vector required to connect to points
		*/
		sub(v:Vector){
			this.x -= v.x;
			this.y -= v.y;
		}
		
		/** 
		* Use for multiplication or division
		*/
		scale(n:number){
			this.x *= n;
			this.y *= n;
		}
		
		
		mag():number{
			return Math.sqrt(this.x*this.x + this.y*this.y);
		}
		
		normalise(){
			var m = this.mag();
			// Can't divide by 0
			if (m != 0){
				// Divide by magnitude
				this.scale(1/m);	
			}
		}
		
		limit(max:number){
		  if (this.mag() > Math.abs(max)) {
			this.normalise();
			this.scale(max);
		  }
		}
		
		angle():number{
			return Math.atan2(this.y, this.x);
		}
	
		clone():Vector{
			return new Vector(this.x, this.y);
		}
	}
}