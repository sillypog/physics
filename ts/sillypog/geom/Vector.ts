module sillypog.geom{
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
		static applyCalculation(a:Vector, b:number, calc:string);
		static applyCalculation(a:Vector, b:Vector, calc:string);
		static applyCalculation(a:Vector, b:any, calc:string){
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
		
		/**
		* The dot product is related to the cosine between 2 vectors, 
		* such that: A · B = |A| * |B| * cos(Θ),
		* ie dot product = length of A * length of B * cosine of angle between them.
		* So if A and B are unit vectors (length = 1) it becomes:
		* A · B = cos(Θ)
		*
		* Also, the dot product of A · A = |A| * |A|
		*/
		dot(v:Vector):number{
			return this.x*v.x + this.y+v.y;
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
		
		rotate(radians:number){
			this.x += Math.cos(radians);
			this.y += Math.sin(radians)
		}
		
		perpendicular(){
			var y = this.y;
			this.y = this.x;
			this.x = -y;
		}
	
		clone():Vector{
			return new Vector(this.x, this.y);
		}
	}
}