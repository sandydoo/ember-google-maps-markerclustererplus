import MapComponent from 'ember-google-maps/components/g-map/map-component';
import MarkerClusterer from '@googlemaps/markerclustererplus';
import { TrackedSet } from '@sandydoo/tracked-maps-and-sets';
import { action } from '@ember/object';

function difference(old, next) {
  const added = new Set(next);
  const removed = new Set(old);

  for (const e of old) {
    added.delete(e);
  }

  for (const e of next) {
    removed.delete(e);
  }

  return {
    added,
    removed,
  };
}

export default class MarkerClustererComponent extends MapComponent {
  get name() {
    return 'markerClusters';
  }

  markers_ = new TrackedSet();

  get markers() {
    return Array.from(this.markers_)
      .map((marker) => marker.mapComponent)
      .filter(Boolean);
  }

  get newOptions() {
    this.options.imagePath ??= '/assets/markerclustererplus/images/m';
    return this.options;
  }

  setup(_, events) {
    const markerClusterer = new MarkerClusterer(
      this.map,
      this.markers,
      this.newOptions
    );

    this.addEventsToMapComponent(markerClusterer, events, this.publicAPI);

    return markerClusterer;
  }

  update(markerClusterer) {
    markerClusterer.setOptions(this.newOptions);

    const { added, removed } = difference(
      markerClusterer.getMarkers(),
      this.markers
    );

    if (removed.size > 0) {
      markerClusterer.removeMarkers(Array.from(removed), true);
    }

    if (added.size > 0) {
      markerClusterer.addMarkers(Array.from(added), true);
    }

    markerClusterer.repaint();
  }

  teardown(mapComponent) {
    if (mapComponent) {
      mapComponent.clearMarkers();
    }

    super.teardown();
  }

  @action
  getMarker(marker) {
    this.markers_.add(marker);

    return {
      // Don't add the marker to the map
      map: null,
      remove: () => this.markers_.delete(marker),
    };
  }
}
