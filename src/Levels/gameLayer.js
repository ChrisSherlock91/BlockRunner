var INIT_GAME = false;

var levelOne = baseLayer.extend
({
	initFollow:null,
	
	ctor:function (id) 
	{
		this._super();
		
		this.init(1);
		
		//Array for Collision bodies
		this.collEnt = [];
		
		//Unlock the Level
		GameVars.levelLocks[GameVars.currLevel].level = 1;
		
		//start Physics system
		this.initPhysics();
		
		//Create New HUD
		this.HudLayer = new HudLayer();
		
		//Init Map
		this.map00 = new cc.TMXTiledMap(res.map_tmx);
		this.gradientSize(this.map00.getMapSize().width * GameVars.TileSize, this.map00.getMapSize().height * GameVars.TileSize);
		GameVars.mapWidth =  this.map00.getContentSize().width;
		GameVars.mapHeight = this.map00.getContentSize().height;
		
		//Create Layer structure
		this.gameLayer = new cc.Layer();
		this.gameLayer.addChild(this.gradient,0);
		this.loadBaseObjects(this.map00,true);
		this.loadObjects(this.map00, 0);
		this.mPlayer = new Player(GameVars.startPosx,GameVars.startPosy,this.space);
		this.gameLayer.addChild(this.mPlayer);
		this.gameLayer.addChild(this.map00,0);
		this.addChild(this.gameLayer);
		this.addChild(this.HudLayer);
		this.HudLayer.setVisible(false);
		this.addChild(this.startTimerLabel);
		
		//Set for start Sequence offsets
		var camX = 550;
		var camY = 230;
		
		if(GameVars.scaleFactor == 2)
		{
			camX = 650;
			camY = 315;
		}
		
		var scale = 0.59;
		
		//Move the Layer to this pos and scale
		this.startGameSeq(scale,camX,camY);
		
		//create the intro if tilt level
		this.createNumbers(); 
		
		//Move back to 0,0
		this.startSequnce(camX,camY);
		
		//Create follow action on player to create a camera effects
		this.initFollow = cc.Follow.create(this.mPlayer.shape.image,cc.rect(0,0,this.map00.getContentSize().width, this.map00.getContentSize().height));
		this.gameLayer.runAction(this.initFollow);
		
		//Dont update the HUD
		this.stopHud = true;
		
		//Dont allow the player to move untill after the countdown
		GameVars.canMove = false;
	
		this.createPauseMenu(this.mPlayer);
		
		this.pauseBtn.visible = false;
		
		this.startMusic();
		
	},	
	
	loadObjects:function(map,mapIndex)
	{
		//Load all the Saw Objects
		var saws = map.getObjectGroup("Saw");
		var sawArray = saws.getObjects();

		for (var i = 0; i < sawArray.length; i++)
		{
			var saw = new Saw(this.space,cc.p(sawArray[i]["x"] + sawArray[i]["width"] / 2,sawArray[i]["y"] + sawArray[i]["height"] / 2));
			this.gameLayer.addChild(saw);
		}
	}
});


var gameScene = cc.Scene.extend({
	onEnter:function (id) 
	{
		this._super();

		if (INIT_GAME == false)
		{
			GameVars.canMove = false;
			INIT_GAME = true;
			var gameLay = new levelOne(id);
			this.addChild(gameLay);
		}
	}
});
