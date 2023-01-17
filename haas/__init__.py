"""Hexagrams as a Service Flask app."""
import os

from flask import Flask
from flask_assets import Environment
from jinja2 import ChoiceLoader
from jinja2 import PackageLoader
from jinja2 import PrefixLoader

app = Flask(__name__, static_url_path="/assets")
assets = Environment(app)
assets.from_module("haas.assets")

app.jinja_env.globals["getenv"] = os.getenv

app.jinja_loader = ChoiceLoader(
    [
        PackageLoader("haas"),
        PrefixLoader({"govuk_frontend_jinja": PackageLoader("govuk_frontend_jinja")}),
    ]
)

import haas.views  # noqa
