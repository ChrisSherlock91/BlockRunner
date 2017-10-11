var INIT_LEVEL5 = false;

var level5 = baseLayer.extend
({
	gravGradient:null,
	boostObj:null,
	initFollow:null,

	ctor:function () 
	{
		cc.log("Level five Init")
		
		//Check if accel level then turn off
		if(GameVars.isAccelLvl) GameVars.isAccelLvl = false;
		
		this._super();

		//Init with current level
		this.init(5);
		
		//Array for boost collision bodies
		this.collEnt = [];
		
		//Unlock the current level
		this.unlockLevel();
		
		//start Physics system
		this.initPhysics();
		
		//Create Hud Layer
		this.HudLayer = new HudLayer();
		
		this.map00 = new cc.TMXTiledMap(res.level5_tmx);
		this.gradientSize(this.map00.getMapSize().width * GameVars.TileSize, this.map00.getMapSize().height * GameVars.TileSize);

		GameVars.mapWidth =  this.map00.getContentSize().width;
		GameVars.mapHeight = this.map00.getContentSize().height;
		GameVars.mapX = this.map00.getPositionX();
		GameVars.mapY = this.map00.getPositionY();		

		//Create Layer structure
		this.gameLayer = new cc.Layer();
		this.gameLayer.addChild(this.gradient,0);
		this.loadBaseObjects(this.map00, true);
		this.loadObjects(this.map00, 0);
		this.mPlayer = new Player(GameVars.startPosx,GameVars.startPosy,this.space);
		this.gameLayer.addChild(this.mPlayer);
		this.gameLayer.addChild(this.gravGradient);
		this.gameLayer.addChild(this.map00,0);
		this.addChild(this.gameLayer);
		this.addChild(this.HudLayer);
		this.HudLayer.setVisible(false);
		this.addChild(this.startTimerLabel);
		
		//Start offset sequence
		if(GameVars.scaleFactor == 2)
			this.startGameSeq(0.53,1550,360);
		else
			this.startGameSeq(0.45,1150,180);

		//create the intro numbers
		this.createNumbers(); 

		if(GameVars.scaleFactor == 2)
			this.startSequnce(1550,360);
		else
			this.startSequnce(1150, 180);

		//Create follow action on player to create a camera effects
		this.initFollow = cc.Follow.create(this.mPlayer.shape.image,cc.rect(0,0,this.map00.getContentSize().width, this.map00.getContentSize().height));
		this.gameLayer.runAction(this.initFollow);

		this.stopHud = true;
		
		//Dont allow the player to move untill after the countdown
		GameVars.canMove = false;
		
		this.createPauseMenu(this.mPlayer,this);
		this.pauseBtn.visible = false;
		this.startMusic();
	},

	loadObjects:function(map,mapIndex)
	{		
		//Load boost Objects
		var boosters = map.getObjectGroup("boostObj");
		var boostArray = boosters.getObjects();
		for(var i = 0; i < boostArray.length; i++)
		{
			var boost = new Boost(this.space,cc.p(boostArray[i]["x"],boostArray[i]["y"]),boostArray[i]["width"],boostArray[i]["height"],boostArray[i]["type"]);
			this.gameLayer.addChild(boost);
		}

		//Load gravity Switch Objects
		var gravSwitch = map.getObjectGroup("switch");
		var switchArray = gravSwitch.getObjects();
		for(var i = 0; i < switchArray.length; i++)
		{
			var collType = SpriteTag.gravOn;
			if(switchArray[i]["type"] == 1)
			{
				collType = SpriteTag.gravOff;
			}
			createStaticBody(this.space,cc.p(switchArray[i]["x"] + switchArray[i]["width"] / 2, switchArray[i]["y"] + switchArray[i]["height"] / 2),
					switchArray[i]["width"],switchArray[i]["height"],true,collType);
		}
		
		//Load swing saw objects
		var swingSaw = map.getObjectGroup("swingSaw");
		var swingArray = swingSaw.getObjects();
		for(var i = 0; i < swingArray.length; i++)
		{
			var swingSaw = new SpinningSaw(this.space,cc.p(swingArray[i]['x'], swingArray[i]['y']), swingArray[i]['type']);
			this.swingSaw.push(swingSaw);
			this.gameLayer.addChild(swingSaw);
		}
		
		//Load gravity switch gradient
		this.gravGradient = cc.LayerGradient.create(cc.color(217,205,90,255),cc.color(242,205,90,255));
		this.gravGradient.setStartOpacity(100);
		this.gravGradient.setEndOpacity(100);
		this.gravGradient.setContentSize(360 * GameVars.scaleFactor,1000 * GameVars.scaleFactor);
		this.gravGradient.x = switchArray[1]["x"];
		if(GameVars.scaleFactor == 1)
			this.gravGradient.y = switchArray[1]["y"] + GameVars.TileSize;
		else
			this.gravGradient.y = switchArray[1]["y"];

		//Load Saws
		var saws = map.getObjectGroup("saws");
		var sawArray = saws.getObjects();
		for (var i = 0; i < sawArray.length; i++)
		{
			var saw = new Saw(this.space,cc.p(sawArray[i]["x"] + sawArray[i]["width"] / 2,sawArray[i]["y"] + sawArray[i]["height"] / 2));
			this.gameLayer.addChild(saw);
		}
	},

	collisionBoost:function(arbiter,space)
	{
		this.mPlayer.boost(1500);
		cc.audioEngine.playEffect(res.bounceSnd_wav);
	},

	collisionGravOn:function()
	{
		//Flip Gravity
		this.space.gravity = cp.v(0, (GameVars.gravity * GameVars.scaleFactor));
		if(!GameVars.isGravityFlipped)
		{
			//If its not flipped already then flip it
			cc.audioEngine.playEffect(res.gravitySwitch_mp3, 0);
			var action = cc.RotateBy.create(0.1, 180);
			this.mPlayer.shape.image.runAction(action);
		}
		GameVars.isGravityFlipped = true;
	},

	collisionGravOff:function()
	{
		//Flip gravity back
		this.space.gravity = cp.v(0, -(GameVars.gravity * GameVars.scaleFactor));
		if(GameVars.isGravityFlipped)
		{
			//If its flipped back then rotate sprite
			cc.audioEngine.playEffect(res.gravityOff_wav, 0);
			var action = cc.RotateBy.create(0.1, 180);
			this.mPlayer.shape.image.runAction(action);
		}
		GameVars.isGravityFlipped = false;
	},
	
	onExit:function()
	{
		this._super();
		for(var i in this.swingSaw)
		{
			this.gameLayer.removeChild(this.swingSaw[i]);
		}
		cc.log("Level five Exit")
	}
	
});

var gameSceneLvl5 = cc.Scene.extend({
	onEnter:function () 
	{
		this._super();

		if (INIT_LEVEL5 == false)
		{
			GameVars.canMove = true;
			INIT_LEVEL5 = true;
			var gameLay = new level5();
			this.addChild(gameLay);
		}
	}
});
