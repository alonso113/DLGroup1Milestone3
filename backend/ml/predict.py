#!/usr/bin/env python3
"""
FIRE Score Prediction Script
Loads the trained DistilBERT model and returns FIRE score for article text
"""

import sys
import json
import torch
import os
import warnings
from transformers import AutoTokenizer, DistilBertForSequenceClassification
from transformers import logging as transformers_logging

# Suppress warnings from transformers
warnings.filterwarnings('ignore')
transformers_logging.set_verbosity_error()

def load_model(model_path):
    """Load the trained DistilBERT model"""
    try:
        # Model configuration from your notebook
        MODEL_NAME = 'distilbert-base-uncased'
        
        # Load the model architecture
        model = DistilBertForSequenceClassification.from_pretrained(
            MODEL_NAME,
            num_labels=2  # binary classification: fake (0) vs true (1)
        )
        
        # Load the trained weights
        state_dict = torch.load(model_path, map_location=torch.device('cpu'))
        model.load_state_dict(state_dict)
        model.eval()
        
        return model
    except Exception as e:
        print(json.dumps({"error": f"Failed to load model: {str(e)}"}), file=sys.stderr)
        sys.exit(1)

def preprocess_text(text, tokenizer, max_length=128):
    """
    Preprocess article text for DistilBERT model
    Uses the same preprocessing as your training notebook
    """
    encoding = tokenizer.encode_plus(
        text,
        add_special_tokens=True,
        max_length=max_length,
        padding='max_length',
        truncation=True,
        return_attention_mask=True,
        return_tensors='pt'
    )
    return encoding

def predict_fire_score(model, tokenizer, article_text):
    """
    Run inference using the trained DistilBERT model
    Returns FIRE score based on model's fake news prediction
    """
    try:
        # Preprocess text using DistilBERT tokenizer
        encoding = preprocess_text(article_text, tokenizer, max_length=128)
        
        # Move to CPU (or GPU if available)
        input_ids = encoding['input_ids']
        attention_mask = encoding['attention_mask']
        
        # Run inference
        with torch.no_grad():
            outputs = model(
                input_ids=input_ids,
                attention_mask=attention_mask
            )
            
            logits = outputs.logits
            probs = torch.softmax(logits, dim=1)
            
            # Get prediction: 0 = fake, 1 = true
            pred_class = torch.argmax(probs, dim=1).item()
            confidence = probs[0][pred_class].item()
            
            # Calculate FIRE score (0-100)
            # If model predicts FAKE (0), higher FIRE score (more risky)
            # If model predicts TRUE (1), lower FIRE score (less risky)
            if pred_class == 0:  # Fake news
                fire_score = int(50 + (confidence * 50))  # Range: 50-100
            else:  # True news
                fire_score = int(50 - (confidence * 50))  # Range: 0-50
        #TODO: scoring system doesnt really make sense: classification is purely binarr
        #yet end user sees both a overall score based on the classification and confidence score
        #and also the confidence score

        return {
            "overall_score": fire_score,
            "confidence": confidence
        }
    
    except Exception as e:
        return {
            "error": f"Prediction failed: {str(e)}"
        }

def main():
    """Main entry point"""
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No article text provided"}))
        sys.exit(1)
    
    # Get article text from command line argument
    article_text = sys.argv[1]
    
    # Path to the trained model (in the same directory as this script)
    model_path = os.path.join(os.path.dirname(__file__), "bestmodel_3_run5.pt")
    
    # Load tokenizer (same as used in training)
    MODEL_NAME = 'distilbert-base-uncased'
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    
    # Load model
    model = load_model(model_path)
    
    # Get prediction
    result = predict_fire_score(model, tokenizer, article_text)
    
    # Output JSON to stdout (Go will capture this)
    print(json.dumps(result))

if __name__ == "__main__":
    main()
