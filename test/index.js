var fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),

    fsExtra = require('fs-extra'),
    moment = require('moment'),

    should = require('should'),
    SnapshotCleaner = require('../lib/cleaner.js');

describe('snapshot-cleaner', function () {
    var options = {
        path: path.resolve(process.cwd(), './test/test-data'),
        lifetime: 5 * 24 * 60 * 60 * 1000,
        symlinks: ['staging', 'testing', 'production'],
        cron: {
            pattern: '0 */1 * * * *',
            debug: true
        }
    };

    before(function () {});

    describe('initialization', function () {
        it ('should fail if path option was not set', function () {
            var o = _.omit(options, 'path');
            (function () { return new SnapshotCleaner(o); })
                .should.throw('Absolute path to snapshots directory was not set');
        });

        it ('should use default lifetime option', function () {
            var o = _.omit(options, 'lifetime'),
                sc = new SnapshotCleaner(o);

            sc.should.be.ok;
            sc._options.lifetime.should.be.ok;
            sc._options.lifetime.should.equal(24 * 60 * 60 * 1000);
        });

        it ('should use default symlinks option', function () {
            var o = _.omit(options, 'symlinks'),
                sc = new SnapshotCleaner(o);

            sc.should.be.ok;
            sc._options.symlinks.should.be.ok;
            should.deepEqual(sc._options.symlinks, ['testing', 'production']);
        });

        it('should be successfully initialized with given options', function () {
            var sc = new SnapshotCleaner(options);
            sc.should.be.ok;

            sc._options.path.should.be.ok;
            sc._options.lifetime.should.be.ok;
            sc._options.symlinks.should.be.ok;

            sc._options.path.should.equal(path.resolve(process.cwd(), './test/test-data'));
            sc._options.lifetime.should.equal(5 * 24 * 60 * 60 * 1000);
            should.deepEqual(sc._options.symlinks, ['staging', 'testing', 'production']);
        });
    });

    describe('execute', function () {
        before(function () {
            var baseDir = path.join(__dirname, 'test-data'),
                snapshotsDir = path.join(baseDir, 'snapshots');

            fsExtra.mkdirpSync(snapshotsDir);
            _([
                [1, 'hours'],
                [12, 'hours'],
                [1, 'days'],
                [1, 'days'],
                [3, 'days'],
                [5, 'days'],
                [7, 'days'],
                [9, 'days'],
                [10, 'days'],
                [11, 'days']
            ]).map(function (item) {
                return moment().subtract(item[0], item[1]);
            }).map(function (item) {
                return item.format('D:M:YYYY-H:m:s');
            }).map(function (item) {
                return path.join(snapshotsDir, item);
            }).map(function (item, index) {
                fsExtra.mkdirsSync(item);
                fs.writeFileSync(path.join(item, 'file.txt'), item, 'utf-8');
                index === 1 && fs.symlinkSync(item, path.join(baseDir, 'testing'), 'dir');
                index === 7 && fs.symlinkSync(item, path.join(baseDir, 'production'), 'dir');
            }).value();
        });

        it ('should be valid _onError handler', function () {
            var sc = new SnapshotCleaner(options);
            (function () { return sc._onError(new Error('whatever error')) })
                .should.throw('whatever error');
        });

        it('should left only snapshots which lifetime is less then configured', function (done) {
            var sc = new SnapshotCleaner(options);
            return sc.execute().then(function () {
                var baseDir = path.join(__dirname, 'test-data'),
                    snapshotsDir = path.join(baseDir, 'snapshots'),
                    snapshots = fs.readdirSync(snapshotsDir);

                snapshots.should.have.length(5);
                done();
            });
        });

        after(function () {
            fsExtra.removeSync(path.join(__dirname, 'test-data'));
        });
    });
});
