cc.game.onStart = function(){
	cc.view.adjustViewPort(true);
	
	if (cc.sys.isNative)
	{
		var searchPaths = jsb.fileUtils.getSearchPaths();

		// ipad retina
		if (cc.view.getFrameSize().width >= 1536 && cc.view.getFrameSize().height >= 1536)
		{
			cc.view.setDesignResolutionSize(2048, 1536, cc.ResolutionPolicy.SHOW_ALL);
			searchPaths.push("res/LargeRes");
			searchPaths.push("res/Audio");
			searchPaths.push("src");
			cc.log("Large Res");
			GameVars.scaleFactor = 2;
			GameVars.TileSize = 100;
		}
		else if (cc.view.getFrameSize().width >= 640 && cc.view.getFrameSize().height >= 640) //iphone hd or above and android high res screens
		{
			var size;

			if (cc.view.getFrameSize().width >= 1136 || cc.view.getFrameSize.height >= 1136)
			{
				size = 1136;
			}
			else
			{
				size = 960;
			}
			
			cc.view.setDesignResolutionSize(size, 640, cc.ResolutionPolicy.SHOW_ALL);
			searchPaths.push("res/MediumRes");
			searchPaths.push("res/Audio");
			searchPaths.push("src");
			cc.log("Med Res");
			GameVars.scaleFactor = 1;
			GameVars.TileSize = 50;
		}
		
		jsb.fileUtils.setSearchPaths(searchPaths);
	}
	else
	{
		cc.view.setDesignResolutionSize(1280, 720, cc.ResolutionPolicy.SHOW_ALL);
		cc.view.resizeWithBrowserSize(true);
		cc.log("Med Res Browser");
	}

	//load resources
	cc.LoaderScene.preload(g_resources, function () 
		{
			cc.audioEngine.setEffectsVolume(0);
			cc.audioEngine.setMusicVolume(0);
//			cc.audioEngine.playEffect(res.sparkleSound_mp3);
//			cc.audioEngine.playEffect(res.bounceSnd_wav);
//			cc.audioEngine.playEffect(res.jumpSnd_wav);
//			cc.audioEngine.playEffect(res.starRewardSnd_mp3);
			cc.audioEngine.playMusic(res.menuMusic_mp3, false);
			cc.spriteFrameCache.addSpriteFrames(res.buttons_plist);
			cc.spriteFrameCache.addSpriteFrames(res.backgrounds_plist);
			cc.spriteFrameCache.addSpriteFrames(res.utils_plist);
			cc.audioEngine.setEffectsVolume(100);
			cc.audioEngine.setMusicVolume(90);
			cc.director.runScene(new MainMenuScene());
		}, this);
};
cc.game.run();