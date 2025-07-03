# backend/camembert_classifier.py

import sys
import torch
from transformers import CamembertTokenizer, CamembertForSequenceClassification

# Charger le modèle CamemBERT entraîné pour la classification (à adapter si non fine-tuné)
model_name = "camembert-base"
tokenizer = CamembertTokenizer.from_pretrained(model_name)
model = CamembertForSequenceClassification.from_pretrained(model_name, num_labels=5)

def classify(text):
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        logits = model(**inputs).logits
        predicted_class = torch.argmax(logits).item() + 1  # pour avoir de 1 à 5
    return predicted_class

if __name__ == "__main__":
    input_text = sys.argv[1]
    urgency = classify(input_text)
    print(urgency)
