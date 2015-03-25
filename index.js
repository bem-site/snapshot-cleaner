var fsExtra = require('fs-extra'),
    SnapshotCleaner = require('./lib/cleaner');

fsExtra.readJSON('./config/_config.json', function (error, config) {
    if (error) {
        throw error;
    }
    var sc = new SnapshotCleaner(config);
    sc.start();
});
