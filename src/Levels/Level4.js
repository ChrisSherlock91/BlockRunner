var INIT_LEVEL4 = false;

var level4 = baseLayer.extend
({
	gravGradient:null,
	boostObj:null,
	swingSaw:null,

	ctor:function () 
	{
		//Check and turn off accel level
		if(GameVars.isAccelLvl) GameVars.isAccelLvl = false;
		
		this._super();
		
		//Array for Body pieces
		this.collEnt = [];

		//Init baseLevel
		this.init(4);
		
		//Array for Boost collisions
		this.boostObj = [];
		
		//Unlock current Level
		this.unlockLevel();
		
		//start Physics system
		this.initPhysics();
		
		//Create HUD Layer
		this.HudLayer = new HudLayer();
		
		//Create map for current level
		this.CreateMap();

		//Garident for background layer
		this.createBakcgroundGradient();

		GameVars.mapWidth =  this.map00.getContentSize().width;
		GameVars.mapHeight = this.map00.getContentSize().height;
		GameVars.mapX = this.map00.getPositionX();
		GameVars.mapY = this.map00.getPositionY();		
		
		//Create Layer structure
		this.gameLayer = new cc.Layer();
		this.gameLayer.addChild(this.gradient,0);
		this.loadBaseObjects(this.map00, true);
		this.loadObjects(this.map00, 0);
		this.mPlayer = new Player(GameVars.startPosx,GameVars.startPosy,this.space,this.sendId);
		this.gameLayer.addChild(this.mPlayer);
		this.gameLayer.addChild(this.map00,0);
		this.addChild(this.gameLayer);
		this.addChild(this.HudLayer);
		this.addChild(this.startTimerLabel);
		this.HudLayer.setVisible(false);
		
		//Add Gravity Switch Gradient
		this.gameLayer.addChild(this.gravGradient);

		//Start Sequence
		if(GameVars.scaleFactor == 2)
			this.startGameSeq(0.77,3350,180);
		else
			this.startGameSeq(0.65,2550,120);

		//create the intro numbers
		this.createNumbers(); 

		if(GameVars.scaleFactor == 2)
			this.startSequnce(3350,180);
		else
			this.startSequnce(2550, 120);

		//Create follow action on player to create a camera effects
		var followAction = cc.Follow.create(this.mPlayer.shape.image,cc.rect(0,0,this.map00.getContentSize().width, this.map00.getContentSize().height));
		this.gameLayer.runAction(followAction);

		this.stopHud = true;
		this.createPauseMenu(this.mPlayer,this);
		this.pauseBtn.visible = false;
		this.startMusic();
		GameVars.canMove = false;
	},

	loadObjects:function(map,mapIndex)
	{		
		//Load boost Object
		var boosters = map.getObjectGroup("boostObj");
		var boostArray = boosters.getObjects();
		for(var i = 0; i < boostArray.length; i++)
		{
			var boost = new Boost(this.space,cc.p(boostArray[i]["x"],boostArray[i]["y"]),boostArray[i]["width"],boostArray[i]["height"],boostArray[i]["type"]);
			this.gameLayer.addChild(boost);
			this.boostObj.push(boost);
		}
		
		//Load Gravity Switches
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
		
		//Set Gravity Gradient and Position
		this.gravGradient = cc.LayerGradient.create(cc.color(217,205,90,255),cc.color(242,205,90,255));
		this.gravGradient.setStartOpacity(100);
		this.gravGradient.setEndOpacity(100);
		this.gravGradient.setContentSize(950 * GameVars.scaleFactor,400 * GameVars.scaleFactor);
		this.gravGradient.x = switchArray[1]["x"];
		this.gravGradient.y = switchArray[1]["y"];

		//Create Saws
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
		//Boost Player and play animation
		this.mPlayer.boost(GameVars.boostAmount - (GameVars.boostAmount / 4));
		this.boostObj[0].startAnim();
		cc.audioEngine.playEffect(res.bounceSnd_wav);
	},
	
	collisionGravOn:function()
	{
		//Flip Gravity
		this.space.gravity = cp.v(0, (3150 * GameVars.scaleFactor));
		if(!GameVars.isGravityFlipped)
		{
			//If its not flipped then flip gravity
			cc.audioEngine.playEffect(res.gravitySwitch_mp3, 0);
			//Rotate sprite
			var action = cc.RotateBy.create(0.1, 180);
			this.mPlayer.shape.image.runAction(action);
		}
		GameVars.isGravityFlipped = true;
	},

	collisionGravOff:function()
	{
		//Flip Gravity Off
		this.space.gravity = cp.v(0, -(3150 * GameVars.scaleFactor));
		if(GameVars.isGravityFlipped)
		{
			//If the gravity has been flipped then flip again
			cc.audioEngine.playEffect(res.gravityOff_wav, 0);
			//Rotate the sprite
			var action = cc.RotateBy.create(0.1, 180);
			this.mPlayer.shape.image.runAction(action);
		}
		GameVars.isGravityFlipped = false;
	},
	
});

var gameSceneLvl4 = cc.Scene.extend({
	onEnter:function () 
	{
		this._super();

		if (INIT_LEVEL4 == false)
		{
			GameVars.canMove = true;
			INIT_LEVEL4 = true;
			var gameLay = new level4();
			this.addChild(gameLay);
		}
	}
});
