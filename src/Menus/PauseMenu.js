var INIT_PAUSE = false;

var PauseMenu = cc.Layer.extend
({
	resumeBtn:null,
	quitBtn:null,
	restartBtn:null,
	pauseStr:null,
	sfxBtn:null,
	musicBtn:null,
	isResumed:false,
	playerRef:null,
	
	ctor:function (player) 
	{
		this._super();
		
		this.playerRef = player;
		
		var whiteBg = cc.LayerColor.create(new cc.Color(128,128,128,160));
		this.addChild(whiteBg);
		
		var bg = new cc.Sprite("#PauseBg.png");
		bg.x = cc.winSize.width * 0.5;
		bg.y = cc.winSize.height * 0.5;
		bg.setScale(GameVars.scaleFactor);
		this.addChild(bg);
		
		this.restartBtn = new ccui.Button("BigBtn.png","BigBtnDwn.png","",ccui.Widget.PLIST_TEXTURE);
		this.restartBtn.x = cc.winSize.width * 0.5;
		this.restartBtn.y = cc.winSize.height * 0.74;
		this.restartBtn.setScale(GameVars.scaleFactor);
		this.restartBtn.addTouchEventListener(this.touchResume, this);
		this.addChild(this.restartBtn);
		
		var restStr = new cc.LabelBMFont("Resume", res.menuFont_ttf);
		restStr.setScale(0.4 * GameVars.scaleFactor,0.4 * GameVars.scaleFactor)
		restStr.setPosition(cc.p(cc.winSize.width * 0.5, cc.winSize.height * 0.74));
		restStr.color = cc.color.RED;
		this.addChild(restStr);

		this.resumeBtn = new ccui.Button("BigBtn.png","BigBtnDwn.png","",ccui.Widget.PLIST_TEXTURE);
		this.resumeBtn.x = cc.winSize.width * 0.5;
		this.resumeBtn.y = cc.winSize.height * 0.55;
		this.resumeBtn.setScale(GameVars.scaleFactor);
		this.resumeBtn.addTouchEventListener(this.touchRestart, this);
		this.addChild(this.resumeBtn);
		
		var resStr = new cc.LabelBMFont("Restart", res.menuFont_ttf);
		resStr.setScale(0.4 * GameVars.scaleFactor,0.4 * GameVars.scaleFactor)
		resStr.setPosition(cc.p(cc.winSize.width * 0.5, cc.winSize.height * 0.55));
		resStr.color = cc.color.RED;
		this.addChild(resStr);
		
		this.quitBtn = new ccui.Button("BigBtn.png","BigBtnDwn.png","",ccui.Widget.PLIST_TEXTURE);
		this.quitBtn.x = cc.winSize.width * 0.5;
		this.quitBtn.y = cc.winSize.height * 0.35;
		this.quitBtn.setScale(GameVars.scaleFactor);
		this.quitBtn.addTouchEventListener(this.touchQuit, this);
		this.addChild(this.quitBtn);
		
		this.pauseStr = new cc.LabelBMFont("Quit", res.menuFont_ttf);
		this.pauseStr.setScale(0.4 * GameVars.scaleFactor,0.4 * GameVars.scaleFactor)
		this.pauseStr.setPosition(cc.p(cc.winSize.width * 0.5, cc.winSize.height * 0.35));
		this.pauseStr.color = cc.color.RED;
		this.addChild(this.pauseStr);
		
		var title = new cc.LabelBMFont("Pause", res.menuFont_ttf);
		title.setScale(0.6 * GameVars.scaleFactor,0.6 * GameVars.scaleFactor)
		if(GameVars.scaleFactor == 1)
			title.setPosition(cc.p(cc.winSize.width * 0.5, cc.winSize.height * 0.93));
		else if(GameVars.scaleFactor == 2)
			title.setPosition(cc.p(cc.winSize.width * 0.5, cc.winSize.height * 0.86));
		title.color = cc.color.RED;
		this.addChild(title);
		
		var sfx = new cc.LabelBMFont("SFX", res.menuFont_ttf);
		sfx.setScale(0.4 * GameVars.scaleFactor,0.4 * GameVars.scaleFactor)
		sfx.setPosition(cc.p(cc.winSize.width * 0.42, cc.winSize.height * 0.22));
		sfx.color = cc.color.RED;
		this.addChild(sfx);
		
		this.sfxBtn = new ccui.Button();
		if(GameVars.sfxOn)
			this.sfxBtn.loadTextures(res.onBtn_png, res.onBtn_png);
		else if (GameVars.sfxOn == false) 
		{
			this.sfxBtn.loadTextures(res.offBtn_png, res.offBtn_png);
		}
		this.sfxBtn.x = cc.winSize.width * 0.42;
		this.sfxBtn.y = cc.winSize.height * 0.15;
		this.sfxBtn.addTouchEventListener(this.sfxOff, this);
		this.addChild(this.sfxBtn);
		
		var music = new cc.LabelBMFont("Music", res.menuFont_ttf);
		music.setScale(0.4 * GameVars.scaleFactor,0.4 * GameVars.scaleFactor)
		music.setPosition(cc.p(cc.winSize.width * 0.55, cc.winSize.height * 0.22));
		music.color = cc.color.RED;
		this.addChild(music);

		this.musicBtn = new ccui.Button();
		if(GameVars.musicOn)
			this.musicBtn.loadTextures(res.onBtn_png, res.onBtn_png);
		else if (GameVars.musicOn == false) 
		{
			this.musicBtn.loadTextures(res.offBtn_png, res.offBtn_png);
		}
		this.musicBtn.x = cc.winSize.width * 0.55;
		this.musicBtn.y = cc.winSize.height * 0.15;
		this.musicBtn.addTouchEventListener(this.musicOff, this);
		this.addChild(this.musicBtn);
	},
	
	musicOff:function(sender,type)
	{
		switch (type)
		{
		case ccui.Widget.TOUCH_ENDED:
			cc.audioEngine.playEffect(res.buttonClick_mp3);
			if(GameVars.musicOn)
			{
				this.musicBtn.loadTextures(res.offBtn_png, res.offBtn_png);
				cc.audioEngine.setMusicVolume(0);
				GameVars.musicVol = 0;
				GameVars.musicOn = false;
			}
			else if(GameVars.musicOn == false)
			{
				this.musicBtn.loadTextures(res.onBtn_png, res.onBtn_png);
				GameVars.musicOn = true;
				cc.audioEngine.setMusicVolume(100);
				GameVars.musicVol = 100;
			}
			break;

			break;                
		}
	},
	
	sfxOff:function(sender,type)
	{
		cc.assert(type != null, "Type must not be Null")
		switch (type)
		{
		case ccui.Widget.TOUCH_ENDED:
			cc.assert(res.buttonClick_mp3 != " ", "Must have a valid resource string")
			cc.audioEngine.playEffect(res.buttonClick_mp3);
			if(GameVars.sfxOn)
			{
				cc.assert(res.offBtn_png && res.offBtn_png != " ", "Must have a valid resource string on/off button")
				this.sfxBtn.loadTextures(res.offBtn_png, res.offBtn_png);
				cc.audioEngine.setEffectsVolume(0);
				GameVars.sfxVol = 0;
				GameVars.sfxOn = false;
			}
			else if(GameVars.sfxOn == false)
			{
				cc.assert(res.offBtn_png && res.offBtn_png != " ", "Must have a valid resource string on/off button")
				this.sfxBtn.loadTextures(res.onBtn_png, res.onBtn_png);
				GameVars.sfxOn = true;
				cc.audioEngine.setEffectsVolume(100);
				GameVars.sfxVol = 100;
			}
			break;

			break;                
		}
	},
	
	restartScene:function()
	{	
		switch(GameVars.currLevel)
		{
		case 0:
			INIT_TUT = false;
			cc.director.resume();
			GameVars.touchRestart = true;
			cc.audioEngine.playEffect(res.buttonClick_mp3);
			this.scheduleOnce(cc.director.runScene(new tutScene()),3);
			break;
		case 1:
			INIT_GAME = false;
			cc.director.resume();
			GameVars.touchRestart = true;
			cc.audioEngine.playEffect(res.buttonClick_mp3);
			this.scheduleOnce(cc.director.runScene(new gameScene()),3);
			break;
		case 2:
			INIT_LEVEL2 = false;
			cc.director.resume();
			GameVars.touchRestart = true;
			cc.audioEngine.playEffect(res.buttonClick_mp3);
			this.scheduleOnce(cc.director.runScene(new gameSceneLvl2()),3);
			break;
		case 3:
			INIT_LEVEL3 = false;
			GameVars.isAccelLvl = false;
			cc.director.resume();
			cc.audioEngine.playEffect(res.buttonClick_mp3);
			this.scheduleOnce(cc.director.runScene(new gameSceneLvl3()),3);
			break;
		case 4:
			INIT_LEVEL4 = false;
			GameVars.isAccelLvl = false;
			cc.director.resume();
			cc.audioEngine.playEffect(res.buttonClick_mp3);
			this.scheduleOnce(cc.director.runScene(new gameSceneLvl4()),3);
			break;
		case 5:
			INIT_LEVEL5 = false;
			cc.director.resume();
			GameVars.touchRestart = true;
			cc.audioEngine.playEffect(res.buttonClick_mp3);
			this.scheduleOnce(cc.director.runScene(new gameSceneLvl5()),3);
			break;
			
		break;
		}
	},
	
	restarFive:function()
	{
		
	},
	
	touchRestart: function(sender, type)
	{
		switch (type)
		{
		case ccui.Widget.TOUCH_ENDED:
			cc.director.resume();
			this.restartScene();
//			switch(GameVars.currLevel)
//			{
//			case 0:
//				INIT_TUT = false;
//				this.playerRef.moveForCollision();
//				cc.director.resume();
//				GameVars.touchRestart = true;
//				cc.audioEngine.playEffect(res.buttonClick_mp3);
//				cc.director.runScene(new cc.TransitionFade(1.5, new tutScene()));
//				break;
//			case 1:
//				INIT_GAME = false;
//				this.playerRef.moveForCollision();
//				cc.director.resume();
//				GameVars.touchRestart = true;
//				cc.audioEngine.playEffect(res.buttonClick_mp3);
//				cc.director.runScene(new gameScene());
//				break;
//			case 2:
//				INIT_LEVEL2 = false;
//				this.playerRef.moveForCollision();
//				cc.director.resume();
//				GameVars.touchRestart = true;
//				cc.audioEngine.playEffect(res.buttonClick_mp3);
//				cc.director.runScene(new gameSceneLvl2())
//				break;
//			case 3:
//				INIT_LEVEL3 = false;
//				this.playerRef.moveForCollision();
//				GameVars.isAccelLvl = false;
//				cc.director.resume();
//				cc.audioEngine.playEffect(res.buttonClick_mp3);
//				cc.director.runScene(new gameSceneLvl3());
//				break;
//			case 4:
//				INIT_LEVEL4 = false;
//				this.playerRef.moveForCollision();
//				GameVars.isAccelLvl = false;
//				cc.director.resume();
//				cc.audioEngine.playEffect(res.buttonClick_mp3);
//				cc.director.runScene(new gameSceneLvl4());
//				break;
//			case 5:
//				INIT_LEVEL5 = false;
//				this.playerRef.moveForCollision();
//				cc.director.resume();
//				GameVars.touchRestart = true;
//				cc.audioEngine.playEffect(res.buttonClick_mp3);
//				cc.director.runScene(new gameSceneLvl5());
//				break;
//			}
			//break;

			break;                
		}
	},
	
	touchResume: function(sender, type)
	{
		switch (type)
		{
		case ccui.Widget.TOUCH_ENDED:
			cc.audioEngine.playEffect(res.buttonClick_mp3);
			this.isResumed = true;
			this.resume();
			break;

			break;                
		}
	},
	
	touchQuit: function(sender, type)
	{
		switch (type)
		{
		case ccui.Widget.TOUCH_ENDED:
			cc.audioEngine.playEffect(res.buttonClick_mp3);
			cc.audioEngine.stopMusic();
			cc.audioEngine.playMusic(res.menuMusic_mp3, false);
			this.onQuitPressed();
			break;

			break;                
		}
	},
	
	resume:function()
	{
		INIT_PAUSE = false;
		this.visible = false;
		cc.director.resume();
	},
	
	onExit:function()
	{
		cc.log("Pause Exit")
		this._super();
	},

	onQuitPressed:function()
	{
		GameVars.isAccelLvl = false;
		cc.director.resume();
		INIT_GAME = false;
		INIT_TUT = false;
		cc.director.runScene(new cc.TransitionFade(1.5, new MainMenuScene()));
	},
});