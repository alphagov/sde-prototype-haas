(function () {
  function CookieBanner($module) {
    this.$module = $module;
  }

  function getCookie(name, defaultValue) {
    console.log('getCookie', name)
    const cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim()
      console.log('cookie', cookie)
      if (cookie.startsWith(name + '=')) {
        return decodeURIComponent(cookie.substring(name.length + 1))
      }
    }
    console.log('not found, returning default', defaultValue)
    return defaultValue || null
  }

  CookieBanner.prototype.init = function () {
    console.log('initializing Cookie Banner', this.$module);
    this.cookies_preferences_set = getCookie('cookies_preferences_set') === 'true'
    console.log('cookies_preferences_set', this.cookies_preferences_set)
    this.cookies_policy = JSON.parse(getCookie('cookies_policy', '{}'))
    console.log('cookies_policy', this.cookies_policy)

    this.$module.message = this.$module.querySelector('.js-cookie-banner-message');
    this.$module.confirmAccept = this.$module.querySelector('.js-cookie-banner-confirmation-accept');
    this.$module.confirmReject = this.$module.querySelector('.js-cookie-banner-confirmation-reject');

    this.$module.querySelector('[data-accept-cookies]').addEventListener('click', this.acceptCookies.bind(this))
    this.$module.querySelector('[data-reject-cookies]').addEventListener('click', this.rejectCookies.bind(this))

    var nodes = this.$module.querySelectorAll('[data-hide-cookie-message]')
    for (var i = 0, length = nodes.length; i < length; i++) {
      nodes[i].addEventListener("click", this.hideBanner.bind(this))
    }

    this.showBanner();
  }

  CookieBanner.prototype.showBanner = function () {
    var acceptedAdditionalCookies = false;
    var responded = Object.keys(this.cookies_policy).length > 0
    console.log('responded', responded)
    for (const category in this.cookies_policy) {
      if (category !== "essential") {
        acceptedAdditionalCookies ||= this.cookies_policy[category];
      }
    }
    console.log('acceptedAdditionalCookies', acceptedAdditionalCookies)

    this.$module.hidden = this.cookies_preferences_set;
    if (!this.cookies_preferences_set) {
      setCookie('cookies_preferences_set', 'true', {'days': 365});
    }
    this.$module.confirmAccept.hidden = !responded || !acceptedAdditionalCookies;
    this.$module.confirmReject.hidden = !responded || acceptedAdditionalCookies;
  }

  CookieBanner.prototype.hideBanner = function () {
    this.$module.hidden = true;
  }

  function setCookie(name, value, options) {
    options = (options || {})
    var cookieString = name.concat('=', value, '; path=/');
    if (options.days) {
      const expiryDate = new Date()
      expiryDate.setTime(expiryDate.getTime() + (options.days * 24 * 60 * 60 * 1000))
      cookieString += '; expires='.concat(expiryDate.toGMTString())
    }
    if (document.location.protocol === 'https:') {
      cookieString += '; Secure'
    }
    document.cookie = cookieString
  }

  const ALL_COOKIES = {
    'essential': true,
    'settings': true,
    'usage': true,
    'campaigns': true
  }

  const ESSENTIAL_COOKIES = {
    'essential': true,
    'settings': false,
    'usage': false,
    'campaigns': false
  }

  CookieBanner.prototype.acceptCookies = function () {
    console.log("accepting cookies")
    this.$module.message.hidden = true
    this.$module.confirmAccept.hidden = false
    this.$module.confirmAccept.focus()
    setCookie('cookies_policy', JSON.stringify(ALL_COOKIES), {'days': 365})
    setCookie('cookies_preferences_set', 'true', {'days': 365})

  }

  CookieBanner.prototype.rejectCookies = function () {
    console.log('rejecting cookies')
    this.$module.message.hidden = true
    this.$module.confirmReject.hidden = false
    this.$module.confirmReject.focus()
    setCookie('cookies_policy', JSON.stringify(ESSENTIAL_COOKIES), {'days': 365})
    setCookie('cookies_preferences_set', 'true', {'days': 365})
  }

  window.CookieBanner = CookieBanner;

  document.addEventListener('DOMContentLoaded', function () {
    const nodes = document.querySelectorAll('[data-module="govuk-cookie-banner"]')
    for (var i = 0, length = nodes.length; i < length; i++) {
      new CookieBanner(nodes[i]).init();
    }
  });
})()
