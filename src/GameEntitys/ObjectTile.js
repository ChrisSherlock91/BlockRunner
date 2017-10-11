
//Global touch Listener used for each tile
var onTouchBegan = function(touch,event)
{
	var target = event.getCurrentTarget();
	var location = target.convertToNodeSpace(touch.getLocation());
	var targetSize = target.getContentSize();
	var targetRectangle = cc.rect(0, 0, targetSize.width, targetSize.height);
	//Check if pressed inside the object
	if (cc.rectContainsPoint(targetRectangle, location)) 
	{
		target.setPressed(true);
	}
	return true;
};

var onTouchEnded = function(touch,event)
{
	var target = event.getCurrentTarget();
	if(target.checkHit == true)
	{
		target.setPressed(false);
	}

};

var ObjectTile = cc.Sprite.extend({	
	checkHit:false,
	lightListener:null,
	
	ctor:function() 
	{
		this._super(res.Outline_png);
		
		//Add touch listener for object
		this.lightListener = cc.EventListener.create({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: false,
			onTouchBegan: onTouchBegan,
			onTouchEnded: onTouchEnded
		});
		cc.eventManager.addListener(this.lightListener, this);
	},
	
	removeListener:function()
	{
		cc.eventManager.removeListener(this.lightListener);
	},
	
	setPressed:function(on)
	{
		this.checkHit = on;
	},
});