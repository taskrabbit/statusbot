exports.action = {
  name:                   'check',
  description:            'check',
  blockedConnectionTypes: [],
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,

  inputs: {
    required: ['url'],
    optional: [],
  },

  run: function(api, connection, next){
    api.check.check(connection.params.url, function(error, details){
      connection.response.details = details;
      connection.error = error;
      next(connection, true);
    });
  }
};