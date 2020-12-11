'''
Microservice to handle
user registration and login
'''

# Import statements
import uuid
from flask import Flask, request
from google.cloud import firestore
from  werkzeug.security import generate_password_hash, check_password_hash
import json
import jwt 
from flask_cors import CORS, cross_origin

# Config flask app and firestore client
app = Flask(__name__)
CORS(app)
db = firestore.Client()

# /user endpoint to handle GET and POST requests
@app.route('/user',methods = ['POST', 'GET'])
def user_endpoint():
    # Handle user login
    if request.method == 'GET':
        try:
            args = request.args
            if args:
                email = args['email']
                password=args['password']
                docs = db.collection(u'cloud_expense_users').where(u'email', u'==', email).stream()
                user={}
                for doc in docs:
                    user = doc.to_dict()
                if user == {}: 
                    return ('User does not exist', 401)
                elif check_password_hash(user['password'], password):
                    token = jwt.encode({ 
                        'user':user
                    }, "decode") 
                    return (json.dumps({'token' : token.decode('UTF-8')}), 200) 
                else:
                    return ('Wrong Password', 401) 
            else:
                return ('Bad request', 400)
        except:
            return ('Internal server error', 503)

    # Handle user registration
    if request.method == 'POST':
        try:
            data = request.get_json()
            if data:
                email = data['email']
                password = data['password']
                full_name = data['full_name']
                user_id = str(uuid.uuid4())
                docs = db.collection(u'cloud_expense_users').where(u'email', u'==', email).stream()
                user_exists = {}
                for doc in docs:
                    user_exists = doc.to_dict()
                if user_exists == {}:  
                    user = db.collection(u'cloud_expense_users').add({
                        u'email': email,
                        u'password': generate_password_hash(password),
                        u'user_name': full_name,
                        u'user_id': user_id,
                    })
                    return ('User Registered Successfully', 201)
                else: 
                    return ('User already exists. Please Log in.', 202,)
            else:
                return ('Bad request', 400)
        except:
            return ('Internal server error', 503)

if __name__ == "__main__":
    #Run the flask server on port 8080
    app.run(debug = True, host = '0.0.0.0', port = 8080)