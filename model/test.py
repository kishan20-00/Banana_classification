import requests

# Define URL of the Flask API
url = 'http://127.0.0.1:5005/predict'  # Replace with the actual URL where your Flask API is hosted

# Define path to the image file
image_path = 'images/test/unripe/musa-acuminata-freshunripe-1cb30cb6-2653-11ec-a56c-d8c4975e38aa_jpg.rf.8ac9dcb483e0b049f2d15f6ec6ab176e.jpg'  # Replace with the path to your image file

# Send POST request with the image file to the Flask API endpoint
with open(image_path, 'rb') as file:
    files = {'image': file}
    response = requests.post(url, files=files)

# Check if the request was successful
if response.status_code == 200:
    # Print the prediction result
    prediction = response.json()
    print("Predicted Class:", prediction['predicted_class'])
else:
    print("Error:", response.text)
