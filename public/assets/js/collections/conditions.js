(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  WEATHER.Collections.Conditions = (function(_super) {
    __extends(Conditions, _super);

    function Conditions() {
      _ref = Conditions.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    return Conditions;

  })(Backbone.Collection.extend({
    StorageName: "Conditions",
    model: WEATHER.Models.Conditions,
    url: "http://127.0.0.1:5000/conditions/",
    debug: false,
    initialize: function(options) {
      this.url += options.lat + "/" + options.long;
      if (options.jumpCache) {
        this.url += "/jumpCache";
      }
      if (options.debug) {
        return this.debug = options.debug;
      }
    },
    parse: function(response) {
      var storageResponse, storageResponseTime, timeDifference, updateStorage;
      if (Modernizr.localstorage) {
        updateStorage = true;
        storageResponse = localStorage.getItem(this.StorageName);
        storageResponseTime = localStorage.getItem(this.StorageName + "Time");
        if (storageResponse && storageResponseTime) {
          timeDifference = new Date().getTime() - storageResponseTime;
          if (timeDifference < 3600000) {
            updateStorage = false;
          }
        }
        if (updateStorage) {
          localStorage.setItem(this.StorageName, JSON.stringify(response));
          localStorage.setItem(this.StorageName + "Time", new Date().getTime());
        }
      }
      return response;
    },
    sync: function(method, model, options) {
      var forceServer, storageResponse, storageResponseTime, timeDifference;
      forceServer = true;
      options.dataType = "jsonp";
      switch (method) {
        case "create":
          return Backbone.sync(method, model, options);
        case "update":
          return Backbone.sync(method, model, options);
        case "delete":
          return Backbone.sync(method, model, options);
      }
      if (Modernizr.localstorage && !this.debug) {
        storageResponse = localStorage.getItem(this.StorageName);
        storageResponseTime = localStorage.getItem(this.StorageName + "Time");
        if (storageResponse && storageResponseTime) {
          timeDifference = new Date().getTime() - storageResponseTime;
          if (timeDifference < 3600000) {
            forceServer = false;
            options.success(JSON.parse(storageResponse));
          }
        }
      }
      if (forceServer) {
        return Backbone.sync(method, model, options);
      }
    }
  }));

}).call(this);
