var Storage = require('./storage');
var config = require('./config');
var usage = require('./usage');

var storage = new Storage(config.storage);

var actions = {
	'note <note>': function(opt, note) {
		console.log(note);
	},

	'default': usage
};

module.exports = actions;
