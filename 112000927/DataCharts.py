from pyecharts import options as opts
from pyecharts.charts import Map
import random
import pandas as pd

TodayProvinceNewCases_DataFlie = 'E:\ProgramProjects\python\homework\三十一个省市每日新增确诊.xlsx'
dfNewCases = pd.read_excel(TodayProvinceNewCases_DataFlie)
provinces = ['河北', '山西', '辽宁', '吉林', '黑龙江', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北', '湖南', '广东', '海南', '四川'
    , '贵州', '云南', '陕西', '甘肃', '青海', '内蒙古', '广西', '西藏', '宁夏', '新疆', '北京', '天津', '上海', '重庆']
cases = []


def create_china_map():
    '''
     作用：生成中国地图
    '''
    (
        Map()
        .add(
            series_name="疫情人数",
            data_pair=cases,
            maptype="china",
            is_map_symbol_show = False,
        )
        # 设置标题
        .set_global_opts(
            title_opts=opts.TitleOpts(title="中国地图"),
            visualmap_opts=opts.VisualMapOpts(max_=100, is_piecewise=True),
        )
        # 生成本地html文件
        .render("中国地图.html")
    )

def DataVisual():
    for i in range(2, 33):
        data = dfNewCases.iloc[0, i]
        cases.append([provinces[i-2], float(data)])
    print(cases)
    create_china_map()

