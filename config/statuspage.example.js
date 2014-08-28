exports.default = { 
  statuspage: function(api){
    return {
      pageId: 'XXX',
      apiKey: 'XXX',
      incidentThreshold: 10,

      checks: [
        // an example check
        // { name: 'My Site',   url: 'http://www.site.comm', metric: 'XXX', component: "XXX", impact: 'major', threshold: 500 },        
        
     ]
    }
  }
}