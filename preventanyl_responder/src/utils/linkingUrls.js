export const generateAppleMapsUrl = (source, dest) => {
    return `http://maps.apple.com/?saddr=${ source.latitude },${ source.longitude }&daddr=${ dest.latitude },${ dest.longitude }`
}