var faceLogin;

var FacebookLogin = cc.Layer.extend
({
	fbBtn:null,
	backBtn:null,
	
	ctor:function () 
	{
		this._super();

		faceLogin = this;
		var windowBg = new cc.Sprite("#ConfirmBg.png");
		windowBg.setScale(GameVars.scaleFactor);
		this.addChild(windowBg);

		var label = new cc.LabelBMFont("Please Login To Facebook", res.menuFont_ttf);
		label.setWidth(cc.winSize.width * 0.3);
		label.setScale(0.55 * GameVars.scaleFactor,0.55 * GameVars.scaleFactor);
		if(GameVars.scaleFactor == 1)
			label.setPosition(cc.p(10,50));
		else if(GameVars.scaleFactor == 2)
			label.setPosition(cc.p(10, 100));
		label.color = cc.color.RED;
		this.addChild(label);
		
		this.fbBtn = new ccui.Button("fbBtn.png","fbBtnDown.png","",ccui.Widget.PLIST_TEXTURE);
		this.fbBtn.setScale(0.64 * GameVars.scaleFactor,0.64 * GameVars.scaleFactor);
		this.fbBtn.y = -cc.winSize.height * 0.1;
		this.fbBtn.addTouchEventListener(this.fbLogin, this);
		this.addChild(this.fbBtn);
		
		this.backBtn = new ccui.Button("ExitBtn.png","ExitBtnDwn.png","",ccui.Widget.PLIST_TEXTURE);
		this.backBtn.setScale(0.7 * GameVars.scaleFactor,0.7 * GameVars.scaleFactor);
		if(GameVars.scaleFactor == 1)
			this.backBtn.y = -cc.winSize.height * 0.27;
		else
			this.backBtn.y = -cc.winSize.height * 0.23;
		this.backBtn.addTouchEventListener(this.touchQuit, this);
		this.addChild(this.backBtn);
		
	},
	
	touchQuit:function(sender,type)
	{
		switch (type)
		{
		case ccui.Widget.TOUCH_ENDED:
			faceLogin.visible = false;
			break;
			
			break;
		}
	},
	
	
	fbLogin:function(sender,type)
	{
		switch (type)
		{
		case ccui.Widget.TOUCH_ENDED:
			cc.audioEngine.playEffect(res.buttonClick_mp3);
			this.login();
			break;

			break;                
		}
	},
	
	login:function(callback)
	{
		var facebook = plugin.FacebookAgent.getInstance();	
		facebook.login(["create_event", "create_note", "manage_pages", "publish_actions" , "user_friends"], function(code, response)
		{
			if(code == plugin.FacebookAgent.CODE_SUCCEED)
			{
				cc.log("login succeeded");
				cc.log("AccessToken: " + response["accessToken"]);
				token = response["accessToken"];
				accToken = response["accessToken"]
				var permissions = response["permissions"];
				var str = "Permissions: ";
				for (var i = 0; i < permissions.length; ++i) 
				{
					str += permissions[i] + " ";
				}
				cc.log("Permissions: " + str);
				} 
				else 
				{
					cc.log("Login failed, error #" + code + ": " + response);
				}
			faceLogin.visible = false;
		});
	},
	
	
});