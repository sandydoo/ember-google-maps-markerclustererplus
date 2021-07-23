# MarkerClustererPlus for Ember Google Maps 

Add marker clustering to [ember-google-maps][ember-google-maps] using [@googlemaps/markerclustererplus][@googlemaps/markerclustererplus].


🔗 Compatibility
------------------------------------------------------------------------------

* Ember Google Maps v4.0 or above
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

```hbs
<GMap @lat="51.508530" @lng="-0.076132" as |map|>
  <map.markerClusterer as |cluster|>
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

© 2020 Google LLC All rights reserved. Google Maps™ is a trademark of Google LLC.


[ember-google-maps]: https://github.com/sandydoo/ember-google-maps
[@googlemaps/markerclustererplus]: https://github.com/googlemaps/js-markerclustererplus

[maintainer-url]: https://github.com/sandydoo
[license-url]: https://github.com/sandydoo/ember-google-maps-markerclustererplus/blob/main/LICENSE.md
