from transformers import CamembertTokenizer, CamembertModel
import torch

tokenizer = CamembertTokenizer.from_pretrained("camembert-base")
model = CamembertModel.from_pretrained("camembert-base")

inputs = tokenizer("Ceci est un test", return_tensors="pt")
outputs = model(**inputs)
print(outputs.last_hidden_state.shape)
