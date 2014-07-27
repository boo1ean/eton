var usage = require('./usage');
var notes = require('./services/notes');
var log = require('./log');
var Promise = require("bluebird");
var prompt = Promise.promisifyAll(require("prompt"));
var storage = require('./storage');
var chalk = require('chalk');

// Configure prompt
prompt.message = ''
prompt.delimiter = ''

var actions = {
	'notes': function() {
		notes.findAll().then(function(items) {
			items.forEach(function(item) {
				log.info(chalk.blue(item.id) + ' ' + item.body);
			});
		});
	},

	'note': function(opt, note) {
		var schema = {
			properties: {
				body: {
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
			.then(function(note) {
				log.info(note.id);
			});
	},

	'reset [collection-name]': function() {
		var schema = {
			properties: {
				ans: {
					description: 'Are you sure? (type yes if so):'
				}
			}
		};

		prompt.start();

		prompt.getAsync(schema).then(function(result) {
			if ('yes' === result.ans) {
				storage.init().then(function() {
					log.info('Data has been reseted.');
				});
			} else {
				log.info('It was close!');
			}
		});
	},

	'default': usage
};

module.exports = actions;
