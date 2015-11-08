'use strict';

var moment = require('./moment');

module.exports.getAppropriateMoment = function (json, minDuration, workingHours) {
    var appropriateMoment = moment();

    var gangShedule = JSON.parse(json);
    var timestamps = [];
    Object.keys(gangShedule).forEach(function (gangMember) {
        gangShedule[gangMember].forEach(function (timeInterval) {
            timestamps.push(
                {
                    participant: gangMember,
                    moment: moment(timeInterval.from),
                    state: 'busy'
                },
                {
                    participant: gangMember,
                    moment: moment(timeInterval.to),
                    state: 'free'
                }
            );
        });
    });

    ['ПН','ВТ','СР'].forEach(function (day) {
        timestamps.push(
            {
                participant: 'bank',
                moment: moment(day + ' ' + workingHours.from + '+5'),
                state: 'free'
            },
            {
                participant: 'bank',
                moment: moment(day + ' ' + workingHours.to + '+5'),
                state: 'busy'
            }
        );
    });

    timestamps.sort(function (timestamp1, timestamp2) {
        return timestamp1.moment.date > timestamp2.moment.date ? 1 : -1;
    });

    var participantsNumber = Object.keys(gangShedule).length + 1;
    var participantsFree = Object.keys(gangShedule).length;
    for (var i = 0; i < timestamps.length; i++) {
        if (timestamps[i].state === 'busy') {
            participantsFree--;
        } else {
            participantsFree++;
        }
        if (participantsFree === participantsNumber) {
            var timeForRobbery =
                timestamps[i + 1].moment.date.getTime() - timestamps[i].moment.date.getTime();
            if (timeForRobbery >= minDuration * 60000) {
                appropriateMoment = timestamps[i].moment;
                return appropriateMoment;
            }
        }
    }
    return;
};

module.exports.getStatus = function (moment, robberyMoment) {
    if (moment.date < robberyMoment.date) {
        // «До ограбления остался 1 день 6 часов 59 минут»
        return robberyMoment.fromMoment(moment);
    }

    return 'Ограбление уже идёт!';
};
