import os
import uuid
from flask import Flask, request, Response
from google.cloud import firestore
from  werkzeug.security import generate_password_hash, check_password_hash
import json
import jwt 

app = Flask(__name__)
db = firestore.Client()
SECRET_KEY="Authentication Secret Goes Here"

@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/user',methods = ['POST', 'GET','OPTIONS'])
def user_endpoint():
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)
    headers={'Access-Control-Allow-Origin': '*',}
    if request.method == 'GET':
        args=request.args
        email=args['email']
        password=args['password']
        docs=db.collection(u'cloud_expense_users').where(u'email', u'==', email).stream()
        user={}
        for doc in docs:
            user=doc.to_dict()
        if user=={}: 
            return ('User does not exist', 401, headers)
        elif check_password_hash(user['password'], password):
            token = jwt.encode({ 
                'user':user
            }, SECRET_KEY) 
            return (json.dumps({'token' : token.decode('UTF-8')}), 200,headers) 
        else:
            return ('Wrong Password', 403, headers) 

    if request.method == 'POST':
        data=request.get_json()
        email=data['email']
        password=data['password']
        full_name=data['full_name']
        user_id = str(uuid.uuid4())
        #check if user exists
        docs=db.collection(u'cloud_expense_users').where(u'email', u'==', email).stream()
        user_exists={}
        for doc in docs:
            user_exists=doc.to_dict()
        #if not then create
        if user_exists=={}:  
            user = db.collection(u'cloud_expense_users').add({
                u'email': email,
                u'password': generate_password_hash(password),
                u'user_name': full_name,
                u'user_id': user_id,
            })

            return ('User Registered Successfully', 201, headers)
        #else erorr
        else: 
            return ('User already exists. Please Log in.', 202, headers)



if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=8080)