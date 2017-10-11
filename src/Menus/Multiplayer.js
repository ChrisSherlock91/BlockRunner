var INIT_MULTI = false;

var networkLayer = null;

var reqSelf;
var userId;

var accToken ;

var MultiLayer = cc.Layer.extend
({
	vsBtn:null,
	vsLabel:null,
	friendBtn:null,
	friendLbl:null,
	quitBtn:null,
	fbLogin:null,
	friendsOnServer:null,
	friendsName:null,
	friendsList:null,
	inviteScreen:null,
	noFriendsLabel:null,
	friendBtns:null,
	dontShowBtn:false,
	
	ctor:function () 
	{
		this._super();
		
		reqSelf = this;
		
		this.friendsList = [];
		this.friendsOnServer = [];
		this.friendsName = [];
		this.friendBtns = [];
		
		var bg = new cc.Sprite(res.mainBg_png);
		bg.setAnchorPoint(0, 0);
		this.addChild(bg);
	
		var label = new cc.LabelBMFont("MultiPlayer", res.menuFont_ttf);
		label.setScale(0.7 * GameVars.scaleFactor ,0.7 * GameVars.scaleFactor);
		if(GameVars.scaleFactor == 1)
			label.setPosition(cc.p(cc.winSize.width * 0.49, cc.winSize.height * 0.87));
		else if(GameVars.scaleFactor == 2)
			label.setPosition(cc.p(cc.winSize.width * 0.51, cc.winSize.height * 0.85));
		label.color = cc.color.RED;
		this.addChild(label);
		
		this.vsBtn = new ccui.Button("BigBtn.png","BigBtnDwn.png","",ccui.Widget.PLIST_TEXTURE);
		this.vsBtn.x = cc.winSize.width * 0.5;
		this.vsBtn.y = cc.winSize.height * 0.7;
		this.vsBtn.setScale(1.5 * GameVars.scaleFactor);
		this.vsBtn.addTouchEventListener(this.touchVs, this);
		this.addChild(this.vsBtn);
		
		this.vsLabel = new cc.LabelBMFont("Quick Match", res.menuFont_ttf);
		this.vsLabel.setScale(0.5 * GameVars.scaleFactor ,0.5 * GameVars.scaleFactor);
		this.vsLabel.setPosition(cc.p(cc.winSize.width * 0.5, cc.winSize.height * 0.7));
		this.vsLabel.color = cc.color.RED;
		this.addChild(this.vsLabel);
		
		this.friendBtn = new ccui.Button("BigBtn.png","BigBtnDwn.png","",ccui.Widget.PLIST_TEXTURE);
		this.friendBtn.x = cc.winSize.width * 0.5;
		this.friendBtn.y = cc.winSize.height * 0.4;
		this.friendBtn.setScale(1.5 * GameVars.scaleFactor);
		this.friendBtn.addTouchEventListener(this.touchFriendBtn, this);
		this.addChild(this.friendBtn);
		
		this.friendLbl = new cc.LabelBMFont("Play With Friend", res.menuFont_ttf);
		this.friendLbl.setScale(0.4 * GameVars.scaleFactor ,0.4 * GameVars.scaleFactor);
		this.friendLbl.setPosition(cc.p(cc.winSize.width * 0.5, cc.winSize.height * 0.4));
		this.friendLbl.color = cc.color.RED;
		this.addChild(this.friendLbl);
	
		this.quitBtn = new ccui.Button("ExitBtn.png","ExitBtnDwn.png","",ccui.Widget.PLIST_TEXTURE);
		this.quitBtn.x = cc.winSize.width * 0.5;
		this.quitBtn.y = cc.winSize.height * 0.15;
		this.quitBtn.setScale(GameVars.scaleFactor);
		this.quitBtn.addTouchEventListener(this.touchQuit, this);
		this.addChild(this.quitBtn);
		
		this.fbLogin = new FacebookLogin();
		this.fbLogin.x = cc.winSize.width * 0.5;
		this.fbLogin.y = cc.winSize.height * 0.5;
		this.fbLogin.visible = false;
		this.addChild(this.fbLogin);
		
		this.inviteScreen = new FriendInvite();
		if(GameVars.scaleFactor == 1)
		{
			this.inviteScreen.x = cc.winSize.width * 0.28;
			this.inviteScreen.y = cc.winSize.height * 0.2;
		}
		else
		{
			this.inviteScreen.x = cc.winSize.width * 0.22;
			this.inviteScreen.y = cc.winSize.height * 0.2;
		}
		
		this.inviteScreen.visible = false;
		this.addChild(this.inviteScreen);
		
		this.noFriendsLabel = new cc.LabelBMFont("No Friends Currently Online", res.menuFont_ttf);
		this.noFriendsLabel.setScale(0.8 * GameVars.scaleFactor ,0.78 * GameVars.scaleFactor);
		this.noFriendsLabel.setPosition(cc.p(cc.winSize.width * 0.5, cc.winSize.height * 0.5));
		this.noFriendsLabel.color = cc.color.RED;
		this.noFriendsLabel.visible = false;
		this.addChild(this.noFriendsLabel);
		
		this.scheduleUpdate();
		
	},
	
	update:function(dt)
	{
		if(!this.fbLogin.visible && !this.dontShowBtn)
		{
			this.quitBtn.visible = true;
			this.vsBtn.visible = true;
		}
		
		if(GameVars.inviteSent || GameVars.replayRequest)
		{
			for(var i = 0; i < this.friendBtns.length; i++)
			{
				this.friendBtns[i].visible = false;
			}
		}
		else
		{
			for(var i = 0; i < this.friendBtns.length; i++)
			{
				this.friendBtns[i].visible = true;
				this.quitBtn.visible = true;
			}
		}
		
		if(GameVars.replayRequest)
		{
			this.quitBtn.visible = false;
			this.inviteScreen.labelInside.setString(GameVars.oppName + " " + "Wants to play a game with you");
			this.inviteScreen.visible = true;
		}
		
		if(GameVars.shouldUpdateFriends)
		{
			cc.log("SHOULD UPDATE FRIENDS")
			this.httpRequest();
			var callFunc = cc.callFunc(this.getActiveFriends,this);
			this.runAction(cc.sequence(cc.delayTime(1),callFunc));
			GameVars.shouldUpdateFriends = false;
		}
	},
	
	getActiveFriends:function()
	{
		this.friendsOnServer = [];
		
		if(this.friendsList.length != 0)
		{
			for(var i = 0; i < GameVars.friendsList.length; i++)
			{
				if(i % 2 != 0)
				{
					for(var k = 0; k < this.friendsList.length; k++)
					{	
						if(k % 2 == 0)
						{
							if(GameVars.friendsList[i] == this.friendsList[k])
							{
								cc.log("Yes Its a Match");
								this.friendsOnServer.push(this.friendsList[k])
							}
							else
							{
								cc.log("NOT A MATCH")
							}
						}
					}
				}
			}
		}
		
		this.displayFriends();
	},
	
	displayFriends:function()
	{	
		this.vsBtn.visible = false;
		this.vsLabel.visible = false;
		this.friendBtn.visible = false;
		this.friendLbl.visible = false;
		networkLayer.removeWaitingLabel();
		this.quitBtn.visible = true;
		if(this.friendsOnServer.length == 0)
		{
			this.noFriendsLabel.visible = true;
		}
		
		for (var int = 0; int < this.friendBtns.length; int++) 
		{
			this.removeChild(this.friendBtns[int]);
		}
		
		this.friendBtns = [];
		
		for(var i = 0; i < this.friendsOnServer.length; i++)
		{
			this.createButton(i);
		}
	},
	
	createButton:function(num)
	{
		var posY = cc.winSize.height * 0.7;
		var self = this;
		cc.log(num + " " + "NUMBER");
		var facebook = plugin.FacebookAgent.getInstance();
		facebook.api("/" + this.friendsOnServer[num]  +  "/",window["plugin"].FacebookAgent.HttpMethod.GET, {}, function (type, data)
				{
			if (type == window["plugin"].FacebookAgent.CODE_SUCCEED) 
			{
				//self.friendsName.push(data.name);
				var button = new FriendsButton(self.friendsOnServer[num],data.name);
				button.x = cc.winSize.width * 0.3;
				button.y = posY;
				self.addChild(button);
				self.friendBtns.push(button);
				posY -= cc.winSize.height * 0.2;
				self.noFriendsLabel.visible = false;
			}
			else 
			{
				cc.log(JSON.stringify(data));
			}
				});
	},
	
	
	sendConnect:function()
	{
		networkLayer.socket.send(JSON.stringify({ type:'quickmatch', playerId : GameVars.myId}));
	},
	
	touchVs:function(sender,type)
	{
		switch (type)
		{
		case ccui.Widget.TOUCH_ENDED:
			cc.audioEngine.playEffect(res.buttonClick_mp3);
			this.dontShowBtn = true;
			this.quitBtn.visible = false;
			this.vsBtn.visible = false;
			this.vsLabel.visible = false;
			this.friendBtn.visible = false;
			this.friendLbl.visible = false;
			var func = cc.callFunc(this.sendConnect,this);
			this.runAction(cc.sequence(cc.delayTime(3),func));
			networkLayer = WebSocketTestLayer.create();
			this.addChild(networkLayer);
			break;

			break;                
		}
	},
	
	touchFriendBtn:function(sender,type)
	{
		switch (type)
		{
		case ccui.Widget.TOUCH_ENDED:
			cc.audioEngine.playEffect(res.buttonClick_mp3);
			var facebook = plugin.FacebookAgent.getInstance();
			if(!facebook.isLoggedIn())
			{
				this.fbLogin.visible = true;
				this.quitBtn.visible = false;
				this.vsBtn.visible = false;
			}
			else
			{
				GameVars.isFacebookPlayer = true;
				this.dontShowBtn = true;
				this.quitBtn.visible = false;
				this.vsBtn.visible = false;
				this.vsLabel.visible = false;
				this.friendBtn.visible = false;
				this.friendLbl.visible = false;
				networkLayer = WebSocketTestLayer.create();
				networkLayer.setWaitingLabel("Getting Friends ");
				this.addChild(networkLayer);
				var func = cc.callFunc(this.sendReq,this);
				this.runAction(cc.sequence(cc.delayTime(3),func));
			}	
			
			break;

			break;                
		}
	},
	
	sendReq:function()
	{
		var facebook = plugin.FacebookAgent.getInstance();
		var id = facebook.getUserID();
		networkLayer.socket.send(JSON.stringify({ type:'facebookId',faceId: id , playerId : GameVars.myId}));
	},
	
	httpRequest:function(callback)
	{
		var facebook = plugin.FacebookAgent.getInstance();
		userId = facebook.getUserID();
		reqSelf.sendGetRequest(userId);
	},
	
	sendGetRequest: function(id) 
	{
		cc.log("GET FRIENDS LIST")
		var facebook = plugin.FacebookAgent.getInstance();
		var self = this;
		facebook.api("/me/friends",window["plugin"].FacebookAgent.HttpMethod.GET, {'fields':'id,name'}, function (type, data)
		{
			if (type == window["plugin"].FacebookAgent.CODE_SUCCEED) 
			{
				for(var i = 0; i < data.data.length; i++)
				{
					reqSelf.friendsList.push(data.data[i].id);
					reqSelf.friendsList.push(data.data[i].name);
				}
			}
			else 
			{
				cc.log(JSON.stringify(data));
			}
		});
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
		if(GameVars.isFacebookPlayer)
		{
			var facebook = plugin.FacebookAgent.getInstance();
			var id = facebook.getUserID();
			console.log("DIsconnect")
			networkLayer.socket.send(JSON.stringify({ type:'leaving', myid: GameVars.myId , faceId: id}));
		}
		INIT_MULTI = false;
		cc.director.runScene(new cc.TransitionFade(1, new MainMenuScene()));
	},
});


var MulitMenu = cc.Scene.extend
({
	onEnter:function () 
	{
		this._super();
		if (INIT_MULTI == false)
		{
			INIT_MULTI = true;
			var layer = new MultiLayer();
			this.addChild(layer);
		}
	}
});




