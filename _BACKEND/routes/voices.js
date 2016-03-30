var express = require('express');
var router = express.Router();

var Voice = require('../models/voice');

/* USERS */
/* GET voices listing. */
router.get('/', function(req, res) {
        Voice.find(function(err, voices) {
			if (err)
				res.send(err);

			res.json(voices);
		});
});

/* POST voices listing. */
router.post('/', function(req, res) {

    
		var voice = new Voice();		// create a new instance of the Voice model
		voice.title = req.body.title;  // set the voices name (comes from the request)
        voice.fileLocation = req.body.fileLocation; 
        voice.user = req.body.uid; 

		voice.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'Voice created!' });
		});

});



/* USERS + ID's */
// get the voice with that id
router.get('/:voice_id', function(req, res) {
		Voice.findById(req.params.voice_id, function(err, voice) {
			if (err)
				res.send(err);
			res.json(voice);
		});
	});

	// update the voice with this id
router.put('/:voice_id', function(req, res) {
		Voice.findById(req.params.voice_id, function(err, voice) {

			if (err)
				res.send(err);

			voice.title = req.body.title;  // set the voices name (comes from the request)
            voice.fileLocation = req.body.fileLocation; 
            voice.user = req.body.uid; 
			voice.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'Voice updated!' });
			});

		});
	})

	// delete the voice with this id
router.delete('/:voice_id', function(req, res) {
		Voice.remove({
			_id: req.params.voice_id
		}, function(err, voice) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
});



module.exports = router;
