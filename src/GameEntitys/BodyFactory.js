var createStaticBody = function(space,pos,width,height,sensor,collisionType,friction)
{
	var body = new cp.StaticBody();
	body.setPos(cc.p(pos.x, pos.y));
	//add shape to space
	var shape = new cp.BoxShape(body,width,height);
	shape.setCollisionType(collisionType);
	if(sensor)
	{
		shape.setSensor(true);
	}
	shape.setFriction(friction);
	space.addStaticShape(shape);
};