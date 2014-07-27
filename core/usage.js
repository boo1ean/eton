var read = require('fs').readFileSync;

module.exports = function() {
	console.log(read(__dirname + '/usage.txt', 'utf-8').toString());
};
