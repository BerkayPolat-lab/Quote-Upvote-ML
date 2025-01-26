## Class Definition for Quote Model

class Quote:
    def __init__(self, quote, author, category):
        self.quote = quote
        self.author = author
        self.category = category
    def __repr__(self):
        return f"Quote(quote={self.quote}, author={self.author}, category={self.category})"