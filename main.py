'''
Microservice to handle creation and fetching 
of expense sheets and its information
from firestore
'''

# Import statements
from flask import Flask, request
from google.cloud import firestore
import json
import jwt 
import uuid
from flask_cors import CORS, cross_origin

# Config flask app and firestore client
app = Flask(__name__)
CORS(app)
db = firestore.Client()
decode_key="decode"

# /sheets endpoint to handle GET and POST requests
@app.route('/sheets',methods = ['POST', 'GET'])
@cross_origin()
def sheet_endpoint(): 
    #Fetch expense sheets for a user 
    if request.method == 'GET':
        try:
            args = request.args
            if args:
                user = jwt.decode(args['token'], decode_key)["user"]
                docs = db.collection(u'cloud_expense_sheets').where(u'user_id', u'==', user['user_id']).stream()
                sheets = []
                for sheet in docs:
                    sheets.append(sheet.to_dict())
                return (json.dumps(sheets), 200) 
            else:
                return ('Bad request', 400)
        except:
            return ('Internal server error', 503)

    #Create a new expense sheet for a user
    if request.method == 'POST':
        try:
            data=request.get_json()
            if data:
                user = jwt.decode(data['token'], decode_key)["user"]
                sheet_id = str(uuid.uuid4())
                sheet = db.collection(u'cloud_expense_sheets').add({
                        u'sheet_name': data["sheet_name"],
                        u'user_id': user['user_id'],
                        u'sheet_budget': data["sheet_budget"],
                        u'sheet_id': sheet_id,
                        u'date_created':data['date_created']
                    })
                responseObj = {
                        'sheet_name': data["sheet_name"],
                        'user_id': user['user_id'],
                        'sheet_budget': data["sheet_budget"],
                        'sheet_id': sheet_id,
                        'date_created':data['date_created']
                    }
                return (json.dumps(responseObj), 201) 
            else:
                return ('Bad request', 400)
        except: 
            return ('Internal server error', 503)

if __name__ == "__main__":
    #Run the flask server on port 8080
    app.run(debug = True, host = '0.0.0.0', port = 8080)