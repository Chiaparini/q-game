var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var jsonfile = require('jsonfile');
 
app.use(express.static(__dirname + '/public'));
 
app.get('/', function(req, res){
  res.render('/index.html');
});


var getRandomNumber = function(min, max){

	var title, random = Math.random();

	if(random < 0.8) return title = 0;
	else return title = 1;
}

var file = 'public/maps/arena.json';

var arenaCol = [],
	arenaRow = [];

for (var i = 0; i <= 16; i++) {
	for (var j = 0; j <= 32; j++) {
		var r = getRandomNumber(0,2);
		if(i == 0 || i == 16 || j == 0 || j == 32) arenaRow.push(1);
		else arenaRow.push(r);
	}
	arenaCol.push(arenaRow);
	arenaRow = [];
}
 
jsonfile.writeFileSync(file, arenaCol);

var playerCount = 0;
var id = 0;

io.on('connection', function(socket){
	playerCount++;
	id++;

	setTimeout(function(){
		socket.emit('connected', {playerId: id});
		io.emit('count', {playerCount: playerCount});
	}, 1500);

	socket.on('disconnect', function(){
		playerCount--;
		io.emit('count',{playerCount: playerCount});
	})

	socket.on('update', function(data){
		socket.broadcast.emit('updated', data);
	})
})
 
server.listen(5000);
console.log("Multiplayer app listening on port 5000");
