class MapMock {
  addControl() {}
  on() {}
  remove() {}
}

class MarkerMock {
  setLngLat() {
    return this;
  }

  addTo() {
    return this;
  }
}

class NavigationControlMock {}
class AttributionControlMock {}

const maplibre = {
  Map: MapMock,
  Marker: MarkerMock,
  NavigationControl: NavigationControlMock,
  AttributionControl: AttributionControlMock,
};

export default maplibre;
