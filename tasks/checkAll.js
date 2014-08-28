exports.task = {
  name:          'checkAll',
  description:   'checkAll',
  frequency:     (10 * 1000),
  queue:         'statusbot',
  plugins:       [],
  pluginOptions: {},
  
  run: function(api, params, next){
    var urls  = []
    api.config.statuspage.checks.forEach(function(c){
      urls.push(c.url);
    });

    api.log("starting task CheckAll with " + urls.length + " checks")

    var doIt = function(){
      if(urls.length === 0){
        next();
      }else{
        var url = urls.pop();
        api.check.check(url, function(){
          setTimeout(doIt, 5000) // need to sleep for statuspage.io rate limit [ http://doers.statuspage.io/api/v1/ ]
        });
      }
    }

    doIt();
  }
};