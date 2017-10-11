var INIT_END_MULTI = false;

var EndMenuMulti = cc.Layer.extend
({
	restartBtn:null,
	quitBtn:null,
	setTime:null,
	nextBtn:null,
	numOfStars:0,
	confirmBg:null,
	exitStr:null,
	yesBtn:null,
	noBtn:null,
	whiteBg:null,
	confirmLabel:null,
	fbBtn:null,
	replayScreen:null,

	ctor:function () 
	{
		this._super();
		var bg = new cc.Sprite(res.mainBg_png);
		bg.setAnchorPoint(0, 0);
		this.addChild(bg);
		
		networkLayer.checkFin = true;
		var windowBg = new cc.Sprite("#LevelCompBg.png");
		windowBg.x = cc.director.getWinSize().width * 0.5;
		windowBg.y = cc.director.getWinSize().height * 0.5;
		windowBg.setScale(GameVars.scaleFactor);
		this.addChild(windowBg);

		var timeLabel = new cc.LabelBMFont("Time ", res.menuFont_ttf);
		timeLabel.setScale(0.6 * GameVars.scaleFactor,0.6 * GameVars.scaleFactor);
		if(GameVars.scaleFactor == 1)
			timeLabel.setPosition(cc.p(cc.winSize.width * 0.36, cc.winSize.height * 0.43));
		else if(GameVars.scaleFactor == 2)
			timeLabel.setPosition(cc.p(cc.winSize.width * 0.36, cc.winSize.height * 0.44));
		timeLabel.color = cc.color.RED;
		this.addChild(timeLabel);

		var time = 0;
		if(GameVars.levelTime == 0)
			time = "DNF";
		else
			time = GameVars.levelTime;
		
		var gameTime = new cc.LabelBMFont(time, res.menuFont_ttf);
		gameTime.setScale(0.6 * GameVars.scaleFactor,0.6 * GameVars.scaleFactor)
		if(GameVars.scaleFactor == 1)
			gameTime.setPosition(cc.p(cc.winSize.width * 0.58, cc.winSize.height * 0.43));
		else if(GameVars.scaleFactor == 2)
			gameTime.setPosition(cc.p(cc.winSize.width * 0.58, cc.winSize.height * 0.44));
		gameTime.color = cc.color.RED;
		this.addChild(gameTime);

		var level = new cc.LabelBMFont("Level", res.menuFont_ttf);
		level.setScale(0.6 * GameVars.scaleFactor,0.6 * GameVars.scaleFactor);
		if(GameVars.scaleFactor == 1)
			level.setPosition(cc.p(cc.winSize.width * 0.36, cc.winSize.height * 0.24));
		else if(GameVars.scaleFactor)
			level.setPosition(cc.p(cc.winSize.width * 0.36, cc.winSize.height * 0.29));
		level.color = cc.color.RED;
		this.addChild(level);

		var currLevel = new cc.LabelBMFont(GameVars.currLevel + 1, res.menuFont_ttf);
		currLevel.setScale(0.6 * GameVars.scaleFactor,0.6 * GameVars.scaleFactor);
		if(GameVars.scaleFactor == 1)
			currLevel.setPosition(cc.p(cc.winSize.width * 0.58, cc.winSize.height * 0.24));
		else if(GameVars.scaleFactor == 2)
			currLevel.setPosition(cc.p(cc.winSize.width * 0.58, cc.winSize.height * 0.29));
		currLevel.color = cc.color.RED;
		this.addChild(currLevel);

		if(GameVars.scaleFactor == 1)
		{
			var btnHeight = cc.winSize.height * 0.08;
			var confirmHeight = cc.winSize.height * 0.35;
		}
		else if(GameVars.scaleFactor == 2)
		{
			var btnHeight = cc.winSize.height * 0.12;
			var confirmHeight = cc.winSize.height * 0.37;
		}
		
		var winLbl = new cc.LabelBMFont("", res.menuFont_ttf);
		winLbl.setScale(0.7 * GameVars.scaleFactor,0.7 * GameVars.scaleFactor);
		if(GameVars.win == true)
			winLbl.setString("You Win");
		else
			winLbl.setString("You Lost");
	
		if(GameVars.scaleFactor == 2)
			winLbl.setPosition(cc.p(cc.winSize.width * 0.5, cc.winSize.height * 0.835));
		else if(GameVars.scaleFactor == 1)
			winLbl.setPosition(cc.p(cc.winSize.width * 0.5, cc.winSize.height * 0.9));
		
		winLbl.color = cc.color.RED;
		this.addChild(winLbl);
		
		this.quitBtn = new ccui.Button("HomeBtn.png","HomeBtnDwn.png","",ccui.Widget.PLIST_TEXTURE);
		this.quitBtn.setScale(0.7 * GameVars.scaleFactor,0.7 * GameVars.scaleFactor);
		this.quitBtn.x = cc.winSize.width * 0.6;
		this.quitBtn.y = btnHeight;
		this.quitBtn.addTouchEventListener(this.touchQuit, this);
		this.addChild(this.quitBtn);
		
		this.restartBtn = new ccui.Button("RetryBtn.png","RetryBtnDwn.png","",ccui.Widget.PLIST_TEXTURE);
		this.restartBtn.setScale(0.72 * GameVars.scaleFactor,0.72 * GameVars.scaleFactor);
		this.restartBtn.x = cc.winSize.width * 0.5;
		this.restartBtn.y = btnHeight;
		this.restartBtn.addTouchEventListener(this.touchRestart, this);
		this.addChild(this.restartBtn)
		
		this.fbBtn = new ccui.Button("fbBtn.png","fbBtnDown.png","",ccui.Widget.PLIST_TEXTURE);
		this.fbBtn.setScale(0.64 * GameVars.scaleFactor,0.64 * GameVars.scaleFactor);
		this.fbBtn.x = cc.winSize.width * 0.4;
		this.fbBtn.y = btnHeight;
		this.fbBtn.addTouchEventListener(this.fbShare, this);
		this.addChild(this.fbBtn);
		
		if(GameVars.win == true)
			this.setStars();

		this.whiteBg = cc.LayerColor.create(new cc.Color(128,128,128,160));
		this.addChild(this.whiteBg);
		this.whiteBg.visible = false;
		cc.audioEngine.stopMusic();
		cc.audioEngine.playMusic(res.menuMusic_mp3, false);
		
		
		this.replayScreen = new GameInvite();
		if(GameVars.scaleFactor == 1)
		{
			this.replayScreen.x = cc.winSize.width * 0.28;
			this.replayScreen.y = cc.winSize.height * 0.2;
		}
		else
		{
			this.replayScreen.x = cc.winSize.width * 0.22;
			this.replayScreen.y = cc.winSize.height * 0.2;
		}
		this.replayScreen.visible = false;
		this.addChild(this.replayScreen);
		
		this.scheduleUpdate();
		
	},
	
	touchRestart:function(sender,type)
	{
		switch (type)
		{
		case ccui.Widget.TOUCH_ENDED:
			networkLayer.socket.send(JSON.stringify({ type:'playagain', oppId: GameVars.oppId}));
			break;
			
			break;
		}
	},
	
	
	fbShare:function(sender,type)
	{
		switch (type)
		{
		case ccui.Widget.TOUCH_ENDED:
			if(GameVars.win)
				var string = "I Just Won a Multiplayer Match On Level" + " " + GameVars.currLevel;
			else if(!GameVars.win)
				var string = "I Just Lost a Multiplayer Match On Level" + " " + GameVars.currLevel;
			
			var info = {
					"dialog": "shareLink",
					"link": "http://www.cocos2d-x.org",
					"name": "Level Complete",
					"description": string,
					"picture": "http://files.cocos2d-x.org/images/orgsite/logo.png"
			};

			var facebook = plugin.FacebookAgent.getInstance();

			facebook.dialog(info, function (code, response) {
				if(code == plugin.FacebookAgent.CODE_SUCCEED){
					// Succeed
				} else {
					cc.log("Sharing failed, error #" + code + ": " + response);
				}
			});
			break;

			break;                
		}
	},
	
	
	update:function(dt)
	{	
		if(GameVars.replayRequest)
		{
			this.fbBtn.visible = false;
			this.restartBtn.visible = false;
			this.quitBtn.visible = false;
			this.replayScreen.visible = true;
		}
		else
		{
			this.fbBtn.visible = true;
			this.restartBtn.visible = true;
			this.quitBtn.visible = true;
			this.replayScreen.visible = false;
		}
		
	},
	
	touchResume: function(sender, type)
	{
		switch (type)
		{
		case ccui.Widget.TOUCH_ENDED:
			cc.audioEngine.playEffect(res.buttonClick_mp3);
			networkLayer.socket.send(JSON.stringify({ type:'playagain', oppId: GameVars.oppId}));
			break;

			break;                
		}
	},
	
	setStars:function()
	{
		if(GameVars.scaleFactor == 1)
			var starHeight = cc.winSize.height * 0.68;
		else if(GameVars.scaleFactor == 2)
			var starHeight = cc.winSize.height * 0.65;

		var star = new cc.Sprite("#StarBig.png");
		if(GameVars.scaleFactor == 1)
			star.setPositionX(cc.winSize.width * 0.33);
		else if(GameVars.scaleFactor == 2)
			star.setPositionX(cc.winSize.width * 0.315);
		star.setPositionY(starHeight);
		star.setOpacity(0);
		star.setScale(2.5);
		this.addChild(star);

		var star2 = new cc.Sprite("#StarBig.png");
		star2.setPositionX(cc.winSize.width * 0.495);
		star2.setPositionY(starHeight);
		star2.setOpacity(0);
		star2.setScale(2.5);
		this.addChild(star2);

		var star3 = new cc.Sprite("#StarBig.png");
		if(GameVars.scaleFactor == 1)
			star3.setPositionX(cc.winSize.width * 0.655)
		else if(GameVars.scaleFactor == 2)
			star3.setPositionX(cc.winSize.width * 0.67);
		star3.setPositionY(starHeight);
		star3.setOpacity(0);
		star3.setScale(2.5);
		this.addChild(star3);

		var scaleAction = cc.scaleTo(1, 1, 1);
		var fadeIn = cc.FadeIn.create(1.0);
		var playSound = cc.callFunc(this.playRewardSound,this);
				
		star3.runAction(cc.Sequence(cc.delayTime(1),fadeIn,playSound,scaleAction));
		star2.runAction(cc.Sequence(cc.delayTime(2),fadeIn,playSound,scaleAction));
		star.runAction(cc.Sequence(cc.delayTime(3),fadeIn,playSound,scaleAction));
			
	},

	touchQuit: function(sender, type)
	{
		switch (type)
		{
		case ccui.Widget.TOUCH_ENDED:
			cc.audioEngine.playEffect(res.buttonClick_mp3);
			var facebook = plugin.FacebookAgent.getInstance();
			networkLayer.socket.send(JSON.stringify({ type:'leaving', myid: GameVars.myId , faceId: GameVars.myId}));
			INIT_TUT = false;
			INIT_END_MULTI = false;
			INIT_GAME = false;
			INIT_MULTI_GAME = false;
			GameVars.isMulti = false;
			networkLayer.waitingOnPlayer = true;
			networkLayer.socket.close();
			placeMentTiles = [];
			GameVars.win = false;
			networkLayer = null;
			cc.director.runScene(new cc.TransitionFade(1.5,new MainMenuScene()));
			break;

			break;                
		}
	},
});

var EndSceneMulti = cc.Scene.extend({
	onEnter:function () 
	{
		this._super();

		if (INIT_END_MULTI == false)
		{
			INIT_END_MULTI = true;
			var layer = new EndMenuMulti();
			this.addChild(layer);
		}
	}
});



