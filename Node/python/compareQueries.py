import spacy
from nltk.corpus import wordnet
import sys
import json

nlp = spacy.load('en_core_web_sm')


def process_text(text):
    doc = nlp(text.lower())
    result = []
    for token in doc:
        if token.text in nlp.Defaults.stop_words:
            continue
        if token.is_punct:
            continue
        if token.lemma_ == '-PRON-':
            continue
        result.append(token.lemma_)
    return " ".join(result)


def calculate_similarity(text1, text2):
    base = nlp(process_text(text1))
    compare = nlp(process_text(text2))
    return base.similarity(compare)


text = sys.argv[1]
textList = json.load(sys.stdin)

for query in textList:
    sim = calculate_similarity(text, query)
    if sim > 0.75:
        print(query)
        print('matched')
        break
    else:
        continue
print('bye')
sys.stdout.flush()
