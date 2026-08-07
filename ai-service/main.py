from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline, AutoTokenizer, AutoModelForSeq2SeqLM

app = FastAPI(title="SmartPortfolio AI Engine")

print("Loading Hugging Face models...")
sentiment_analyzer = pipeline("sentiment-analysis", model="distilbert-base-uncased-finetuned-sst-2-english")

# Load model and tokenizer directly
model_name = "sshleifer/distilbart-cnn-12-6"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)


class DocumentPayload(BaseModel):
    text: str


@app.post("/analyze")
def analyze_document(payload: DocumentPayload):
    text = payload.text.strip()

    if not text:
        return {"error": "Empty text provided"}

    sentiment_result = sentiment_analyzer(text[:512])[0]

    # Tokenize and generate
    inputs = tokenizer(text[:1024], return_tensors="pt", max_length=1024, truncation=True)
    summary_ids = model.generate(inputs["input_ids"], max_length=60, min_length=15, do_sample=False)
    summary_text = tokenizer.decode(summary_ids[0], skip_special_tokens=True)

    return {
        "sentiment": sentiment_result["label"],
        "confidence": float(sentiment_result["score"]),
        "summary": summary_text
    }