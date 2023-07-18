var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var multer  = require('multer');
// var upload = multer({ dest: 'uploads/' });
const path = require('path');
const fs = require('fs');

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
app.use(express.static(path.resolve(__dirname, './client/public')));

app.use( '/project', require('./routes/project') );
// app.use( '/client', require('./routes/client') );
// app.use( '/admin', require('./routes/admin') );

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './client/public/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
});

let jsonFileStorage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './client/public/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

var upload = multer({ //multer settings
    storage: storage,
    fileFilter : function(req, file, callback) { //file filter
        if (['png', 'jpg', 'gif', 'jpeg', 'bmp'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1].toLowerCase()) === -1) {
            return callback(new Error('Wrong extension type'));
        }
        callback(null, true);
    }
}).single('file');

let jsonFileUpload = multer({ //multer settings
    storage: jsonFileStorage,
    fileFilter : function(req, file, callback) { //file filter
        if (['json'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1].toLowerCase()) === -1) {
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
	console.log('POSTOSOSOSOS')
	// console.log(JSON.stringify(req.headers));
	const project = req.header('project');
	console.log('project is ' + project)

	let result = {};

	const topRes = res;

	upload(req, res, function(err){
	    if(err) {
	         // result = err;
	         console.log(err)
	         topRes.json({ error: err });
	         return;
	    }
	    
	    /// ulter gives us file info in req.file object
	    if(!req.file) {
	        // result = err;
	        console.log(err);
	        topRes.json({ error: "No file passed" });
	        return;
	    }

	    console.log(JSON.stringify(req.file.filename))

	    const folder = './client/public/Projects/';

	    if (!fs.existsSync(folder + project)){
		    fs.mkdirSync(folder + project);
		}

		// fs.rename('./client/public/' + req.file.filename, './client/public/' + project + '/' + req.file.filename, function (err) {
	    fs.rename('./client/public/' + req.file.filename, folder + project + '/' + req.file.filename, function (err) {
            if (err) {
                console.log(err);
                topRes.json({ error: err });
                // result = err;
                return;
            }

            // result 
            result.name = req.file.originalname,
            result.source = project + '/' + req.file.filename

            topRes.json({
				name: req.file.originalname,
				source: '/Projects/' + project + '/' + req.file.filename
			})
        });
	})

	// res.json({result: 'nada'})
});

app.get('/images', function(req, res) {
	console.log('GETGETEGFDGDSGDDFG')
	const project = req.query.project;

	const folder = `./client/public/Projects/${project}`;
	const fs = require('fs');

	let files = [];
	fs.readdirSync(folder).forEach(file => {
	  files.push({name: file.split('/')[file.split('/').length-1], source: '/Projects/' + project + '/' + file});
	});

	console.log('files', files)
	res.json({result: files})
})

app.post('/files', function(req, res) {
	console.log('uploading firebase file')
	// console.log('HEADERS: ' + JSON.stringify(req.headers()))
	const project = req.header('project');
	console.log('project is ' + project)

	let result = {};

	const topRes = res;

	jsonFileUpload(req, res, function(err){
	    // console.log('file is: ' + JSON.stringify(req));
		if(err) {
	         // result = err;
	         console.log(err)
	         topRes.json({ error: err });
	         return;
	    }
	    
	    /// ulter gives us file info in req.file object
	    if(!req.file) {
	        // result = err;
	        console.log(err);
	        topRes.json({ error: "No file passed" });
	        return;
	    }

	    console.log(JSON.stringify(req.file.filename))

	    if (!fs.existsSync('./client/public/' + project)){
		    fs.mkdirSync('./client/public/' + project);
		}

	    fs.rename('./client/public/' + req.file.filename, './client/public/' + project + '/' + req.file.filename, function (err) {
            if (err) {
                console.log(err);
                topRes.json({ error: err });
                // result = err;
                return;
            }

            console.log('Firebase file saved')

            // result 
            result.name = req.file.originalname,
            result.source = project + '/' + req.file.filename

            topRes.json({
				name: req.file.originalname,
				source: '/' + project + '/' + req.file.filename
			})
        });
	})

	// res.json({result: 'nada'})
});

app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, './client/build', 'index.html'));
});

var server = app.listen(PORT, function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Example app listeningzzza at http://%s:%s', host, port);
});