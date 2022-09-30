from flask import render_template, jsonify, request

from haas import app
from haas.generator import generate_hex


@app.get("/")
def home():
    return render_template("index.html", title="Home")


@app.get("/api")
def api():
    return jsonify(generate_hex(6))


@app.route("/analytics", methods=["GET", "POST"])
def analytics_ua():
    ga_version = request.args.get("type", default="ua")
    container_id = {
        "ua": "GTM-5S9XWS6",
        "ga4": "GTM-TTVXKG3",
    }[ga_version]

    if request.method == "POST":
        input = request.form["hex_count"] or "6"
        num = int(input)
    else:
        num = 6

    return render_template(
        "reading.html",
        container_id=container_id,
        title="Hexagrams",
        hexagrams=generate_hex(num),
    )
