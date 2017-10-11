//Saw
var SpinningSaw = cc.Sprite.extend
({
	space:null,
	body:null,
	body2:null,
	shape:null,
	shape2:null,
	pivotConstraint:null,
	simpleMotor:null,
	chainSprite:null,

	ctor:function ( space, pos, type) 
	{
		this._super();
		
		this.space = space;
		var bodySize = 50 * GameVars.scaleFactor;
		var radius = 60 * GameVars.scaleFactor;
		var offSet = 200 * GameVars.scaleFactor;
		var pivotPoint = 150 * GameVars.scaleFactor;

		this.body = new cp.Body(Infinity, Infinity);
		this.body.p = cc.p(pos.x,pos.y);
		this.shape = new cp.BoxShape(this.body, bodySize, bodySize);
		this.shape.setCollisionType(0);
		var bodySprite = cc.Sprite(res.metalBox_png);
		this.addChild(bodySprite,5); 
		bodySprite.setPosition(this.body.p.x,this.body.p.y);
		this.shape.image = bodySprite;
		this.space.addShape(this.shape);

		this.body2 = new cp.Body(1,cp.momentForCircle(1, bodySize, bodySize, cp.vzero));
		this.body2.p = cc.p(pos.x - offSet,pos.y);
		this.space.addBody(this.body2);

		this.shape2 = new cp.CircleShape(this.body2,radius,cp.vzero);
		var bodySprite = new cc.Sprite("#blade.png");
		this.addChild(bodySprite,5); 
		bodySprite.setPosition(this.body2.p.x,this.body2.p.y);
		this.shape2.image = bodySprite;
		this.shape2.setAsSensor = true;
		this.shape2.setCollisionType(SpriteTag.saw);
		this.space.addShape(this.shape2);

		var sprite_action = cc.RepeatForever.create(cc.RotateBy.create(0.6, 360));
		this.shape2.image.runAction(sprite_action);

		this.pivotConstraint = cp.PivotJoint(this.body, this.body2, cp.v(0, 0), cp.v(-offSet, 0));
		this.space.addConstraint(this.pivotConstraint);

		if(type == 2)
		{
			this.simpleMotor = new cp.SimpleMotor(this.body, this.body2, -Math.PI);
		}
		else
		{
			this.simpleMotor = new cp.SimpleMotor(this.body, this.body2, Math.PI);
		}
		this.space.addConstraint(this.simpleMotor);

		this.chainSprite = new cc.Sprite(res.chain_png);
		this.chainSprite.x = this.body.p.x;
		this.chainSprite.y = this.body.p.y;
		this.chainSprite.setScale(0.3 * GameVars.scaleFactor);
		this.chainSprite.setRotation(90);
		this.chainSprite.setAnchorPoint(cc.p(0, -0.01));
		this.addChild(this.chainSprite,0);
		
		this.scheduleUpdate();
	},

	update:function()
	{
		this.shape2.image.x = this.body2.p.x;
		this.shape2.image.y = this.body2.p.y;
		
		var deltaY = this.body2.p.y - this.body.p.y;
		var deltaX = this.body2.p.x - this.body.p.x;
		var angle = Math.atan2(deltaY, deltaX) * 180 / Math.PI;
		angle -= 90;
		this.chainSprite.setRotation(-angle);
	},
	
	onExit:function()
	{
		cc.log("Exit Saw");
		//this.unscheduleAllCallbacks();
//		this.space.removeConstraint(this.simpleMotor);
//		this.space.removeConstraint(this.pivotConstraint);
//		this.space.removeShape(this.shape);
//		this.space.removeShape(this.shape2);
//		this.space.removeBody(this.body2);
		this._super();
	}

});