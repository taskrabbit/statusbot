exports.default = {
  routes: function(api){
    return {

      all: [
        { path: "/statusbot/status/light",         action: "status" },
        { path: "/statusbot/status/heavy",         action: "status" },
      ]
      
    };
  }
};
