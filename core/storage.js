var Promise = require('bluebird');
var log = require('./log');
var fs = Promise.promisifyAll(require("fs-extra"));
var version = require('../package').version;
var _ = require('lodash');

var Storage = function(options) {
	this.options = options;
};

// Db storage file ensurance and initialization smethods

Storage.prototype.ensureStorage = function() {
	var exists = fs.existsSync(this.options.path);

	if (exists) {
		return Promise.resolve()
	}

	return this.init();
};

Storage.prototype.init = function() {
	var now = new Date().getTime();

	var initialData = {
		eton: version,
		created_at: now,
		updated_at: now,
		collections: {
			notes: {
				last_id: 0,
				updated_at: now,
				items: []
			},

			todos: {
				last_id: 0,
				updated_at: now,
				items: []
			},

			timers: {
				last_id: 0,
				updated_at: now,
				items: []
			}
		}
	};

	return this.update(initialData);
};

// Reading bulk read methods

Storage.prototype.getAll = function() {
	var self = this;

	return this.ensureStorage()
		.then(function() {
			if (self.data) {
				return self.data;
			}

			return fs.readJsonAsync(self.options.path).then(function(data) {
				self.data = data;
				return data;
			});
		});
};

Storage.prototype.getCollection = function(collection) {
	return this.getAll().then(function(data) {
		if (!data.collections[collection]) {
			throw new Error('Collection does not exist: ' + collection);
		}

		return data.collections[collection];
	});
};

// Write operations

Storage.prototype.update = function(data) {
	this.data = data;
	data.updated_at = new Date().getTime();

	return fs.outputJsonAsync(this.options.path, data);
};

Storage.prototype.updateCollection = function(collectionName, collectionData) {
	var self = this;
	return this.getAll().then(function(data) {
		data.collections[collectionName] = collectionData;
		return self.update(data);
	});
};

Storage.prototype.create = function(collectionName, item) {
	var self = this;

	return this.getCollection(collectionName).then(function(col) {
		// Generate autoincrement id
		var id = col.last_id + 1;
		item.id = col.last_id = id;
		col.updated_at = new Date().getTime();
		col.items.push(item);

		return self.updateCollection(collectionName, col).then(function() {
			return item;
		});
	});
};

var config = require('./config');
module.exports = new Storage(config.storage);
