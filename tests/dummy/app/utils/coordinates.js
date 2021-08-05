export function randomCoordinateAround({ lat, lng }) {
  const heading = randomInt(1, 360);
  const distance = randomInt(50, 1000);
  const point = window.google.maps.geometry.spherical.computeOffset(
    new window.google.maps.LatLng(lat, lng),
    distance,
    heading
  );

  return {
    lat: point.lat(),
    lng: point.lng(),
  };
}

export function randomCoordinatesAround(center, count = 1) {
  const coords = [];

  for (let n = 0; n < count; n++) {
    coords.push(randomCoordinateAround(center));
  }

  return coords;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
