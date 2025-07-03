from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load model
model = joblib.load("ml_models/symptom_model.pkl")

# Feature columns used during training
symptom_keys = [
    "fever", "cough", "rash", "vomiting", "diarrhea",
    "difficulty_breathing", "poor_feeding", "seizures", "lethargy",
    "bulging_fontanelle", "irritability", "dehydration",
    "jaundice", "sneezing", "runny_nose"
]

# Medication mapping
medication_map = {
    "measles": ["Paracetamol", "Vitamin A", "Rest"],
    "bronchiolitis": ["Saline drops", "Nebulization", "Oxygen support"],
    "fever": ["Paracetamol", "Hydration", "Cool compress"],
    "diarrhea": ["ORS", "Zinc", "Probiotics"],
    "meningitis": ["IV Antibiotics", "Steroids", "Hospital care"],
    "allergy": ["Antihistamines", "Avoid triggers"],
    "sepsis": ["Broad-spectrum antibiotics", "IV fluids", "NICU"],
    "dehydration": ["ORS", "IV fluids", "Monitoring"],
    "common_cold": ["Saline nasal drops", "Humidifier", "Rest"],
    "encephalitis": ["Antivirals", "Seizure control meds", "Oxygen"],
    "neonatal_jaundice": ["Phototherapy", "Breastfeeding", "Hydration"]
}


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    input_symptoms = data.get("symptoms", "").lower().replace(" ", "").split(",")

    # Validate symptoms
    valid_set = set(symptom_keys)
    invalid = [s for s in input_symptoms if s not in valid_set]

    if invalid:
        return jsonify({
            "error": f"Invalid symptom(s) detected: {', '.join(invalid)}",
            "valid_symptoms": list(valid_set)
        }), 400

    # Create input vector and convert to DataFrame
    vector = [1 if s in input_symptoms else 0 for s in symptom_keys]
    input_df = pd.DataFrame([vector], columns=symptom_keys)

    # Predict
    prediction = model.predict(input_df)[0]
    medications = medication_map.get(prediction, ["Consult pediatrician"])

    return jsonify({
        "disease": prediction,
        "medications": medications
    })


if __name__ == "__main__":
    app.run(port=5001)
