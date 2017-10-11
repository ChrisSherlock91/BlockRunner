var baseLayer = cc.Layer.extend
({
	mapWidth:0,
	map00:null,
	space:null,
	hudLayer:null,
	currLevel:0,
	pauseBtn:null,
	pauseMenu:null,
	collDead:false,
	screenSize:null,
	particle:null,
	coll:null,
	gameLayer:null,
	time:0,
	mPlayer:null,
	HudLayer:null,
	doOnce:false,
	outline:null,
	tiltLbl:null,
	followAction:null,
	setFollow:null,
	collEnt:null,
	collLayer:null,
	startTimerLabel:null,
	stopHud:false,
	swingSaw:null,
	gradient:null,
	
	init:function(level)
	{	
		//this.swingSaw.length = 0;
		this.stopMusic();
		this.screenSize = cc.director.getWinSize();
		GameVars.touchRestart = false;
		GameVars.currLevel = level;
		GameVars.levelTime = 0;
		this.gradient = cc.LayerGradient.create(cc.color(86,184,245,255),cc.color(150,238,250,255));
		
		this.startTimerLabel = new cc.LabelBMFont("3", res.menuFont_ttf);
		this.startTimerLabel.setScale(3 * GameVars.scaleFactor,3 * GameVars.scaleFactor)
		this.startTimerLabel.setPosition(cc.p(cc.winSize.width * 0.5, cc.winSize.height * 0.5));
		this.startTimerLabel.color = cc.color.RED;
		this.startTimerLabel.visible = false;
		this.startTimerLabel.setOpacity(200);
	},
	
	// init space of chipmunk
	initPhysics:function() 
	{
		//1. new space object 
		this.space = new cp.Space();
		//2. setup the  Gravity
		this.space.gravity = cp.v(0, -(3150 * GameVars.scaleFactor));

		this.space.addCollisionHandler(SpriteTag.player, SpriteTag.floor, this.collisionFloorBegin.bind(this),this.collisionFloorBegin.bind(this), null, this.collisionFloorEnd.bind(this));
		this.space.addCollisionHandler(SpriteTag.player, SpriteTag.goal, this.collisionGoal.bind(this),null, null, null);
		this.space.addCollisionHandler(SpriteTag.player, SpriteTag.saw, this.collisionSaw.bind(this),null, null, null);
		this.space.addCollisionHandler(SpriteTag.player, SpriteTag.boost, this.collisionBoost.bind(this),null,null,null);
		this.space.addCollisionHandler(SpriteTag.player, SpriteTag.bomb, this.collisionBomb.bind(this),null,null,null);
		this.space.addCollisionHandler(SpriteTag.player, SpriteTag.gravOn, this.collisionGravOn.bind(this),null,null,null);
		this.space.addCollisionHandler(SpriteTag.player, SpriteTag.gravOff, this.collisionGravOff.bind(this),null,null,null);
	},
	
	//To be Overwritten
	collisionBomb:function()
	{
	},
	collisionGravOn:function()
	{
	},
	collisionGravOff:function()
	{
	},
	collisionBoost:function()
	{
	},
	
	unlockLevel:function()
	{
		GameVars.levelLocks[GameVars.currLevel].level = 1;
	},
	
	CreateMap:function()
	{
		//Load Correct map for current level
		switch (GameVars.currLevel)
		{
		case 2:
			this.map00 = new cc.TMXTiledMap(res.level2_tmx);
			break;
		case 3:
			this.map00 = new cc.TMXTiledMap(res.level3_tmx);
			break;
		case 4:
			this.map00 = new cc.TMXTiledMap(res.level4_tmx);
			break;
		case 5:
			this.map00 = new cc.TMXTiledMap(res.level5_tmx);
			break;

			break;                
		}
	},
	
	createPauseMenu:function(player)
	{
		this.pauseMenu = new PauseMenu(player);
		this.addChild(this.pauseMenu);
		this.pauseMenu.visible = false;
		
		this.pauseBtn = new ccui.Button("PauseBtn.png","PauseBtnDwn.png","",ccui.Widget.PLIST_TEXTURE);
		this.pauseBtn.x = this.screenSize.width * 0.05;
		this.pauseBtn.y = this.screenSize.height * 0.92;
		this.pauseBtn.setScale(GameVars.scaleFactor);
		this.pauseBtn.addTouchEventListener(this.pauseGame, this);
		this.addChild(this.pauseBtn);
	},
	
	gradientSize:function(width,height)
	{
		this.gradient.setContentSize(width,height);
	},
	
	createParticleSys:function()
	{
		//create particle system
		this.particle = cc.ParticleSystem.create(res.starsParticles_plist);
		this.particle.setPosition(cc.winSize.width * 0.5, cc.winSize.height * 0.5);
		this.particle.setScale(GameVars.scaleFactor);
		this.addChild(this.particle);
		
	},
	
	setUpdate:function()
	{
		//this.scheduleUpdate();
	},
	
	collisionGoal:function (arbiter,space)
	{	
		//Create Particle System
		this.createParticleSys();
		
		this.mPlayer.stopMoving();
		cc.audioEngine.playEffect(res.sparkleSound_mp3);
		
		//Stop HUD and set the time
		this.stopHud = true;
		GameVars.levelTime = this.time / 100;
		GameVars.canMove = false;
		var offset = 100;
		if(GameVars.currLevel == 2)
		{
			offset = -100;
		}
		var sprite_action = cc.moveBy(1, offset, 0);
		
		if(GameVars.isMulti)
		{
			var endLevel = cc.callFunc(this.endLevelMulti,this);
			networkLayer.socket.send(JSON.stringify({ type:'finish', dataX: GameVars.levelTime , opId: GameVars.oppId , myId: GameVars.myId}));
		}
		else
		{
			var endLev = cc.callFunc(this.endLevel,this);
			this.mPlayer.runAction(cc.sequence(cc.delayTime(1),sprite_action,endLev));
		}
	},
	
	endLevelMulti:function()
	{
		INIT_GAME = false;
		cc.director.runScene(new cc.TransitionFade(1.5, new EndSceneMulti()));
	},
	
	update:function(dt)
	{
		//Check if game is paused
		this.checkUnPause();
		
		//check collision then run the explosion effect
		if(this.coll == true && this.doOnce == false)
		{
			this.createExplosion();
			this.doOnce = true;
		}
		
		//Game is not paused 
		if(this.stopHud == false)
		{
			this.time++;
			this.HudLayer.updateTime(this.time / 100);
		}
		
		//World Step for Chipmunk
		this.space.step(dt);
		
	},
	
	onExit:function()
	{
		//this.unscheduleUpdate();
		//this.stopAllActions();
		cc.log("Base Level Exit")
		this._super();
	},
	
	createBakcgroundGradient:function()
	{
		this.gradientSize(this.map00.getMapSize().width * GameVars.TileSize, this.map00.getMapSize().height * GameVars.TileSize);
	},
	
	checkExplosion:function()
	{
		//check collision then run the explosion effect
		if(this.coll == true && this.doOnce == false)
		{
			this.createExplosion();
			this.doOnce = true;
		}
	},
	
	checkRestart:function()
	{
		if(GameVars.touchRestart == true)
		{
			this.mPlayer.moveForCollision();
			GameVars.touchRestart = false;
		}
	},
	
	
	stopMusic:function()
	{
		cc.audioEngine.stopMusic();
	},
	
	startMusic:function()
	{
		cc.audioEngine.playMusic(res.levelSnd_wav,true);
	},
	
	getMapWidth:function()
	{
		return this.map00.getContentSize().width;
	},
	
	setFollowAction:function()
	{
		//reset the player and "Camera"
		this.coll = false;
		this.doOnce = false;
		this.mPlayer.stopMoving();
		this.mPlayer.resetPos();
		this.removeColl();
		this.gameLayer.stopAllActions();
		this.followAction = cc.Follow.create(this.mPlayer.shape.image,cc.rect(0,0, GameVars.mapWidth, GameVars.mapHeight));
		this.gameLayer.runAction(this.followAction);
	},
	
	//Loading of walls,floors and start
	loadBaseObjects:function(map,loadGoal)
	{
		var platforms = map.getObjectGroup("floor");
		cc.assert(platforms != [],"Platforms Is null");
		var platArray = platforms.getObjects();
		for (var i = 0; i < platArray.length; i++)
		{
			createStaticBody(this.space,cc.p(platArray[i]["x"] + platArray[i]["width"] / 2,platArray[i]["y"] + platArray[i]["height"] / 2),platArray[i]["width"],platArray[i]["height"],false,SpriteTag.floor,0);	
		}

		var walls = map.getObjectGroup("wall");
		var wallArray = walls.getObjects();
		for (var i = 0; i < wallArray.length; i++)
		{
			createStaticBody(this.space,cc.p(wallArray[i]["x"] + wallArray[i]["width"] / 2,wallArray[i]["y"] + wallArray[i]["height"] / 2),
							 wallArray[i]["width"],wallArray[i]["height"],false,SpriteTag.wall,0)
		}
		
		if(!GameVars.isMulti)
		{
			var start = map.getObjectGroup("start");
			var startArray = start.getObjects();
			GameVars.startPosx = startArray[0]["x"] + startArray[0]["width"] / 2;
			GameVars.startPosy = startArray[0]["y"] + startArray[0]["height"] / 2;
		}
		
		if(loadGoal)
		{
			var goals = this.map00.getObjectGroup("Goal");
			var goalArray = goals.getObjects();
			createStaticBody(this.space,cc.p(goalArray[0]["x"] + goalArray[0]["width"] / 2,goalArray[0]["y"] + goalArray[0]["height"] / 2),
							 goalArray[0]["width"],goalArray[0]["height"],true,SpriteTag.goal);
		}
	},
	
	startTimer:function()
	{
		this.timerLabel.visible = true;
		var end = cc.callFunc(this.sendTime,this);
		var time4 = cc.callFunc(this.setTime,this);
		this.mPlayer.runAction(cc.sequence(cc.delayTime(1),time4,cc.delayTime(1),time4,cc.delayTime(1),time4,
				cc.delayTime(1),time4,cc.delayTime(1),time4,end));
	},
	
	setTime:function()
	{
		this.timeCount--;
		this.timerLabel.setString(this.timeCount);
	},
	
	removeColl:function()
	{
		//loop delet the bodies and delete them from the array
		this.collEnt.length = 0;
		this.gameLayer.removeChild(this.collLayer);
	},
	
	createExplosion:function()
	{
		//stop the action and player cant move
		cc.audioEngine.playEffect(res.bangSnd_mp3);
		this.gameLayer.stopAllActions();
		
		this.collLayer = new cc.Layer();
		
		//create particle system
		var bloodParticle = cc.ParticleSystem.create(res.bloodParticle_plist);
		bloodParticle.setPosition(this.mPlayer.body.p.x, this.mPlayer.body.p.y);
		this.gameLayer.addChild(bloodParticle);
		
		//create new bodyPieces and add them to a new layer
		for(var i = 0; i < GameVars.bodyPieces; i++)
		{
			var piece = new BodyPiece(this.space,this.mPlayer.body.p,30,30);
			this.collEnt.push(piece);
			this.collLayer.addChild(piece);
		}
		//add the layer move the player
		this.gameLayer.addChild(this.collLayer);
		this.collDead = true;
		this.mPlayer.moveForCollision();
		//reset the player and "Camera"
		this.setFollow = cc.CallFunc(this.setFollowAction,this);
		this.runAction(cc.sequence(cc.delayTime(1),this.setFollow));
	},
	
	startGameSeq:function(scale,xPos,yPos)
	{
		this.scheduleUpdate();
		//Set position for entry effect
		this.setScale(scale, scale);
		this.setPosition(-(xPos * GameVars.scaleFactor), -yPos);
	},
	
	startGameSeqOdd:function(scaleX,scaleY,xPos,yPos)
	{
		//Set position for entry effect
		this.setScale(scaleX, scaleY);
		this.setPosition((xPos * GameVars.scaleFactor), yPos);

	},
	
	createNumbers:function()
	{
		//Create the numbers for start sequence
		if(GameVars.isAccelLvl == true)
		{
			this.tiltLbl = new cc.LabelBMFont("Tilt", res.menuFont_ttf);
			this.tiltLbl.setScale(1 * GameVars.scaleFactor,1 * GameVars.scaleFactor)
			this.tiltLbl.setPosition(cc.p(cc.winSize.width * 0.5, cc.winSize.height * 0.8));
			this.tiltLbl.color = cc.color.RED;
			this.addChild(this.tiltLbl);
			
			this.outline = new cc.Sprite("#iPad.png");
			this.outline.setPosition(cc.winSize.width * 0.5, cc.winSize.height * 0.5);
			this.outline.setVisible(true);
			this.outline.setScale(2);
			this.outline.setRotation(90);
			this.addChild(this.outline);
		}
		
	},
	
	startSequnce:function(xPos,yPos)
	{
		//Start sequence actions
		var scaleAction = cc.scaleTo(3, 1, 1);
		var moveAction = cc.moveBy(3, xPos * GameVars.scaleFactor, yPos);
		var setHud =  cc.callFunc(this.setHudStart,this);
		var setThree = cc.callFunc(this.setNum,this);
		var setTwo = cc.CallFunc(this.setNum2,this);
		var setOne = cc.CallFunc(this.setNum3,this);
		var setGo = cc.CallFunc(this.setGo,this);
		var startLevel = cc.CallFunc(this.startLevel,this);
		
		
		var rotateFunc = cc.callFunc(this.rotateFunc, this);
		
		//Run the actions for the start sequence
		this.runAction(cc.sequence(cc.delayTime(3),scaleAction));
		
		if(GameVars.isAccelLvl == true)
		{
			this.runAction(cc.sequence(cc.delayTime(3),moveAction,rotateFunc,cc.delayTime(2.5),setThree,cc.DelayTime(1),setTwo,cc.delayTime(1),setOne,
					cc.delayTime(1),setGo,cc.delayTime(0.5),startLevel));
		}
		else
		{
			this.runAction(cc.sequence(cc.delayTime(3),moveAction,setThree,cc.DelayTime(1),setTwo,cc.delayTime(1),setOne,
					cc.delayTime(1),setGo,cc.delayTime(0.5),startLevel));
		}
	},
	
	rotateFunc:function()
	{
		var rotate = cc.rotateBy(1, 30, 30);
		var rotateBack = cc.rotateBy(1,-60,-60);
		var fade = cc.callFunc(this.deleteTilt,this);
		this.outline.runAction(cc.sequence(rotate,rotateBack,fade));
	},
	
	deleteTilt:function()
	{
		this.outline.runAction(cc.fadeTo(1, 0));
		this.tiltLbl.runAction(cc.fadeTo(1, 0));
	},
	
	collisionSaw:function (arbiter, space)
	{	
		//Set collision to true for particle
		this.coll = true;
	},
	
	startLevel:function()
	{
		//Set go vis and show the hud
		this.startTimerLabel.visible = false;
		this.setHudStart();
	},

	setGo:function()
	{
		//set visible
		this.playTickAudio();
		this.startTimerLabel.setString("GO");
	},

	setNum:function()
	{
		//set visible
		this.playTickAudio();
		this.startTimerLabel.visible = true;
	},

	setNum2:function()
	{
		//set visible
		this.playTickAudio();
		this.startTimerLabel.setString("2");
	},

	setNum3:function()
	{
		//set visible
		this.playTickAudio();
		this.startTimerLabel.setString("1");
	},
	
	playTickAudio:function()
	{
		cc.audioEngine.playEffect(res.tick_wav, 0);
	},

	setHudStart:function()
	{
		//remove start numbers and set hud visible
		this.deleteNumberTextures();
		this.HudLayer.setVisible(true);
		if(!GameVars.isMulti)
			this.pauseBtn.visible = true;
		
		this.stopHud = false;
		GameVars.canMove = true;
	},
	
	deleteNumberTextures:function()
	{
		//this.removeChild(this.startTimerLabel);
	},
	
	pauseGame:function(sender,type)
	{
		switch (type)
		{
		case ccui.Widget.TOUCH_ENDED:
			cc.audioEngine.playEffect(res.buttonClick_mp3);
			this.pausedPressed();
			break;

			break;                
		}
	},
	
	pausedPressed:function()
	{
		this.pauseMenu.visible = true;
		this.pauseBtn.visible = false;
		cc.director.pause();
	},
	
	checkUnPause:function()
	{
		if(this.pauseMenu.isResumed)
		{
			this.pauseBtn.visible = true;
		}
	},
	
	endLevel:function()
	{
		cc.director.runScene(new cc.TransitionFade(1.5, new EndScene()));
	},
	
	collisionFloorBegin:function (arbiter, space) 
	{
		GameVars.canJump = true;
	},
	collisionFloorEnd:function(arbiter,space)
	{
		GameVars.canJump = false;
	},
});