(function () {
  "use strict";

  Utils = window.Utils = {};

  Utils.getQueryString = function (url) {
    return url.slice((url.indexOf("?") + 1) || url.length);
  };

  Utils.getURLParameter = function (name) {
    name += "=";
    var pairs = Utils.getQueryString(window.location.href).split("&");
    for (var index = 0; pairs.length > index; index++) {
      if (pairs[index].slice(0, name.length) === name) {
        return pairs[index].slice(name.length);
      }
    }
  };

  Utils.getCookie = function (name, defaultValue) {
    name += "=";
    const cookies = document.cookie.split(";");
    for (var index = 0; cookies.length > index; index++) {
      if (cookies[index].trim().slice(0, name.length) === name) {
        return decodeURIComponent(cookies[index].trim().slice(name.length));
      }
    }
    return defaultValue ? defaultValue : null;
  };

  Utils.setCookie = function (name, value, options) {
    options = (options || {});
    var cookieString = name.concat("=", value, "; path=/");
    if (options.days) {
      const expiryDate = new Date()
      expiryDate.setTime(expiryDate.getTime() + (options.days * 24 * 60 * 60 * 1000));
      cookieString += "; expires=".concat(expiryDate.toGMTString());
    }
    if (document.location.protocol === "https:") {
      cookieString += "; Secure";
    }
    document.cookie = cookieString;
  };

  Utils.addURLParameter = function (url, name, value) {
    name = encodeURIComponent(name).concat("=");
    value = encodeURIComponent(value);
    var queryString = Utils.getQueryString(url);
    var parameters = queryString.split("&");
    var index = 0, newParameters = [], modified = false;
    for (; parameters.length > index; index++) {
      if (parameters[index].slice(0, name.length) === name) {
        newParameters[newParameters.length] = name.concat(value);
        modified = true;
      } else if (parameters[index] !== "") {
        newParameters[newParameters.length] = parameters[index];
      }
    }
    if (!modified) {
      newParameters[newParameters.length] = name.concat(value);
    }
    return url.replace(queryString, newParameters.join("&"));
  };

  Utils.removeURLParameter = function (url, name) {
    name += "=";
    var queryString = Utils.getQueryString(url);
    var parameters = queryString.split("&");
    for (var index = 0; parameters.length > index; index++) {
      if (parameters[index].slice(0, name.length) === name) {
        parameters.splice(index--, 1);
      }
    }
    return url.replace(queryString, parameters.join("&"));
  };
})();
