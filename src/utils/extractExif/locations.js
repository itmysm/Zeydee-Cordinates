export function getCoordinates(lat, latRef, long, longRef) {
  const gpsLatitude = parseGeoInfo(lat, latRef)
  const gpsLongitude = parseGeoInfo(long, longRef)

  return gpsLatitude.length && gpsLongitude.length ? `${gpsLatitude} ${gpsLongitude}` : 'N/A'
}

const parseGeoInfo = (coordArray, direction) => {
  if (!coordArray || coordArray.length === 0) return ''

  let degrees = coordArray[0]
  let minutes = coordArray[1]
  let seconds = coordArray[2]

  let decimal = degrees + minutes / 60 + seconds / 3600
  if (direction === 'S' || direction === 'W') {
    decimal = -decimal
  }

  return formatCoordinates(decimal)
}

const formatCoordinates = (decimal) => {
  const degrees = Math.floor(decimal)
  const minutes = Math.floor((decimal - degrees) * 60)
  const seconds = ((decimal - degrees - minutes / 60) * 3600).toFixed(1)

  return `${degrees}°${minutes}'${seconds}"${decimal >= 0 ? 'N' : 'S'}`
}
