import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupMapTest } from 'ember-google-maps/test-support';
import { click, waitFor as waitFor_, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { A } from '@ember/array';

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Increase the default timeouts. Things can take a while sometimes.
function waitFor(selector, options = {}) {
  return waitFor_(selector, { timeout: 5000, ...options });
}

function randomCoordinatesAround({ lat, lng }, count = 1) {
  let coords = [];

  for (let n = 0; n < count; n++) {
    let heading = randomInt(1, 360),
      distance = randomInt(100, 5000),
      point = window.google.maps.geometry.spherical.computeOffset(
        new window.google.maps.LatLng(lat, lng),
        distance,
        heading
      );

    coords.push({
      lat: point.lat(),
      lng: point.lng(),
    });
  }

  return coords;
}

module('Integration | Component | g-map/marker-clusterer', function (hooks) {
  setupRenderingTest(hooks);
  setupMapTest(hooks);

  hooks.beforeEach(async function () {
    this.googleMapsApi = this.owner.lookup('service:google-maps-api');
    this.google = await this.googleMapsApi.google;

    this.lat = '51.507568';
    this.lng = '0';
    this.locations = randomCoordinatesAround(
      { lat: this.lat, lng: this.lng },
      100
    );
  });

  test('it clusters markers', async function (assert) {
    assert.expect(2);

    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} as |map|>
        <map.markerClusterer as |cluster|>
          {{#each this.locations as |location|}}
            <cluster.marker @lat={{location.lat}} @lng={{location.lng}} />
          {{/each}}
        </map.markerClusterer>
      </GMap>
    `);

    let api = await this.waitForMap();
    let cluster = api.components.markerClusters[0].mapComponent;

    assert.equal(
      cluster.getTotalMarkers(),
      this.locations.length,
      'all markers are managed by the cluster'
    );

    let clusterMarkers = await waitFor('.cluster');
    assert.ok(clusterMarkers, 'there are clusters on the map');
  });

  test('it registers events', async function (assert) {
    assert.expect(3);

    this.events = [];
    this.registerEvent = ({ eventName }) => this.events.push(eventName);

    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} as |map|>
        <map.markerClusterer
          @onClick={{this.registerEvent}}
          @onClusteringbegin={{this.registerEvent}}
          @onClusteringend={{this.registerEvent}}
          as |cluster|>
          {{#each this.locations as |location|}}
            <cluster.marker @lat={{location.lat}} @lng={{location.lng}} />
          {{/each}}
        </map.markerClusterer>
      </GMap>
    `);

    await this.waitForMap();

    let clusters = await waitFor('.cluster');
    let someClusterMarker = clusters.length ? clusters[0] : clusters;
    await click(someClusterMarker);

    assert.ok(this.events.includes('click'), 'registered a click event');
    assert.ok(
      this.events.includes('clusteringbegin'),
      'notified when clustering began'
    );
    assert.ok(
      this.events.includes('clusteringend'),
      'notified when clustering ended'
    );
  });

  test('it returns the marker clusterer instance from @onceOnClusteringend', async function (assert) {
    assert.expect(1);

    this.getMarkerClustererInstance = ({ mapComponent }) => {
      this.markerClustererInstance = mapComponent;
    };

    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} as |map|>
        <map.markerClusterer
          @onceOnClusteringend={{this.getMarkerClustererInstance}}
          as |cluster|>
          {{#each this.locations as |location|}}
            <cluster.marker @lat={{location.lat}} @lng={{location.lng}} />
          {{/each}}
        </map.markerClusterer>
      </GMap>
    `);

    await this.waitForMap();

    assert.ok(
      this.markerClustererInstance &&
        'getTotalClusters' in this.markerClustererInstance,
      'can get the marker clusterer instance with @onceOnClusteringend'
    );
  });

  test('it handles adding and removing markers', async function (assert) {
    assert.expect(3);

    this.set('trackedLocations', A(this.locations));

    let assertNumberOfMarkersMatch = (cluster, message = null) => {
      assert.equal(
        cluster.getTotalMarkers(),
        this.trackedLocations.length,
        message
      );
    };

    await render(hbs`
      <GMap @lat={{this.lat}} @lng={{this.lng}} as |map|>
        <map.markerClusterer as |cluster|>
          {{#each this.trackedLocations as |location|}}
            <cluster.marker @lat={{location.lat}} @lng={{location.lng}} />
          {{/each}}
        </map.markerClusterer>
      </GMap>
    `);

    let api = await this.waitForMap();
    let clusterApi = api.components.markerClusters[0];

    assertNumberOfMarkersMatch(clusterApi.mapComponent, 'rendered a cluster');

    this.trackedLocations.popObject();
    await this.waitForMap();
    assertNumberOfMarkersMatch(
      clusterApi.mapComponent,
      'removed a marker from the cluster'
    );

    this.trackedLocations.pushObject(this.locations[0]);
    await this.waitForMap();
    assertNumberOfMarkersMatch(
      clusterApi.mapComponent,
      'added a marker to the cluster'
    );
  });
});
