import streamlit as st
from PIL import Image
import numpy as np
import tensorflow as tf

# Load the trained model
model = tf.keras.models.load_model('banana_classification.h5')

# Define class labels
class_labels = ["overripe", "ripe", "rotten", "unripe"]

# Streamlit app title and description
st.title("Banana Classification")
st.write("Upload a banana image to classify it into one of the categories: Overripe, Ripe, Rotten, or Unripe.")

# Image upload
uploaded_file = st.file_uploader("Choose a banana image...", type=["jpg", "png", "jpeg"])

if uploaded_file is not None:
    try:
        # Open the image
        img = Image.open(uploaded_file)
        st.image(img, caption="Uploaded Image", use_container_width=True)

        # Preprocess the image
        img = img.resize((224, 224))  # Resize image to match model input size
        img_array = np.array(img) / 255.0  # Normalize image array

        # Ensure image array has the correct shape
        if img_array.ndim == 2:  # Grayscale image
            img_array = np.expand_dims(img_array, axis=-1)
            img_array = np.repeat(img_array, 3, axis=-1)  # Convert grayscale to RGB
        elif img_array.shape[-1] != 3:  # If not RGB, convert to RGB
            img_array = img_array[..., :3]

        # Make prediction
        predictions = model.predict(np.expand_dims(img_array, axis=0))[0]

        predicted_class_index = np.argmax(predictions)
        predicted_class = class_labels[predicted_class_index]
        confidence = predictions[predicted_class_index]

        # Display the results
        st.subheader("Prediction")
        st.write(f"**Class:** {predicted_class}")
        st.write(f"**Confidence:** {confidence:.2f}")

    except Exception as e:
        st.error(f"An error occurred: {str(e)}")
