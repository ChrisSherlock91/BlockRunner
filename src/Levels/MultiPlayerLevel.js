var INIT_MULTI_GAME = false;
var placeMentTiles = [];
var bombOnce = true;
var touchLeft = false;
var touchRight = false;
var touchUp = false;
var touchDown = false;
var moving = false;
var startTouch;
var endTouch;
var swipeTolerance = 10;
var speedX = 0;
var speedY = 0;
var pos = 0;
var self;

var multiLevel = baseLayer.extend
({
	mPlayer:null,
	mPlayer2:null,
	gameLayer:null,
	time:0,
	stopHud:false,
	doOnce:false,
	startOnce:false,
	collLayer:null,
	checkFin:null,
	sendId:null,
	timerLabel:null,
	timeCount:5,
	sequenceX:null,
	sequenceY:null,
	mulitWeaponScreen:null,
	menuBtn:null,
	bombs:null,
	followSprite:null,
	
	ctor:function (id) 
	{
		this._super();

		this.init(10);
		
		self = this;
		
		//For holding bombs and body pieces
		this.bombs = [];
		this.collEnt = [];
		//This is for saw placement places
		placeMentTiles = [];
		
		var mapScaleSize = 0.59;
		
		//Tell the other player your ready to start
		//networkLayer.socket.send(JSON.stringify({ type:'ready', oppId: GameVars.oppId , id: GameVars.myId}));

		//start Physics system
		this.initPhysics();

		//Create Hud Layer
		this.HudLayer = new HudLayer();
		
		//Create map
		this.map00 = new cc.TMXTiledMap(res.multiMap_tmx);

		//load Background Gradient
		this.gradientSize(this.map00.getMapSize().width * GameVars.TileSize, this.map00.getMapSize().height * GameVars.TileSize);
		GameVars.mapWidth =  this.map00.getContentSize().width;
		GameVars.mapHeight = this.map00.getContentSize().height;
		GameVars.mapX = this.map00.getPositionX();
		GameVars.mapY = this.map00.getPositionY();
		
		//Create weapon menu button
		this.menuBtn = new ccui.Button();
		this.menuBtn.loadTextures(res.MultiMenuBtn,res.MultiMenuBtnDown)
		this.menuBtn.setScale(0.7 * GameVars.scaleFactor,0.7 * GameVars.scaleFactor);
		this.menuBtn.x = cc.director.getWinSize().width * 0.05;
		this.menuBtn.y = cc.director.getWinSize().height * 0.9;
		this.menuBtn.addTouchEventListener(this.backBtnPressed, this);
		this.menuBtn.visible = false;

		//Create Layer structure
		this.gameLayer = new cc.Layer();
		this.gameLayer.addChild(this.gradient,0);
		this.loadBaseObjects(this.map00,false);
		this.loadObjects(this.map00, 0);
		this.mPlayer = new Player(GameVars.startPosx,GameVars.startPosy,this.space);
		this.gameLayer.addChild(this.mPlayer,3);
		this.gameLayer.addChild(this.map00,2);
		this.mPlayer2 = new GhostPlayer(0,-5000,this.space);
		this.gameLayer.addChild(this.mPlayer2,2);
		this.addChild(this.gameLayer);
		this.addChild(this.HudLayer);
		this.addChild(this.menuBtn);
		this.HudLayer.setVisible(false);
		this.addChild(this.startTimerLabel);
		
		//Create new weapon menu
		this.mulitWeaponScreen = new MultiWeaponsSelect();
		this.mulitWeaponScreen.visible = false;
		this.addChild(this.mulitWeaponScreen);

		//Start the sequence
		this.setSequencePositions();
		this.startGameSeq(mapScaleSize, this.sequenceX, this.sequenceY);

		//create the intro numbers
		this.createNumbers(); 
		
		//Create follow action on player to create a camera effects
		this.followActionPlayer = cc.Follow.create(this.mPlayer.shape.image,cc.rect(0,0,GameVars.mapWidth - (GameVars.TileSize / 2), GameVars.mapHeight - (GameVars.TileSize / 2)));
		this.gameLayer.runAction(this.followActionPlayer);

		this.stopHud = true;
		GameVars.canMove = false;

		this.createPauseMenu(this.mPlayer);

		this.pauseBtn.visible = false;
		this.startMusic();

		//Create end countdown label
		this.timerLabel = new cc.LabelBMFont("5", res.menuFont_ttf);
		this.timerLabel.setScale(3 * GameVars.scaleFactor,3 * GameVars.scaleFactor)
		this.timerLabel.setPosition(cc.p(cc.winSize.width * 0.5, cc.winSize.height * 0.5));
		this.timerLabel.color = cc.color.RED;
		this.timerLabel.visible = false;
		this.timerLabel.setOpacity(90);
		this.addChild(this.timerLabel);
		
		GameVars.startGame = true;
		
		//Invisible sprite used for scrolling level
		this.followSprite = new cc.Sprite("#player2.png");
		this.followSprite.x = 500;
		this.followSprite.y = 500;
		this.gameLayer.addChild(this.followSprite);
		
		//Touch listener for saw tiles
		this.lightListener = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: false,
			onTouchBegan: this.onTouchBegan,
			onTouchMoved: this.onTouchMoved,
			onTouchEnded: this.onTouchEnded
		});
		cc.eventManager.addListener(this.lightListener, this.gameLayer);
		
		this.scheduleUpdate();
	},
	
	collisionBomb:function()
	{
		this.coll = true;
	},
	
	swipeDirection:function()
	{
		//Get direction of movement and set the speed
		var distX = startTouch.x - endTouch.x;
		var distY = startTouch.y - endTouch.y;
		if(Math.abs(distX) + Math.abs(distY) > swipeTolerance)
		{
			speedX = (distX / 10);
			speedY = (distY / 10);
		}
	},
	
	movefunction:function(x,y)
	{
	},
	
	onTouchEnded:function(touch,event)
	{
		//Stop when the swipe ends
		speedX = 0;
		speedY = 0;	
		if(moving)
		{
			moving = false;
		}
	},
	
	onTouchMoved:function(touch,event)
	{
		//Get the swipe and move the invisible sprite around the screen
		var target = event.getCurrentTarget();
		var location = target.convertToNodeSpace(touch.getLocation());
		
		if(self.mulitWeaponScreen.visible == true)
		{
			moving = true;
			var distX = pos.x - touch.getLocation().x;
			var distY = pos.y - touch.getLocation().y; 
			if(distX)
				speedX += (distX / 10) * -1;
			if(distY)
				speedY += (distY / 10) * -1;
			
			pos = touch.getLocation();
			
		    
		}
	},
	
	onTouchBegan:function(touch,event)
	{
		//Get initial touch for getting direction of movement
		var target = event.getCurrentTarget();
		var location = target.convertToNodeSpace(touch.getLocation());
		startTouch = touch.getLocation();
		
		pos.x = touch.getLocation().x;
		pos.y = touch.getLocation().y;
		
		//Check if a bomb is selected
		if(self.mulitWeaponScreen.visible && GameVars.NumBombs != 0 && self.mulitWeaponScreen.checkBombBtnPressed() && bombOnce == true)
		{
			//If so create a bomb and tell the other player
			self.createBomb(location.x,location.y)
			bombOnce = false;
			var callFunc = cc.callFunc(self.setBombActive,self);
			self.runAction(cc.sequence(cc.delayTime(1),callFunc));
			//networkLayer.socket.send(JSON.stringify({ type:'bomb', dataX: location.x.toFixed(2) , dataY: location.y.toFixed(2), opId: GameVars.oppId , scale: GameVars.scaleFactor}));
		}
		
		return true;
	},
	
	//Used for initial scale and positions of movement for intro sequence
	setSequencePositions:function()
	{
		if(GameVars.scaleFactor == 1)
		{
			if(GameVars.oppId % 2 == 0)
			{
				this.sequenceX =  GameVars.mapWidth / 2.64;
			}
			else
			{
				this.sequenceX = -GameVars.mapWidth / 2.64;
			}
			this.sequenceY =  GameVars.mapHeight / 4.54;
		}
		else
		{
			if(GameVars.oppId % 2 == 0)
			{
				this.sequenceX =  GameVars.mapWidth / 5;
			}
			else
			{
				this.sequenceX =  -GameVars.mapWidth / 5;
			}

			this.sequenceY =  GameVars.mapHeight / 6;
		}

	},
	
	//If weapon button pressed
	backBtnPressed:function(sender,type)
	{
		switch (type)
		{
		case ccui.Widget.TOUCH_ENDED:
			cc.audioEngine.playEffect(res.buttonClick_mp3);
			this.mulitWeaponScreen.visible = true;
			this.mulitWeaponScreen.setBombBtnBack();
			this.mulitWeaponScreen.setSawBtnBack();
			this.mPlayer.stopMoving();
			//Change action to follow invisible sprite
			var foll = cc.Follow.create(this.followSprite,cc.rect(0,0, GameVars.mapWidth, GameVars.mapHeight));
			this.gameLayer.runAction(foll);
			GameVars.isGhostScreen = true;
			GameVars.canMove = false;
			break;

			break;                
		}
	},

	loadObjects:function(map,mapIndex)
	{
		var whichGoal;
		if(GameVars.oppId % 2 == 0)
		{
			whichGoal = 0;
		}
		else
		{
			whichGoal = 1;
			GameVars.enemyColType = 1;
		}
		
		//Load which goal is yours
		var goals = this.map00.getObjectGroup("Goal");
		var goalArray = goals.getObjects();
		createStaticBody(this.space,cc.p(goalArray[whichGoal]["x"],goalArray[whichGoal]["y"]),
				goalArray[whichGoal]["width"],goalArray[whichGoal]["height"],true,SpriteTag.goal,0);
		
		//Load which start is yours
		var start = this.map00.getObjectGroup("start");
		var startArray = start.getObjects();
		GameVars.startPosx = startArray[whichGoal]["x"] + startArray[whichGoal]["width"] / 2;
		GameVars.startPosy = startArray[whichGoal]["y"] + startArray[whichGoal]["height"] / 2;
		
		
		//Load all placement tiles for saws
		var objects = this.map00.getObjectGroup("objects");
		var objectArray = objects.getObjects();
		for (var i = 0; i < objectArray.length; i++)
		{
			var objTile = new ObjectTile();
			objTile.x = objectArray[i]["x"] + objectArray[i]["width"] / 2;
			objTile.y = objectArray[i]["y"] + objectArray[i]["height"] / 2;
			objTile.visible = false;
			this.gameLayer.addChild(objTile,100);
			placeMentTiles.push(objTile);
		}
	},

	sendTime:function()
	{
		//Send to the server you havent reached the goal withing the time allocated
		//networkLayer.socket.send(JSON.stringify({ type: 'timeout' ,oppId: GameVars.oppId , mineId: GameVars.myId}));
	},
	
	createEnemySaw:function(index)
	{
		//Create a saw in the position of the tile pressed
		var saw = new Saw(this.space,cc.p(placeMentTiles[index].x,placeMentTiles[index].y));
		this.gameLayer.addChild(saw,1);
		this.gameLayer.removeChild(placeMentTiles[index]);
		if (index > -1) 
		{
			placeMentTiles.splice(index, 1);
		}
	},
	
	createSaw:function(posX,posY)
	{
		//Create a new Saw
		var saw = new Saw(this.space,cc.p(posX,posY),SpriteTag.yourSaw);
		this.gameLayer.addChild(saw,1);
		GameVars.NumSaws--;
		this.mulitWeaponScreen.setSawBtn();
	},
	
	createBomb:function(posX,posY)
	{
		//Create a new Bomb
		var bomb = new Bomb(this.space,cc.p(posX,posY));
		this.gameLayer.addChild(bomb,2);
		GameVars.NumBombs--;
		this.mulitWeaponScreen.setBombBtn();
		this.bombs.push(bomb);
	},
	
	createEnemyBomb:function(posX,posY)
	{
		//Scaling positions between 2x and 1x so bomb is created in the correct position
		if(GameVars.enemyScale == 2 && GameVars.scaleFactor == 1)
		{
			posX = posX * 0.5;
			posY = posY * 0.5;
		}
		if(GameVars.enemyScale == 1 && GameVars.scaleFactor == 2)
		{
			posX = posX * 2;
			posY = posY * 2;
		}

		var point = cc.p(posX, posY);
		var bomb = new Bomb(this.space,point);
		this.gameLayer.addChild(bomb,2);
		this.bombs.push(bomb);
	},
	
	setBombActive:function()
	{
		bombOnce = true;
	},
	
	update:function(dt)
	{
		
		//Change follow action nodes between game and weapon menu
		if(GameVars.switchFollow)
		{
			var follow = cc.Follow.create(this.mPlayer.shape.image,cc.rect(0,0,GameVars.mapWidth - (GameVars.TileSize / 2), GameVars.mapHeight - (GameVars.TileSize / 2)));
			this.gameLayer.runAction(follow);
			GameVars.switchFollow = false;
		}
		
		//Track the player while your not in the weapon screen
		if(!this.mulitWeaponScreen.visible)
		{
			this.followSprite.x = this.mPlayer.shape.image.x;
			this.followSprite.y = this.mPlayer.shape.image.y;
		}
		
		//Move the invisible sprite in the direction of your swipe
		if(this.mulitWeaponScreen.visible && !this.mulitWeaponScreen.sawBtn.btnSelected && !this.mulitWeaponScreen.bombBtn.btnSelected)
		{	
			if(speedX > 0 && this.followSprite.x < GameVars.mapWidth - (cc.winSize.width / 2))
			{
				this.followSprite.x += speedX;
			}
			if(speedX < 0 && this.followSprite.x > cc.winSize.width / 2)
			{
				this.followSprite.x += speedX;
			}
			
			if(speedY > 0 && this.followSprite.y < GameVars.mapHeight - (cc.winSize.height / 2))
			{
				this.followSprite.y += speedY;
			}

			if(speedY < 0 && this.followSprite.y > cc.winSize.height / 2)
			{
				this.followSprite.y += speedY;
			}
		}
		else
		{
			speedX = 0;
			speedY = 0;
		}
		
		
		//Dipslay placement tile if weapon menu is visible
		if(this.mulitWeaponScreen.visible)
		{	
			for (var i = 0; i < placeMentTiles.length; i++)
			{
				placeMentTiles[i].visible = true;
			}
		}
		else
		{
			for (var i = 0; i < placeMentTiles.length; i++)
			{
				placeMentTiles[i].visible = false;
			}
		}
		
		for (var i = 0; i < placeMentTiles.length; i++)
		{
			if(placeMentTiles[i].visible)
			{
				//If placement tile is pressed
				if(placeMentTiles[i].checkHit && GameVars.NumSaws != 0 && this.mulitWeaponScreen.checkSawBtnPressed())
				{
					//Create a saw locally
					this.createSaw(placeMentTiles[i].x, placeMentTiles[i].y)
					//Tell the other player where you created a saw
					//networkLayer.socket.send(JSON.stringify({ type:'saw', dataX: i , opId: GameVars.oppId}));
					//Remove that placement tiles from the array and scene
					this.gameLayer.removeChild(placeMentTiles[i]);
					if (i > -1) 
					{
						placeMentTiles.splice(i, 1);
					}
				}
			}
		}
	
		for(var i = 0; i < this.bombs.length; i++)
		{
			if(this.bombs[i].dead)
			{
				GameVars.canJump = true;
				this.gameLayer.removeChild(this.bombs[i]);
				this.bombs.splice(i,1);
			}
		}
		
		if(this.mulitWeaponScreen.checkSawBtnPressed() == true )
		{
			if(this.mulitWeaponScreen.checkBombBtnPressed() == true)
			{
				this.mulitWeaponScreen.setSawBtnBack();
			}
		}
		
		if(GameVars.createSaw)
		{
			this.createEnemySaw(GameVars.enemySawIndex);
			GameVars.createSaw = false;
		}
		
		if(GameVars.createBomb)
		{
			this.createEnemyBomb(GameVars.enemyBombX,GameVars.enemybombY);
			GameVars.createBomb = false;
		}
		
		this.space.step(dt);
		
		if(GameVars.canMove)
		{
			this.menuBtn.visible = true;
		}
		else
		{
			this.menuBtn.visible = false;
			this.mPlayer.stopMoving();
		}
		
		if(GameVars.otherFin == true)
		{
			this.startTimer();
			GameVars.otherFin = false;
		}

		if(GameVars.startGame == true && this.startOnce == false)
		{
			this.startSequnce(this.sequenceX, this.sequenceY);
			this.startOnce = true;
		}

		//check collision then run the explosion effect
		if(this.coll == true && this.doOnce == false)
		{
			this.createExplosion();
			this.doOnce = true;
		}

		if(this.stopHud == false)
		{
			this.time++;
			this.HudLayer.updateTime(this.time / 100);
		}
	}
});

var multiLevelScene = cc.Scene.extend({
	onEnter:function (id) 
	{
		this._super();

		if (INIT_MULTI_GAME == false)
		{
			GameVars.canMove = false;
			INIT_MULTI_GAME = true;
			var gameLay = new multiLevel(id);
			this.addChild(gameLay);
		}
	}
});
