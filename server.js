var express = require('express');
var app = express();
var port = process.env.PORT || 8080;

app.use(express.static('src'));

app.get('*', (req, res) => {
    res.sendFile(__dirname+'/src/index.html');
});

app.listen(port, function () {
    console.log('Express server is up on port '+port);
});
