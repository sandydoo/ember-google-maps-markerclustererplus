# MarkerClustererPlus for Ember Google Maps 

[![Latest version][npm-version-badge]][npm-url]

Add marker clustering to [ember-google-maps][ember-google-maps] using [@googlemaps/markerclustererplus][@googlemaps/markerclustererplus].

> What is clustering?
>
> Drawing a lot of markers in close proximity can quickly turn into a usability nightmare. Grouping, or clustering, markers is a common way of simplifying how markers are displayed when used in large numbers.


🔗 Compatibility
------------------------------------------------------------------------------

* Ember Google Maps v4.2 or above
* Ember.js v3.16 or above
* Ember CLI v3.16 or above
* Node.js v10 or above


⚙️ Installation
------------------------------------------------------------------------------

```
ember install ember-google-maps-markerclustererplus
```


⭐ Usage
------------------------------------------------------------------------------

[A version of the following guide, together with a demo, is included in the ember-google-maps docs →][ember-google-maps-clustering-guide].

#### Cluster some markers

The `markerClusterer` works in the same way as any other [ember-google-maps][ember-google-maps] component. If you're not sure what that means, [read through the general guide for ember-google-maps →][ember-google-maps-guide].

The MarkerClustererPlus library accepts a bunch of options to configure the clusters. As with any map component, you can pass these options straight to the `markerClusterer` component. [Here’s a full list of supported options →](https://googlemaps.github.io/js-markerclustererplus/interfaces/markerclustereroptions.html)

The `markerClusterer` yields its own special `marker` that's added to the cluster instead of the map. Don’t confuse it with the regular marker yielded by the map itself!

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

You can also register events. You've got your usual suspects, like `click`, `dblclick`, and others; and also two special events: `clusteringbegin` and `clusteringend`. These are both native, albeit poorly publicized, MarkerClustererPlus events. But beware! These clustering events may be called several times during a single render because MarkerClustererPlus clusters markers in batches.

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

#### More cluster icons

The MarkerClustererPlus library comes with a small collection of default cluster icons to choose from. They're all copied to `/assets/markerclustererplus/images/`.


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
[ember-google-maps-clustering-guide]: https://ember-google-maps.sandydoo.me/docs/clustering
[@googlemaps/markerclustererplus]: https://github.com/googlemaps/js-markerclustererplus

[maintainer-url]: https://github.com/sandydoo
[license-url]: https://github.com/sandydoo/ember-google-maps-markerclustererplus/blob/main/LICENSE.md
