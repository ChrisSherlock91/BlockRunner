var friendSelf;

var FriendsButton = cc.Layer.extend
({
	m_id:null,
	m_name:null,
	
	ctor:function (id,name) 
	{
		this._super();
		this.init(id,name);
	},
	init:function (id,name) 
	{
		this._super();
		
		this.m_id = id;
		friendSelf = this;
		
		var btn = new ccui.Button("PlainBtn.png","PlainBtnDwn.png","",ccui.Widget.PLIST_TEXTURE);
		btn.setScale(GameVars.scaleFactor);
		btn.addTouchEventListener(this.invitePressed, this);
		this.addChild(btn);
		
		var label = new cc.LabelBMFont(name, res.menuFont_ttf);
		label.setScale(0.7 * GameVars.scaleFactor,0.7 * GameVars.scaleFactor);
		label.x = cc.winSize.width * 0.3;
		label.color = cc.color.RED;
		this.addChild(label);
	},
	
	invitePressed:function(sender,type)
	{
		switch (type)
		{
		case ccui.Widget.TOUCH_ENDED:
			cc.audioEngine.playEffect(res.buttonClick_mp3);
			var facebook = plugin.FacebookAgent.getInstance();
			facebook.api("/me/",window["plugin"].FacebookAgent.HttpMethod.GET, {}, function (type, data)
			{
				if (type == window["plugin"].FacebookAgent.CODE_SUCCEED) 
				{
					//self.friendsName.push(data.name);
					GameVars.inviteSent = true;
					cc.log("Sending Invite to friend" + friendSelf.m_id + "Id" + "" + GameVars.myId + "MY ID" + "" + data.name + "THE NAME");
					networkLayer.socket.send(JSON.stringify({ type:'inviteFriend', oppId: friendSelf.m_id , myId: GameVars.myId , myname: data.name}));
				}
				else 
				{
					cc.log(JSON.stringify(data));
				}
					});
			break;

			break;                
		}
	}
	
	
});