var INIT_LEVEL2 = false;

var level2 = baseLayer.extend
({
	initFollow:null,

	ctor:function () 
	{
		//Accelerometer Level
		GameVars.isAccelLvl = true;
		
		this._super();

		//Init Level 2 Super
		this.init(2);

		//Array for Collision bodies
		this.collEnt = [];

		//Unlock Level
		GameVars.levelLocks[GameVars.currLevel].level = 1;

		//start Physics system
		this.initPhysics();

		//Create HUD Layer
		this.HudLayer = new HudLayer();
		
		//Create Map
		this.map00 = new cc.TMXTiledMap(res.level2_tmx);

		//Create background gradient to level size
		this.gradientSize(this.map00.getMapSize().width * GameVars.TileSize, this.map00.getMapSize().height * GameVars.TileSize);

		GameVars.mapWidth =  this.map00.getContentSize().width;
		GameVars.mapHeight = this.map00.getContentSize().height;

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

		//Set offset for start sequence
		if(GameVars.scaleFactor == 2)
			this.startGameSeq(0.855,120,-1700);
		else
			this.startGameSeq(0.91, 50, -1100);

		//create the intro numbers
		this.createNumbers(); 

		if(GameVars.scaleFactor == 2)
			this.startSequnce(120,-1700);
		else
			this.startSequnce(50, -1100);

		//Create follow action on player to create a camera effects
		this.initFollow = cc.Follow.create(this.mPlayer.shape.image,cc.rect(0,0,this.map00.getContentSize().width, this.map00.getContentSize().height));
		this.gameLayer.runAction(this.initFollow);

		//Pause HUd and hide UI
		this.stopHud = true;
		this.createPauseMenu(this.mPlayer);
		this.pauseBtn.visible = false;
		this.startMusic();
		GameVars.canMove = false;
		
	},


	loadObjects:function(map,mapIndex)
	{		
		//Create Spikes from TMX map
		var spikes = map.getObjectGroup("spikes");
		var spikeArray = spikes.getObjects();
		for (var i = 0; i < spikeArray.length; i++)
		{
			var spike = new Spike(this.space,cc.p(spikeArray[i]["x"],spikeArray[i]["y"]),100,100,spikeArray[i]["type"]);
			this.gameLayer.addChild(spike);
		}
	}
});

var gameSceneLvl2 = cc.Scene.extend({
	onEnter:function () 
	{
		this._super();

		if (INIT_LEVEL2 == false)
		{
			GameVars.canMove = true;
			INIT_LEVEL2 = true;
			var gameLay = new level2();
			this.addChild(gameLay);
		}
	}
});