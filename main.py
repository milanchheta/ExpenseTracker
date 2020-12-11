'''
Microservice to handle creation and
fetching of expenses from firestore
'''

# Import statements
from flask import Flask, request
from google.cloud import firestore
import json
from flask_cors import CORS, cross_origin

# Config flask app and firestore client
app = Flask(__name__)
CORS(app)
db = firestore.Client()

# /expenses endpoint to handle GET and POST requests
@app.route('/expenses',methods = ['POST', 'GET'])
@cross_origin()
def expenses_endpoint():
    #Fetch expenses for a user with given expense sheet
    if request.method == 'GET':
        try:
            args = request.args
            if args:
                expense_sheet_id = args['expense_sheet_id']
                docs = db.collection(u'cloud_expenses').where(u'expense_sheet_id', u'==', expense_sheet_id).stream()
                expenses = []
                for expense in docs:
                    expenses.append(expense.to_dict())
                return (json.dumps(expenses), 200) 
            else:
                return ('Bad request', 400)
        except:
            return ('Internal server error', 503)

    #Add a new expense to the expense sheet
    if request.method == 'POST':
        try:
            data = request.get_json()
            if data:
                sheet = db.collection(u'cloud_expenses').add({
                    u'expense_name': data["expense_name"],
                    u'expense_sheet_id': data["expense_sheet_id"],
                    u'expense_value': data['expense_value'],
                    u'date_created':data['date_created'],
                    u'expense_category':data['expense_category'],
                })
                return ('Expense added!', 200) 
            else:
                return ('Bad request', 400)
        except:
            return ('Internal server error', 503)

if __name__ == "__main__":
    #Run the flask server on port 8080
    app.run(debug=True, host='0.0.0.0', port=8080)