var path = require('path'),
    config = require('nconf'),
    SnapshotCleaner = require('./lib/cleaner');

config.env();
config.add('config', {
    type: 'file',
    file: path.resolve(__dirname, './config/_config.json')
});

var sc = new SnapshotCleaner();
sc.start();
