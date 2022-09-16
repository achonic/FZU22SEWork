import pandas as pd
import math

TodayProvinceNewCases_DataFlie = 'E:\ProgramProjects\python\homework\三十一个省市每日新增确诊.xlsx'
ProvinceList = 'E:\ProgramProjects\python\homework\三十一个省市新增无症状感染者.xlsx'
dfNewCases = pd.read_excel(TodayProvinceNewCases_DataFlie)
dfNewAsyCases = pd.read_excel(ProvinceList)
provinces = ['河北', '山西', '辽宁', '吉林', '黑龙江', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '海南', '四川'
    , '贵州', '云南', '陕西', '甘肃', '青海', '内蒙古', '广西', '西藏', '宁夏', '新疆', '北京', '天津', '上海', '重庆']

cases = []
localcases = []
provincelist = []

#     获取今日各省新增本土数据 并加载入中国地图中
def Get_Today_Province_Data():
    cases = []
    for i in range(2, 32):
        data = dfNewCases.iloc[0, i]
        if math.isnan(data) == True:
            data = 0
        cases.append({'name': provinces[i - 2], 'value': int(data)})
    return cases
#     获取新增本土历史数据 并加载入新增本土趋势折线图中
def Get_Local_History():
    localcases = []
    for i in range(1, 30):
        xdata = dfNewCases.iloc[i, 0]
        ydata = dfNewCases.iloc[i, 1]
        localcases.append({"name": xdata, "value": ydata})
    return localcases
#     获取各省新增本土，新增无症状感染者 插入table中
def Get_Province_List():
    provincelist = []
    for i in range(2, 32):
        data1 = dfNewCases.iloc[0, i]
        data2 = dfNewAsyCases.iloc[0, i]
        if math.isnan(data1) == True:
            data1 = 0
        if math.isnan(data2) == True:
            data2 = 0
        provincelist.append({'province': provinces[i - 2], 'newLocal': int(data1), 'newAsyLocal': int(data2)})
    return provincelist