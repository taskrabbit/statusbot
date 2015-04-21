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

  run: function(api, data, next){
    api.check.check(data.params.url, function(error, details){
      data.response.details = details;
      next(error);
    });
  }
};