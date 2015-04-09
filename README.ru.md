# snapshot-cleaner
Инструмент для удаления устаревших версий данных для bem-site проектов.

[![Coveralls branch](https://img.shields.io/coveralls/bem-site/snapshot-cleaner/master.svg)](https://coveralls.io/r/bem-site/snapshot-cleaner?branch=master)
[![Travis](https://img.shields.io/travis/bem-site/snapshot-cleaner.svg)](https://travis-ci.org/bem-site/snapshot-cleaner)
[![David](https://img.shields.io/david/bem-site/snapshot-cleaner.svg)](https://david-dm.org/bem-site/snapshot-cleaner)
[![David](https://img.shields.io/david/dev/bem-site/snapshot-cleaner.svg)](https://david-dm.org/bem-site/snapshot-cleaner#info=devDependencies)

![GitHub Logo](./logo.jpg)

## Установка

* склонировать репозиторий: `$ git clone https://github.com/bem-site/snapshot-cleaner.git`
* установить npm зависимости: `$ npm install`
* сгенерировать конфигурационный файл: `$ npm run config`

## Конфигурация

Вся доступная конфигурация проекта находится в файле: `config/_config.json`

* `path` - абсолютный путь к папке с данынми. 
(не ../snapshots директория а ее родительская директория). Необходимая опция.
* `lifetime` - Время жизни версии данных в миллесекундах. 
Результатом работы программы будет удаление тех версий данных 
время жизни которых будет больше чем указанное в значении данной опции. Значение по умолчанию - 
86400000 что эквивалентно одним суткам.
* `symlinks` - Массив с именами симлинок на папки версий данных. 
В процессе удаления данных происходит проверка на то, что удаляемая версия данных не является
целевой папкой ни для одной из симлинок чьи имена перечислены в значении данной опции. 
Значение по умолчанию: ['testing', 'production']
* `cron` - объект, который позволяет настроить расписание выполнения очистки данных.
Более детально об этой опции можно прочитать [здесь](https://github.com/bem-site/cron-runner/blob/master/README.ru.md)
* `logger` - настройки логгирования инструмента. Для логгирования используется
иструмент [логгер](https://github.com/bem-site/logger). Более детально про его настройку можно прочитать
в [документации](https://github.com/bem-site/logger/blob/master/README.ru.md) к этому инструменту

## Тестирование

Запуск тестов:
```
npm run mocha
```

Запуск тестов с вычислением покрытия кода тестами с помощью инструмента [istanbul](https://www.npmjs.com/package/istanbul):
```
npm run istanbul
```

Проверка синткасиса кода с помощью jshint и jscs
```
npm run codestyle
```

Особая благодарность за помощь в разработке:

* Ильченко Николай (http://github.com/tavriaforever)
* Константинова Гела (http://github.com/gela-d)

Разработчик Кузнецов Андрей Серргеевич @tormozz48
Вопросы и предложения присылать по адресу: tormozz48@gmail.com
