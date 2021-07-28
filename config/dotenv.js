/* eslint-env node */

'use strict';

const path = require('path');

module.exports = function (env) {
  const isCI = Boolean(process.env.CI);

  return {
    enabled: !isCI, // disable for CI
    clientAllowedKeys: ['GOOGLE_MAPS_API_KEY'],
    fastbootAllowedKeys: [],
    failOnMissingKey: false,
    path: path.join(path.dirname(__dirname), `.env.${env}`),
  };
};
