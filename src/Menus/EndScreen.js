//End Var for re initialising the scene
var INIT_END = false;

var EndMenu = cc.Layer.extend
({
	restartBtn:null,
	quitBtn:null,
	setTime:null,
	nextBtn:null,
	numOfStars:0,
	confirmBg:null,
	exitStr:null,
	yesBtn:null,
	noBtn:null,
	whiteBg:null,
	confirmLabel:null,
	fbBtn:null,
	LeaderBoard:null,
	leaderBtn:null,
	faceId:null,
	faceName:null,
	facebookLogin:null,
	postedScore:false,

	ctor:function () 
	{
		this._super();
		//Swtich accel level off
		if(GameVars.isAccelLvl) GameVars.isAccelLvl = false;
		//Set Background sprite
		var bg = new cc.Sprite(res.mainBg_png);
		bg.setAnchorPoint(0, 0);
		this.addChild(bg);

		//Add Window menu background
		var windowBg = new cc.Sprite("#LevelCompBg.png");
		windowBg.x = cc.director.getWinSize().width * 0.5;
		windowBg.y = cc.director.getWinSize().height * 0.5;
		windowBg.setScale(GameVars.scaleFactor);
		this.addChild(windowBg);

		//Assign Star Rewards
		this.getNumOfStars();
		
		//Add Labels for Time and Level information
		var label = new cc.LabelBMFont("Level Complete", res.menuFont_ttf);
		label.setScale(0.6 * GameVars.scaleFactor,0.6 * GameVars.scaleFactor);
		if(GameVars.scaleFactor == 1)
			label.setPosition(cc.p(cc.winSize.width * 0.5, cc.winSize.height * 0.9));
		else if(GameVars.scaleFactor == 2)
			label.setPosition(cc.p(cc.winSize.width * 0.5, cc.winSize.height * 0.84));
		label.color = cc.color.RED;
		this.addChild(label);
		
		var time = new cc.Sprite("#Time.png");
		if(GameVars.scaleFactor == 1)
		{
			time.x = cc.winSize.width * 0.46;
			time.y = cc.winSize.height * 0.43;
		}
		else if(GameVars.scaleFactor == 2)
		{
			time.x = cc.winSize.width * 0.46;
			time.y = cc.winSize.height * 0.44;
		}
		this.addChild(time);
		
		var timeLabel = new cc.LabelBMFont("Time ", res.menuFont_ttf);
		timeLabel.setScale(0.6 * GameVars.scaleFactor,0.6 * GameVars.scaleFactor);
		if(GameVars.scaleFactor == 1)
			timeLabel.setPosition(cc.p(cc.winSize.width * 0.36, cc.winSize.height * 0.43));
		else if(GameVars.scaleFactor == 2)
			timeLabel.setPosition(cc.p(cc.winSize.width * 0.36, cc.winSize.height * 0.44));
		timeLabel.color = cc.color.RED;
		this.addChild(timeLabel);
		
		var gameTime = new cc.LabelBMFont(GameVars.levelTime, res.menuFont_ttf);
		gameTime.setScale(0.6 * GameVars.scaleFactor,0.6 * GameVars.scaleFactor)
		if(GameVars.scaleFactor == 1)
			gameTime.setPosition(cc.p(cc.winSize.width * 0.58, cc.winSize.height * 0.43));
		else if(GameVars.scaleFactor == 2)
			gameTime.setPosition(cc.p(cc.winSize.width * 0.58, cc.winSize.height * 0.44));
		gameTime.color = cc.color.RED;
		this.addChild(gameTime);
		
		var level = new cc.LabelBMFont("Level", res.menuFont_ttf);
		level.setScale(0.6 * GameVars.scaleFactor,0.6 * GameVars.scaleFactor);
		if(GameVars.scaleFactor == 1)
			level.setPosition(cc.p(cc.winSize.width * 0.36, cc.winSize.height * 0.24));
		else if(GameVars.scaleFactor)
			level.setPosition(cc.p(cc.winSize.width * 0.36, cc.winSize.height * 0.29));
		level.color = cc.color.RED;
		this.addChild(level);
		
		var currLevel = new cc.LabelBMFont(GameVars.currLevel + 1, res.menuFont_ttf);
		currLevel.setScale(0.6 * GameVars.scaleFactor,0.6 * GameVars.scaleFactor);
		if(GameVars.scaleFactor == 1)
			currLevel.setPosition(cc.p(cc.winSize.width * 0.58, cc.winSize.height * 0.24));
		else if(GameVars.scaleFactor == 2)
			currLevel.setPosition(cc.p(cc.winSize.width * 0.58, cc.winSize.height * 0.29));
		currLevel.color = cc.color.RED;
		this.addChild(currLevel);
		
		if(GameVars.scaleFactor == 1)
		{
			var btnHeight = cc.winSize.height * 0.08;
			var confirmHeight = cc.winSize.height * 0.35;
		}
		else if(GameVars.scaleFactor == 2)
		{
			var btnHeight = cc.winSize.height * 0.12;
			var confirmHeight = cc.winSize.height * 0.37;
		}
		
		//Add Buttons for Next,Restart,Facebook Share,Leaderboard and Exit
		this.nextBtn = new ccui.Button("PlayBtn.png","PlayBtnDwn.png","",ccui.Widget.PLIST_TEXTURE);
		this.nextBtn.setScale(0.7 * GameVars.scaleFactor,0.7 * GameVars.scaleFactor);
		this.nextBtn.x = cc.winSize.width * 0.3;
		this.nextBtn.y = btnHeight;
		this.nextBtn.addTouchEventListener(this.nextLevel, this);
		this.addChild(this.nextBtn);
		
		this.restartBtn = new ccui.Button("RetryBtn.png","RetryBtnDwn.png","",ccui.Widget.PLIST_TEXTURE);
		this.restartBtn.setScale(0.72 * GameVars.scaleFactor,0.72 * GameVars.scaleFactor);
		this.restartBtn.x = cc.winSize.width * 0.4;
		this.restartBtn.y = btnHeight;
		this.restartBtn.addTouchEventListener(this.touchResume, this);
		this.addChild(this.restartBtn)

		this.fbBtn = new ccui.Button("fbBtn.png","fbBtnDown.png","",ccui.Widget.PLIST_TEXTURE);
		this.fbBtn.setScale(0.64 * GameVars.scaleFactor,0.64 * GameVars.scaleFactor);
		this.fbBtn.x = cc.winSize.width * 0.5;
		this.fbBtn.y = btnHeight;
		this.fbBtn.addTouchEventListener(this.fbShare, this);
		this.addChild(this.fbBtn);
		
		this.leaderBtn = new ccui.Button();
		this.leaderBtn.loadTextures(res.LeaderBtn, res.LeaderBtnDwn);
		this.leaderBtn.setScale(0.64 * GameVars.scaleFactor,0.64 * GameVars.scaleFactor);
		this.leaderBtn.x = cc.winSize.width * 0.6;
		this.leaderBtn.y = btnHeight;
		this.leaderBtn.addTouchEventListener(this.leaderTouch, this);
		this.addChild(this.leaderBtn);
		
		this.quitBtn = new ccui.Button("HomeBtn.png","HomeBtnDwn.png","",ccui.Widget.PLIST_TEXTURE);
		this.quitBtn.setScale(0.7 * GameVars.scaleFactor,0.7 * GameVars.scaleFactor);
		this.quitBtn.x = cc.winSize.width * 0.7;
		this.quitBtn.y = btnHeight;
		this.quitBtn.addTouchEventListener(this.touchQuit, this);
		this.addChild(this.quitBtn);
		
		//Set your stars reward
		this.setStars();
		//Check stars if better than previous to save locally
		this.checkStars();
		//Layer Gradient for exit screen
		this.whiteBg = cc.LayerColor.create(new cc.Color(128,128,128,160));
		this.addChild(this.whiteBg);
		this.whiteBg.visible = false;
		
		//This is for when you press the exit button
		this.confirmBg = new cc.Sprite("#ConfirmBg.png");
		this.confirmBg.x = cc.winSize.width * 0.5;
		this.confirmBg.y = cc.winSize.height * 0.6;
		this.confirmBg.setScale(GameVars.scaleFactor);
		this.addChild(this.confirmBg);
		this.confirmBg.visible = false;
		this.exitStr = new cc.LabelBMFont("     Are you Sure \n You want to Exit?", res.menuFont_ttf);
		this.exitStr.setScale(0.6 * GameVars.scaleFactor,0.6 * GameVars.scaleFactor);
		this.exitStr.setPosition(cc.p(cc.winSize.width * 0.5, cc.winSize.height * 0.62));
		this.exitStr.color = cc.color.RED;
		this.addChild(this.exitStr);
		this.exitStr.visible = false;
		this.yesBtn = new ccui.Button("YesBtn.png","YesBtnDwn.png","",ccui.Widget.PLIST_TEXTURE);
		this.yesBtn.setScale(0.7 * GameVars.scaleFactor,0.7 * GameVars.scaleFactor);
		this.yesBtn.x = cc.winSize.width * 0.42;
		this.yesBtn.y = confirmHeight;
		this.yesBtn.addTouchEventListener(this.yesQuit, this);
		this.addChild(this.yesBtn);
		this.yesBtn.visible = false;
		this.noBtn = new ccui.Button("NoBtn.png","NoBtnDwn.png","",ccui.Widget.PLIST_TEXTURE);
		this.noBtn.setScale(0.7 * GameVars.scaleFactor,0.7 * GameVars.scaleFactor);
		this.noBtn.x = cc.winSize.width * 0.55;
		this.noBtn.y = confirmHeight;
		this.noBtn.addTouchEventListener(this.noQuit, this);
		this.addChild(this.noBtn);
		this.noBtn.visible = false;

		this.confirmLabel = new cc.LabelBMFont("Confirm", res.menuFont_ttf);
		this.confirmLabel.setScale(0.6 * GameVars.scaleFactor,0.6 * GameVars.scaleFactor);
		if(GameVars.scaleFactor == 1)
			this.confirmLabel.setPosition(cc.p(cc.winSize.width * 0.5, cc.winSize.height * 0.85));
		else if(GameVars.scaleFactor == 2)
			this.confirmLabel.setPosition(cc.p(cc.winSize.width * 0.5, cc.winSize.height * 0.81));
		this.confirmLabel.color = cc.color.RED;
		this.addChild(this.confirmLabel);
		this.confirmLabel.visible = false;
		
		if(GameVars.currLevel == 0 || GameVars.currLevel == 1 || GameVars.currLevel == 2)
			GameVars.levelLocks[GameVars.currLevel + 1].level = 1;
		
		//New Leaderboard object 
		this.LeaderBoard = new LeaderBoard();
		this.LeaderBoard.x = cc.winSize.width * 0.5;
		this.LeaderBoard.y = cc.winSize.height * 0.45;
		this.LeaderBoard.visible = false;
		this.addChild(this.LeaderBoard);
		
		//New FB Login object
		this.fbLogin = new FacebookLogin();
		this.fbLogin.x = cc.winSize.width * 0.5;
		this.fbLogin.y = cc.winSize.height * 0.5;
		this.fbLogin.visible = false;
		this.addChild(this.fbLogin);
		
		//Stop Game audio play menu music
		cc.audioEngine.stopMusic();
		cc.audioEngine.playMusic(res.menuMusic_mp3, false);
		
		//Register update for callbacks
		this.scheduleUpdate();
	},
	
	//Get your information from facebook api (Id,Name)
	getFacebookInfo:function()
	{
		var facebook = plugin.FacebookAgent.getInstance();
		var self = this;
		facebook.api("/me/",window["plugin"].FacebookAgent.HttpMethod.GET, {'fields':'name'}, function (type, data)
		{
			if (type == window["plugin"].FacebookAgent.CODE_SUCCEED) 
			{
				for(var i = 0; i < data.data.length; i++)
				{
					self.faceId = data.data[i].id;
					self.faceName = data.data[i].name;
				}
			}
			else 
			{
				cc.log(JSON.stringify(data));
			}
		});
	},
	
	
	//Exit menu display buttons
	setConfirm:function()
	{
		this.yesBtn.visible = true;
		this.whiteBg.visible = true;
		this.noBtn.visible = true;
		this.exitStr.visible = true;
		this.confirmBg.visible = true;
		this.confirmLabel.visible = true;
	},
	
	//Hide exit menu show endscreen again
	noPressed:function()
	{
		this.quitBtn.visible = true;
		this.nextBtn.visible = true;
		this.restartBtn.visible = true;
		this.fbBtn.visible = true;

		this.yesBtn.visible = false;
		this.whiteBg.visible = false;
		this.noBtn.visible = false;
		this.exitStr.visible = false;
		this.confirmBg.visible = false;
		this.confirmLabel.visible = false;
	},
	
	fbShare:function(sender,type)
	{
		switch (type)
		{
		case ccui.Widget.TOUCH_ENDED:
			//JSON map for share information
			var info = {
					"dialog": "shareLink",
					"link": "http://chrissherlock.site11.com/",
					"name": "Level Complete",
					"description": 'I completed level' + " " + (GameVars.currLevel + 1) + ' ' + 'In : ' + GameVars.levelTime + " " + 'Seconds',
					"picture": "http://i.imgur.com/JlidxC9.jpg"
			};

			var facebook = plugin.FacebookAgent.getInstance();

				//Share the map created
				facebook.dialog(info, function (code, response) {
					if(code == plugin.FacebookAgent.CODE_SUCCEED){
						// Succeed
					} else {
						cc.log("Sharing failed, error #" + code + ": " + response);
					}
				});
			break;

			break;                
		}
	},
	
	leaderTouch:function(sender,type)
	{
		var that = this;
		
		switch (type)
		{
		case ccui.Widget.TOUCH_ENDED:
			var facebook = plugin.FacebookAgent.getInstance();
			//Check your not on tutorial level
			if(GameVars.currLevel != 0)
			{
				//If not logged in display login screen
				if(!facebook.isLoggedIn())
				{
					this.fbLogin.visible = true;
					this.nextBtn.visible = false;
	
				}
				else
				{
					//Get your facebook ID
					cc.audioEngine.playEffect(res.buttonClick_mp3);
					this.getFaceId();
				}
				break;
			}
			else
			{
				//For Tutorial Level - No Leaderboard
				this.LeaderBoard.setNoString();
				this.LeaderBoard.visible = true;
				this.buttonsVisible(false);
			}

			break;                
		}
	},
	
	//Get your Facebook ID
	getFaceId:function(highscores)
	{
		var that = this;
		var facebook = plugin.FacebookAgent.getInstance();
		facebook.api("/me", plugin.FacebookAgent.HttpMethod.GET, {'fields':'name'}, function (type, data)
		{
			if (type == window["plugin"].FacebookAgent.CODE_SUCCEED) 
			{
				GameVars.faceId = data.id;
				GameVars.faceName = data.name;
				cc.log("Got Face ID");
				cc.log("Your Name" + GameVars.faceName);
				cc.log("Your Face Id" + GameVars.faceId);
				//Check if your new score better than old score
				that.checkIfBetterScore();
			}
			else 
			{
				cc.log(JSON.stringify(data));
			}
		});
	},
	
	checkIfBetterScore:function()
	{
		var self = this;
		var xhr = cc.loader.getXMLHttpRequest();
		xhr.open("POST", "http://52.16.195.14:3000/getDb");
		xhr.setRequestHeader("Content-Type","text/plain;charset=UTF-8");
		xhr.onreadystatechange = function () 
		{
			if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) 
			{
				var httpStatus = xhr.statusText;
				var response = xhr.responseText;
				var highScores = JSON.parse(response);
				//Compare highscores with returned score for your level
				self.compareScores(highScores);
			}
		};
		//Post your facebook id and return your score for that level
		var levelstr = "Level" + GameVars.currLevel;
		var param = JSON.stringify({ level : levelstr});
		xhr.send(param);
	},
	
	compareScores:function(highScores)
	{
		var isHighScore = false;
		var newAccount = false;
		for(var i = 0; i < highScores.length; i++)
		{
			//Check the returned id is actually yours
			if(highScores[i].FaceId == GameVars.faceId)
			{
				//Compare your old score with new score
				if(highScores[i].Score > GameVars.levelTime)
				{
					//Send the updated score to the DB
					this.updatePlayerScore();
					//Set you have a new highscore
					isHighScore = true;
					break;
				}
				else
				{
					//You dont need a new account
					newAccount = false;
					break;
				}
			}
			else
			{
				//Create a new entry in the DB
				newAccount = true;
			}
		}
		
		if(highScores.length == 0)
		{
			//Post your new score
			this.postHighScore();
		}
		else if(newAccount && !isHighScore)
		{
			this.postHighScore();
		}
		else
		{
			//Request the highscore table
			this.sendGetRes();
		}
	},
	
	updatePlayerScore:function()
	{
		var self = this;
		var xhr = cc.loader.getXMLHttpRequest();
		xhr.open("POST", "http://52.16.195.14:3000/repaceScore");
		xhr.setRequestHeader("Content-Type","text/plain;charset=UTF-8");
		xhr.onreadystatechange = function () 
		{
			if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) 
			{
				var httpStatus = xhr.statusText;
				var response = xhr.responseText + "...";
				cc.log(response);
				//After posting do a get request to get the highscore table
				//This makes sure your highscore is entered in the returned result
				self.sendGetRes();
			}
		};
		//post to DB your level and new score
		var levelstr = "Level" + GameVars.currLevel;
		var param = JSON.stringify({ level: levelstr ,name : GameVars.faceName , score: GameVars.levelTime , faceId: GameVars.faceId });
		xhr.send(param);
	},
	
	sendGetRes:function()
	{
		var self = this;
		var xhr = cc.loader.getXMLHttpRequest();
		xhr.open("POST", "http://52.16.195.14:3000/getDb");
		xhr.setRequestHeader("Content-Type","text/plain;charset=UTF-8");
		xhr.onreadystatechange = function () 
		{
			if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) 
			{
				var httpStatus = xhr.statusText;
				var response = xhr.responseText;
				var highScores = JSON.parse(response);
				cc.log("RETURNED HIGHSCORES " + " " + highScores);
				//Set the leaderboard with the returned JSON object
				self.LeaderBoard.setLeaderboard(highScores);
			}
		};
		
		//Post what level leaderboard you would like
		var levelstr = "Level" + GameVars.currLevel;
		var param = JSON.stringify({ level : levelstr});
		xhr.send(param);
		this.LeaderBoard.visible = true;
		this.buttonsVisible(false);
	},
	
	postHighScore:function()
	{
		var self = this;
		var xhr = cc.loader.getXMLHttpRequest();
		xhr.open("POST", "http://52.16.195.14:3000/");
		xhr.setRequestHeader("Content-Type","text/plain;charset=UTF-8");
		xhr.onreadystatechange = function () 
		{
			if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) 
				{
					var httpStatus = xhr.statusText;
					var response = xhr.responseText + "...";
					cc.log(response);
					self.sendGetRes();
				}
		};
		var levelstr = "Level" + GameVars.currLevel;
		cc.log("This is Curr Level : " + " " + levelstr);
		var param = JSON.stringify({ level : levelstr,name : GameVars.faceName , score: GameVars.levelTime , faceId: GameVars.faceId });
		xhr.send(param);
	},
	
	
	noQuit:function(sender,type)
	{
		switch (type)
		{
		case ccui.Widget.TOUCH_ENDED:
			cc.audioEngine.playEffect(res.buttonClick_mp3);
			this.noPressed();
			break;

			break;                
		}
	},
	
	yesQuit:function(sender,type)
	{
		switch (type)
		{
		case ccui.Widget.TOUCH_ENDED:
			cc.audioEngine.playEffect(res.buttonClick_mp3);
			this.onQuitPressed();
			break;

			break;                
		}
	},
	
	buttonsVisible:function(on)
	{
		if(on)
		{
			this.quitBtn.visible = true;
			this.nextBtn.visible = true;
			this.restartBtn.visible = true;
			this.fbBtn.visible = true;
			this.leaderBtn.visible = true;
		}
		else
		{
			this.quitBtn.visible = false;
			this.nextBtn.visible = false;
			this.restartBtn.visible = false;
			this.fbBtn.visible = false;
			this.leaderBtn.visible = false;
		}
	},
	
	checkStars:function()
	{
		if(GameVars.levelStars[GameVars.currLevel].stars < this.numOfStars)
		{
			GameVars.levelStars[GameVars.currLevel].stars = this.numOfStars;
			//uses Localstroage to save how many stars you have recived
			//this.saveStars();
		}
	},
	
	update:function(dt)
	{
		if(this.LeaderBoard.visible == false && this.whiteBg.visible == false && this.fbLogin.visible == false)
		{
			this.buttonsVisible(true);
		}
		else
		{
			this.buttonsVisible(false);
		}
	},
	
	//Save levelstars Locally
	saveStars:function()
	{
		var ls = cc.sys.localStorage;
		var key  = "levelStars";
		for(var i = 0; i < GameVars.levelStars.length; i++)
			ls.setItem(key + i, GameVars.levelStars[i].stars);
	},
	
	//Set how many stars to reward
	setStars:function()
	{
		var stars="";
		var stars2 ="";
		var stars3 ="";
		
		if(this.numOfStars == 3)
		{
			stars = "#StarBig.png";
			stars2 =  "#StarBig.png";
			stars3 = "#StarBig.png";
		}
		else if(this.numOfStars == 2)
		{
			stars =  "#darkStar.png"
			stars2 =  "#StarBig.png";
			stars3 =  "#StarBig.png";
		}
		else if(this.numOfStars == 1)
		{
			stars = "#darkStar.png"
				stars2 = "#darkStar.png"
			stars3 =  "#StarBig.png";
		}
		
		if(GameVars.scaleFactor == 1)
			var starHeight = cc.winSize.height * 0.68;
		else if(GameVars.scaleFactor == 2)
			var starHeight = cc.winSize.height * 0.65;
		
		var star = new cc.Sprite(stars);
		if(GameVars.scaleFactor == 1)
			star.setPositionX(cc.winSize.width * 0.655);
		else if(GameVars.scaleFactor == 2)
			star.setPositionX(cc.winSize.width * 0.67);
		star.setPositionY(starHeight);
		star.setOpacity(0);
		star.setScale(2.5);
		this.addChild(star);
		
		var star2 = new cc.Sprite(stars2);
		star2.setPositionX(cc.winSize.width * 0.495);
		star2.setPositionY(starHeight);
		star2.setOpacity(0);
		star2.setScale(2.5);
		this.addChild(star2);
		
		var star3 = new cc.Sprite(stars3);
		if(GameVars.scaleFactor == 1)
			star3.setPositionX(cc.winSize.width * 0.33);
		else if(GameVars.scaleFactor == 2)
			star3.setPositionX(cc.winSize.width * 0.315);
		star3.setPositionY(starHeight);
		star3.setOpacity(0);
		star3.setScale(2.5);
		this.addChild(star3);
		
		var scaleAction = cc.scaleTo(1, 1, 1);
		var fadeIn = cc.FadeIn.create(1.0);
		var playSound = cc.callFunc(this.playRewardSound,this);
		
		if(this.numOfStars == 3)
		{			
			star3.runAction(cc.Sequence(cc.delayTime(1),fadeIn,playSound,scaleAction));
			star2.runAction(cc.Sequence(cc.delayTime(2),fadeIn,playSound,scaleAction));
			star.runAction(cc.Sequence(cc.delayTime(3),fadeIn,playSound,scaleAction));
		}
		if(this.numOfStars == 2)
		{
			star3.runAction(cc.Sequence(cc.delayTime(1),fadeIn,playSound,scaleAction));
			star2.runAction(cc.Sequence(cc.delayTime(2),fadeIn,playSound,scaleAction));
			star.setScale(0.3, 0.3);
			star.setOpacity(100);
		}
		else if(this.numOfStars == 1)
		{
			star3.runAction(cc.Sequence(cc.delayTime(1),fadeIn,playSound,scaleAction));
			star2.setScale(0.3, 0.3);
			star2.setOpacity(100);
			star.setScale(0.3, 0.3);
			star.setOpacity(100);
		}
	},
	
	playRewardSound:function()
	{
		cc.audioEngine.playEffect(res.starRewardSnd_mp3);
	},
	
	//Check times to reward stars
	getNumOfStars:function()
	{
		if(GameVars.levelTime < GameVars.starTimes[GameVars.currLevel].three)
			this.numOfStars = 3;
		else if(GameVars.levelTime < GameVars.starTimes[GameVars.currLevel].two)
			this.numOfStars = 2;
		else
			this.numOfStars = 1;
	},

	touchResume: function(sender, type)
	{
		switch (type)
		{
		case ccui.Widget.TOUCH_ENDED:
			cc.audioEngine.playEffect(res.buttonClick_mp3);
			this.resume();
			break;

			break;                
		}
	},
	
	nextLevel:function(sender,type)
	{
		switch (type)
		{
		case ccui.Widget.TOUCH_ENDED:
			cc.audioEngine.playEffect(res.buttonClick_mp3);
			this.loadNextLevel();
			break;

			break;                
		}
	},

	touchQuit: function(sender, type)
	{
		switch (type)
		{
		case ccui.Widget.TOUCH_ENDED:
			cc.audioEngine.playEffect(res.buttonClick_mp3);
			this.setConfirm();
			this.buttonsVisible(false);
			break;

			break;                
		}
	},
	
	//Check current level and load next in sequence
	loadNextLevel:function()
	{
		INIT_PAUSE = false;
		INIT_TUT = false;
		INIT_END = false;
		INIT_LEVEL2 = false;
		INIT_LEVEL3 = false;
		INIT_LEVEL4 = false;
		INIT_LEVEL5 = false;
		switch(GameVars.currLevel)
		{
			case 0:
				cc.director.runScene(new cc.TransitionFade(1.5, new gameScene()));
				break;
			case 1:
				GameVars.canMove = false;
				cc.director.runScene(new cc.TransitionFade(1.5, new gameSceneLvl2()))
				break;
			case 2:
				GameVars.canMove = false;
				cc.director.runScene(new cc.TransitionFade(1.5, new gameSceneLvl3()));
				break;
			case 3:
				GameVars.canMove = false;
				cc.director.runScene(new cc.TransitionFade(1.5, new gameSceneLvl4()));
				break;
			case 4:
				GameVars.canMove = false;
				cc.director.runScene(new cc.TransitionFade(1.5, new LevelSelectScene))
			break;
		}
	},

	//Resumes your current level again
	resume:function()
	{
		INIT_PAUSE = false;
		INIT_TUT = false;
		INIT_END = false;
		INIT_GAME = false;
		
		switch(GameVars.currLevel)
		{
		case 0:
			INIT_TUT = false;
			cc.director.resume();
			GameVars.touchRestart = true;
			cc.audioEngine.playEffect(res.buttonClick_mp3);
			this.scheduleOnce(cc.director.runScene(new tutScene()),3);
			break;
		case 1:
			INIT_GAME = false;
			cc.director.resume();
			GameVars.touchRestart = true;
			cc.audioEngine.playEffect(res.buttonClick_mp3);
			this.scheduleOnce(cc.director.runScene(new gameScene()),3);
			break;
		case 2:
			INIT_LEVEL2 = false;
			cc.director.resume();
			GameVars.touchRestart = true;
			cc.audioEngine.playEffect(res.buttonClick_mp3);
			this.scheduleOnce(cc.director.runScene(new gameSceneLvl2()),3);
			break;
		case 3:
			INIT_LEVEL3 = false;
			GameVars.isAccelLvl = false;
			cc.director.resume();
			cc.audioEngine.playEffect(res.buttonClick_mp3);
			this.scheduleOnce(cc.director.runScene(new gameSceneLvl3()),3);
			break;
		case 4:
			INIT_LEVEL4 = false;
			GameVars.isAccelLvl = false;
			cc.director.resume();
			cc.audioEngine.playEffect(res.buttonClick_mp3);
			this.scheduleOnce(cc.director.runScene(new gameSceneLvl4()),3);
			break;
		case 5:
			INIT_LEVEL5 = false;
			cc.director.resume();
			GameVars.touchRestart = true;
			cc.audioEngine.playEffect(res.buttonClick_mp3);
			this.scheduleOnce(cc.director.runScene(new gameSceneLvl5()),3);
			break;

			break;
		}
	},

	onQuitPressed:function()
	{
		INIT_TUT = false;
		INIT_END = false;
		cc.director.runScene(new cc.TransitionFade(1.5, new MainMenuScene()));
	},
});

var EndScene = cc.Scene.extend({
	onEnter:function () 
	{
		this._super();

		if (INIT_END == false)
		{
			INIT_END = true;
			var layer = new EndMenu();
			this.addChild(layer);
		}
	}
});



