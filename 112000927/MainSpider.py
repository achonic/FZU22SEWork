
from bs4 import BeautifulSoup
from CommonFunction import requests_page
import pandas as pd


#excel文件链接
TodayAsymptomaticCases_Datafile = 'E:\ProgramProjects\python\homework\三十一个省市新增无症状感染者.xlsx'
TodayProvinceNewCases_DataFlie = 'E:\ProgramProjects\python\homework\三十一个省市每日新增确诊.xlsx'
HMTNewcases_Datafile = 'E:\ProgramProjects\python\homework\港澳台每日新增确诊.xlsx'
epidemicPosters_links_file = 'E:\ProgramProjects\python\homework\每日疫情报告链接.xlsx'

# 四个dataframe 读取自excel
df = pd.read_excel(epidemicPosters_links_file)
dfNewCases = pd.read_excel(TodayProvinceNewCases_DataFlie, index_col=0)

dfNewAsymptomaticCases = pd.read_excel(TodayAsymptomaticCases_Datafile, index_col=0)
dfHMTNewCases = pd.read_excel(HMTNewcases_Datafile, index_col=0)


#疫情报告链接的总行数
nrows = df.shape[0]

#31个省市自治区 直辖市
provinces = ['河北', '山西', '辽宁', '吉林', '黑龙江', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '海南', '四川'
    , '贵州', '云南', '陕西', '甘肃', '青海', '内蒙古', '广西', '西藏', '宁夏', '新疆', '北京', '天津', '上海', '重庆']
#港澳台
HMT = ['香港特别行政区', '澳门特别行政区', '台湾地区']
NextCases = []

# 得到该省的当天新增确诊人数
def GetTheCases(CasesText, province, LocalcasesNum):
    CasesNumber = ""
    TempPro = ""

    prolen = len(province)
    textlen = len(CasesText)

    #          遍历文本 找出新增确诊人数
    for i in range(0, textlen - prolen + 1):
        for j in range(i, i + prolen):
            TempPro += CasesText[j]
        if TempPro == province:  # 如果当前字符串与所要查询的省份匹配
            i += prolen  # 将下标指向数字
            if i < textlen:
                while CasesText[i] >= '0' and CasesText[i] <= '9':
                    CasesNumber += CasesText[i]
                    i += 1
            if CasesNumber == "":
                CasesNumber = LocalcasesNum
            break
        TempPro = ""
    return CasesNumber  # 返回该省的当天新增确诊人数


def HandleContentData(Pagei, soup):
    #  获取段落
    list = soup.find_all('p')

    item = ""

    # 新增本土确诊病例
    for i in list:
        if i.text != "":
            item = i
            break
    s = item.text
    NewCases_Text = ""
    TodayNewCases = []
    casesNum = ""

    for i in range(0, len(s) - 3):
        local = ""
        local += s[i] + s[i + 1] + s[i + 2] + s[i + 3]
        if local == "本土病例":
            i += 4

            # 新冠疫情报告最新格式
            if s[i] >= '0' and s[i] <= '9':
                while s[i] != "例":
                    casesNum += s[i]
                    i += 1
                # 本土新增文本提取
                while s[i] != "（":
                    i += 1
                while s[i] != "）":
                    NewCases_Text += s[i]
                    i += 1
                break
            # 新冠疫情报告旧格式
            else:
                textpos = i
                i -= 3
                while s[i] >= '0' and s[i] <= '9':
                    casesNum += s[i]
                    i -= 1
                casesNum = casesNum[::-1]

                i = textpos
                # 本土新增文本提取
                while s[i] != "（":
                    i += 1
                while s[i] != "）":
                    NewCases_Text += s[i]
                    i += 1
                break

    TodayNewCases.append(casesNum)
    # 获取该页报告的31省市自治区的新增确诊病例
    for i in range(0, 31):
        TodayNewCases.append(GetTheCases(NewCases_Text, provinces[i], casesNum))
    dfNewCases.loc[df.iloc[Pagei+1, 1], :] = TodayNewCases



    # 新增本土无症状感染者
    flag = 0
    s = ""
    for i in list:
        if i.text == "":
            continue
        temp_s = i.text
        for j in range(0, len(temp_s) - 5):
            temp = temp_s[j] + temp_s[j+1] + temp_s[j+2] + temp_s[j+3] + temp_s[j+4]
            if temp == "新增无症状":
                s = temp_s
                flag = 1
                break
        if flag == 1:
            break


    NewAsymptomaticases_Text = ""
    TodayNewAsymptomaticCases = []
    AsymptomaticCasesNum = ""
    for i in range(0, len(s) - 1):
        local = ""
        local += s[i] + s[i + 1]
        if local == "本土":
            i += 2
            # 新冠疫情报告最新格式
            if s[i] >= '0' and s[i] <= '9':
                while s[i] != "例":
                    AsymptomaticCasesNum += s[i]
                    i += 1
                # 本土新增文本提取
                while s[i] != "（":
                    i += 1
                while s[i] != "）":
                    NewAsymptomaticases_Text += s[i]
                    i += 1
                break
    TodayNewAsymptomaticCases.append(AsymptomaticCasesNum)
    # 获取该页报告的31省市自治区的新增确诊病例
    for i in range(0, 31):
        TodayNewAsymptomaticCases.append(GetTheCases(NewAsymptomaticases_Text, provinces[i], AsymptomaticCasesNum))
    dfNewAsymptomaticCases.loc[df.iloc[Pagei+1, 1], :] = TodayNewAsymptomaticCases

    #港澳台新增确诊
    #  由于港澳台卫健委官网仅统计总确诊病例，所以采用当天减前一天表示新增确诊人数
    HMTTotalcases = []
    DeltaCases = []
    flag = 0
    s = ""
    for i in list:
        if i.text == "":
            continue
        temp_s = i.text
        for j in range(0, len(temp_s) - 5):
            temp = temp_s[j] + temp_s[j + 1] + temp_s[j + 2]
            if temp == "港澳台":
                s = temp_s
                flag = 1
                break
        if flag == 1:
            break
    for i in range(0, 3):
        HMTTotalcases.append(GetTheCases(s, HMT[i], None))

    if Pagei != 281:
        for i in range(0, 3):
            DeltaCases.append(str(int(NextCases[i]) - int(HMTTotalcases[i])))
        dfHMTNewCases.loc[df.iloc[Pagei, 1], :] = DeltaCases
    NextCases.clear()
    for i in range(0, 3):
        NextCases.append(HMTTotalcases[i])



#  获取并处理 从开始到现在 的疫情报告
def Deal_epidemicDaysList(i):
    url = df.iloc[i, 2]  # 读取0 ~ 976所有页面的报告
    html = None
    while html is None:
        html = requests_page(url)
    soup = BeautifulSoup(html, 'lxml')
    title = soup.find(class_='tit').text
    if title[0] == '截':
        HandleContentData(i, soup)

    # 写入Excel
    dfNewCases.to_excel(TodayProvinceNewCases_DataFlie)
    dfNewAsymptomaticCases.to_excel(TodayAsymptomaticCases_Datafile)
    dfHMTNewCases.to_excel(HMTNewcases_Datafile)

    print("已成功爬取至第" + str(i) +"份报告")

def main():
    #  获取并处理 从开始到现在 的疫情报告列表
    for i in range(281, nrows+1):
        Deal_epidemicDaysList(i)


if __name__ == "__main__":
    main()
