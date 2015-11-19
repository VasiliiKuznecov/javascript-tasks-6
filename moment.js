'use strict';

var initDate = new Date();

var MILISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
var MILISECONDS_PER_HOUR = 1000 * 60 * 60;
var MILISECONDS_PER_MINUTE = 1000 * 60;
var DAY_TO_NUMBER = {
    'ВС': 0,
    'ПН': 1,
    'ВТ': 2,
    'СР': 3,
    'ЧТ': 4,
    'ПТ': 5,
    'СБ': 6
};
var NUMBER_TO_DAY = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];
var DAYS_CASES = ['день', 'дня', 'дней'];
var HOURS_CASES = ['час', 'часа', 'часов'];
var MINUTES_CASES = ['минута', 'минуты', 'минут'];


module.exports = function (_date) {
    return {
        // Здесь как-то хранится дата ;)
        dateObject: makeDateObject(_date),

        // А здесь часовой пояс
        timezone: 5,

        set date(date) {
            this.dateObject = makeDateObject(date);
        },

        get date() {
            return this.dateObject;
        },

        format: function (formatted) {
            formatted = formatted.replace('%DD', NUMBER_TO_DAY[this.dateObject.getDay()]);
            formatted = formatted.replace(
                '%HH', addLeadZero(this.dateObject.getUTCHours() + this.timezone)
            );
            formatted = formatted.replace(
                '%MM', addLeadZero(this.dateObject.getUTCMinutes())
            );
            return formatted;
        },

        // Возвращает кол-во времени между текущей датой и переданной `moment`
        // в человекопонятном виде
        fromMoment: function (moment) {
            var milisecondsLeft = this.date.getTime() - moment.date.getTime();
            if (milisecondsLeft < MILISECONDS_PER_MINUTE) {
                return milisecondsLeft <= 0 ?
                    'Ограбление уже идет!' : 'До ограбления меньше минуты.';
            }
            var timeLeft = {};
            timeLeft.days = parseInt(milisecondsLeft / MILISECONDS_PER_DAY, 10);
            milisecondsLeft = milisecondsLeft % MILISECONDS_PER_DAY;
            timeLeft.hours = parseInt(milisecondsLeft / MILISECONDS_PER_HOUR, 10);
            milisecondsLeft = milisecondsLeft % MILISECONDS_PER_HOUR;
            timeLeft.minutes = parseInt(milisecondsLeft / MILISECONDS_PER_MINUTE, 10);
            var result = 'До ограбления: ';
            if (timeLeft.days > 0) {
                result += timeLeft.days + ' ' + DAYS_CASES[getCase(timeLeft.days)] + ' ';
            }
            if (timeLeft.hours > 0) {
                result += timeLeft.hours + ' ' + HOURS_CASES[getCase(timeLeft.hours)] + ' ';
            }
            result += timeLeft.minutes + ' ' + MINUTES_CASES[getCase(timeLeft.minutes)] + ' ';
            return result;
        }
    };
};

module.exports.makeDate = function (time) {
    var parsedTime = {
        day: time.substr(0, 2),
        hours: parseInt(time.substr(3, 2), 10),
        minutes: parseInt(time.substr(6, 2), 10),
        timezone: parseInt(time.substr(8), 10)
    };
    var date = new Date(initDate.getTime());
    var untilTimestampDay = (7 - initDate.getUTCDay() + DAY_TO_NUMBER[parsedTime.day]) % 7;
    date.setUTCDate(initDate.getUTCDate() + untilTimestampDay);
    date.setUTCHours(parsedTime.hours - parsedTime.timezone, parsedTime.minutes, 0, 0);
    return date;
};

function addLeadZero(number) {
    return (number < 10 ? '0' : '') + number;
}

function makeDateObject(date) {
    if (!date) {
        return;
    }
    if (date instanceof Date) {
        return date;
    }
    return module.exports.makeDate(date);
}

function getCase(number) {
    if (number % 100 >= 11 && number % 100 <= 14) {
        return 2;
    }
    if (number % 10 === 1) {
        return 0;
    }
    if (number % 10 >= 1 && number % 10 <= 4) {
        return 1;
    }
    return 2;
}
