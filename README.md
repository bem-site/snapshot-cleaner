# snapshot-cleaner
Tools for clear old bem-site data snapshots

[![Coveralls branch](https://img.shields.io/coveralls/bem-site/snapshot-cleaner/master.svg)](https://coveralls.io/r/bem-site/snapshot-cleaner?branch=master)
[![Travis](https://img.shields.io/travis/bem-site/snapshot-cleaner.svg)](https://travis-ci.org/bem-site/snapshot-cleaner)
[![David](https://img.shields.io/david/bem-site/snapshot-cleaner.svg)](https://david-dm.org/bem-site/snapshot-cleaner)
[![David](https://img.shields.io/david/dev/bem-site/snapshot-cleaner.svg)](https://david-dm.org/bem-site/snapshot-cleaner#info=devDependencies)

![GitHub Logo](./logo.jpg)

## Installation

* clone this repo: `$ git clone https://github.com/bem-site/snapshot-cleaner.git`
* install npm dependencies: `npm install`
* generate configuration file: `npm run config`

## Configuration

All tool configuration is in `config/_config.json` file.

* `path` - absolute path to db folder. (not ../snapshots folder). Required option.
* `lifetime` - lifetime of snapshot in milliseconds.
Snapshots which lifetime is greater then given lifetime would be removed. Default value is
86400000 that equal to one day in milliseconds.
* `symlinks` - array with names of symlinks. Defaults are ['testing', 'production']
* `cron` - configuration object for cron execution
* `logger` - log settings. App logger [логгер](https://github.com/bem-site/logger). More details about logger settings
you can read in logger [docs](https://github.com/bem-site/logger/blob/master/README.ru.md)

## Testing

Run tests:
```
npm run mocha
```

Run tests with istanbul coverage calculation:
```
npm run istanbul
```

Run codestyle verification (jshint and jscs)
```
npm run codestyle
```

Special thanks to:

* Nikolay Ilchenko (http://github.com/tavriaforever)
* Konstantinova Gela (http://github.com/gela-d)

Maintainer @tormozz48
Please send your questions and proposals to: tormozz48@gmail.com
