 
// Port where we'll run the websocket server
var webSocketsServerPort = 80;
 
// websocket and http servers
var express = require("express");
var webSocketServer = require('websocket').server;
var http = require('http');
var bodyParser = require("body-parser");
var app  = express();
 
// list of currently connected clients (users)
var clients = [];
var clientsTimes = [];
var clientsReady = [];

var facebookClients = [];
var numOfQuickClients = 0;

var quickmatchClients = [];

var numOfClients = 0;
var numOfFacebook = 0;


var mysql = require('mysql');
var pool  = mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'chris',
    password : 'nst12zypolq',
    database : 'highscores',
    debug    :  false
});

app.use(bodyParser.urlencoded({ extended: false }));


function replaceScore(req,res)
{
    pool.getConnection(function(err,connection)
    {
        if (err) 
        {
          connection.release();
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }        

        req.on('data', function(chunk) 
        {
            var j = JSON.parse(chunk);
            console.log("Replace Score");
            var sql = "UPDATE" + " " + j.level  + " " + "Set Score = ? Where FaceId = ?";
            var values = [ [j.score, j.faceId.toString()] ];

            connection.query(sql, [j.score, j.faceId.toString()],function(err,rows)
            {
                connection.release();
                if(!err) 
                {
                    res.json(rows);
                } 
                else
                {
                    console.log(err);
                }          
            });

            connection.on('error', function(err) 
            {      
              console.log(err + " " + "ERROR")
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;     
            });


        });
  });
}


function handle_get(req,res)
{

    pool.getConnection(function(err,connection)
    {
        if (err) 
        {
          connection.release();
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }

        req.on('data', function(chunk) 
        {
            var j = JSON.parse(chunk);
            var string = "SELECT  Name,Score,FaceId,@curRank := @curRank + 1 AS rank FROM" + " " + j.level + " " + "p, (SELECT @curRank := 0) r ORDER BY  Score";
            connection.query(string,function(err,rows)
            {
                connection.release();
                if(!err) 
                {
                    res.json(rows);
                } 
                else
                {
                    console.log(err);
                }          
            });
        });

        connection.on('error', function(err) 
        {      
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;     
        });

    });
}

function handle_database(req,res) 
{
    
    pool.getConnection(function(err,connection)
    {
        if (err) 
        {
          connection.release();
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }           

        req.on('data', function(chunk) 
        {
            var j = JSON.parse(chunk);
            console.log("Trying to Insert Data");

            var sql = "INSERT INTO" + " " + j.level  + " " +  "(Name, Score, FaceId) VALUES ?";
            var values = [ [j.name, j.score, j.faceId.toString()] ];

            connection.query(sql,[values],function(err,rows)
            {
                connection.release();
                if(!err) 
                {
                    res.json(rows);
                } 
                else
                {
                    console.log(err);
                }          
            });

            connection.on('error', function(err) 
            {      
              console.log(err + " " + "ERROR")
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;     
            });


        });
  });
}

app.post("/getDb",function(req,res)
{
    console.log("Recieved Get");
    handle_get(req,res);
});

app.post('/repaceScore',function(request,response)
{
    replaceScore(request,response);
});

app.post('/',function(request,response)
{
    handle_database(request,response);
});

app.listen(3000);


/**
 * HTTP server
 */
var server = http.createServer(function(request, response) 
{
    // Not important
});

server.listen(webSocketsServerPort, function() 
{
    console.log((new Date()) + " Server is listening on port " + webSocketsServerPort);
});
/**
 * WebSocket server
 */
var wsServer = new webSocketServer({
    // WebSocket server is tied to a HTTP server. WebSocket request is just
    httpServer: server
});
 
