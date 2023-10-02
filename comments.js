// create a web server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Comment = require('./comment.model');
var db = 'mongodb://localhost/example';
var path = require('path');
var port = 3000;

// connect to mongodb
mongoose.connect(db);

// use body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

// create a new comment
app.post('/comment', function(req, res) {
	var newComment = new Comment();
	newComment.name = req.body.name;
	newComment.comment = req.body.comment;
	newComment.save(function(err, comment) {
		if (err) {
			res.send('error saving comment');
		} else {
			console.log(comment);
			res.send(comment);
		}
	});
});

// get all comments
app.get('/comments', function(req, res) {
	console.log('getting all comments');
	Comment.find({})
		.exec(function(err, comments) {
			if (err) {
				res.send('error occured');
			} else {
				console.log(comments);
				res.json(comments);
			}
		});
});

// get a comment by id
app.get('/comments/:id', function(req, res) {
	console.log('getting one comment');
	Comment.findOne({
			_id: req.params.id
		})
		.exec(function(err, comment) {
			if (err) {
				res.send('error occured');
			} else {
				console.log(comment);
				res.json(comment);
			}
		});
});

// update a comment
app.put('/comment/:id', function(req, res) {
	Comment.findOneAndUpdate({
			_id: req.params.id
		}, {
			$set: {
				name: req.body.name,
				comment: req.body.comment
			}
		}, {
			upsert: true
		},
		function(err, newComment) {
			if (err) {
				console.log('error occured');
			} else {
				console.log(newComment);
				res.status(204);
			}
		});
});

// delete a comment
app.delete('/comment/:id', function(req, res) {
	Comment.findOneAndRemove({
			_id: req.params.id
		},
		function(err, comment) {
			if (err) {
				res.send(' error deleting');
            }
        });
    });