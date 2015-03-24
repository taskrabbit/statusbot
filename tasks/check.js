exports.task = {
  name:          'check',
  description:   'check',
  frequency:     0,
  queue:         'statusbot',
  plugins:       [],
  pluginOptions: {},
  
  run: function(api, params, next){
    api.check.check(params.url, function(err, details){
      setTimeout(function(){
        api.tasks.enqueue("check", params, 'statusbot');
        next(err, details);
      }, 3000); // need to sleep for statuspage.io rate limit [ http://doers.statuspage.io/api/v1/ ]
    });
  }
};