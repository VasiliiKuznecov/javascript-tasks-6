'use strict';

var initDate = new Date();

var MILISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
var MILISECONDS_PER_HOUR = 1000 * 60 * 60;
var MILISECONDS_PER_MINUTE = 1000 * 60;

module.exports = function (_date) {
    return {
        // Здесь как-то хранится дата ;)
        dateObject: makeDateObject(_date),

        // А здесь часовой пояс
        timezone: 5,

        set date(_date) {
            this.dateObject = makeDateObject(_date);
        },

        get date() {
            return this.dateObject;
        },

        format: function (pattern) {
            var formatedDate = pattern;
            var days = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
            formatedDate = formatedDate.replace(/%DD/, days[this.dateObject.getDay()]);
            formatedDate = formatedDate.replace(
                /%HH/, addLeadZero(this.dateObject.getUTCHours() + this.timezone)
            );
            formatedDate = formatedDate.replace(
                /%MM/, addLeadZero(this.dateObject.getUTCMinutes())
            );
            return formatedDate;
        },

        // Возвращает кол-во времени между текущей датой и переданной `moment`
        // в человекопонятном виде
        fromMoment: function (moment) {
            var milisecondsLeft = this.date.getTime() - moment.date.getTime();
            var timeLeft = {};
            timeLeft['days'] = Number.parseInt(milisecondsLeft / MILISECONDS_PER_DAY);
            milisecondsLeft = milisecondsLeft % MILISECONDS_PER_DAY;
            timeLeft['hours'] = Number.parseInt(milisecondsLeft / MILISECONDS_PER_HOUR);
            milisecondsLeft = milisecondsLeft % MILISECONDS_PER_HOUR;
            timeLeft['minutes'] = Number.parseInt(milisecondsLeft / MILISECONDS_PER_MINUTE);
            return 'До ограбления: Дней: ' + timeLeft['days'] + ' Часов: ' + timeLeft['hours'] +
                ' Минут: ' + timeLeft['minutes'];
        }
    };
};

module.exports.makeDate = function (time) {
    var parsedTime = {
        day: time.substr(0, 2),
        hours: Number.parseInt(time.substr(3, 2)),
        minutes: Number.parseInt(time.substr(6, 2)),
        timezone: Number.parseInt(time.substr(8))
    };
    var date = new Date(initDate.getTime());
    var days = {
        'ВС': 0,
        'ПН': 1,
        'ВТ': 2,
        'СР': 3,
        'ЧТ': 4,
        'ПТ': 5,
        'СБ': 6
    };
    var untilTimestampDay = (7 - initDate.getUTCDay() + days[parsedTime.day]) % 7;
    date.setUTCDate(initDate.getUTCDate() + untilTimestampDay);
    date.setUTCHours(parsedTime.hours - parsedTime.timezone, parsedTime.minutes, 0, 0);

    return date;
};

function addLeadZero(number) {
    if (number < 10) {
        return '0' + number;
    } else {
        return number.toString();
    }
}

function makeDateObject(_date) {
    if (!_date) {
        return;
    }
    if (_date instanceof Date) {
        return _date;
    } else {
        return module.exports.makeDate(_date);
    }
};
