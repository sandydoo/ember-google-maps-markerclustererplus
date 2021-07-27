# MarkerClustererPlus for Ember Google Maps 

[![Latest version][npm-version-badge]][npm-url]

Add marker clustering to [ember-google-maps][ember-google-maps] using [@googlemaps/markerclustererplus][@googlemaps/markerclustererplus].


🔗 Compatibility
------------------------------------------------------------------------------

* Ember Google Maps v4.2 or above
* Ember.js v3.16 or above
* Ember CLI v3.16 or above
* Node.js v10 or above


Installation
------------------------------------------------------------------------------

```
ember install ember-google-maps-markerclustererplus
```


Usage
------------------------------------------------------------------------------

#### Cluster some markers

The `markerClusterer` works in the same way as any other [ember-google-maps][ember-google-maps] component. If you're not sure how this works, [read through the guide for ember-google-maps][ember-google-maps-guide].

The `markerClusterer` yields its own special `marker` that's added to the cluster, instead of the map.

```hbs
<GMap @lat="51.508530" @lng="-0.076132" as |map|>

  <map.markerClusterer as |cluster|>

    {{#each this.locations as |location|}}
      <cluster.marker @lat={{location.lat}} @lng={{location.lng}} />
    {{/each}}

  </map.cluster>
</GMap>
```

#### Handle events

You can also register events. You've got your usual suspects, like `click`, `dblclick`, and others, and also two special events: `clusteringbegin` and `clusteringend`. These are both native, albeit poorly publicized, `markerclustererplus` events. But beware! These clustering events may be called several times during a single render, because `markerclustererplus` clusters markers in batches.

```hbs
<GMap @lat="51.508530" @lng="-0.076132" as |map|>

  <map.markerClusterer
    @onClick={{this.whenAClusterMarkerIsClicked}}
    @onClusteringbegin={{this.whenABatchOfMarkersIsToBeClustered}}
    @onClusteringend={{this.whenABatchOfMarkersHasBeenClustered}}
    as |cluster|>

    {{#each this.locations as |location|}}
      <cluster.marker @lat={{location.lat}} @lng={{location.lng}} />
    {{/each}}

  </map.cluster>
</GMap>
```

#### Get the `MarkerClusterer` instance

The best way to do this is to register a one-time event with `@onceOn`.

```hbs
<GMap @lat="51.508530" @lng="-0.076132" as |map|>

  <map.markerClusterer
    @onceOnClusteringend={{this.getMarkerClusterer}}
    as |cluster|>

    {{#each this.locations as |location|}}
      <cluster.marker @lat={{location.lat}} @lng={{location.lng}} />
    {{/each}}

  </map.cluster>
</GMap>
```

😇 Maintainers
--------------------------------------------------------------------------------

This addon is maintained by **[Sander Melnikov][maintainer-url]**.


Contributing
------------------------------------------------------------------------------

See the [Contributing](CONTRIBUTING.md) guide for details.


License
------------------------------------------------------------------------------

[MIT][license-url] © [Sander Melnikov][maintainer-url].

This software is not endorsed, maintained, or supported by Google LLC.

© 2021 Google LLC All rights reserved. Google Maps™ is a trademark of Google LLC.


[npm-version-badge]: https://img.shields.io/npm/v/ember-google-maps-markerclustererplus.svg?label=latest
[npm-url]: https://www.npmjs.org/package/ember-google-maps-markerclustererplus

[ember-google-maps]: https://github.com/sandydoo/ember-google-maps
[ember-google-maps-guide]: https://ember-google-maps.sandydoo.me/docs/getting-started
[@googlemaps/markerclustererplus]: https://github.com/googlemaps/js-markerclustererplus

[maintainer-url]: https://github.com/sandydoo
[license-url]: https://github.com/sandydoo/ember-google-maps-markerclustererplus/blob/main/LICENSE.md
