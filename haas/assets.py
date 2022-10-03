from flask_assets import Bundle
from webassets.filter import get_filter


cookies_js = Bundle(
    "javascripts/cookies.js",
    filters=get_filter(
        "babel",
        binary="node_modules/@babel/cli/bin/babel.js",
        presets="@babel/env",
    ),
    output="cookies-%(version)s.js",
)
