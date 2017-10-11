//Saw
var Saw = cc.Sprite.extend
({
	space:null,
	sprite:null,
	body:null,
	shape:null,

	ctor:function ( space, pos, type) 
	{
		this._super("#blade.png");
		this.space = space;

		this.body = new cp.StaticBody();
		this.body.setPos(cc.p(pos.x, pos.y));
		this.x = pos.x;
		this.y = pos.y;
		var radius = this.width / 2;
		this.shape = new cp.CircleShape(this.body, radius, cp.vzero);
		if(type != SpriteTag.yourSaw && !GameVars.isMulti)
		{
			this.shape.setCollisionType(5);
		}
		else if(type != SpriteTag.yourSaw && GameVars.isMulti)
		{
			if(GameVars.enemyColType == 0)
			{
				this.setColor(cc.color(86,184,245,255))
			}
			else
			{
				this.setColor(cc.color(255,80,41,255))
			}
			this.shape.setCollisionType(5);
		}
		else if(type == SpriteTag.yourSaw)
		{
			if(GameVars.enemyColType == 0)
			{
				this.setColor(cc.color(255,80,41,255))
			}
			else
			{

				this.setColor(cc.color(86,184,245,255))
			}
			this.shape.setCollisionType(SpriteTag.yourSaw);
		}
		this.shape.setSensor(true);
		this.space.addStaticShape(this.shape);
		//Spinning forever
		var sprite_action = cc.RepeatForever.create(cc.RotateBy.create(1.6, 360));
		this.runAction(sprite_action);
	},
});