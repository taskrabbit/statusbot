var http = require('http');
var https = require('https');
var request = require('request');

http.globalAgent.maxSockets = 100;
https.globalAgent.maxSockets = 100;

exports.statuspage = function(api, next){

  api.statuspage = {

    _start: function(){
      if(api.config.statuspage.rebootTime && api.config.statuspage.rebootTime > 0){
        setTimeout(function(){
          api.log("rebooting...");
          api._self.stop(process.exit);
        }, api.config.statuspage.rebootTime);
      }
    },

    baseUrl: "https://api.statuspage.io/v1/pages/" + api.config.statuspage.pageId + "/",
    header: { 
      Authorization: "OAuth " + api.config.statuspage.apiKey, 
      // 'Content-type': 'application/x-www-form-urlencoded; charset=utf-8' 
      'Content-type': 'application/json',
    },

    incidents: {
      condionallyCreate: function(name, status, message, impact, callback){
        api.statuspage.incidents.list(function(err, response, body){
          var list = JSON.parse(body);
          var open = false;
          list.forEach(function(i){
            if(i.status != 'resolved'){ open = true; }
          });
          if(open === false){
            api.statuspage.incidents.create(name, status, message, impact, callback);
          }else{
            callback('already created');
          }
        });
      },

      create: function(name, status, message, impact, callback){
        // incident[name] - The name of the incident
        // incident[status] - The status, one of investigating|identified|monitoring|resolved (optional, defaults to investigating if left blank)
        // incident[message] - The initial message, created as the first incident update (optional)
        // incident[wants_twitter_update] - Post the new incident to twitter (t or f, defaults to f)
        // incident[impact_override] - Override calculated impact value, one of none|minor|major|critical (optional)
        // incident[component_ids] - List of components whose subscribers should be notified (only applicable for pages with component subscriptions enabled)
        if(!impact){ impact = 'none'; }

        var req  = {
          url: api.statuspage.baseUrl + 'incidents.json',
          method: 'POST',
          headers: api.statuspage.header,
          body: JSON.stringify({incident: {
            name: name,
            status: status,
            message: message,
            impact_override: impact,
          }}),
        };

        request(req, callback);
      },

      update: function(id, name, status, message, impact, callback){
        // incident[name] - The name of the incident
        // incident[status] - The status, one of investigating|identified|monitoring|resolved (if realtime) or scheduled|in_progress|verifying|completed (if scheduled)
        // incident[message] - The body of the new incident update that will be created (optional)
        // incident[wants_twitter_update] - Post the new incident update to twitter (t or f, defaults to f)
        // incident[impact_override] - Override calculated impact value, one of none|minor|major|critical (optional)
        // incident[component_ids] - List of components whose subscribers should be notified (only applicable for pages with component subscriptions enabled)
        if(!impact){ impact = 'none'; }

        var req  = {
          url: api.statuspage.baseUrl + 'incidents/' + id + '.json',
          method: 'PATCH',
          headers: api.statuspage.header,
          body: JSON.stringify({incident: {
            name: name,
            status: status,
            message: message,
            impact_override: impact,
          }}),
        };

        request(req, callback);
      },

      list: function(callback){
        var req  = {
          url: api.statuspage.baseUrl + 'incidents.json',
          method: 'GET',
          headers: api.statuspage.header,
        };

        request(req, callback);
      }
    },

    components: {
      update: function(id, status, callback){
        // operational|degraded_performance|partial_outage|major_outage
        var req  = {
          url: api.statuspage.baseUrl + 'components/' + id + '.json',
          method: 'PATCH',
          headers: api.statuspage.header,
          body: JSON.stringify({component: {
            status: status
          }}),
        };

        request(req, callback);
      },

      list: function(callback){
        var req  = {
          url: api.statuspage.baseUrl + 'components.json',
          method: 'GET',
          headers: api.statuspage.header,
        };

        request(req, callback);
      },
    },

    metrics: {
      data: function(id, value, timestamp, callback){
        if(!timestamp){
          timestamp = Math.floor(new Date().getTime() / 1000);
        }

        var req  = {
          url: api.statuspage.baseUrl + 'metrics/' + id + '/data.json',
          method: 'POST',
          headers: api.statuspage.header,
          body: JSON.stringify({data: {
            value: value,
            timestamp: timestamp,
          }}),
        };

        request(req, callback);
      }, 

      get: function(callback){
        var req  = {
          url: api.statuspage.baseUrl + 'metrics_providers.json',
          method: 'GET',
          headers: api.statuspage.header,
        };

        request(req, callback);
      },
    }

  };

  next();
};