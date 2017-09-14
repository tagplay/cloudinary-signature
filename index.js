'use strict';

var crypto = require('crypto');

var excludedParams = ['file', 'type', 'resource_type', 'api_key'];

module.exports = sign;

function sign(key, secret, params) {
  if (!key) throw new Error('An Cloudinary API Key is required');
  if (!secret) throw new Error('An Cloudinary API Secret is required');
  if (!params) params = {};

  params.timestamp = Date.now();
  params.signature = generateSignature(secret, params);
  params.api_key = key;
  return params;
}

function generateSignature(secret, params) {
  var signableParams = Object.keys(params)
    .map(function(key) {
      if (excludedParams.indexOf(key) === -1) {
        if (key === 'tags' && typeof params[key] !== 'string') {
          return 'tags=' + params[key].sort().join(',');
        } else {
          return key + '=' + params[key];
        }
      }
    })
    .filter(Boolean);

  var shasum = crypto.createHash('sha1');
  shasum.update(signableParams.sort().join('&') + secret);
  return shasum.digest('hex');
}
