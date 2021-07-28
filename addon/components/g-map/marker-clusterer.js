import MapComponent from 'ember-google-maps/components/g-map/map-component';
import MarkerClusterer from '@googlemaps/markerclustererplus';
import { TrackedSet } from '@sandydoo/tracked-maps-and-sets';
import { action } from '@ember/object';

export default class MarkerClustererComponent extends MapComponent {
  get name() {
    return 'markerClusters';
  }

  markers = new TrackedSet();

  get markerComponents() {
    return Array.from(this.markers)
      .map((marker) => marker.mapComponent)
      .filter(Boolean);
  }

  setup(options, events) {
    // Nothing to do when there are no markers
    if (this.markerComponents.length === 0) {
      return;
    }

    options.imagePath ??= 'assets/markerclustererplus/images/m';

    const markerClusterer = new MarkerClusterer(
      this.map,
      this.markerComponents,
      options
    );

    this.addEventsToMapComponent(markerClusterer, events, this.publicAPI);

    return markerClusterer;
  }

  teardown(mapComponent) {
    mapComponent.clearMarkers();
    super.teardown();
  }

  @action
  getMarker(marker) {
    this.markers.add(marker);

    return {
      // Don't add the marker to the map
      map: null,
      remove: () => this.markers.delete(marker),
    };
  }
}
