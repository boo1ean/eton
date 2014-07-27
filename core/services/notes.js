var storage = require('../storage');

var dal = {
	create: function(data) {
		data.created_at = new Date();
		data.tags = data.tags.split(',').filter(Boolean);
		return storage.create('notes', data);
	},

	findAll: function() {
		return storage.getCollection('notes').then(function(col) {
			return col.items;
		});
	}
};

module.exports = dal;
