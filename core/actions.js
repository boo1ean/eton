var usage = require('./usage');
var notes = require('./services/notes');
var log = require('./log');
var Promise = require("bluebird");
var prompt = Promise.promisifyAll(require("prompt"));

prompt.message = ''
prompt.delimiter = ''

var actions = {
	'note': function(opt, note) {
		var schema = {
			properties: {
				note: {
					required: true,
					description: 'note:'
				},

				tags: {
					description: 'tags:'
				}
			}
		};

		prompt.start();

		prompt.getAsync(schema)
			.then(notes.create)
			.then(function() {
				log.info('\nok');
			});
	},

	'default': usage
};

module.exports = actions;
