from flask import Flask, request, Response
from google.cloud import firestore
import json
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

db = firestore.Client()
SECRET_KEY="Authentication Secret Goes Here"

@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/expenses',methods = ['POST', 'GET'])
@cross_origin()

def expenses_endpoint():
  
    if request.method=='GET':
        args=request.args
        if args:
            expense_sheet_id=args['expense_sheet_id']
            docs=db.collection(u'cloud_expenses').where(u'expense_sheet_id', u'==', expense_sheet_id).stream()
            expenses=[]
            for expense in docs:
                expenses.append(expense.to_dict())
            return (json.dumps(expenses), 200) 
        else:
            return ('Bad request', 400)

    if request.method == 'POST':
        data=request.get_json()
        sheet = db.collection(u'cloud_expenses').add({
            u'expense_name': data["expense_name"],
            u'expense_sheet_id': data["expense_sheet_id"],
            u'expense_value': data['expense_value'],
            u'date_created':data['date_created'],
            u'expense_category':data['expense_category'],
        })
        return ('Expense added!', 200) 


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=8080)