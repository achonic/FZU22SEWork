import requests
import time

def requests_page(url):
    headers = {
        'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
    }
    try:
        response = requests.get(url=url, headers=headers)

        if response.status_code == 200:
            print("success!")
            return response.content.decode()
        else:
      #      print("retry")
            time.sleep(1)
    except requests.requestException:
        return None
