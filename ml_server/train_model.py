# ml_server/train_model.py

import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

df = pd.read_csv('ml_models/newborn_symptom_data.csv')
X = df.drop('disease', axis=1)
y = df['disease']

model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X, y)

os.makedirs('ml_models', exist_ok=True)
joblib.dump(model, 'ml_models/symptom_model.pkl')
print("✅ Model saved!")
