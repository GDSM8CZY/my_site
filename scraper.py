import requests
from bs4 import BeautifulSoup

url = "https://dcc.dickinson.edu/latin-core-list1"

response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')

for tr in soup.find_all('tr')[1:]:
    cols = tr.find_all('td')
    latin_word = cols[0].text.strip()
    # split latin word by spaces and take the first part
    latin_word = latin_word.split()[0]
    latin_word = latin_word.replace(",", "")
    # Save latin words with definitions to a csv file
    with open("static/data/latin_core_vocabulary_list1.csv", "a", encoding="utf-8") as f:
        if len(latin_word) >= 4 and len(latin_word) <= 7:
            f.write(f"{latin_word}\n")