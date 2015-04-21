exports.action = {
  name:                   'showDocumentation',
  description:            'return API documentation',
  blockedConnectionTypes: [],
  outputExample:          {},
  matchExtensionMimeType: false,
  version:                1.0,
  toDocument:             true,

  inputs: {
    required: [],
    optional: [],
  },

  run: function(api, data, next){    
    data.response.documentation = api.documentation.documentation;
    next();
  }
};