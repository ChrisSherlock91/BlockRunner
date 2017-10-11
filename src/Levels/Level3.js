var INIT_LEVEL3 = false;

var level3 = baseLayer.extend
({
	boostObj:null,

	ctor:function () 
	{	
		//Check if its accel level still
		if(GameVars.isAccelLvl) GameVars.isAccelLvl = false;
		
		this._super();

		this.init(3);
		
		//Array for boost objects used for collisions
		this.boostObj = [];
		
		this.collEnt = [];
		
		//Unlock the Current Level
		this.unlockLevel();
		
		//start Physics system
		this.initPhysics();
		
		//Create HUD Lyer
		this.HudLayer = new HudLayer();
		
		//Load Map For Current Level
		this.CreateMap();
		
		//Create Gradient for background
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
		this.mPlayer = new Player(GameVars.startPosx,GameVars.startPosy,this.space,this.sendId);
		this.gameLayer.addChild(this.mPlayer);
		this.gameLayer.addChild(this.map00,0);
		this.addChild(this.gameLayer);
		this.addChild(this.HudLayer);
		this.addChild(this.startTimerLabel);
		this.HudLayer.setVisible(false);

		//Start Sequence offset
		if(GameVars.scaleFactor == 2)
			this.startGameSeq(0.78,150,1550);
		else
			this.startGameSeq(0.78,150,800);

		//create the intro numbers
		this.createNumbers(); 

		if(GameVars.scaleFactor == 2)
			this.startSequnce(150,1550);
		else
			this.startSequnce(150, 800);

		//Create follow action on player to create a camera effects
		var followAction = cc.Follow.create(this.mPlayer.shape.image,cc.rect(0,0,this.map00.getContentSize().width, this.map00.getContentSize().height));
		this.gameLayer.runAction(followAction);

		//Stop Hud
		this.stopHud = true;
		this.createPauseMenu(this.mPlayer,this);
		this.pauseBtn.visible = false;
		this.startMusic();
		GameVars.canMove = false;
		
	},

	loadObjects:function(map,mapIndex)
	{		
		//Load Boost Objects
		var boosters = map.getObjectGroup("boostObj");
		var boostArray = boosters.getObjects();
		for(var i = 0; i < boostArray.length; i++)
		{
			var boost = new Boost(this.space,cc.p(boostArray[i]["x"],boostArray[i]["y"]),100,100,boostArray[i]["type"]);
			this.gameLayer.addChild(boost);
			this.boostObj.push(boost);
		}
		
		//Load Saw Objects
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
		//Boost player and play animation
		this.mPlayer.boost(GameVars.boostAmount);
		this.boostObj[0].startAnim();
		cc.audioEngine.playEffect(res.bounceSnd_wav);
	}
});

var gameSceneLvl3 = cc.Scene.extend({
	onEnter:function () 
	{
		this._super();

		if (INIT_LEVEL3 == false)
		{
			GameVars.canMove = true;
			INIT_LEVEL3 = true;
			var gameLay = new level3();
			this.addChild(gameLay);
		}
	}
});
