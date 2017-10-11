
var Spike = cc.Sprite.extend
({
	ctor:function ( space, pos) 
	{
		this._super("#spike.png");
		var scale = 0.6;
		this.setScale(scale);
		var body = new cp.StaticBody();
		body.setPos(cc.p(pos.x, pos.y));
		this.x = pos.x;
		this.y = pos.y;
		var offset = 4;
		var verts = [this.width / offset,-this.height / offset  , -this.width / offset, -this.height / offset,    0, this.height / offset];    
		var shape = new cp.PolyShape(body, verts, cp.v(0, 0));
		shape.setCollisionType(SpriteTag.saw);
		space.addStaticShape(shape);
	}
});





