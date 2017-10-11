//Ghost sprite for multiplayer
var GhostPlayer = cc.Layer.extend({
	posX:null,
	posY:null,
	wasFlipped:null,

	ctor:function (positionX,positionY,world) 
	{
		this._super();
		this.posX = positionX;
		this.posY = positionY;
		this.space = world;
		this.wasFlipped = false;
		this.init();
	},

	init:function () 
	{
		this.createPlayer();
		this.scheduleUpdate();
	},

	createPlayer:function()
	{
		//Check which player you are
		if(GameVars.enemyColType == 0)
		{
			this.sprite2 = new cc.Sprite(res.playerLeft1Blue_png);	
		}
		else
		{
			this.sprite2 = new cc.Sprite(res.playerRight1_png);
		}
		
		this.sprite2.x = this.posX;
		this.sprite2.y = this.posY;
		this.sprite2.setOpacity(650);
		this.addChild(this.sprite2);
	},

	update:function(dt)
	{
		//update to positions recived from networking object
		this.sprite2.x = GameVars.ghostX; 
		this.sprite2.y = GameVars.ghostY;
		
		
		if(GameVars.isImageFlipped)
		{
			this.sprite2.setFlippedX(true);
		}
		else
		{
			this.sprite2.setFlippedX(false);
		}
	
		
		
	},
});