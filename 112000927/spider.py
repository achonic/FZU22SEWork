import time

import requests
from bs4 import BeautifulSoup
from CommonFunction import requests_page
import pandas as pd

epidemicPosters_links_file = 'E:\ProgramProjects\python\homework\每日疫情报告链接.xlsx'
#创建一个新的表格

data1 = []
data2 = []
def HandleContentData(soup):


    list = soup.find(class_='list').find_all('li')
    for item in list:
        item_name = item.find(class_='ml').string
        item_href = 'http://www.nhc.gov.cn' + item.select("a")[0]["href"]
        print(item_href)
        print(item_name)
        data1.append(item_name)
        data2.append(item_href)

def write_Data_To_Excel():
    writer = pd.ExcelWriter(epidemicPosters_links_file)
    data = {"日期：": data1, "每日疫情报告链接：": data2}
    sheetNames = data.keys()
    data = pd.DataFrame(data)
    for sheetName in sheetNames:
        data.to_excel(writer, sheet_name=sheetName)
    writer.save()
    print("Done")


#  获取并处理 从开始到现在 的疫情报告目录列表
def Deal_EpidemicDaysList():
    url = 'http://www.nhc.gov.cn/xcs/yqtb/list_gzbd'
    html = None
    while html is None:
        html = requests_page(url)
    soup = BeautifulSoup(html, 'lxml')
    HandleContentData(soup)

    for i in range(2, 42):
        url = 'http://www.nhc.gov.cn/xcs/yqtb/list_gzbd_' + str(i)
        html = None
        while html is None:
            html = requests_page(url)

        soup = BeautifulSoup(html, 'lxml')
        HandleContentData(soup)
    write_Data_To_Excel()



