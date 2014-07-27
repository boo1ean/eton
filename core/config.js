var config = {
	storage: {
		path: (
			process.env.HOME
			|| process.env.HOMEPATH
			|| process.env.USERPROFILE
		) + '/.eton'

	}
};

module.exports = config;
