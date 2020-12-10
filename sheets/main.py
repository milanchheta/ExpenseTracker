from flask import Flask, request, Response
from google.cloud import firestore
import json
import jwt 
import uuid
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

db = firestore.Client()
SECRET_KEY="Authentication Secret Goes Here"

@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/sheets',methods = ['POST', 'GET'])
@cross_origin()
def sheet_endpoint(): 
    if request.method=='GET':
        args=request.args
        if args:
            user = jwt.decode(args['token'], SECRET_KEY)["user"]
            docs=db.collection(u'cloud_expense_sheets').where(u'user_id', u'==', user['user_id']).stream()
            sheets=[]
            for sheet in docs:
                sheets.append(sheet.to_dict())
            return (json.dumps(sheets), 200) 
        else:
            return ('Bad request', 400)


    if request.method == 'POST':
        data=request.get_json()
        if data:
            user = jwt.decode(data['token'], SECRET_KEY)["user"]
            sheet_id = str(uuid.uuid4())
            sheet = db.collection(u'cloud_expense_sheets').add({
                    u'sheet_name': data["sheet_name"],
                    u'user_id': user['user_id'],
                    u'sheet_budget': data["sheet_budget"],
                    u'sheet_id': sheet_id,
                    u'date_created':data['date_created']
                })
            responseObj={
                    'sheet_name': data["sheet_name"],
                    'user_id': user['user_id'],
                    'sheet_budget': data["sheet_budget"],
                    'sheet_id': sheet_id,
                    'date_created':data['date_created']
                }
            return (json.dumps(responseObj), 201) 
        else:
            return ('Bad request', 400)



if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=8080)