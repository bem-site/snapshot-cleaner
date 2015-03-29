var fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    inherit = require('inherit'),

    vow = require('vow'),
    vowNode = require('vow-node'),
    fsExtra = require('fs-extra'),
    moment = require('moment'),
    Logger = require('bem-site-logger'),
    CronRunner = require('cron-runner');

module.exports = inherit(CronRunner, {

    _logger: undefined,

    __constructor: function (options) {
        this.__base(options);

        this._logger = Logger.createLogger(module);
        var o = this._options;
        if (!o.path) {
            throw new Error('Absolute path to snapshots directory was not set');
        }

        if (!o.lifetime) {
            this._logger.warn('Snapshot "lifetime" option was not set. Default snapshot "lifetime" will be set');
            this._options.lifetime = this.__self.DEFAULT.LIFETIME;
        }

        if (!o.symlinks) {
            this._logger.warn('Existed "symlinks" option was not set. Default "symlinks" options will be set');
            this._options.symlinks = this.__self.DEFAULT.SYMLINKS;
        }
    },

    _onError: function (error) {
        this._logger.error('Error occur while clean old snapshots');
        this._logger.error(error.message);
        throw error;
    },

    execute: function () {
        this._logger.info('-- start execute snapshot cleaner --');

        /*
        * At first we should find real paths for all environment symlinks passed in configuration
        * Then we should read snapshots folder and apply 2 filters to result of reading:
        * 1. We should exclude snapshots which symlinks are pointed to
        * 2. We should exclude snapshots which lifetime less then configured lifetime
        * Rest of snapshot folders should be removed
        */

        var currentDate = moment(),
            snapshotsPath = path.join(this._options.path, 'snapshots'),
            symlinkRealPaths = _.chain(this._options.symlinks)
                .map(function (item) {
                    return path.join(this._options.path, item);
                }, this)
                .map(function (item) {
                    return vowNode.promisify(fs.realpath)(item);
                })
                .value();

        return vow.all([vowNode.promisify(fs.readdir)(snapshotsPath), vow.allResolved(symlinkRealPaths)])
            .spread(function (snapshots, symlinks) {
                symlinks = _.chain(symlinks)
                    .filter(function (item) { return item.isFulfilled(); })
                    .map(function (item) { return item.valueOf(); })
                    .map(function (item) { return path.basename(item); })
                    .value();
                return _.difference(snapshots, symlinks);
            })
            .then(function (snapshots) {
                // exclude snapshots with small lifetime
                // add full path to snapshot name
                // remove old snapshots
                snapshots = _.chain(snapshots)
                    .filter(function (item) {
                        return currentDate['diff'](moment(item, this.__self.DATE_FORMAT)) > this._options.lifetime;
                    }, this)
                    .map(function (item) {
                        this._logger.info('Snapshot with name %s will be removed', item);
                        return path.join(snapshotsPath, item);
                    }, this)
                    .map(function (item) {
                        return vowNode.promisify(fsExtra.remove)(item);
                    })
                    .value();
                return vow.all(snapshots);
            }, this)
            .then(function () {
                this._logger.info('-- end execute snapshot cleaner -- ');
            }, this)
            .fail(this._onError);
    }
}, {
    DATE_FORMAT: 'D:M:YYYY-H:m:s', // snapshot name date format
    DEFAULT: {
        LIFETIME: 24 * 60 * 60 * 1000, // default snapshot lifetime in milliseconds
        SYMLINKS: ['testing', 'production'] // default set of environment symlinks
    }
});
