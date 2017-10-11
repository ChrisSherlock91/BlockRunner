var WebSocket = WebSocket || window.WebSocket || window.MozWebSocket; 

var yourId = 0;
var oppId = 0;

var WebSocketTestLayer = cc.Layer.extend({
	socket: null,
	waitingOnPlayer:true,
	checkFin:false,
	numOfDots:0,
	waitLbl:null,
	dotLbl:null,
	dotLbl2:null,
	dotLbl3:null,
	dotAction:null,
	whiteBg:null,
	
	init: function () 
	{	
		var winSize = cc.director.getWinSize();
		this.whiteBg = cc.LayerColor.create(new cc.Color(128,128,128,160));
		this.addChild(this.whiteBg);

		this.dotLbl = new cc.LabelBMFont(".", res.menuFont_ttf);
		this.dotLbl.setScale(0.7 * GameVars.scaleFactor ,0.7 * GameVars.scaleFactor);
		this.dotLbl.setPosition(cc.p(cc.winSize.width * 0.72, cc.winSize.height * 0.5));
		this.dotLbl.color = cc.color.RED;
		this.dotLbl.setVisible(false);
		this.addChild(this.dotLbl);

		this.dotLbl2 = new cc.LabelBMFont(".", res.menuFont_ttf);
		this.dotLbl2.setScale(0.7 * GameVars.scaleFactor ,0.7 * GameVars.scaleFactor);
		this.dotLbl2.setPosition(cc.p(cc.winSize.width * 0.75, cc.winSize.height * 0.5));
		this.dotLbl2.color = cc.color.RED;
		this.dotLbl2.setVisible(false);
		this.addChild(this.dotLbl2);

		this.dotLbl3 = new cc.LabelBMFont(".", res.menuFont_ttf);
		this.dotLbl3.setScale(0.7 * GameVars.scaleFactor ,0.7 * GameVars.scaleFactor);
		this.dotLbl3.setPosition(cc.p(cc.winSize.width * 0.78, cc.winSize.height * 0.5));
		this.dotLbl3.color = cc.color.RED;
		this.dotLbl3.setVisible(false);
		this.addChild(this.dotLbl3);

		this.waitLbl = new cc.LabelBMFont("Waiting for Players ", res.menuFont_ttf);
		this.waitLbl.setScale(0.7 * GameVars.scaleFactor ,0.7 * GameVars.scaleFactor);
		this.waitLbl.setPosition(cc.p(cc.winSize.width * 0.5, cc.winSize.height * 0.5));
		this.waitLbl.color = cc.color.RED;
		this.addChild(this.waitLbl);

		var setDot = cc.callFunc(this.setDot,this);
		//Getting 3 moving dots illusion of loading
		this.dotAction = cc.RepeatForever.create((cc.Sequence(cc.delayTime(1),setDot,cc.delayTime(1),setDot,cc.delayTime(1),
				setDot,cc.delayTime(1),setDot,cc.delayTime(1),setDot)));
	
		var self = this;
		
		this.socket = new WebSocket("ws://52.16.195.14:80",'echo-protocol');

		this.socket.onopen = function(evt)         
		{
			//self._sendTextStatus.setString("Send Text WS was opened.");
		};

		this.socket.onmessage = function(evt) 
		{
			try 
			{
				var json = JSON.parse(evt.data);
			} catch (e) 
			{
				console.log('This doesn\'t look like a valid JSON: ' + evt.data);
				return;
			}
			
			if(json.type == "connect")
			{
				GameVars.myId = json.data;
				cc.log("You have been connected to the server" + GameVars.myId);
			}
			
			if(json.type == "friendArray")
			{
				cc.log("FRIEND ARRAY");
				GameVars.friendsList = json.data;
				GameVars.shouldUpdateFriends = true;
			}
			
			if(json.type == "friendInvite")
			{
				cc.log("Recived Request");
				GameVars.oppId = json.data;
				GameVars.oppName = json.myname;
				cc.log(json.myname + "MYNAME");
				GameVars.replayRequest = true;
			}
			
			if(json.type == "decline")
			{
				cc.log("DECLINE RECIVED");
				GameVars.replayRequest = false;
				GameVars.inviteSent = false;
			}
			
			if(json.type == "start")
			{
				GameVars.oppId = json.data;
				cc.log("Starting Game");
				self.waitingOnPlayer = false;
				INIT_MULTI = false;
				INIT_MULTI_GAME = false;
				INIT_END_MULTI = false;
				GameVars.isMulti = true;
				//placeMentTiles = [];
				GameVars.startGame = true;
				GameVars.replayRequest = false;
				self.checkFin = false;
				cc.director.runScene(new cc.TransitionFade(1, new multiLevelScene(oppId)));
			}
			
			if(json.type == "waiting")
			{
				self.waitingOnPlayer = true;
			}
			
			if(json.type == "yesplayagain")
			{
				GameVars.startGame = true;
				INIT_MULTI = false;
				cc.log("Starting Game");
				cc.director.runScene(new cc.TransitionFade(1, new multiLevelScene(GameVars.oppId)));
			}
			
			if(json.type == "update")
			{
				GameVars.ghostX = json.dataX * GameVars.scaleFactor;
				GameVars.ghostY = json.dataY * GameVars.scaleFactor;
				GameVars.isImageFlipped = json.flip;
			}
			
			if(json.type == "saw")
			{
				cc.log("Recieved Message Saw" + json.dataX);
				GameVars.enemySawIndex = json.dataX;
				GameVars.createSaw = true;
			}
			
			if(json.type == "bomb")
			{
				GameVars.enemyBombX = json.dataX;
				GameVars.enemybombY = json.dataY;
				GameVars.enemyScale = json.scale;
				GameVars.createBomb = true;
			}
			
			if(json.type == 'otherfin')
			{
				GameVars.otherFin = true;
			}
			
			if(json.type == 'hasfinished')
			{
				if(self.checkFin == false)
				{
					if(json.data == "win")
						GameVars.win = true;
					else if(json.data == "lost")
						GameVars.win = false;
						
					cc.director.runScene(new cc.TransitionFade(2.5, new EndSceneMulti()));
				}
			}
			
			if(json.type == 'yesplayagain')
			{
				cc.log("YES PLAY AGAIN START GAME")
				GameVars.startGame = true;
			}
			
			if(json.type == "replay")
			{
				GameVars.replayRequest = true;
			}
			
			if(json.type == 'youfinished')
			{
				//cc.director.runScene(new cc.TransitionFade(1.5, new MainMenuScene()));
			}
			
		};
	
		this.socket.onerror = function(evt) 
		{
			cc.log("sendText Error was fired" + evt.data);
		};

		this.socket.onclose = function(evt) 
		{
			cc.log("_wsiSendText websocket instance closed.");
		};
		
		return true;
	},
	
	setWaitingLabel:function(str)
	{
		this.waitLbl.setString(str);
		this.waitLbl.runAction(this.dotAction);
		
	},
	
	removeWaitingLabel:function()
	{
		this.waitLbl.visible = false;
		this.whiteBg.visible = false;
		this.waitLbl.stopAllActions();
	},
	
	setDot:function()
	{
		//used for setting the three moving dots
		if(this.numOfDots == 0)
		{
			this.dotLbl.setVisible(true);
			this.dotLbl2.setVisible(false);
			this.dotLbl3.setVisible(false);
			this.numOfDots++;
		}
		else if(this.numOfDots == 1)
		{
			this.dotLbl2.setVisible(true);
			this.numOfDots++;
		}
		else if(this.numOfDots == 2)
		{
			this.dotLbl3.setVisible(true);
			this.numOfDots++;
		}
		else
		{
			this.dotLbl.setVisible(false);
			this.dotLbl2.setVisible(false);
			this.dotLbl3.setVisible(false);
			this.numOfDots = 0;
		}
	},
	
	touchQuit: function(sender, type)
	{
		switch (type)
		{
		case ccui.Widget.TOUCH_ENDED:
			cc.audioEngine.playEffect(res.buttonClick_mp3);
			INIT_MULTI = false;
			this.socket.send(JSON.stringify({ type:'quit', yourID: yourId}));
			this.endLevel();
			break;

			break;                
		}
	},
	
	endLevel:function()
	{
		INIT_GAME = false;
		cc.director.runScene(new cc.TransitionFade(1.5, new MainMenuScene()));
	},

	onExit: function() 
	{
		this._super();
	},

	_stringConvertToArray:function (strData) {
		if (!strData)
			return null;

		var arrData = new Uint16Array(strData.length);
		for (var i = 0; i < strData.length; i++) {
			arrData[i] = strData.charCodeAt(i);
		}
		return arrData;
	},

	toExtensionsMainLayer: function (sender) 
	{
		var scene = new ExtensionsTestScene();
		scene.runThisTest();
	}
});

WebSocketTestLayer.create = function () {
	var retObj = new WebSocketTestLayer();
	if (retObj && retObj.init()) {
		return retObj;
	}
	return null;
};