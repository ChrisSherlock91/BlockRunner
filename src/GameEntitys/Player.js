//Check which direction player is moving
var moveRight = false;
var moveLeft = false;
var isJumping = false;

var Player = cc.Layer.extend({
	posX:null,
	posY:null,
	space:null,
	body:null,
	oldX:null,
	count:0,
	sprite:null,
	sprite2:null,
	shape:null,
	shapeArray:null,
	touchSprite:null,

	ctor:function (positionX,positionY,world) 
	{
		this._super();
		
		//init at position
		this.posX = positionX;
		this.posY = positionY;
		this.space = world;
		this.init();
		
		//This is Debug Draw for Chipmunk
		//this._debugNode = new cc.PhysicsDebugNode(this.space);
		//this.addChild(this._debugNode, 1);
	},

	init:function () 
	{
		//Create player body
		this.createPlayer();
		
		if( 'accelerometer' in cc.sys.capabilities && GameVars.isAccelLvl == true ) 
		{
			// call is called 30 times per second
			var self = this;
			moveLeft = false;
			moveRight = false;
			cc.inputManager.setAccelerometerInterval(1/30);
			cc.inputManager.setAccelerometerEnabled(true);
			cc.eventManager.addListener({
				event: cc.EventListener.ACCELERATION,
				callback: function(accelEvent, event)
				{
					if(GameVars.canMove)
					{
						var target = event.getCurrentTarget();
						
						if(accelEvent.x > 0)
						{
							self.shape.image.setFlippedX(false);
						}
						else if(accelEvent.x < 0)
						{
							self.shape.image.setFlippedX(true);
						}
						
						//Accel events for tilt strength based on scale
						if(GameVars.scaleFactor == 2)
						{
							self.move((accelEvent.x * 60) * GameVars.scaleFactor);
						}
						else
						{
							self.move((accelEvent.x * 70));
						}
					}
				}
			}, this);

		} 
		else
		{
			GameVars.isAccelLvl = false;
		}

		//If touch device
		if (cc.sys.capabilities.hasOwnProperty('touches') && GameVars.isAccelLvl == false)
		{
			//Add Touch listeners
			cc.eventManager.addListener({
				event: cc.EventListener.TOUCH_ONE_BY_ONE,
				swallowTouches: false,
				onTouchBegan: this.onTouchBegan,
				onTouchMoved: this.onTouchMoved,
				onTouchEnded: this.onTouchEnded
			}, this)
		}
		
		//ifdevice has a keyboard
		if (cc.sys.capabilities.hasOwnProperty('keyboard'))
			//Add event listeners
			cc.eventManager.addListener({
				event: cc.EventListener.KEYBOARD,
				onKeyPressed: this.onKeyDown,
				onKeyReleased: this.onKeyUp
			}, this)


		this.scheduleUpdate();
	},

	onKeyDown:function(key,event)
	{
		if(GameVars.canMove == true)	
		{
			if(key == 146) // W Key
			{
				if(GameVars.canJump)
				{
					//Play audio and jump
					cc.audioEngine.playEffect(res.jumpSnd_wav);
					event.getCurrentTarget().jump();
				}
			}
			if(key == 124)
				moveLeft = true;
			else if(key == 127)
				moveRight = true;
		}
	},

	onKeyUp:function(key,event)
	{
		if(key == 146)
			isJumping = false;
		if(key == 124)
			moveLeft = false;
		else if(key == 127)
			moveRight = false;
	},
	
	onTouchMoved:function(touch,event)
	{
		if(GameVars.canMove == true)
		{
			var pos = touch.getLocation();
			//Cehck touch positions for hud items for movement
			if(!GameVars.switchedControls)
			{
				if(pos.x < cc.winSize.width * 0.2 && pos.y < cc.winSize.height * 0.4)
					moveLeft = true;
			}
			else if(GameVars.switchedControls)
			{
				if(pos.x > cc.winSize.width * 0.5 && pos.x < cc.winSize.width * 0.75 && pos.y < cc.winSize.height * 0.8)
					moveLeft = true;
			}

			if(!GameVars.switchedControls)
			{
				if(pos.x > cc.winSize.width * 0.2 && pos.x < cc.winSize.width * 0.5 && pos.y < cc.winSize.height * 0.4)
					moveRight = true;
			}
			else if(GameVars.switchedControls)
			{
				if(pos.x < cc.winSize.width * 0.99 && pos.x > cc.winSize.width * 0.8 && pos.y < cc.winSize.height * 0.4)
					moveRight = true;
			}

			if(!GameVars.switchedControls)
			{
				if(pos.x > cc.winSize.width / 2)
				{
					isJumping = true;
					if(GameVars.canJump)
					{
						cc.audioEngine.playEffect(res.jumpSnd_wav);
						event.getCurrentTarget().jump();
					}
				}
			}
			
			else if(GameVars.switchedControls)
			{
				if(pos.x < cc.winSize.width / 2)
				{
					isJumping = true;
					if(GameVars.canJump)
					{
						cc.audioEngine.playEffect(res.jumpSnd_wav);
						event.getCurrentTarget().jump();
					}
				}
			}
			
		}
		return true;
	},

	onTouchBegan:function(touch, event)
	{
		if(GameVars.canMove == true)
		{
			var pos = touch.getLocation();
			
			if(!GameVars.switchedControls)
			{
				if(pos.x < cc.winSize.width * 0.2 && pos.y < cc.winSize.height * 0.4)
					moveLeft = true;
			}
			else if(GameVars.switchedControls)
			{
				if(pos.x > cc.winSize.width * 0.5 && pos.x < cc.winSize.width * 0.75 && pos.y < cc.winSize.height * 0.8)
					moveLeft = true;
			}
	
			if(!GameVars.switchedControls)
			{
				if(pos.x > cc.winSize.width * 0.2 && pos.x < cc.winSize.width * 0.5 && pos.y < cc.winSize.height * 0.4)
					moveRight = true;
			}
			else if(GameVars.switchedControls)
			{
				if(pos.x < cc.winSize.width * 0.99 && pos.x > cc.winSize.width * 0.8 && pos.y < cc.winSize.height * 0.4)
					moveRight = true;
			}
	
			if(!GameVars.switchedControls)
			{
				if(pos.x > cc.winSize.width / 2)
				{
					isJumping = true;
					if(GameVars.canJump)
					{
						cc.audioEngine.playEffect(res.jumpSnd_wav);
						event.getCurrentTarget().jump();
					}
				}
			}
			else if(GameVars.switchedControls)
			{
				if(pos.x < cc.winSize.width / 2)
				{
					isJumping = true;
					if(GameVars.canJump)
					{
						cc.audioEngine.playEffect(res.jumpSnd_wav);
						event.getCurrentTarget().jump();
					}
				}
			}
		}

		return true;
	},

	onTouchEnded:function(touch,event)
	{
		moveRight = false;
		moveLeft = false;
		isJumping = false;
		return true;
	},


	createPlayer:function()
	{	
		this.body = new cp.Body(1, cp.momentForBox(1, GameVars.playerSize * GameVars.scaleFactor, GameVars.playerSize * GameVars.scaleFactor));
		this.body.p = cc.p(this.posX,this.posY);
		this.space.addBody(this.body);
		this.shape = new cp.BoxShape(this.body, GameVars.playerSize * GameVars.scaleFactor, GameVars.playerSize * GameVars.scaleFactor - (5 * GameVars.scaleFactor));
		this.shape.setCollisionType(0);
		this.shape.setFriction(0.1)
		
		
		if(GameVars.isMulti)
		{
			if(GameVars.enemyColType == 0)
			{
				var bodySprite = cc.Sprite.create(res.playerRight1_png); this.addChild(bodySprite,0); bodySprite.setPosition(this.body.p.x,this.body.p.y);
				this.shape.image = bodySprite;
			}
			else
			{
				var bodySprite = cc.Sprite.create(res.playerRight1Blue_png); this.addChild(bodySprite,0); bodySprite.setPosition(this.body.p.x,this.body.p.y);
				this.shape.image = bodySprite
			}
		}
		else
		{
			var bodySprite = cc.Sprite.create(res.playerRight1_png); this.addChild(bodySprite,0); bodySprite.setPosition(this.body.p.x,this.body.p.y);
			this.shape.image = bodySprite;
		}
		
		this.space.addShape(this.shape);
	},
	
	stopMoving:function()
	{
		this.body.setVel(cc.p(0, 0));
	},

	resetPos:function()
	{
		this.body.p = cp.v(GameVars.startPosx, GameVars.startPosy);
	},
	
	boost:function(boostPower)
	{
		this.stopMoving();
		this.body.applyImpulse(cp.v(0, (boostPower * GameVars.scaleFactor)), cp.v(0, 0));
	},
	
	moveForCollision:function()
	{
		//Hack for moving and resetting the follow node
		this.body.p = cp.v(-4000, -4000);
		this.body.setVel(cc.p(0,0));
		GameVars.gravityFlipped = false;
	},

	update:function()
	{
		//Check movement
		if(moveRight)
		{
			if(GameVars.isGravityFlipped)
			{
				this.shape.image.setFlippedX(true);
			}
			else
			{
				this.shape.image.setFlippedX(false);
			}
			this.move(10 * GameVars.scaleFactor);
		}
		if(moveLeft)
		{
			if(GameVars.isGravityFlipped)
			{
				this.shape.image.setFlippedX(false);
			}
			else
			{
				this.shape.image.setFlippedX(true);
			}
			this.move(-10 * GameVars.scaleFactor);	
		}
		
		
		//Stop the body rotating
		this.body.w = 0;
		
		//keep sprite with physics body
		this.shape.image.x = this.body.p.x;
		this.shape.image.y = this.body.p.y;
		
		if(GameVars.isMulti && GameVars.canMove)
		{
			this.count++;
			
			//Send Update messages if in multiplayer game
			if(GameVars.scaleFactor == 2 && this.count % 1 == 0)
				networkLayer.socket.send(JSON.stringify({ type:'update', data: GameVars.oppId, dataX: this.body.p.x * 0.5.toFixed(2) , dataY: this.body.p.y * 0.5.toFixed(2)
					,flipped:this.shape.image.isFlippedX()}));
			else if(GameVars.scaleFactor == 1 && this.count % 1 == 0)
				networkLayer.socket.send(JSON.stringify({ type:'update', data: GameVars.oppId, dataX: this.body.p.x.toFixed(2) , dataY: this.body.p.y.toFixed(2), flipped:this.shape.image.isFlippedX()}));
		}
		
	},
	
	onExit:function()
	{
		this._super();
		cc.log("Player Exit");
	},

	move:function(moveX)
	{	
		this.body.applyImpulse(cp.v(moveX, 0), cp.v(0, 0));
	},

	jump:function()
	{		
		this.body.applyImpulse(cp.v(0, (GameVars.jumpPower * GameVars.scaleFactor)), cp.v(0, 0));	
		GameVars.canJump = false;
	},
	
});