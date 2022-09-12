from MainSpider import Deal_EpidemicPost
from spider import Deal_EpidemicDaysList
from DataCharts import DataVisual


def main():
    #  爬取并处理 从开始到现在 的疫情报告列表 并将得到的数据写入excel
    Deal_EpidemicDaysList()
    #  获取并处理 从开始到现在 的疫情报告
    Deal_EpidemicPost()
    # 可视化
    DataVisual()


if __name__ == "__main__":
    main()