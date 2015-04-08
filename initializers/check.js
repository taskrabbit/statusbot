var request = require('request');

module.exports = {
  initialize: function(api, next){
    api.check = {

      counters: {},

      enqueue: function(){
        api.config.statuspage.checks.forEach(function(c){
          api.tasks.enqueue("check", {url: c.url}, 'statusbot');
        });
      },

      check: function(url, callback){
        var check;
        api.config.statuspage.checks.forEach(function(c){
          if(c.url === url){ check = c; }
        });

        if(!check){
          callback(new Error('no check for that url found'));
        }else{
          if(!api.check.counters[check.name]){ api.check.counters[check.name] = 0; }

          var start = new Date().getTime();
          request.get(check.url, function(error, response, body){
            var end     = new Date().getTime();
            var delta   = (end - start);
            var status  = 'operational';
            var started = 0;

            var complete = function(){
              if(started === 0){
                var details = { url: url, status:status, delta:delta };
                callback(null, details);
              }
            };

            if(delta > check.threshold ){
              status = 'degraded_performance';
              api.check.counters[check.name]++;
            } else if (error || response.statusCode != 200){
              status = 'partial_outage';
              api.check.counters[check.name]++;
            }else{
              api.check.counters[check.name] = 0;
            }

            if(api.check.counters[check.name] > 0){
              api.log("outage count for " + check.name + ": " + api.check.counters[check.name], 'alert');
              if(api.check.counters[check.name] >= api.config.statuspage.incidentThreshold){
                if(status === 'partial_outage'){
                  started++;
                  api.check.createIncident(check, function(err){
                    started--;
                    if(err){ api.log(err, 'warning'); }
                    complete();
                  }); 
                }

                if(status === 'degraded_performance' || status === 'partial_outage'){
                  started++;
                  api.statuspage.components.update(check.component, status, function(err, response, body){
                    started--;
                    if(err){ api.log(err, 'warning'); }
                    complete();
                  });
                }
              }
            }

            started++;
            api.statuspage.metrics.data(check.metric, delta, Math.floor(start / 1000), function(err, response, body){
              if(err){ api.log(err, 'warning'); }
              if(body && body !== ''){
                body = JSON.parse(body);
                if(body.error){ api.log(body.error, 'warning'); }
              }
              started--;
              complete();
            });
          });
        }
      },

      createIncident: function(check, callback){
        var status = 'investigating';
        var message = api.config.errors.incidentCreatedError(check.name);
        var name = 'Error with ' + check.name;
        api.log("creating incident for " + check.name, 'alert');
        api.statuspage.incidents.condionallyCreate(name, status, message, check.impact, function(error, response, body){
          if(error != 'already created'){ api.log('Incident ==>> ' + message, 'warning'); }
          if(typeof callback === 'function'){
            callback(error, response, body);
          }
        });
      }
    };

    next();
  }, 

  startPriority: 9999,
  start: function(api, next){
    api.check.enqueue();
    next();
  }
};
