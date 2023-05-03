from flask import Flask, request, make_response, jsonify
import os 

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024 # 16 MB limit
app.config['UPLOAD_FOLDER'] = "./uploads"

@app.route("/", methods = ["GET", "POST"])
def home():
    if request.method == "GET":
        return make_response("Hello", 200)
    else:
        return make_response("Invalid request", 400)

@app.route("/upload", methods = ["POST"])
def upload_img():
    # check if file present
    if "image" not in request.files:
        return make_response(jsonify({"error": "No file attached"}), 400)
    
    img = request.files["image"]
    print('##filename: ', img.filename)
    if not allowed_file(img.filename):
        return make_response(jsonify({"error": "File should be image of '.tif' format"}), 400)

    # save file
    img.save(os.path.join(app.config['UPLOAD_FOLDER'], img.filename))

    return make_response(jsonify({"message": "File uploaded successfully"}), 200)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in {"tif"} 

if __name__ == "__main__":
    app.run()