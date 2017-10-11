//Bomb
var Bomb = cc.Sprite.extend
({
	space:null,
	sprite:null,
	body:null,
	shape:null,
	explosionShape:null,
	moveBy:null,
	animate:null,
	posX:null,
	posY:null,
	dead:false,

	ctor:function ( space, pos) 
	{
		this._super();

		var bodyWidth = 30;
		var bodyHeight = 50;
		
		//Create Body and add it to space
		this.space = space;
		this.body = new cp.Body(1,cp.momentForBox(1, bodyWidth * GameVars.scaleFactor, bodyHeight * GameVars.scaleFactor));
		this.body.setPos(cp.v(pos.x,pos.y));
		space.addBody(this.body);
		this.shape = new cp.BoxShape(this.body, bodyWidth * GameVars.scaleFactor, bodyHeight * GameVars.scaleFactor);
		this.shape.setFriction(1);
		this.shape.setElasticity(0);
		this.space.addShape(this.shape);
		var bodySprite = cc.Sprite.create(res.BombOne_png); this.addChild(bodySprite,0); bodySprite.setPosition(this.body.p.x,this.body.p.y);
		this.shape.image = bodySprite;
		//Start Fuse Anim
		this.startAnim();
		//After 3 seconds call the explosion animation
		var callFunc = cc.callFunc(this.startAnimExplosion,this);
		this.shape.image.runAction(cc.sequence(cc.delayTime(3),callFunc));
		
		this.scheduleUpdate();
		
	},

	//Fuse burning Animation
	startAnim:function()
	{
		// Load sprite frames to frame cache, add texture node
		cc.audioEngine.playEffect(res.fuseSnd_wav);
		cc.spriteFrameCache.addSpriteFrames(res.Bomb_plist);
		var spriteTexture = cc.textureCache.addImage(res.Bomb_png),
		spriteImages  = cc.SpriteBatchNode.create(spriteTexture);
		this.addChild(spriteImages);
		var numFrames = 11;
		var animFrames = [];
		var str = "";
		for (var i = 1; i < numFrames; i++) 
		{
			str = "bomb" + i  + ".png";
			var spriteFrame = cc.spriteFrameCache.getSpriteFrame(str);
			var animFrame = new cc.AnimationFrame();
			animFrame.initWithSpriteFrame(spriteFrame, 1, null);
			animFrames.push(animFrame);
		}
		var animation = cc.Animation.create(animFrames, 0.2, 1);
		var animate = cc.Animate.create(animation); 
		this.shape.image.runAction(animate);
	},
	
	startAnimExplosion:function()
	{	
		//Remove the body from space
		this.space.removeBody(this.body);
		this.space.removeShape(this.shape);
		cc.audioEngine.playEffect(res.explosionSnd_wav);
		//Create Explosion sensor on static body
		var body = new cp.StaticBody();
		body.setPos(cc.p(this.posX, this.posY));
		var radius = 250 * GameVars.scaleFactor;
		this.explosionShape = new cp.CircleShape(body, radius, cp.v(0,0));
		this.explosionShape.setFriction(1);
		this.explosionShape.setElasticity(0);
		this.explosionShape.setSensor(true);
		this.space.addStaticShape(this.explosionShape);
	
		//Set the explosion to dead to remove it from space
		var callFunc = cc.callFunc(this.setDead,this);
		this.shape.image.runAction(cc.sequence(cc.delayTime(0.25),callFunc));
		
		this.explosionShape.setCollisionType(12);
		// Load sprite frames to frame cache, add texture node
		cc.spriteFrameCache.addSpriteFrames(res.Explosion_plist);
		var spriteTexture = cc.textureCache.addImage(res.Explosion_png),
		spriteImages  = cc.SpriteBatchNode.create(spriteTexture);
		this.addChild(spriteImages);
		var animFrames = [];
		var str = "";
		var numFrames = 11;
		
		for (var i = 0; i < numFrames; i++) 
		{
			if(i != 10)
			{
				str = "MidAirExplo__00" + i + ".png";
			}
			else
			{
				str = "MidAirExplo__010.png";
			}
			var spriteFrame = cc.spriteFrameCache.getSpriteFrame(str);
			var animFrame = new cc.AnimationFrame();
			animFrame.initWithSpriteFrame(spriteFrame, 1, null);
			animFrames.push(animFrame);
		}
		var animation = cc.Animation.create(animFrames, 0.025, 1);
		var animate = cc.Animate.create(animation); 
		this.shape.image.runAction(animate);
	},
	
	setDead:function()
	{
		this.space.removeShape(this.explosionShape);
		this.dead = true;
	},
	
	
	update:function(dt)
	{
		if(!this.dead)
		{
			this.posX = this.body.p.x;
			this.posY = this.body.p.y;
			this.shape.image.x = this.body.p.x;
			this.shape.image.y = this.body.p.y;
			var angle = Math.atan2(-this.body.rot.y,this.
					body.rot.x);
			this.shape.image.rotation= angle*57.2957795;
		}
	}

});

