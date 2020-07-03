# Dependencies
import numpy as np
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from flask import Flask, jsonify, render_template, request, redirect
from flask_sqlalchemy import SQLAlchemy
import json

#################################################
# Database Setup
#################################################

engine = create_engine(
    "postgres://marciooliver:@localhost:5432/HappinessData")

# reflect an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
# print(Base.classes)
Happiness = Base.classes.happiness
Happiness_Report = Base.classes.happyness_report

#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################


# Home page rendering html template
@app.route("/")
def index():
    data = engine.execute("SELECT * FROM happiness")
    return render_template("index.html", data=data)


# Jsonify happiness data route
@app.route("/api/v1.0/happyness_index")
def happyness_index():
    # Get all data from DB
    data = engine.execute("SELECT * FROM happiness")
    
    # jsonify data to render template
    return jsonify({'data': [dict(row) for row in data]})


# Render Happiness Report data to html template
@app.route("/project3")
def project3():
    ML_data = engine.execute("SELECT * FROM happyness_report")
    return render_template("project3.html", ML_data=ML_data)


# Jsonify data route for happiness report data
@app.route("/api/v1.0/happyness_report_data")
def happyness_report_data():
    # Get all data from DB
    ML_data = engine.execute("SELECT * FROM happyness_report")

    # jsonify data to render template
    return jsonify({'ML_data': [dict(row) for row in ML_data]})

# Route for team html template
@app.route("/the_team")
def about_us():
    return render_template("about_us.html")

if __name__ == "__main__":
    app.run(debug=True)

