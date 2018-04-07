import moment from 'moment';

export const ZERO_TIME = moment (0);

export const getMomentNow = () => {
    return moment ();
}

export const getMomentNowSubtractHours = (hours) => {
    now = moment ();
    console.log ('now', now)
    return now.subtract (hours * 60, 'minutes');
}

export const formatTime = (timestamp) => {
    a = moment (timestamp)
    return a.local.format (0)
}

export const formatDateTime = (timestamp) => {
    a = moment (timestamp)
    return a.local().format ('LLL')
}

export const generateRange = (timestamp, range) => {
    let startDate = timestamp.clone().subtract (range, 'days').startOf ('day')
    let endDate   = timestamp.clone().add      (range, 'days').endOf ('day')

    return {
        "startDate" : startDate,
        "endDate"   : endDate
    }
}

export const generateRangeCurrent = (range) => {
    let currentTimestamp = moment ()
    return generateRange (currentTimestamp, range);
}

export const compareDiffDateTime = (firstTimestamp, secondTimestamp) => {
    return moment.utc (moment (firstTimestamp ,"DD/MM/YYYY HH:mm:ss").diff (moment(secondTimestamp ,"DD/MM/YYYY HH:mm:ss")))
}

export const compareDiffDateTimeNow = (timestamp) => {
    now  = moment ();

    console.log (now, ' ', timestamp);

    return compareDiffDateTime (now, timestamp);
}

export const compareDiffHours = (firstTimestamp, secondTimestamp) => {

    time = compareDiffDateTime (timestamp, secondTimestamp);
    hours = time.hour () + (time.minutes () / 60);

    return hours;

}

export const compareDiffHoursNow = (timestamp) => {

    time = compareDiffDateTimeNow (timestamp);
    
    hours = time.hours () + (time.minutes () / 60) + (time.seconds () / 60 / 60);

    return hours;
}