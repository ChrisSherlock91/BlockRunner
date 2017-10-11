var INIT_OPTIONS = false;

var OptionsLayer = cc.Layer.extend
({
	resumeBtn:null,
	quitBtn:null,

	ctor:function () 
	{
		this._super();

		var bg = new cc.Sprite(res.mainBg_png);
		bg.setAnchorPoint(0, 0);
		this.addChild(bg);
		
		var windowBg = new cc.Sprite("#OptionsBg.png");
		windowBg.x = cc.director.getWinSize().width * 0.5;
		windowBg.y = cc.director.getWinSize().height * 0.5;
		windowBg.setScale(GameVars.scaleFactor);
		this.addChild(windowBg);
		
		var label = new cc.LabelBMFont("Options", res.menuFont_ttf);
		label.setScale(0.7 * GameVars.scaleFactor ,0.7 * GameVars.scaleFactor);
		if(GameVars.scaleFactor == 1)
			label.setPosition(cc.p(cc.winSize.width * 0.49, cc.winSize.height * 0.87));
		else if(GameVars.scaleFactor == 2)
			label.setPosition(cc.p(cc.winSize.width * 0.49, cc.winSize.height * 0.81));
		label.color = cc.color.RED;
		this.addChild(label);

		this.quitBtn = new ccui.Button("ExitBtn.png","ExitBtnDwn.png","",ccui.Widget.PLIST_TEXTURE);
		this.quitBtn.x = cc.winSize.width * 0.5;
		this.quitBtn.y = cc.winSize.height * 0.15;
		this.quitBtn.setScale(GameVars.scaleFactor);
		this.quitBtn.addTouchEventListener(this.touchQuit, this);
		this.addChild(this.quitBtn);
		
		var musicVol = new cc.LabelBMFont("Music Volume", res.menuFont_ttf);
		musicVol.setScale(0.6 * GameVars.scaleFactor,0.6 * GameVars.scaleFactor);
		if(GameVars.scaleFactor == 1)
			musicVol.setPosition(cc.p(cc.winSize.width * 0.49, cc.winSize.height * 0.75));
		else if(GameVars.scaleFactor == 2)
			musicVol.setPosition(cc.p(cc.winSize.width * 0.49, cc.winSize.height * 0.7));
		musicVol.color = cc.color.RED;
		this.addChild(musicVol);
		
		var slider = new ccui.Slider();
		slider.setTouchEnabled(true);
		slider.loadBarTexture("sliderTrack.png",ccui.Widget.PLIST_TEXTURE);
		slider.loadSlidBallTextures("sliderThumb.png", "sliderThumb.png", "",ccui.Widget.PLIST_TEXTURE);
		slider.loadProgressBarTexture("sliderProgress.png",ccui.Widget.PLIST_TEXTURE);
		if(GameVars.scaleFactor == 1)
		{	
			slider.x = cc.winSize.width * 0.5;
			slider.y = cc.winSize.height * 0.68;
		}
		else if (GameVars.scaleFactor == 2)
		{
			slider.x = cc.winSize.width * 0.5;
			slider.y = cc.winSize.height * 0.62;
			slider.setScale(2);
		}
		slider.addEventListener(this.sliderEvent, this);
		slider.percent = GameVars.musicVol;
		this.addChild(slider);
		
		var sfxVol = new cc.LabelBMFont("SFX Volume", res.menuFont_ttf);
		sfxVol.setScale(0.6 * GameVars.scaleFactor,0.6 * GameVars.scaleFactor);
		if(GameVars.scaleFactor == 1)
			sfxVol.setPosition(cc.p(cc.winSize.width * 0.49, cc.winSize.height * 0.58));
		else if(GameVars.scaleFactor == 2)
			sfxVol.setPosition(cc.p(cc.winSize.width * 0.49, cc.winSize.height * 0.55));
		sfxVol.color = cc.color.RED;
		this.addChild(sfxVol);

		var sfxSlider = new ccui.Slider();
		sfxSlider.setTouchEnabled(true);
		sfxSlider.loadBarTexture("sliderTrack.png",ccui.Widget.PLIST_TEXTURE);
		sfxSlider.loadSlidBallTextures("sliderThumb.png", "sliderThumb.png", "",ccui.Widget.PLIST_TEXTURE);
		sfxSlider.loadProgressBarTexture("sliderProgress.png",ccui.Widget.PLIST_TEXTURE);
		if(GameVars.scaleFactor == 1)
		{
			sfxSlider.x = cc.winSize.width * 0.5;
			sfxSlider.y = cc.winSize.height * 0.49;
		}
		else if(GameVars.scaleFactor == 2)
		{
			sfxSlider.x = cc.winSize.width * 0.5;
			sfxSlider.y = cc.winSize.height * 0.5;
			sfxSlider.setScale(2);
		}
		sfxSlider.addEventListener(this.sfxSlider, this);
		sfxSlider.percent = GameVars.sfxVol;
		this.addChild(sfxSlider);
		
		
		this.controlBtn = new ccui.Button();
		if(GameVars.switchedControls == true)
			this.controlBtn.loadTextures(res.onBtn_png, res.onBtn_png);
		else if (GameVars.switchedControls == false) 
			this.controlBtn.loadTextures(res.offBtn_png, res.offBtn_png);
		this.controlBtn.x = cc.winSize.width * 0.5;
		this.controlBtn.y = cc.winSize.height * 0.32;
		this.controlBtn.addTouchEventListener(this.control, this);
		this.addChild(this.controlBtn);
		
		var switchLbl = new cc.LabelBMFont("Reverse Controls", res.menuFont_ttf);
		switchLbl.setScale(0.6 * GameVars.scaleFactor,0.6 * GameVars.scaleFactor);
		if(GameVars.scaleFactor == 1)
			switchLbl.setPosition(cc.p(cc.winSize.width * 0.5, cc.winSize.height * 0.4));
		else if(GameVars.scaleFactor == 2)
			switchLbl.setPosition(cc.p(cc.winSize.width * 0.49, cc.winSize.height * 0.4));
		switchLbl.color = cc.color.RED;
		this.addChild(switchLbl);
	},
	
	control:function(sender,type)
	{
		switch (type)
		{
		case ccui.Widget.TOUCH_ENDED:
			cc.audioEngine.playEffect(res.buttonClick_mp3);
			if(GameVars.switchedControls)
			{
				this.controlBtn.loadTextures(res.offBtn_png, res.offBtn_png);
				GameVars.switchedControls = false;
			}
			else if(!GameVars.switchedControls)
			{
				this.controlBtn.loadTextures(res.onBtn_png, res.onBtn_png);
				GameVars.switchedControls = true;
			}
			break;

			break;                
		}
	},
	
	sfxSlider: function(sender, type)
	{
		switch (type)
		{
		case ccui.Slider.EVENT_PERCENT_CHANGED:
			cc.audioEngine.setEffectsVolume(sender.getPercent().toFixed(0) / 100);
			GameVars.sfxVol = sender.getPercent().toFixed(0);
			if(GameVars.sfxVol == 0)
			{
				GameVars.sfxOn = false;
			}
			break;
		}
	},
	
	sliderEvent: function(sender, type)
	{
		switch (type)
		{
		case ccui.Slider.EVENT_PERCENT_CHANGED:
			cc.audioEngine.setMusicVolume(sender.getPercent().toFixed(0) / 100);
			GameVars.musicVol = sender.getPercent().toFixed(0);
			if(GameVars.musicVol == 0)
			{
				GameVars.musicOn = false;
			}
			break;
		}
	},


	touchQuit: function(sender, type)
	{
		switch (type)
		{
		case ccui.Widget.TOUCH_ENDED:
			cc.audioEngine.playEffect(res.buttonClick_mp3);
			this.quitToMainMenu();
			break;

			break;                
		}
	},

	quitToMainMenu:function()
	{
		INIT_OPTIONS = false;
		cc.director.runScene(new cc.TransitionFade(1, new MainMenuScene()));
	},
});


var OptionsMenu = cc.Scene.extend
({
	onEnter:function () 
	{
		this._super();
		if (INIT_OPTIONS == false)
		{
			INIT_OPTIONS = true;
			var layer = new OptionsLayer();
			this.addChild(layer);
		}
	}
});




