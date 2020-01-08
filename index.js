var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var multer  = require('multer');
// var upload = multer({ dest: 'uploads/' });
const path = require('path');

var app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(cors());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static(path.resolve(__dirname, './client/build')));

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
});

var upload = multer({ //multer settings
    storage: storage,
    fileFilter : function(req, file, callback) { //file filter
        if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
            return callback(new Error('Wrong extension type'));
        }
        callback(null, true);
    }
}).single('file');

const PORT = process.env.PORT || 5000;

app.get('/testing', function(req, res) {
	res.send('Hello Worldz');
});


app.post('/images', function(req, res) {
	const project = req.body.project;

	upload(req, res, function(err){
	    if(err) {
	         res.json({ error: err });
	         return;
	    }
	    
	    /** Multer gives us file info in req.file object */
	    if(!req.file) {
	        res.json({ error: "No file passed" });
	        return;
	    }

	    fs.rename('./uploads/' + req.file.fileName, '../uploads/' + project + '/' + '/' + fileName, function (err) {
            if (err) {
                res.json({ error: err });
            }

            res.json({results: 'success'});
        });
	})

	res.json({result: 'success'})
});

app.get('/images', function(req, res) {
	const project = req.query.project;

	const folder = `./images/${project}`;
	const fs = require('fs');

	let files = [];
	fs.readdirSync(folder).forEach(file => {
	  files.push(file);
	});

	res.json({result: files})
})

app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
});

var server = app.listen(PORT, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listeningzzza at http://%s:%s', host, port);
});