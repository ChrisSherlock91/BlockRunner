//BodyPiece
var BodyPiece = cc.Sprite.extend
({
	space:null,
	sprite:null,
	sprite2:null,
	body:null,
	shape:null,

	ctor:function ( space, pos, width, height) 
	{
		this._super();

		this.space = space;
		
		//To keep sprite and body together
		var num = Math.floor((Math.random() * 4) + 0);
		var str;
		if(num == 0)
			str = res.part0_png;
		else if(num ==1)
			str = res.part1_png;
		else if(num == 2)
			str = res.part2_png;
		else if(num == 4)
			str = res.part3_png

		this.sprite2 = new cc.Sprite(str);
		this.sprite2.x = pos.x
		this.sprite2.y = pos.y;
		this.sprite2.setScale(0.5, 0.5);
		this.addChild(this.sprite2);

		//Create dyanmic body
		
		this.body = new cp.Body(1, cp.momentForBox(1, width, height));
		this.body.p = cc.p(pos.x,pos.y);
		this.space.addBody(this.body);
		this.shape = new cp.BoxShape(this.body, width, height);
		this.shape.setCollisionType(100);
		this.shape.image = this.sprite2;
		this.space.addShape(this.shape);
		
		//Apply random impusle to body
		var force = 500;
		this.body.applyImpulse(cp.v(cc.random0To1() * force, cc.random0To1() * force), cp.v(cc.random0To1() * force, cc.random0To1() * force));
		
		this.scheduleUpdate();
	},
	
	update:function()
	{
		//update body and sprite
		if(this.body)
		{
			this.shape.image.x = this.body.p.x;
			this.shape.image.y = this.body.p.y;
			this.shape.image.setRotation( -(180 * this.body.w / Math.PI));
		}
		else
		{
			cc.log("Body is null")
		}
	},

	onExit:function()
	{
		this._super();
		//this.unscheduleUpdate();
		this.space.removeShape(this.shape);
		this.space.removeBody(this.body);
	}
});

