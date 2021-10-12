'use strict';

const path = require('path');
const funnel = require('broccoli-funnel');
const mergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: require('./package').name,

  options: {
    babel: {
      plugins: ['@babel/plugin-proposal-logical-assignment-operators'],
    },

    'ember-google-maps': {
      customComponents: {
        markerClusterer: 'g-map/marker-clusterer',
      },
    },
  },

  treeForPublic() {
    let trees = [];

    const tree = this._super.treeForPublic.apply(this, arguments);
    if (tree) {
      trees.push(tree);
    }

    const pathToMarkerClusterer = path.dirname(
      require.resolve('@googlemaps/markerclustererplus/package.json')
    );

    const clusterImagesTree = funnel(pathToMarkerClusterer, {
      srcDir: 'images',
      destDir: 'assets/markerclustererplus/images',
    });

    trees.push(clusterImagesTree);

    return mergeTrees(trees);
  },
};
