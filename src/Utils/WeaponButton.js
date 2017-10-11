var weaponButton = cc.Layer.extend
({
	btn:null,
	type:0,
	btnSelected:false,
	btnUp:true,
	amountLbl:null,
	
	ctor:function (type) 
	{
		this._super();
		this.type = type;
		this.init(type);
	},
	init:function (type) 
	{
		this._super();
		
		this.btn = new ccui.Button();
		this.btn.loadTextureNormal(res.itemsBg);
		this.btn.setScale(0.5 * GameVars.scaleFactor);
		this.btn.addTouchEventListener(this.btnPressed, this);
		this.addChild(this.btn);
		
		if(type == 0)
		{
			var sawBlade = new cc.Sprite("#blade.png");
			sawBlade.y = 20 * GameVars.scaleFactor;
			sawBlade.setScale(0.45);
			this.addChild(sawBlade);
		}
		else
		{
			var bombBlade = new cc.Sprite(res.BombOne_png);
			bombBlade.y = 20 * GameVars.scaleFactor;
			bombBlade.setScale(0.9);
			this.addChild(bombBlade);
		}

		this.amountLbl = new cc.LabelBMFont(GameVars.NumSaws, res.menuFont_ttf);
		this.amountLbl.setScale(0.35 * GameVars.scaleFactor,0.35 * GameVars.scaleFactor)
		this.amountLbl.setPosition(cc.p(0,-37.5 * GameVars.scaleFactor));
		this.amountLbl.color = cc.color.RED;
		this.addChild(this.amountLbl);
		
	},
	
	updateButton:function()
	{
		if(this.type == 0)
		{
			this.amountLbl.setString(GameVars.NumSaws);
		}
		else
		{
			this.amountLbl.setString(GameVars.NumBombs);
		}
	},
	
	setBack:function()
	{
		this.btn.loadTextureNormal(res.itemsBg);
		this.btnUp = true;
		this.btnSelected = false;
	},
	
	btnPressed:function(sender,type)
	{
		switch (type)
		{
		case ccui.Widget.TOUCH_ENDED:
			cc.audioEngine.playEffect(res.buttonClick_mp3);
			if(this.btnUp)
			{
				this.btn.loadTextureNormal(res.itemsBgSelected);
				this.btnUp = false;
				this.btnSelected = true;
			}
			else
			{
				this.btn.loadTextureNormal(res.itemsBg);
				this.btnUp = true;
				this.btnSelected = false;
			}
			break;

			break;                
		}
	},
	
});