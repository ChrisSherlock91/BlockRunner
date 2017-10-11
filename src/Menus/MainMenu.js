//For setting scenes active
var INITIALIZED_MM = false;

var MainMenu = cc.Layer.extend
({
	spriteSheet:null,
	
	ctor:function () 
	{
		this._super();
		var bg = new cc.Sprite(res.mainBg_png);
		bg.setAnchorPoint(0, 0);
		this.addChild(bg);
		
		var label = new cc.LabelBMFont("Block Runner", res.menuFont_ttf);
		label.setPosition(cc.p(cc.winSize.width * 0.5, cc.winSize.height * 0.7));
		label.color = cc.color.RED;
		label.setScale(GameVars.scaleFactor,GameVars.scaleFactor);
		this.addChild(label);
		
		var playBtn = new ccui.Button("PlayBtn.png", "PlayBtnDwn.png","",ccui.Widget.PLIST_TEXTURE);
		playBtn.x = cc.winSize.width * 0.3;
		playBtn.y = cc.winSize.height * 0.2;
		playBtn.setScale(GameVars.scaleFactor);
		playBtn.addTouchEventListener(this.onNewGame, this);
		this.addChild(playBtn);
		
		var multiBtn = new ccui.Button("multiBtn.png","multiBtnDwn.png","",ccui.Widget.PLIST_TEXTURE);
		multiBtn.x = cc.winSize.width * 0.5;
		multiBtn.y = cc.winSize.height * 0.2;
		multiBtn.setScale(GameVars.scaleFactor);
		multiBtn.addTouchEventListener(this.onMultiPressed,this);
		this.addChild(multiBtn);
		
		var optionsBtn = new ccui.Button("SettingsBtn.png", "SettingsBtnDwn.png","",ccui.Widget.PLIST_TEXTURE);
		optionsBtn.x = cc.winSize.width * 0.7;
		optionsBtn.y = cc.winSize.height * 0.2;
		optionsBtn.setScale(GameVars.scaleFactor);
		optionsBtn.addTouchEventListener(this.onOptionsPressed, this);
		this.addChild(optionsBtn);
		//Uses Local Storage to store stars won in each level
		//this.loadStars();
	},
	
	loadStars:function()
	{
		var ls = cc.sys.localStorage;
		for(var k = 0; k < GameVars.levelStars.length; k++)
			GameVars.levelStars[k].stars = ls.getItem("levelStars" + k);
	},
	
	onNewGame:function(sender,type)
	{
		switch (type)
		{
		case ccui.Widget.TOUCH_ENDED:
			// Retrieve user id
			INITIALIZED_MM = false;
			cc.audioEngine.playEffect(res.buttonClick_mp3);
			cc.director.runScene(new cc.TransitionFade(1, new LevelSelectScene()));
			break;

		break;                
		}
	},
	
	onMultiPressed:function(sender,type)
	{
		switch (type)
		{
		case ccui.Widget.TOUCH_ENDED:
			INITIALIZED_MM = false;
			cc.audioEngine.playEffect(res.buttonClick_mp3);
			cc.director.runScene(new cc.TransitionFade(1, new MulitMenu()));
			break;

			break;                
		}
	},
	
	onOptionsPressed:function(sender,type)
	{
		switch (type)
		{
		case ccui.Widget.TOUCH_ENDED:
			INITIALIZED_MM = false;
			cc.audioEngine.playEffect(res.buttonClick_mp3);
			cc.director.runScene(new cc.TransitionFade(1, new OptionsMenu()));
			break;

			break;                
		}
	},
});

var MainMenuScene = cc.Scene.extend
({
	onEnter:function () 
	{
		this._super();
		
		if (INITIALIZED_MM == false)
		{
			INITIALIZED_MM = true;
			var layer = new MainMenu();
			this.addChild(layer);
		}
	}
});

