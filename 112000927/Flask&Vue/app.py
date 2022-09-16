from flask import Flask
from flask import render_template
from flask_cors import CORS
from jieba.analyse import extract_tags
import string

from ReadDataFromSheet import Get_Today_Province_Data
from ReadDataFromSheet import Get_Local_History
from ReadDataFromSheet import Get_Province_List
from flask import jsonify


app = Flask(__name__,static_folder='./static/static')
CORS(app)

@app.route('/getjson')
def hello_world5():
    data = Get_Today_Province_Data()
    print(data)
  #  data = [{'name': '上海', 'value': 5000.0}, {'name': '云南', 'value': 162.0}]
    return jsonify(data)

@app.route('/LocalNewCases')
def hello_world2():
    data = Get_Local_History()
    print(data)
  #  data = [{'name': '上海', 'value': 5000.0}, {'name': '云南', 'value': 162.0}]
    return jsonify(data)

@app.route('/provinceList')
def hello_world3():
    data = Get_Province_List()
    print(data)
  #  data = [{'name': '上海', 'value': 5000.0}, {'name': '云南', 'value': 162.0}]
    return jsonify(data)

@app.route('/')
def hello_world():
    return render_template('index.html')

if __name__ == '__main__':
    app.run()
