from flask import Flask, render_template, url_for

app = Flask(__name__)

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/normal")
def normal():
    return render_template('normalPoly.html')

@app.route("/versus")
def versus():
    return render_template('versusPoly.html')