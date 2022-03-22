from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
from nltk.stem import WordNetLemmatizer
from nltk.corpus import wordnet
import nltk
import sys
import time
import json

lemmatizer = WordNetLemmatizer()

options = Options()
options.add_argument('--headless')
options.add_argument('--disable-gpu')
driver = webdriver.Chrome("C:/Users/rudra/Downloads/chromedriver_win32/chromedriver.exe")
# driver.get("https://relatedwords.org/relatedto/Machine")
driver.get("https://relatedwords.org/relatedto/" + sys.argv[1])

words = []
fwords = []

html = driver.page_source
soup = BeautifulSoup(html, 'html.parser')
mydivs = soup.find("div", {"class": "words"})
for a in mydivs.findAll("a", {"class": "item"}):
    words.append(a.get_text())

driver.quit()
# nltk.download('wordnet')
# nltk.download('omw-1.4')
for w in words:
    if(' ' in w):
        fwords.append(w)
    else:
        fwords.append(lemmatizer.lemmatize(w, pos="v"))
fwords = list(dict.fromkeys(fwords))
string = ','.join(map(str, fwords))

with open('./corpus/corpus.json', 'r') as f:
  data = json.load(f)

title = sys.argv[1]
title = title.replace('%20',' ')

dataToAdd = {
    'title': title,
    'words': string
}

data.append(dataToAdd)

with open('./corpus/corpus.json', 'w') as json_file:
  json.dump(data,json_file)
