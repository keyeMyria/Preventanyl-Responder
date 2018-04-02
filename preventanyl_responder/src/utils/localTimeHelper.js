import moment from 'moment';

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