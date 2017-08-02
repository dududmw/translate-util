# encoding: utf-8

from bottle import Bottle, run, abort
from bottle import request, response, redirect, template, static_file
import bottle
import parser
import json

app = Bottle()

def allow_cross_domain(fn):
    def _enable_cors(*args, **kwargs):
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'GET,POST,PUT,OPTIONS'
        allow_headers = 'Referer, Accept, Origin, User-Agent, Content-Type'
        response.headers['Access-Control-Allow-Headers'] = allow_headers
        if bottle.request.method != 'OPTIONS':
            return fn(*args, **kwargs)
    return _enable_cors

@app.route('/ping',method=['GET'])
def ping():
    return json.dumps({'errorCode':0,'data':'pong'})

@app.route('/syntactic_analysis',method=['OPTIONS', 'POST'])
@allow_cross_domain
def syntactic_analysis():
    text=request.json.get('text')
    data=parser.parse(text)
    result={'errorCode':0,'data':data}
    return json.dumps(result)
HOST_ID='0.0.0.0'
HOST_PORT='9001'
run(app,host=HOST_ID,port=HOST_PORT)