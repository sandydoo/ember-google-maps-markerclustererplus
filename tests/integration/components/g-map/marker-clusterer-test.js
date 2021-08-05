import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { setupMapTest } from 'ember-google-maps/test-support';
import { click, waitFor as waitFor_, render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { A } from '@ember/array';
import { randomCoordinatesAround } from 'dummy/utils/coordinates';

// Increase the default timeouts. Things can take a while sometimes.
function waitFor(selector, options = {}) {
  return waitFor_(selector, { timeout: 5000, ...options });
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

    let assertNumberOfMarkersMatch = (cluster, message = undefined) => {
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
    let cluster = api.components.markerClusters[0].mapComponent;

    assertNumberOfMarkersMatch(cluster, 'rendered a cluster');

    this.trackedLocations.popObject();
    await this.waitForMap();
    assertNumberOfMarkersMatch(cluster, 'removed a marker from the cluster');

    this.trackedLocations.pushObject(this.locations[0]);
    await this.waitForMap();
    assertNumberOfMarkersMatch(cluster, 'added a marker to the cluster');
  });
});
