var levelButton = cc.Layer.extend
({
	level:null,
	ctor:function (level) 
	{
		this._super();
		this.level = level;
		this.init();
	},
	init:function () 
	{
		this._super();

		var bg = new cc.Sprite("#LevelBtnBg.png");
		bg.setScale(GameVars.scaleFactor);
		this.addChild(bg);
		
		if(GameVars.levelLocks[this.level].level == 1)
		{
			var btn = new ccui.Button("PlainBtn.png","PlainBtnDwn.png","",ccui.Widget.PLIST_TEXTURE);
			btn.y = 15;
			btn.setScale(GameVars.scaleFactor);
			btn.addTouchEventListener(this.levelPressed, this);
			var label = new cc.LabelBMFont(this.level + 1, res.menuFont_ttf);
			this.addChild(btn);
			label.setScale(0.7 * GameVars.scaleFactor,0.7 * GameVars.scaleFactor);
			label.y = 15;
			label.color = cc.color.RED;
			this.addChild(label);
		}
		else if(GameVars.levelLocks[this.level].level == 0)
		{
			var btn = new ccui.Button("LockedBtn.png","LockedBtn.png","",ccui.Widget.PLIST_TEXTURE);
			btn.setScale(GameVars.scaleFactor);
			btn.y = 15;
			this.addChild(btn);
		}
		
		if(GameVars.levelStars[this.level].stars >= 1)
		{
			var star = new cc.Sprite("#Star.png");
			star.y = -60 * GameVars.scaleFactor;
			star.x = -40 * GameVars.scaleFactor;
			this.addChild(star);
			
			if(GameVars.levelStars[this.level].stars >= 2)
			{
				var star2 = new cc.Sprite("#Star.png");
				star2.y = -65 * GameVars.scaleFactor;
				this.addChild(star2);
				
				if(GameVars.levelStars[this.level].stars == 3)
				{
					var star3 = new cc.Sprite("#Star.png");
					star3.x = 40 * GameVars.scaleFactor;
					star3.y = -60 * GameVars.scaleFactor;
					this.addChild(star3);
				}
			}
		}
	},
	
	levelPressed:function(sender,type)
	{
		if(GameVars.levelLocks[this.level].level == 1)
		{
			switch (type)
			{
			case ccui.Widget.TOUCH_ENDED:
				
				INITIALIZED_LS = false;
				switch(this.level)
				{
					case 0:
						cc.audioEngine.playEffect(res.buttonClick_mp3);
						cc.director.runScene(new cc.TransitionFade(1.5, new tutScene()));
						break;
					case 1:
						cc.audioEngine.playEffect(res.buttonClick_mp3);
						cc.director.runScene(new cc.TransitionFade(1.5, new gameScene()));
						break;
					case 2:
						INIT_LEVEL2 = false;
						cc.audioEngine.playEffect(res.buttonClick_mp3);
						cc.director.runScene(new cc.TransitionFade(1.5, new gameSceneLvl2()));
						break;
					case 3:
						INIT_LEVEL3 = false;
						cc.audioEngine.playEffect(res.buttonClick_mp3);
						cc.director.runScene(new cc.TransitionFade(1.5, new gameSceneLvl3()));
						break;
					case 4:
						INIT_LEVEL4 = false;
						cc.audioEngine.playEffect(res.buttonClick_mp3);
						cc.director.runScene(new cc.TransitionFade(1.5, new gameSceneLvl4()));
						break;
					case 5:
						INIT_LEVEL5 = false;
						cc.audioEngine.playEffect(res.buttonClick_mp3);
						cc.director.runScene(new cc.TransitionFade(1.5, new gameSceneLvl5()));
						break;
					break;
				}	
				break;

			}	              
		}
	},
	
});