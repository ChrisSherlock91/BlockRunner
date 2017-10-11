//collision type for chipmunk
if(typeof SpriteTag == "undefined") 
{
	var SpriteTag = {};
	SpriteTag.player = 0;
	SpriteTag.floor = 1;
	SpriteTag.wall = 3;
	SpriteTag.saw = 5;
	SpriteTag.goal = 4;
	SpriteTag.gravOn = 7;
	SpriteTag.gravOff = 8;
	SpriteTag.boost = 9;
	SpriteTag.yourSaw = 10;
	SpriteTag.enemySaw = 11;
	SpriteTag.bomb = 12;
};


var GameVars = GameVars || {};
GameVars.isGravityFlipped = false;
GameVars.isImageFlipped = false;
GameVars.gravity = 3150;
GameVars.boostAmount = 2000;
GameVars.jumpPower = 1150;
GameVars.bodyPieces = 25;
GameVars.playerSize = 50;
GameVars.oppId = 0;
GameVars.myId = 0;
GameVars.otherFin = false;
GameVars.switchedControls = false;
GameVars.isAccelLvl = false;
GameVars.win = false;
GameVars.sfxOn = true;
GameVars.musicOn = true;
GameVars.mPressed = false;
GameVars.hasFinished = false;
GameVars.touchHeldRight = false;
GameVars.touchHeldLeft = false;
GameVars.gravityFlipped = false;
GameVars.startGame = false;
GameVars.jump = false;
GameVars.canJump = false;
GameVars.levelTime = 0;
GameVars.startPosx = 0;
GameVars.startPosY = 0;
GameVars.touchRestart = false;
GameVars.canMove = true;
GameVars.isMulti = false;
GameVars.musicVol = 100;
GameVars.sfxVol = 100;
GameVars.ghostX = 300;
GameVars.ghostY = -3000;
GameVars.currLevel = 0;
GameVars.scaleFactor = 0;
GameVars.TileSize = 50;
GameVars.GoalWidth = 10;
GameVars.GoalHeight = 150;
GameVars.GoalHeightBig = 500;
GameVars.InPlay = true;
GameVars.NumSaws = 5;
GameVars.NumBombs = 5;
GameVars.enemyBombX = 0;
GameVars.enemybombY = 0;
GameVars.enemyScale = 0;
GameVars.createSaw = false;
GameVars.createBomb = false;
GameVars.enemySawIndex = 0;
GameVars.enemyColType = 0;
GameVars.switchFollow = false;
GameVars.isGhostScreen = false;


//Control on Multiplayer Game and Invites
GameVars.friendsList;
GameVars.shouldUpdateFriends = false;
GameVars.replayRequest = false;
GameVars.oppName = "";
GameVars.inviteSent = false;
GameVars.isFacebookPlayer = false;
GameVars.faceId = 0;
GameVars.faceName = "";

//Control for level Locking
GameVars.levelLocks = [
                        {"level":"1"},
                        {"level":"1"},
                        {"level":"1"},
                        {"level":"1"},
                        {"level":"1"},
                        {"level":"1"},
                      ]
//For checking star values to be awarded
GameVars.starTimes = [
                       {"level":"0","three":"5" ,"two":"150"}, 
                       {"level":"1","three":"8" ,"two":"15"}, 
                       {"level":"2","three":"15","two":"22"},
                       {"level":"3","three":"12","two":"18"},
                       {"level":"4","three":"9" ,"two": "15"},
                       {"level":"5","three":"15","two":"22"}
                     ];

//Storing the number of stars on each level
GameVars.levelStars = [
                        {"stars" : "0"},
                        {"stars" : "0"},
                        {"stars" : "0"},
                        {"stars" : '0'},
                        {"stars" : '0'},
                        {"stars" : '0'},
                       ];
