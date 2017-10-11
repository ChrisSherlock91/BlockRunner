//For setting scenes active
var INITIALIZED_LS = false;

var LevelSelect = cc.Layer.extend
({
	ctor:function () 
	{
		this._super();
		
		var bg = new cc.Sprite(res.mainBg_png);
		bg.setAnchorPoint(0, 0);
		this.addChild(bg);
		var windowBg = new cc.Sprite("#LevelSelectBg.png");
		windowBg.x = cc.director.getWinSize().width * 0.5;
		windowBg.y = cc.director.getWinSize().height * 0.5;
		windowBg.setScale(GameVars.scaleFactor);
		this.addChild(windowBg);
		
		var label = new cc.LabelBMFont("Level Select", res.menuFont_ttf);
		label.setScale(0.55 * GameVars.scaleFactor,0.55 * GameVars.scaleFactor);
		if(GameVars.scaleFactor == 1)
			label.setPosition(cc.p(cc.winSize.width * 0.495, cc.winSize.height * 0.89));
		else if(GameVars.scaleFactor == 2)
			label.setPosition(cc.p(cc.winSize.width * 0.495, cc.winSize.height * 0.82));
		label.color = cc.color.RED;
		this.addChild(label);
		
		if(GameVars.scaleFactor == 2)
			var height = cc.director.getWinSize().height * 0.55;
		else
			var height = cc.director.getWinSize().height * 0.6;
		
		
		var initXPos = cc.director.getWinSize().width * 0.27;
		var numOfButtons = 5;
		
		//create level select buttons
		for(var i = 0; i < numOfButtons; i++)
		{
			var button = new levelButton(i);
			button.x = initXPos;
			initXPos += cc.director.getWinSize().width * 0.18;
			button.y = height;
			button.setScale(0.9);
			this.addChild(button);
			//Drop a level and reset xPos
			if(i == 2)
			{
				initXPos = cc.director.getWinSize().width * 0.27;
				height = cc.director.getWinSize().height * 0.3;
			}
		}
		
		var exit = new ccui.Button("ExitBtn.png","ExitBtnDwn.png","",ccui.Widget.PLIST_TEXTURE);
		exit.setScale(0.8,0.8);
		exit.x = cc.winSize.width * 0.5;
		exit.y = cc.winSize.height * 0.1;
		exit.setScale(GameVars.scaleFactor);
		exit.addTouchEventListener(this.exit, this);
		this.addChild(exit);
	},
	
	exit: function(sender, type)
	{
		switch (type)
		{
		case ccui.Widget.TOUCH_ENDED:
			INITIALIZED_LS = false;
			cc.audioEngine.playEffect(res.buttonClick_mp3);
			cc.director.runScene(new cc.TransitionFade(1, new MainMenuScene()))
			break;

			break;                
		}
	},
});

var LevelSelectScene = cc.Scene.extend
({
	onEnter:function () 
	{
		this._super();

		if (INITIALIZED_LS == false)
		{
			INITIALIZED_LS = true;
			var layer = new LevelSelect();
			this.addChild(layer);
		}
	}
});

