from flask import Flask, request, jsonify
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pickle
import numpy as np
#from quote_upvote.models import Quote

app = Flask(__name__)

with open("./quote_upvote/quotes.pkl", "rb") as f:
    quotes = pickle.load(f)

with open("./quote_upvote/similarity_matrix.pkl", "rb") as f:
    similarity_matrix = pickle.load(f)

def recommend_similar_quote(liked_quote_index):
    print("Quote Index:", liked_quote_index)
    similarity_row = similarity_matrix[liked_quote_index].toarray().flatten()
    similar_indices = np.argsort(similarity_row)[::-1] ## indexing: [start:stop:step]

    similar_quote = [quotes[i]['quote'] for i in similar_indices if i != liked_quote_index]
    similar_quote_author = [quotes[i]['author'] for i in similar_indices if i != liked_quote_index]
    returned_object = {'quote': similar_quote[0], 'author': similar_quote_author[0]}
    return returned_object


@app.route('/similar-quote', methods=['POST'])
def similar_quote():
    data = request.json
    liked_quote_index = data.get("likedQuoteIndex")
    
    # Validate the index (if needed)
    if liked_quote_index is None:
        return jsonify({"error": "likedQuoteIndex is required"}), 400

    recommended_quote = recommend_similar_quote(liked_quote_index)
    # Use the result.pkl data to fetch the recommended quote and its author
    # Assuming the result.pkl contains a structure like:
    # {"quote": "Recommended Quote", "author": "Recommended Author"}
    return jsonify(recommended_quote)

if __name__ == '__main__':
    app.run(debug=True)
