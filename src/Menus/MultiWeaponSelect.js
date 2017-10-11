var MultiWeaponsSelect = cc.Layer.extend
({
	self:null,
	bombBtn:null,
	sawBtn:null,
	sawBtnPressed:false,

	ctor:function () 
	{
		this._super();
		this.self = this;

		var winSize = cc.director.getWinSize();
		var whiteBg = cc.LayerColor.create(new cc.Color(128,128,128,160));
		this.addChild(whiteBg);
		
		var backBtn = new ccui.Button();
		backBtn.loadTextures(res.MultiMenuBtn,res.MultiMenuBtnDown)
		backBtn.setScale(0.7 * GameVars.scaleFactor,0.7 * GameVars.scaleFactor);
		backBtn.x = cc.director.getWinSize().width * 0.05;
		backBtn.y = cc.director.getWinSize().height * 0.9;
		backBtn.addTouchEventListener(this.backBtnPressed, this);
		this.addChild(backBtn);
		
		this.sawBtn = new weaponButton(0);
		this.sawBtn.x = cc.director.getWinSize().width * 0.93;
		this.sawBtn.y = cc.director.getWinSize().height * 0.75;
		this.addChild(this.sawBtn);
		
		this.bombBtn = new weaponButton(1);
		this.bombBtn.x = cc.director.getWinSize().width * 0.93;
		this.bombBtn.y = cc.director.getWinSize().height * 0.5;
		this.addChild(this.bombBtn);
	},
	
	setSawBtn:function()
	{
		this.sawBtn.updateButton();
	},
	
	setBombBtn:function()
	{
		this.bombBtn.updateButton();
	},
	
	checkSawBtnPressed:function()
	{
		return this.sawBtn.btnSelected;
	},
	
	setSawBtnBack:function()
	{
		this.sawBtn.setBack();
	},
	
	setBombBtnBack:function()
	{
		this.bombBtn.setBack();
	},
	
	checkBombBtnPressed:function()
	{
		return this.bombBtn.btnSelected;
	},
	
	backBtnPressed:function(sender,type)
	{
		switch (type)
		{
		case ccui.Widget.TOUCH_ENDED:
			cc.audioEngine.playEffect(res.buttonClick_mp3);
			this.self.visible = false;
			GameVars.canMove = true;
			GameVars.switchFollow = true;
			break;

			break;                
		}
	}


});