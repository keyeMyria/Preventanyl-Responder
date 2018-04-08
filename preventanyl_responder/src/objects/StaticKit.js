import { formatAddressObjectForMarker } from '../utils/strings';

export default class StaticKit {

    constructor (id, key, title, description, formattedDescription, latlng) {
        this.id                   = id;
        this.key                  = key;
        this.title                = title;
        this.description          = description;
        this.formattedDescription = formattedDescription;
        this.latlng               = latlng;
    }
    
    static generateStaticKitFromSnapshot (staticKit) {
        id                   = staticKit.id;
        key                  = staticKit.id;
        title                = staticKit.displayName;
        description          = staticKit.comments
        formattedDescription = formatAddressObjectForMarker (staticKit.address)
        latlng = {
            latitude  : staticKit.coordinates.lat,
            longitude : staticKit.coordinates.long,
        };
        
        return new StaticKit (id, key, title, description, formattedDescription, latlng);
    }

}