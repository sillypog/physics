///<reference path="../../lib/jquery.d.ts"/>
///<reference path="../physics/Physics.ts"/>

module sillypog.display{

	// namespace module imports
	var physics = sillypog.physics;

	export class Circle{
	
		public physics:physics.Physics;
		public $;	// Add type for jQuery
	
		constructor(x:number,y:number){
			console.log('Circle: constructor',x,y);
			
			this.physics = new physics.Physics(x,y);
	
			this.$ = $('<div class="movable circle" />').css({left:x, top:y});
		};
		
		radius():number{
			return this.$.width() /2;
		}
		
		update(){
			this.physics.update();
	
			this.$.css({left:this.physics.location.x, top:this.physics.location.y});
		};
		
	}
}