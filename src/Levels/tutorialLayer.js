//For Creating Scenes
var INIT_TUT = false;

var tutLayer = baseLayer.extend
({
	//goal:null,
	label:null,
	highlight:null,
	highlightBtn:null,
	gradient:null,

	ctor:function () 
	{
		this._super();
		
		//Init as Tutorial Level
		this.init(0);

		//Set up Physics
		this.initPhysics();
		
		//Used for positioning player
		if(GameVars.scaleFactor == 1)
			this.mPlayer = new Player(200,400,this.space);
		else
			this.mPlayer = new Player(500,1000,this.space);
		
		//New HUDLayer
		this.HudLayer = new HudLayer();
		
		//Create Map
		this.map00 = new cc.TMXTiledMap(res.tutMap2);
		
		//Set backGround Size
		this.gradientSize(this.map00.getMapSize().width * GameVars.TileSize, this.map00.getMapSize().height * GameVars.TileSize);
		
		//Get Size Vars
		this.mapWidth = this.getMapWidth();
		this.loadObjects(this.map00, 0);

		//Create a Game Layer
		this.gLayer = new cc.Layer();
		this.gLayer.addChild(this.gradient,0);
		this.gLayer.addChild(this.mPlayer);
		this.gLayer.addChild(this.map00,0);
		this.addChild(this.gLayer);
		this.addChild(this.HudLayer);
		
		//Create Goal Object
		var goals = this.map00.getObjectGroup("Goal");
		var goalArray = goals.getObjects();
		createStaticBody(this.space,cc.p(goalArray[0]["x"] + goalArray[0]["width"] / 2,goalArray[0]["y"] + goalArray[0]["height"] / 2),
				goalArray[0]["width"],goalArray[0]["height"],true,SpriteTag.goal);
		
		//Highlight boxes added
		this.highlight = cc.Sprite("#highlight.png");
		this.highlight.x = this.screenSize.width * 0.9;
		this.highlight.y = this.screenSize.height * 0.94;
		this.highlight.setVisible(false);
		this.addChild(this.highlight);
		
		//Gradient for Jump Highlight
		this.gradient = cc.LayerGradient.create(cc.color(242,205,90,255),cc.color(242,205,90,255));
		this.gradient.setStartOpacity(100);
		this.gradient.setContentSize(cc.winSize.width,cc.winSize.height);
		this.gradient.x = cc.winSize.width * 0.5;
		this.gradient.y = 0;
		this.gradient.visible = false;
		this.addChild(this.gradient);
		
		
		this.highlightBtn = cc.Sprite("#highlightBtn.png");
		if(!GameVars.switchedControls)
			this.highlightBtn.x = this.screenSize.width * 0.1;
		else
			this.highlightBtn.x = this.screenSize.width * 0.7;
		this.highlightBtn.y = this.screenSize.height * 0.07;
		this.highlightBtn.setScale(0.5, 0.5);
		this.addChild(this.highlightBtn);
		
		//This check for display which tutorial information to show
		var s = "";
		
		if (!cc.sys.capabilities.hasOwnProperty('touches'))
		{
			this.highlightBtn.setVisible(false);
			s = "A";
		}
		
		var string = "Press" + " " + s + " " + "to Move Left";
		//Set Text for tutorial
		this.label = new cc.LabelBMFont(string, res.menuFont_ttf);
		if(GameVars.scaleFactor == 2)
			this.label.setScale(1 * GameVars.scaleFactor);
		this.label.setPosition(cc.p(this.screenSize.width / 2,this.screenSize.height / 2));
		this.label.setColor(cc.color(255, 0, 0));
		this.addChild(this.label);
		
		//Actions for tutorial level
		var sprite_action2 = cc.FadeTo.create(2.0, 0);
		var sprite_action = cc.FadeIn.create(1.0);
		
		//Actions to set and change tutorial messages and highlights
		var highlightLeft = cc.callFunc(this.setHighlightLeft,this);
		var highLightRight = cc.callFunc(this.moveHighlightBtn,this);
		var highLightJump = cc.callFunc(this.moveHighlightJump,this);
		var highlight = cc.callFunc(this.setHighlight,this);
		var finish = cc.CallFunc.create(this.loadRightMove, this);
		var changeText = cc.CallFunc.create(this.loadJumpText, this);
		var timerText = cc.CallFunc.create(this.loadTimerText, this);
		var endSequence = cc.CallFunc.create(this.endSeq, this);
		var delayTime = 0.5;
		
		//Run the sequence of actions on the label
		this.label.runAction(cc.Sequence(cc.delayTime(delayTime), sprite_action2,highlightLeft,cc.delayTime(delayTime),finish,highLightRight,sprite_action,sprite_action2,
				highlightLeft,cc.delayTime(delayTime),changeText,highLightJump,sprite_action,sprite_action2,highlightLeft,cc.delayTime(delayTime),timerText,
				sprite_action,highlight,sprite_action2,
				endSequence));

		//Set a "Camera" Effect to follow the player
		var followAction = cc.Follow.create(this.mPlayer.shape.image,cc.rect(0,0, this.mapWidth, this.map00.getContentSize().height));
		this.gLayer.runAction(followAction);
		
		GameVars.canMove = true;
		this.createPauseMenu(this.player);
		this.scheduleUpdate();
		this.startMusic();
	},
	
	endSeq:function()
	{
		//Create goal to let player move on to next level
		this.highlight.setVisible(false);
	},
	
	setHighlight:function()
	{
		this.highlight.setVisible(true);
		this.gradient.visible = false;
	},
	
	setHighlightLeft:function()
	{
		if (cc.sys.capabilities.hasOwnProperty('touches'))
			this.highlightBtn.setVisible(false);
	},
	
	moveHighlightBtn:function()
	{
		if (cc.sys.capabilities.hasOwnProperty('touches'))
		{
			if(!GameVars.switchedControls)
				this.highlightBtn.x = cc.director.getWinSize().width * 0.3;
			else
				this.highlightBtn.x = cc.director.getWinSize().width * 0.9;
			this.highlightBtn.setVisible(true);
		}
	},
	
	moveHighlightJump:function()
	{
		if (cc.sys.capabilities.hasOwnProperty('touches'))
		{
			this.gradient.visible = true;
		}
	},
	
	loadObjects:function(map,mapIndex)
	{		
		//Load all objects in the arrays
		var platforms = map.getObjectGroup("Floor");
		var platArray = platforms.getObjects();
		for (var i = 0; i < platArray.length; i++)
		{
			createStaticBody(this.space,cc.p(platArray[i]["x"] + platArray[i]["width"] / 2,platArray[i]["y"] + platArray[i]["height"] / 2),
					platArray[i]["width"],platArray[i]["height"],false,SpriteTag.floor,0.7);	
		}

		var walls = map.getObjectGroup("wall");
		var wallArray = walls.getObjects();
		for (var i = 0; i < wallArray.length; i++)
		{
			createStaticBody(this.space,cc.p(wallArray[i]["x"] + wallArray[i]["width"] / 2,wallArray[i]["y"] + wallArray[i]["height"] / 2),
					wallArray[i]["width"],wallArray[i]["height"],false,SpriteTag.wall,0)
		}
	},
	
	loadRightMove:function()
	{
		var s = "";
		if (!cc.sys.capabilities.hasOwnProperty('touches'))
			this.label.setString("Press" + " " + "D" + " " + "to Move Right");
		else
			this.label.setString("Press" + " " + "to Move Right");
	},
	
	loadJumpText:function()
	{
		var s = "";
		if (!cc.sys.capabilities.hasOwnProperty('touches'))
			s = "W";
		this.label.setString("Press" + " " + s + " " + "to Jump");
	},
	
	loadTimerText:function()
	{
		this.label.setString("This Is Your Current Time");
	}
});

var tutScene = cc.Scene.extend({
	onEnter:function () 
	{
		this._super();

		if (INIT_TUT == false)
		{
			INIT_TUT = true;
			var layer = new tutLayer();
			this.addChild(layer);
		}
	}
});
