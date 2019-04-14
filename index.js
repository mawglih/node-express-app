const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const items = require('./items');


const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const port = 8080;

//cors
const allowedOrigins = [
  'http://localhost:3000',
];
app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  }
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

io.on('connection', (client) => {
	client.on('subscribeToTimer', (interval) => {
		console.log('client is subscribing with interval ', interval);
		setInterval(() => {
			client.emit('timer', new Date().toString());
		}, interval);
	});
});

app.get('/get-items', (req, res) => {
	res.json(items);
});


app.listen(port, () => console.log(`Server running on port ${port}`))
console.log(`server is ready on port ${port}`)

// io.listen(port);
// console.log(`socket is listening ${port}!`);
