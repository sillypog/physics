///<reference path="Vector.ts"/>

module geom{

	export class Rectangle{
		
		constructor(public x:number, public y:number, public width:number, public height:number){}
	
		containsX(p:Vector){
			if (p.x < this.x || p.x > this.width){
				return false;
			}
			return true;
		};
	
		containsY(p:Vector){
			if (p.y < this.y || p.y > this.height){
				return false;
			}
			return true;
		};
	}
}