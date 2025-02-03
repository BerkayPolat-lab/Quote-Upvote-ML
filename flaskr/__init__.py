from flask import Flask, request, jsonify
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pickle
import numpy as np

app = Flask(__name__)

with open("../quote_upvote/quotes.pkl", "rb") as f:
    quotes = pickle.load(f)

with open("../quote_upvote/similarity_matrix.pkl", "rb") as f:
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
    if not request.is_json:
        return jsonify({"error": "Invalid Content-Type. Expected application/json."}), 415
    data = request.get_json()
    liked_quote_index = data.get("likedQuoteIndex")
    print(liked_quote_index)
    
    if liked_quote_index is None:
        return jsonify({"error": "likedQuoteIndex is required"}), 400

    recommended_quote = recommend_similar_quote(liked_quote_index)
    print(jsonify(recommended_quote))
    return jsonify(recommended_quote)


if __name__ == '__main__':
    app.run(debug=True)
