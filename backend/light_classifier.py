# light_classifier.py
import sys

def classify(text):
    text = text.lower()
    if "urgent" in text or "payer" in text or "impôts" in text:
        return 1
    if "rendez-vous" in text or "rdv" in text or "réunion" in text:
        return 2
    if "préparer" in text or "envoyer" in text or "réviser" in text:
        return 3
    if "lire" in text or "écrire" in text or "organiser" in text:
        return 4
    return 5

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(3)
        sys.exit(0)

    text = sys.argv[1]
    urgency = classify(text)
    print(urgency)
