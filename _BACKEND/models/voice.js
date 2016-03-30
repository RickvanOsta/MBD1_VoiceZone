var mongoose     = require('mongoose');

	var Schema = mongoose.Schema;

	var voiceSchema = new Schema({
		title: { type: String, required: true },
		fileLocation: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
	});
	// /Statics
	var Voice = mongoose.model('Voice', voiceSchema);

module.exports = Voice;