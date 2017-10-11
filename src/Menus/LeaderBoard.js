var LeaderBoard = cc.Layer.extend
({
	self:null,
	yourPoslbl:null,
	lblArray:null,
	noLeaderStr:null,
	
	ctor:function () 
	{
		this._super();
		this.self = this;
		var windowBg = new cc.Sprite("#LevelSelectBg.png");
		windowBg.x = 0;
		windowBg.y = 0;
		windowBg.setScale(GameVars.scaleFactor * 1);
		this.addChild(windowBg);
		
		this.lblArray = [];
		
		var rectPos = windowBg.getTextureRect()
		
		var leaderLbl = new cc.LabelBMFont("LeaderBoard", res.menuFont_ttf);
		leaderLbl.x = -5 * GameVars.scaleFactor;
		leaderLbl.y = 250 * GameVars.scaleFactor;
		leaderLbl.setScale(0.5 * GameVars.scaleFactor);
		leaderLbl.color = cc.color.RED;
		this.addChild(leaderLbl);	
		
		this.noLeaderStr = new cc.LabelBMFont("Sorry No Leaderboard Available",res.menuFont_ttf);
		this.noLeaderStr.y = -cc.winSize.height * 0.05;
		this.noLeaderStr.setScale(0.7 * GameVars.scaleFactor);
		this.noLeaderStr.setWidth(cc.winSize.width * 0.5);
		this.noLeaderStr.color = cc.color.RED;
		this.noLeaderStr.visible = false;
		this.addChild(this.noLeaderStr);
		
		this.yourPoslbl = new cc.LabelBMFont("Your Ranking : ", res.menuFont_ttf);
		this.yourPoslbl.x = -50 * GameVars.scaleFactor;
		this.yourPoslbl.y = 170 * GameVars.scaleFactor;
		this.yourPoslbl.setScale(0.4 * GameVars.scaleFactor);
		this.yourPoslbl.color = cc.color.RED;
		this.addChild(this.yourPoslbl);	
		
		var namelbl = new cc.LabelBMFont("Name", res.menuFont_ttf);
		namelbl.x = -200 * GameVars.scaleFactor;
		namelbl.y = 100 * GameVars.scaleFactor;
		namelbl.setScale(0.5 * GameVars.scaleFactor);
		namelbl.color = cc.color.BLUE;
		this.addChild(namelbl);	
		
		var scorelbl = new cc.LabelBMFont("Time", res.menuFont_ttf);
		scorelbl.x = 40 * GameVars.scaleFactor;
		scorelbl.y = 100 * GameVars.scaleFactor;
		scorelbl.setScale(0.5 * GameVars.scaleFactor);
		scorelbl.color = cc.color.BLUE;
		this.addChild(scorelbl);	
		
		var ranklbl = new cc.LabelBMFont("Rank", res.menuFont_ttf);
		ranklbl.x = 200 * GameVars.scaleFactor;
		ranklbl.y = 100 * GameVars.scaleFactor;
		ranklbl.setScale(0.5 * GameVars.scaleFactor);
		ranklbl.color = cc.color.BLUE;
		this.addChild(ranklbl);	
		
		
		var backBtn = new ccui.Button("NoBtn.png","NoBtnDwn.png","",ccui.Widget.PLIST_TEXTURE);
		backBtn.setScale(0.7 * GameVars.scaleFactor,0.7 * GameVars.scaleFactor);
		backBtn.x = 0;
		backBtn.y = -200 * GameVars.scaleFactor;
		backBtn.addTouchEventListener(this.backBtnPressed, this);
		this.addChild(backBtn);
	},
	
	setNoString:function()
	{
		this.noLeaderStr.visible = true;
	},

	setLeaderboard:function(highScoreTable)
	{
		var yPos = 80 * GameVars.scaleFactor;
		
		for(var i in highScoreTable)
		{
			if(highScoreTable[i].FaceId == GameVars.faceId)
			{
				this.yourPoslbl.setString("Your Ranking : " + " " + highScoreTable[i].rank);
			}
			
			if(i < 4)
			{
				yPos -= 40 * GameVars.scaleFactor;
				var lbl = new cc.LabelBMFont(highScoreTable[i].Name, res.menuFont_ttf);
				lbl.x = -200 * GameVars.scaleFactor;
				lbl.y = yPos;
				lbl.setScale(0.45 * GameVars.scaleFactor);
				lbl.color = cc.color.RED;
				this.addChild(lbl);	
				
				var timelbl = new cc.LabelBMFont(highScoreTable[i].Score + "", res.menuFont_ttf);
				timelbl.x = 25 * GameVars.scaleFactor;
				timelbl.y = yPos;
				timelbl.setScale(0.45 * GameVars.scaleFactor);
				timelbl.color = cc.color.RED;
				this.addChild(timelbl);	
				
				var ranklbl = new cc.LabelBMFont(highScoreTable[i].rank, res.menuFont_ttf);
				ranklbl.x = 190 * GameVars.scaleFactor;
				ranklbl.y = yPos;
				ranklbl.setScale(0.45 * GameVars.scaleFactor);
				ranklbl.color = cc.color.RED;
				this.addChild(ranklbl);	
			}
		}
	},
	backBtnPressed:function(sender,type)
	{
		switch (type)
		{
		case ccui.Widget.TOUCH_ENDED:
			cc.audioEngine.playEffect(res.buttonClick_mp3);
			this.self.visible = false;
			break;

			break;                
		}
	}
	
	
});