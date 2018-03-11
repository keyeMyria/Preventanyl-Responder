import moment from 'moment';

export const formatTime = (timestamp) => {
    a = moment (timestamp)
    return a.local.format (0)
}

export const formatDateTime = (timestamp) => {
    a = moment (timestamp)
    return a.local().format ('LLL')
}