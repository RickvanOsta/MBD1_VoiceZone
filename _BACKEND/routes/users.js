var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* USERS */
/* GET users listing. */
router.get('/', function(req, res) {
        User.find(function(err, users) {
			if (err)
				res.send(err);

			res.json(users);
		});
});

/* POST users listing. */
router.post('/', function(req, res) {

    
		var user = new User();		// create a new instance of the User model
		user.username = req.body.username;  // set the users name (comes from the request)
        user.uid = req.body.uid;

		user.save(function(err) {
			if (err)
				res.send(err);

			res.json({ message: 'User created!' });
		});

});



/* USERS + ID's */
// get the user with that id
router.get('/:user_id', function(req, res) {
		User.findById(req.params.user_id, function(err, user) {
			if (err)
				res.send(err);
			res.json(user);
		});
	});

	// update the user with this id
router.put('/:user_id', function(req, res) {
		User.findById(req.params.user_id, function(err, user) {

			if (err)
				res.send(err);

			user.username = req.body.username;  // set the users name (comes from the request)
            user.uid = req.body.uid;
			user.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'User updated!' });
			});

		});
	})

	// delete the user with this id
router.delete('/:user_id', function(req, res) {
		User.remove({
			_id: req.params.user_id
		}, function(err, user) {
			if (err)
				res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
});



module.exports = router;
