from flask import Flask, request, Response
from google.cloud import firestore
import json
from flask_cors import CORS, cross_origin
import pygal

app = Flask(__name__)
CORS(app)

db = firestore.Client()

@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/analyse',methods = ['GET'])
@cross_origin()

def analyse_endpoint():
  
    if request.method=='GET':
        args=request.args
        if args:
            budget=args['budget']
            expense_sheet_id=args['expense_sheet_id']
            docs=db.collection(u'cloud_expenses').where(u'expense_sheet_id', u'==', expense_sheet_id).stream()
            expenses=[]
            for expense in docs:
                expenses.append(expense.to_dict())

            spent=0
            d={}
            for expense in expenses:
                spent+=int(expense["expense_value"])
                if expense["expense_category"] in d:
                    d[expense["expense_category"]]+=int(expense["expense_value"])
                else:
                    d[expense["expense_category"]]=int(expense["expense_value"])

            b_chart = pygal.Bar()
            b_chart.title = "Overall expenses"
            b_chart.add("Budget", int(budget))
            b_chart.add("Spent", spent)
            barGraph=b_chart.render_data_uri()

            pie_chart = pygal.Pie()
            pie_chart.title = 'Category wise expenses'
            for k,v in d.items():
                pie_chart.add(k,v)
            pieChart=pie_chart.render_data_uri()

            graphData = {"pieChart":pieChart,"barGraph":barGraph}
            return (json.dumps(graphData), 200)
        else:
            return ('Bad request', 400)



if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=8080)