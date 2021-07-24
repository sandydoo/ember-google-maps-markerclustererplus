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
    return Array.from(this.markers).map((marker) => marker.mapComponent);
  }

  setup(options) {
    options.imagePath ??= 'assets/markerclustererplus/images/m';

    const markerClusterer = new MarkerClusterer(
      this.map,
      this.markerComponents,
      options
    );

    return markerClusterer;
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
