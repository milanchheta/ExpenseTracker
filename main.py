'''
Microservice to handle generation of 
grpahs for a particular user and expense sheet
'''

# Import statements
from flask import Flask, request
from google.cloud import firestore
from flask_cors import CORS, cross_origin
import pygal

# Config flask app and firestore client
app = Flask(__name__)
CORS(app)
db = firestore.Client()

# /analyse endpoint to handle GET requests
@app.route('/analyse',methods = ['GET'])
@cross_origin()
def analyse_endpoint():
    #Generate graph for an expense sheet
    if request.method == 'GET':
        try:

            args=request.args
            if args:
                budget = args['budget']
                expense_sheet_id = args['expense_sheet_id']
                docs = db.collection(u'cloud_expenses').where(u'expense_sheet_id', u'==', expense_sheet_id).stream()
                expenses = []
                for expense in docs:
                    expenses.append(expense.to_dict())

                spent = 0
                d = {}
                for expense in expenses:
                    spent += int(expense["expense_value"])
                    if expense["expense_category"] in d:
                        d[expense["expense_category"]] += int(expense["expense_value"])
                    else:
                        d[expense["expense_category"]] = int(expense["expense_value"])

                b_chart = pygal.Bar()
                b_chart.title = "Overall expenses"
                b_chart.add("Budget", int(budget))
                b_chart.add("Spent", spent)
                barGraph = b_chart.render_data_uri()

                pie_chart = pygal.Pie()
                pie_chart.title = 'Category wise expenses'
                for k,v in d.items():
                    pie_chart.add(k,v)
                pieChart = pie_chart.render_data_uri()

                graphData = {"pieChart":pieChart,"barGraph":barGraph}
                return (json.dumps(graphData), 200)
            else:
                return ('Bad request', 400)
        except:
            return ('Internal server error', 503)


if __name__ == "__main__":
    #Run the flask server on port 8080
    app.run(debug = True, host = '0.0.0.0', port = 8080)