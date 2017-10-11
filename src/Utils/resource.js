//For loading All assets
var folder = "";


if(!cc.sys.isNative)
{
	folder = "res/BrowserRes/";
}

var res = 
{
	//Maps
	tutMap2 : folder + "tutorialMap2.tmx",
    map_tmx : folder + "map.tmx",
    level2_tmx : folder + "Level2.tmx",
    level3_tmx : folder + "Level3.tmx",
    level4_tmx : folder + "Level4.tmx",
    level5_tmx : folder + "Level5.tmx",
    multiMap_tmx : folder + "MultiMap.tmx",
    
    //Audio
    gravityOff_wav : folder + "GravityOff.wav",
    gravitySwitch_mp3 : folder + "gravitySwitch.mp3",
    tick_wav : folder + "tick.wav",
    buttonClick_mp3 : folder + "buttonClick.wav",
    menuMusic_mp3 : folder + "MenuMusic.mp3",
    jumpSnd_wav : folder + "Jump.wav",
    bangSnd_mp3 : folder + "Bang.wav",
    levelSnd_wav : folder + "LevelMusic.mp3",
    starRewardSnd_mp3 : folder + "StarReward.wav",
    sparkleSound_mp3 : folder + "SparkleSound.wav",
    bounceSnd_wav : folder + "BounceSnd.wav",
    fuseSnd_wav : folder + "FuseBurning.wav",
    explosionSnd_wav : folder + "Explosion.wav",
    
    //Plist files
    sparkParticle_plist : folder + "SparkParticle.plist",
    bloodParticle_plist : folder + "bloodTexture.plist",
    starsParticles_plist : folder + "stars.plist",
    buttons_plist : folder + "Buttons.plist",
    backgrounds_plist : folder + "Backgrounds.plist",
    Bounce_plist : folder + "Bounce.plist",
    utils_plist : folder + "Utils.plist",
    Bomb_plist : folder + "Bomb.plist",
    Explosion_plist : folder + "Explosion.plist",
    Jump_plist : folder + "jump.plist",
    JumpBlue_plist : folder + "jumpBlue.plist",
    JumpBlue_png : folder + "jumpBlue.png",
    Jump_png : folder + "jump.png",
    
    //Fonts
    menuFont_ttf : folder + "font.fnt",
    
    //Png Images
    metalBox_png : folder + "metalBox.jpg",
    chain_png : folder + "metal-chain.png",
    part0_png : folder + "part0.png",
    part1_png : folder + "part1.png",
    part2_png : folder + "part2.png",
    part3_png : folder + "part3.png",
    playerRight1_png : folder + "frame1Right.png",
    playerRight2_png : folder + "frame2Right.png",
    playerRight1Blue_png : folder + "frame1RightBlue.png",
    plyaerRight2Blue_png : folder + "frame2RightBlue.png",
    mainBg_png : folder + "MainBg.png",
    itemsBg : folder + "ItemBg.png",
    itemsBgSelected : folder + "ItemsBgSelected.png",
    sky_png : folder + "sky.png",
    onBtn_png : folder + "OnBtn.png",
    offBtn_png : folder + "OffBtn.png",
    buttons_png : folder + "Buttons.png",
    backgrounds_png : folder + "Backgrounds.png",
    utils_png : folder + "Utils.png",
    BounceDown : folder + "Bounce0.png",
    BounceMid : folder + "Bounce1.png",
    BounceUp : folder + "Bounce2.png",
    Bounce_png : folder + "Bounce.png",
    LeaderBtn: folder + "LeaderBtn.png",
    LeaderBtnDwn : folder + "LeaderDwn.png",
    Outline_png : folder + "outline.png",
    MultiMenuBtn : folder + "MultiMenuBtn.png",
    Bomb_png : folder + "Bomb.png",
    BombOne_png : folder + "bomb1.png",
    Explosion_png : folder + "Explosion.png",
    MultiMenuBtnDown : folder + "MultiMenuBtnDown.png"
};

var g_resources = [];
for (var i in res) 
{
    g_resources.push(res[i]);
}