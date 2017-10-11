var HudLayer = cc.Layer.extend
({
	timeBg:null,
	timerLabel:null,
	bg:null,
	left:null,
	right:null,

	ctor:function () 
	{
		this._super();
		this.init();
	},

	init:function () 
	{
		this._super();
		var winsize = cc.director.getWinSize();
		var scale = 0.7 * GameVars.scaleFactor;
		var opacity = 700;
		
		this.timeBg = new cc.Sprite("#TimeBg.png");
		this.timeBg.setPosition(cc.p(winsize.width * 0.9, winsize.height * 0.93));
		this.timeBg.setScale(GameVars.scaleFactor);
		this.addChild(this.timeBg);

		this.timerLabel = new cc.LabelBMFont("0", res.menuFont_ttf);
		this.timerLabel.setScale(0.4 * GameVars.scaleFactor,0.4 * GameVars.scaleFactor)
		this.timerLabel.setPosition(cc.p(cc.winSize.width * 0.92, cc.winSize.height * 0.93));
		this.timerLabel.color = cc.color.RED;
		this.addChild(this.timerLabel);
		
		if (cc.sys.capabilities.hasOwnProperty('touches') && GameVars.isAccelLvl == false)
		{
			this.left = new cc.Sprite("#LeftArrow.png");
			if(!GameVars.switchedControls)
				this.left.x = winsize.width * 0.1;
			else
				this.left.x = winsize.width * 0.7;
			this.left.y = winsize.height * 0.07;
			this.left.setScaleX(scale);
			this.left.setScaleY(scale);
			this.left.setOpacity(opacity);
			this.addChild(this.left);
	
			this.right = new cc.Sprite("#RightArrow.png");
			if(!GameVars.switchedControls)
				this.right.x = winsize.width * 0.3;
			else
				this.right.x = winsize.width * 0.9;
			this.right.y = winsize.height * 0.07;
			this.right.setScaleX(scale);
			this.right.setScaleY(scale);
			this.right.setOpacity(opacity);
			this.addChild(this.right);
		}
	},

	pauseGame:function()
	{
		cc.director.pushScene(new cc.TransitionFade(0.2, new pauseScene()));
	},
	
	updateTime:function(time)
	{
		this.timerLabel.setString(time);
	},
});