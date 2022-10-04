from flask_assets import Bundle
from webassets.filter import get_filter


cookies_js = Bundle(
    "javascripts/utils.js",
    "javascripts/cookie-banner.js",
    "javascripts/cookies-page.js",
    "javascripts/consent.js",
    filters=get_filter(
        "babel",
        binary="node_modules/@babel/cli/bin/babel.js",
        presets="@babel/env",
    ),
    output="cookies-%(version)s.js",
)
