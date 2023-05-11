from flask import Flask, request, make_response, jsonify, send_file
import os 
import subprocess

from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024 # 16 MB limit
app.config['UPLOAD_FOLDER'] = "./uploads"

@app.route("/", methods = ["GET", "POST"])
def home():
    if request.method == "GET":
        return make_response("Hello", 200)
    else:
        return make_response("Invalid request", 400)


@app.route("/results", methods = ["GET"])
def get_results():
    if request.method == "GET":
        # Mapping
        subprocess.call(['python', '.\\model\\mapper.py'])
        # return make_response(, 200)
        if not os.path.exists('.\\uploads\\results.png'):
            return make_response("Results is not availabe currently", 400)
        return send_file('.\\uploads\\results.png')
    else:
        return make_response("Invalid request", 400)


@app.route("/upload", methods = ["POST"])
def upload_img():
    # check if file present
    if len(request.files) != 2:
        return make_response(jsonify({"error": "Invalid request"}), 400)
    
    imgs = request.files
    if not (allowed_file(imgs['image1'].filename) and allowed_file(imgs['image2'].filename)):
        return make_response(jsonify({"error": "File should be image of '.tif' format"}), 400)


    # save file
    imgs['image1'].save(os.path.join(app.config['UPLOAD_FOLDER'], imgs['image1'].filename))
    imgs['image2'].save(os.path.join(app.config['UPLOAD_FOLDER'], imgs['image2'].filename))

    return make_response(jsonify({"message": "File uploaded successfully"}), 200)


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {"tif"} 

if __name__ == "__main__":
    app.run()