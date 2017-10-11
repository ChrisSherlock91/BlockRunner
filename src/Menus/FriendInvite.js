var FriendInvite = cc.Layer.extend
({
	labelInside:null,
	
	ctor:function () 
	{
		this._super();

		var bg = new cc.Sprite('#ConfirmBg.png');
		bg.setScale(1.2 * GameVars.scaleFactor);
		bg.setAnchorPoint(0, 0);
		this.addChild(bg);

		var label = new cc.LabelBMFont("Game Invite", res.menuFont_ttf);
		label.setScale(0.4 * GameVars.scaleFactor ,0.4 * GameVars.scaleFactor);
		if(GameVars.scaleFactor == 1)
			label.setPosition(cc.p(cc.winSize.width * 0.25, cc.winSize.height * 0.67));
		else
			label.setPosition(cc.p(cc.winSize.width * 0.28, cc.winSize.height * 0.57));
		label.color = cc.color.RED;
		this.addChild(label);

		this.labelInside = new cc.LabelBMFont("The Other Player Wants To Play Again", res.menuFont_ttf);
		this.labelInside.setScale(0.4 * GameVars.scaleFactor ,0.4 * GameVars.scaleFactor);
		if(GameVars.scaleFactor == 1)
		{
			this.labelInside.setPosition(cc.p(cc.winSize.width * 0.26, cc.winSize.height * 0.4));
			this.labelInside.setWidth(cc.winSize.width * 0.7);
		}
		else
		{
			this.labelInside.setPosition(cc.p(cc.winSize.width * 0.3, cc.winSize.height * 0.4));
			this.labelInside.setWidth(cc.winSize.width * 0.5);
		}
		
		this.labelInside.color = cc.color.RED;
		this.addChild(this.labelInside);

		var yesBtn = new ccui.Button("YesBtn.png","YesBtnDwn.png","",ccui.Widget.PLIST_TEXTURE);
		yesBtn.setScale(0.72 * GameVars.scaleFactor,0.72 * GameVars.scaleFactor);
		if(GameVars.scaleFactor == 1)
			yesBtn.x = cc.winSize.width * 0.2;
		else
			yesBtn.x = cc.winSize.width * 0.22;
		yesBtn.y = cc.winSize.height * 0.2;
		yesBtn.addTouchEventListener(this.touchYes, this);
		this.addChild(yesBtn)

		var noBtn = new ccui.Button("NoBtn.png","NoBtnDwn.png","",ccui.Widget.PLIST_TEXTURE);
		noBtn.setScale(0.72 * GameVars.scaleFactor,0.72 * GameVars.scaleFactor);
		if(GameVars.scaleFactor == 1)
			noBtn.x = cc.winSize.width * 0.3;
		else
			noBtn.x = cc.winSize.width * 0.32;
		noBtn.y = cc.winSize.height * 0.2;
		noBtn.addTouchEventListener(this.touchNo, this);
		this.addChild(noBtn)


	},

	touchNo:function(sender,type)
	{
		switch (type)
		{
		case ccui.Widget.TOUCH_ENDED:
			cc.audioEngine.playEffect(res.buttonClick_mp3);
			GameVars.replayRequest = false;
			this.visible = false;
			networkLayer.socket.send(JSON.stringify({ type:'declineInvite', oppId: GameVars.oppId}));
			break;

			break;                
		}
	},

	touchYes:function(sender,type)
	{
		switch (type)
		{
		case ccui.Widget.TOUCH_ENDED:
			cc.audioEngine.playEffect(res.buttonClick_mp3);
			networkLayer.socket.send(JSON.stringify({ type:'aceptInvite', oppId: GameVars.oppId , id : GameVars.myId}));
			break;

			break;                
		}
	}
});


