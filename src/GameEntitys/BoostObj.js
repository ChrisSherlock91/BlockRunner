//Boost
var Boost = cc.Layer.extend
({
	sprite:null,
	
	ctor:function ( space, pos, width, height,type) 
	{
		this._super();
	
		var offset;
		
		//Checking small offset for left - right placement in tile
		if (GameVars.scaleFactor == 1)
			offset = -15;
		else
			offset = 0;
		
		//Check which side the object is placed
		var body = new cp.StaticBody();
		if(type == 1)
		{
			body.setPos(cc.p(pos.x + GameVars.TileSize + offset, pos.y));
		}
		else if(type == 2)
		{
			body.setPos(cc.p(pos.x + GameVars.TileSize - GameVars.TileSize - offset, pos.y));
		}
		else if(type == 3)
		{
			body.setPos((cc.p(pos.x + GameVars.TileSize, pos.y)));
		}

		//Set shapes collision filter on box
		var shape = new cp.BoxShape(body, GameVars.TileSize,GameVars.TileSize);
		shape.setCollisionType(SpriteTag.boost);
		shape.setSensor(true);
		space.addShape(shape);
		
		// Create sprite and set attributes
		this.sprite = cc.Sprite.create(res.BounceDown);        
		if (type != 1)
			this.sprite.x = pos.x + GameVars.TileSize;
		else if (type == 1)
			this.sprite.x = pos.x;

		this.sprite.y = pos.y;
		this.addChild(this.sprite, 0);
	},
	
	startAnim:function()
	{
		// Load sprite frames to frame cache, add texture node
		cc.spriteFrameCache.addSpriteFrames(res.Bounce_plist);
		var spriteTexture = cc.textureCache.addImage(res.Bounce_png),
		spriteImages  = cc.SpriteBatchNode.create(spriteTexture);
		this.addChild(spriteImages);
		var animFrames = [];
		var str = "";
		var numFrames = 3;
		
		for (var i = 0; i < numFrames; i++) 
		{
			str = "Bounce" + i  + ".png";
			var spriteFrame = cc.spriteFrameCache.getSpriteFrame(str);
			var animFrame = new cc.AnimationFrame();
			animFrame.initWithSpriteFrame(spriteFrame, 1, null);
			animFrames.push(animFrame);
		}
		//Create the animation and play on the object
		var animation = cc.Animation.create(animFrames, 0.08, 1);
		animation.setRestoreOriginalFrame(true);
		var animate   = cc.Animate.create(animation); 
		this.sprite.runAction(cc.sequence(animate,animate.reverse()));
	}
	
});

