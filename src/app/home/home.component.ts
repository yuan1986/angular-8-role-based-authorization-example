import { Component } from '@angular/core';
import { AuthenticationService } from '@app/services';
import { Router } from '@angular/router';
import { EChartOption } from 'echarts';
import { RestService } from '@app/services/rest.service';
import { Url } from '@app/helpers/url.enum';
import { environment } from '@environments/environment';
import { keys, each, find, values, union } from 'lodash';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
  constructor(
    private router: Router,
    private restApi: RestService,
    private authenticationService: AuthenticationService
  ) {}

  tabNum = 1;
  rankLengendTextList: Array<string>;
  accessOption: EChartOption;
  turnoverOption: EChartOption;
  salesOption: EChartOption;
  rankOption: EChartOption;
  pvOption: EChartOption;
  retentionOption: EChartOption;

  public tabClick(v: number): void {
    this.tabNum = v;
    this.getRankOption(v);
  }

  getPvOption() {
    this.restApi
      .get<any>(`${environment.apiUrl}${Url.getPvInfo}`)
      .subscribe(r => {
        // tslint:disable-next-line: one-variable-per-declaration
        const views = [0],
          removeCarts = [0],
          purchases = [0],
          carts = [0];

        each(values(r.returnData), v => {
          const view = find(v, { eventType: 'view' });
          const removeCart = find(v, { eventType: 'remove_from_cart' });
          const purchase = find(v, { eventType: 'purchase' });
          const cart = find(v, { eventType: 'cart' });

          if (!!view) {
            views.push(view);
          }
          if (!!removeCart) {
            removeCarts.push(removeCart);
          }
          if (!!purchase) {
            purchases.push(purchase);
          }
          if (!!cart) {
            carts.push(cart);
          }
        });

        this.pvOption = {
          title: {
            fontSize: 20,
            color: 'rgba(0,0,0,0.85)',
            text: 'PV构成情况',
            left: 40,
            top: 20
          },
          color: ['#5B8FF9', '#5AD8A6', '#5D7092', '#F6BD16'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            top: 20,
            right: 50,
            data: ['添加购物车', '购买', '从购物车移除', '查看']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: keys(r.returnData)
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              barWidth: 10,
              name: '添加购物车',
              type: 'bar',
              stack: 'pv',
              itemStyle: {
                normal: {
                  borderColor: '#fff'
                  // topborderWidth: 2,
                }
              },
              data: carts
            },
            {
              barWidth: 10,
              name: '购买',
              type: 'bar',
              stack: 'pv',
              itemStyle: {
                normal: {
                  borderColor: '#fff'
                  // topborderWidth: 2,
                }
              },
              data: purchases
            },
            {
              barWidth: 10,
              name: '从购物车移除',
              type: 'bar',
              stack: 'pv',
              itemStyle: {
                normal: {
                  borderColor: '#fff'
                  // topborderWidth: 2,
                }
              },
              data: removeCarts
            },
            {
              barWidth: 10,
              name: '查看',
              type: 'bar',
              stack: 'pv',
              itemStyle: {
                normal: {
                  borderColor: '#fff'
                  // topborderWidth: 2,
                }
              },
              data: views
            }
          ]
        };
      });
  }

  getRetentionOption() {
    this.restApi
      .post<any>(`${environment.apiUrl}${Url.getTrend}`, { conditions: [1, 7] })
      .subscribe(r => {
        // tslint:disable-next-line: one-variable-per-declaration
        const day1 = [],
          day7 = [];
        values(r.returnData[1]).forEach(v => {
          day1.push(v.substr(0, v.length - 1));
        });
        values(r.returnData[7]).forEach(v => {
          day7.push(v.substr(0, v.length - 1));
        });
        this.retentionOption = {
          color: ['#5B8FF9', '#5AD8A6'],
          title: {
            text: '留存率',
            left: 40,
            top: 20
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            top: 20,
            right: 50,
            data: ['当日留存率', '七日留存率']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: union(keys(r.returnData[1]), keys(r.returnData[7]))
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              name: '当日留存率',
              type: 'line',
              stack: '总量',
              data: day1,
              symbol: 'circle',
              lineStyle: { color: '#5B8FF9' }
            },
            {
              name: '七日留存率',
              type: 'line',
              stack: '总量',
              data: day7,
              symbol: 'circle',
              lineStyle: { color: '#5AD8A6' }
            }
          ]
        };
      });
  }

  getAccessOption() {
    combineLatest(
      this.restApi.post<any>(`${environment.apiUrl}${Url.getUserUvView}`, {}),
      this.restApi.post<any>(`${environment.apiUrl}${Url.getUserPvView}`, {})
    ).subscribe(r => {
      // tslint:disable-next-line: one-variable-per-declaration
      const xData = [0],
        Uvs = [0],
        Pvs = [0];
      each(r[0].returnData.userVisitTrendList, v => {
        xData.push(v.countDate);
        Uvs.push(v.num);
      });

      each(r[1].returnData.userVisitTrendList, v => {
        Pvs.push(v.num);
      });

      this.accessOption = {
        color: ['#5B8FF9', '#5AD8A6'],
        title: {
          text: 'UV/PV访问趋势',
          left: 40,
          top: 20
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          top: 20,
          right: 50,
          data: ['UV', 'PV']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },

        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: xData
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'UV',
            type: 'line',
            stack: '总量',
            data: Uvs,
            symbol: 'circle',
            lineStyle: { color: '#5B8FF9' }
          },
          {
            name: 'PV',
            type: 'line',
            stack: '总量',
            data: Pvs,
            symbol: 'circle',
            lineStyle: { color: '#5AD8A6' }
          }
        ]
      };
    });
  }

  getTurnoverOption() {
    this.restApi
      .get<any>(`${environment.apiUrl}${Url.getSells}`)
      .subscribe(r => {
        const categoryCodes = [],
          datas = [];
        let sellTotal = 0;
        each(r.returnData, v => {
          categoryCodes.push(v.categoryCode);
          datas.push({
            value: +v.sellTotal.toFixed(),
            name: v.categoryCode
          });
          sellTotal = sellTotal + parseInt(v.sellTotal.toFixed(), 10);
        });

        this.turnoverOption = {
          color: ['#5AD8A6', '#5B8FF9', '#5D7092', '#F6BD16', '#833080'],
          title: {
            text: '成交额',
            left: 20,
            top: 20,
            textStyle: {
              color: '#000',
              fontSize: 20
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
          },
          legend: {
            type: 'scroll',
            orient: 'vertical',
            right: '1%',
            bottom: '15%',
            data: categoryCodes,
            formatter: (item, ticket, callback) => {
              if (item.length > 6) {
                return (
                  item.substr(0, 6) + '...' + item.substring(item.length - 6)
                );
              }
              return item;
            }
          },
          graphic: [
            {
              type: 'text',
              left: 'center',
              top: '40%',
              style: {
                text: '总成交(元)',
                textAlign: 'center',
                fill: '#000',
                fontSize: 16
              }
            },
            {
              type: 'text',
              left: 'center',
              top: '50%',
              style: {
                text: sellTotal,
                textAlign: 'center',
                fill: '#000',
                fontSize: 32
              }
            }
          ],
          series: [
            {
              name: '成交额',
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'inside',
                fontSize: 12,
                color: '#2C3542'
              },
              emphasis: {
                label: {
                  show: true
                }
              },
              labelLine: {
                show: false
              },
              data: datas
            }
          ]
        };
      });
  }

  getSalesOption() {
    this.restApi
      .get<any>(`${environment.apiUrl}${Url.getSellCnts}`)
      .subscribe(r => {
        const categoryCodes = [],
          datas = [];
        let sellTotal = 0;
        each(r.returnData, v => {
          categoryCodes.push(v.categoryCode);
          datas.push({
            value: +v.sellCnt.toFixed(),
            name: v.categoryCode
          });
          sellTotal = sellTotal + parseInt(v.sellCnt.toFixed(), 10);
        });

        this.salesOption = {
          color: ["#5AD8A6", "#5B8FF9", "#5D7092", "#F6BD16", "#833080"],
          title: {
            text: "销售额",
            left: 20,
            top: 20,
            textStyle: {
              color: "#000",
              fontSize: 20
            }
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {c} ({d}%)"
          },
          legend: {
            type: "scroll",
            orient: "vertical",
            right: "1%",
            bottom: "15%",
            data: categoryCodes,
            formatter: (item, ticket, callback) => {
              if (item.length > 6) {
                return (
                  item.substr(0, 6) + "..." + item.substring(item.length - 6)
                );
              }
              return item;
            }
          },
          graphic: [
            {
              type: "text",
              left: "center",
              top: "40%",
              style: {
                text: "总成交(元)",
                textAlign: "center",
                fill: "#000",
                fontSize: 16
              }
            },
            {
              type: "text",
              left: "center",
              top: "50%",
              style: {
                text: sellTotal,
                textAlign: "center",
                fill: "#000",
                fontSize: 32
              }
            }
          ],
          series: [
            {
              name: "销售额",
              type: "pie",
              radius: ["40%", "70%"],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: "inside",
                fontSize: 12,
                color: "#2C3542"
              },
              emphasis: {
                label: {
                  show: true
                }
              },
              labelLine: {
                show: false
              },
              data: datas
            }
          ]
        };
      });
  }

  getRankOption(tabId) {
    let topUrl = '';

    if (tabId === 1) {
      topUrl = Url.getProductPurchase;
    } else if (tabId === 2) {
      topUrl = Url.getProductView;
    } else {
      topUrl = Url.getProductAddCart;
    }

    this.restApi
      .post<any>(`${environment.apiUrl}${topUrl}`, {})
      .subscribe(r => {
        const legendTextList = [];
        const dataList = [];
        for (const i of r.returnData) {
          legendTextList.push(i.productName);
          dataList.push(i.statNum);
        }
        this.rankLengendTextList = legendTextList;
        this.rankOption = {
          style: {
            height: 830
          },

          // backgroundColor: 'black',
          tooltip: {
            trigger: 'axis'
          },
          grid: {
            height: 830,
            top: '0%',
            left: '3%',
            right: '11%',
            bottom: '0%',
            containLabel: true
          },
          yAxis: [
            {
              show: false,
              type: 'category',
              data: legendTextList,
              inverse: true,
              axisTick: {
                alignWithLabel: true
              },
              axisLabel: {
                margin: 10,
                textStyle: {
                  fontSize: 18
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#2548ac'
                }
              }
            }
          ],
          xAxis: [
            {
              show: false,
              type: 'value',
              axisLabel: {
                margin: 10,
                interval: 1, // 横轴信息全部显示
                rotate: -30, // -15度角倾斜显示
                textStyle: {
                  fontSize: 18,
                  color: 'white'
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#192469'
                }
              },
              splitLine: {
                lineStyle: {
                  color: '#17367c'
                }
              }
            }
          ],
          series: [
            {
              name: 'Top 20',
              type: 'bar',
              barWidth: 10,
              data: dataList,
              label: {
                normal: {
                  show: true,
                  position: 'left',
                  textStyle: {
                    color: '#999999', // color of value
                    fontSize: 18
                  }
                }
              },
              itemStyle: {
                normal: {
                  color: '#5B8FF9'
                }
              }
            }
          ]
        };
      });
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  getNewData() {
    const isOk = window.confirm(
      '重新分析日志数据将耗费比较长的时间，请确认是否要重新查询数据？'
    );
    if (isOk) {
      this.restApi
        .get<any>(`${environment.apiUrl}${Url.getRequeryDatas}`)
        .subscribe(r => {
          debugger;
        });
    }
  }

  init() {
    this.getAccessOption();
    this.getPvOption();
    this.getRetentionOption();
    this.getTurnoverOption();
    this.getSalesOption();
    this.getRankOption(this.tabNum);
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit() {
    this.init();
  }
}
