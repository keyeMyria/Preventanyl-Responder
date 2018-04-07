import { replaceAll } from '../utils/strings';

export default class Overdose {
    
    constructor (id, date, latlng, region, timestamp, alerted) {
        this.id        = id
        this.key       = id
        this.date      = date
        this.latlng    = latlng
        this.region    = region
        this.timestamp = timestamp
        this.alerted   = alerted;
    }
    
    static generateOverdoseFromSnapshot (overdose) {
        id   = overdose.id
        date = overdose.date
        latlng = {
            latitude  : overdose.latitude,
            longitude : overdose.longitude
        }
        region    = overdose.region
        timestamp = overdose.timestamp
        alerted   = overdose.alerted
        return new Overdose (id, date, latlng, region, timestamp, alerted)
    } 
    
    static generateOverdose (region, reportedTime, coordinates) {
        id = Overdose.generateId(reportedTime, coordinates.latitude, coordinates.longitude)
        return new Overdose (id, Date.now(), coordinates, region, reportedTime, false)
    }

    static generateOverdoseFromLocation (locationObject) {
        return new Overdose.generateOverdose ("", Date.now(), locationObject.latlng)
    }
    
    static generateId (timestamp, latitude, longitude) {
        return replaceAll (`${ timestamp }_${ latitude }_${ longitude }`, '.', ',')
        // return `${ timestamp }_${ latitude }_${ longitude }`
    }

    // To match Firebase database structure
    generateOverdoseForStorage () {
        return {
            date      : this.date,
            id        : this.id,
            latitude  : this.latlng.latitude,
            longitude : this.latlng.longitude,
            region    : this.region,
            timestamp : this.timestamp,
            alerted   : this.alerted
        }
    }

}
