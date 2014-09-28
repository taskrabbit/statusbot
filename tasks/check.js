exports.task = {
  name:          'check',
  description:   'check',
  frequency:     0,
  queue:         'statusbot',
  plugins:       [],
  pluginOptions: {},
  
  run: function(api, params, next){
    api.check.check(params.url, function(){
      setTimeout(function(){
        api.tasks.enqueue("check", params, 'statusbot');
        next(true);
      }, 5000); // need to sleep for statuspage.io rate limit [ http://doers.statuspage.io/api/v1/ ]
    });
  }
};