import moment from 'moment';

export const formatTime = (timestamp) => {
    a = moment (timestamp)
    return a.format (0)
}

export const formatDateTime = (timestamp) => {
    a = moment (timestamp)
    return a.format ('LLL')
}