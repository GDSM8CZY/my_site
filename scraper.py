import requests
from bs4 import BeautifulSoup

url = "https://dcc.dickinson.edu/latin-core-list1"

response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')

for tr in soup.find_all('tr')[1:]:
    cols = tr.find_all('td')
    out = ",".join([item.text.strip().replace(",", "#") for item in cols])
    # Save latin words with definitions to a csv file
    with open("static/data/latin_core_vocabulary_list1.csv", "a", encoding="utf-8") as f:
        f.write(out + "\n")