// This callback function is called every time someone
// tries to connect to the WebSocket server
wsServer.on('request', function(request) 
{
    console.log((new Date()) + ' Connection from origin ' + request.origin + '.');
    var connection = request.accept('echo-protocol', request.origin); 
    numOfClients++;
    var id = numOfClients;
    
    //Store Client
    clients[id] = connection;
    clients[id].sendUTF(JSON.stringify({"type": 'connect' , data: id}));
    console.log((new Date()) + ' Connection accepted From' + id );

    // user sent some message
    connection.on('message', function(message) 
    {
        if (message.type === 'utf8') 
        { // accept only text
             try 
            {
                var json = JSON.parse(message.utf8Data);
            } catch (e) 
            {
                console.log('This doesn\'t look like a valid JSON: ', message);
                return;
            }

           //console.log((new Date()) + ' Received Message from ' + id + " " + json.type);

            //Check if both players are ready to start
            if(json.type == "ready")
            {
                clientsReady[json.id] = true;

                if(clientsReady[json.id] == true && clientsReady[json.oppId] == true)
                {
                    //Send message to both players to start the game
                    clients[json.id].sendUTF(JSON.stringify({ type:'start', data: json.oppId }));
                    clients[json.oppId].sendUTF(JSON.stringify({ type:'start', data: json.id }));
                }
            }

            //Check if its a quickmatch game type
            if(json.type == "quickmatch")
            {
                //Check if we have two clients in quickmatch
                numOfQuickClients++;
                quickmatchClients[numOfQuickClients] = json.playerId;

                //If we have two clients ready
                if(numOfQuickClients % 2 == 0)
                {
                    //Tell the both clients to start the game
                    var clientId = quickmatchClients[numOfQuickClients];
                    console.log(clientId + "This is the Id Quickmatch");
                    clients[clientId - 1].sendUTF(JSON.stringify({type: 'start' , data: clientId}));
                    clients[clientId].sendUTF(JSON.stringify({type: 'start' , data: clientId - 1}));
                }
                else
                {
                    //Tell who is waiting that we need another player
                    var myId = quickmatchClients[numOfQuickClients]
                    console.log(myId + "This IS THE ID Quickmatch");
                    clients[myId].sendUTF(JSON.stringify({type: 'waiting', data: ''}));
                }
            }

            //If facebook friend request
            if(json.type == 'inviteFriend')
            {
                for(var i = 0; i < facebookClients.length; i++)
                {
                    if(facebookClients[i] == json.oppId)
                    {
                        //Send a message to the other client with your name and id
                        console.log("Sending message to friend")
                        console.log(json.myname + "My Name");
                        clients[facebookClients[i - 1]].sendUTF(JSON.stringify({ type: 'friendInvite' , data : json.myId, myname: json.myname}))
                    }
                }
            }

            if(json.type == "aceptInvite")
            {
                //Acept facebook game invite then start the game
                clients[json.id].sendUTF(JSON.stringify({ type:'start', data: json.oppId }));
                clients[json.oppId].sendUTF(JSON.stringify({ type:'start', data: json.id }));
            }

            if(json.type == "declineInvite")
            {
                //Decline the facebook friend invite
                console.log("Sending DEcline Invite");
                clients[json.oppId].sendUTF(JSON.stringify({ type:'decline', data: json.id }));
            }

            if(json.type == "leaving")
            {
                //check if a facebook client has exited lobby
                var indexFace = facebookClients.indexOf(json.faceId);
                var indexId = facebookClients.indexOf(json.myid);

                facebookClients.splice(indexFace,1);
                facebookClients.splice(indexId, 1);

                for(var i = 0; i < facebookClients.length; i++)
                {
                        if(i % 2 == 0)
                        {
                            //Tell all other people to reload their lobby
                            clients[facebookClients[i]].sendUTF(JSON.stringify({ type: 'friendArray' , data : facebookClients}))
                        }
                }
            }

            if(json.type == "facebookId")
            {
                //New player connected from facebook
                facebookClients.push(json.playerId);
                facebookClients.push(json.faceId);
                clients[json.playerId].sendUTF(JSON.stringify({ type: 'friendArray' , data : facebookClients}))

                for(var i = 0; i < facebookClients.length; i++)
                {
                    if(facebookClients[i] != json.playerId)
                    {
                        if(i % 2 == 0)
                        {
                            //Tell everyone to update their friends lobby list
                            clients[facebookClients[i]].sendUTF(JSON.stringify({ type: 'friendArray' , data : facebookClients}))
                        }
                    }
                }

            }


            if(json.type == "playagain")
            {
                clients[json.oppId].sendUTF(JSON.stringify({ type: 'replay' , data : ''}))
            }

            if(json.type == "yesreplay")
            {
                clients[json.id].sendUTF(JSON.stringify({ type:'start', data: json.oppId }));
                clients[json.oppId].sendUTF(JSON.stringify({ type:'start', data: json.id }));
            }
        
            if(json.type == "update")
            {
                if(clients[json.data] != null)
                    clients[json.data].sendUTF(JSON.stringify({type:'update', dataX: json.dataX, dataY: json.dataY , flip: json.flipped}));
            }

            if(json.type == "saw")
            {
                console.log("Recieved Message Saw")
                clients[json.opId].sendUTF(JSON.stringify({type:'saw', dataX: json.dataX}));
            }

            if(json.type == "bomb")
            {
                console.log("Recieved Message Bomb")
                console.log("The Scale is " + " " + json.scale)
                clients[json.opId].sendUTF(JSON.stringify({type:'bomb', dataX: json.dataX , dataY: json.dataY , scale: json.scale}));
            }

            if(json.type == "finish")
            {
                clientsTimes[json.myId] = json.dataX;
                if(clientsTimes[json.opId] != null)
                {
                    if(clientsTimes[json.myId] < clientsTimes[json.opId])
                    {
                        clients[json.opId].sendUTF(JSON.stringify({type: 'hasfinished', data: 'lost'}));
                        clients[json.myId].sendUTF(JSON.stringify({type: 'hasfinished', data: 'win'}));
                    }
                    else
                    {
                        clients[json.opId].sendUTF(JSON.stringify({type: 'hasfinished', data: 'win'}));
                        clients[json.myId].sendUTF(JSON.stringify({type: 'hasfinished', data: 'lost'}));
                    }
                }
                else
                    clients[json.opId].sendUTF(JSON.stringify({ type:'otherfin', data: ''}));
            }

            if(json.type == "timeout")
            {
                console.log("TimeOut");
                clients[json.oppId].sendUTF(JSON.stringify({type: 'hasfinished', data: 'win'}));
                clients[json.mineId].sendUTF(JSON.stringify({type: 'hasfinished', data: 'lost'}));

            }

            if(json.type == "quit")
            {
                clients.splice(json.data,1);
                clients[json.opId].sendUTF(JSON.stringify({ type: 'hasfinished', data: 'win'}));
            }

        }
    });
 
    // user disconnected
    connection.on('close', function(connection) 
    {
        console.log((new Date()) + " Peer " + id + " disconnected.");
        // remove user from the list of connected clients
        if(id % 2 == 0)
        {
            clients[id -1].sendUTF(JSON.stringify({type: 'hasfinished', data: 'win'}));
        }
        else
        {
            if(clients[id + 1] != null)
            {
                clients[id + 1].sendUTF(JSON.stringify({type: 'hasfinished' , data: 'win'}));
            }
        }


    });
 
});