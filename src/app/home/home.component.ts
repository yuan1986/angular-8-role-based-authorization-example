﻿import { Component } from "@angular/core";
import { AuthenticationService } from "@app/services";
import { Router } from "@angular/router";
import { EChartOption } from "echarts";
import { RestService } from "@app/services/rest.service";
import { Url } from "@app/helpers/url.enum";
import { environment } from "@environments/environment";
import { keys, each, find, values, union } from "lodash";
import { combineLatest } from "rxjs";
import { map } from "rxjs/operators";

@Component({ templateUrl: "home.component.html" })
export class HomeComponent {
  constructor(
    private router: Router,
    private restApi: RestService,
    private authenticationService: AuthenticationService
  ) {}

  accessOption: EChartOption;
  turnoverOption: EChartOption;
  rankOption: EChartOption;
  pvOption: EChartOption;
  retentionOption: EChartOption;

  getPvOption() {
    this.restApi
      .get<any>(`${environment.apiUrl}${Url.getPvInfo}`)
      .subscribe(r => {
        const views = [0],
          removeCarts = [0],
          purchases = [0],
          carts = [0];

        each(values(r.returnData), v => {
          const view = find(v, { eventType: "view" });
          const removeCart = find(v, { eventType: "remove_from_cart" });
          const purchase = find(v, { eventType: "purchase" });
          const cart = find(v, { eventType: "cart" });

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
            color: "rgba(0,0,0,0.85)",
            text: "PV构成情况",
            left: 40,
            top: 20
          },
          color: ["#5B8FF9", "#5AD8A6", "#5D7092", "#F6BD16"],
          tooltip: {
            trigger: "axis",
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          legend: {
            top: 20,
            right: 50,
            data: ["添加购物车", "购买", "从购物车移除", "查看"]
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
          },
          xAxis: [
            {
              type: "category",
              data: keys(r.returnData)
            }
          ],
          yAxis: [
            {
              type: "value"
            }
          ],
          series: [
            {
              barWidth: 10,
              name: "添加购物车",
              type: "bar",
              stack: "pv",
              itemStyle: {
                normal: {
                  borderColor: "#fff"
                  // topborderWidth: 2,
                }
              },
              data: carts
            },
            {
              barWidth: 10,
              name: "购买",
              type: "bar",
              stack: "pv",
              itemStyle: {
                normal: {
                  borderColor: "#fff"
                  // topborderWidth: 2,
                }
              },
              data: purchases
            },
            {
              barWidth: 10,
              name: "从购物车移除",
              type: "bar",
              stack: "pv",
              itemStyle: {
                normal: {
                  borderColor: "#fff"
                  // topborderWidth: 2,
                }
              },
              data: removeCarts
            },
            {
              barWidth: 10,
              name: "查看",
              type: "bar",
              stack: "pv",
              itemStyle: {
                normal: {
                  borderColor: "#fff"
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
        const day1 = [],
          day7 = [];
        values(r.returnData[1]).forEach(v => {
          day1.push(v.substr(0, v.length - 1));
        });
        values(r.returnData[7]).forEach(v => {
          day7.push(v.substr(0, v.length - 1));
        });
        debugger;

        this.retentionOption = {
          color: ["#5B8FF9", "#5AD8A6"],
          title: {
            text: "留存率",
            left: 40,
            top: 20
          },
          tooltip: {
            trigger: "axis"
          },
          legend: {
            top: 20,
            right: 50,
            data: ["当日留存率", "七日留存率"]
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true
          },
          xAxis: {
            type: "category",
            boundaryGap: false,
            data: union(keys(r.returnData[1]), keys(r.returnData[7]))
          },
          yAxis: {
            type: "value"
          },
          series: [
            {
              name: "当日留存率",
              type: "line",
              stack: "总量",
              data: day1,
              symbol: "circle",
              lineStyle: { color: "#5B8FF9" }
            },
            {
              name: "七日留存率",
              type: "line",
              stack: "总量",
              data: day7,
              symbol: "circle",
              lineStyle: { color: "#5AD8A6" }
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
        color: ["#5B8FF9", "#5AD8A6"],
        title: {
          text: "UV/PV访问趋势",
          left: 40,
          top: 20
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          top: 20,
          right: 50,
          data: ["UV", "PV"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },

        xAxis: {
          type: "category",
          boundaryGap: false,
          data: xData
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "UV",
            type: "line",
            stack: "总量",
            data: Uvs,
            symbol: "circle",
            lineStyle: { color: "#5B8FF9" }
          },
          {
            name: "PV",
            type: "line",
            stack: "总量",
            data: Pvs,
            symbol: "circle",
            lineStyle: { color: "#5AD8A6" }
          }
        ]
      };
    });
  }

  getTurnoverOption() {
    this.turnoverOption = {
      color: ["#5AD8A6", "#5B8FF9", "#5D7092", "#F6BD16", "#833080"],
      title: {
        text: "成交额",
        left: "left",
        top: 20,
        textStyle: {
          color: "rgba(0,0,0,0.85)",
          fontSize: 20
        }
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)"
      },
      legend: {
        orient: "vertical",
        right: 10,
        bottom: 180,
        data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"]
      },
      graphic: [
        {
          type: "text",
          left: "center",
          top: "40%",
          style: {
            text: "总成交",
            textAlign: "center",
            fill: "rgba(0,0,0,0.45)",
            fontSize: 12
          }
        },
        {
          type: "text",
          left: "41%",
          top: "50%",
          style: {
            text: "1430",
            textAlign: "center",
            fill: "rgba(0,0,0,85)",
            fontSize: 32
          }
        },
        {
          type: "text",
          left: "55%",
          top: "51%",
          style: {
            text: "万",
            textAlign: "center",
            fill: "rgba(0,0,0,0.45)",
            fontSize: 24
          }
        }
      ],
      series: [
        {
          name: "成交额",
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          label: {
            show: true,
            position: "inside",
            fontSize: 12,
            color: "rgba(44,53,66,0.65)"
          },
          emphasis: {
            label: {
              show: true
            }
          },
          labelLine: {
            show: false
          },
          data: [
            { value: 335, name: "直接访问" },
            { value: 310, name: "邮件营销" },
            { value: 234, name: "联盟广告" },
            { value: 135, name: "视频广告" },
            { value: 1548, name: "搜索引擎" }
          ]
        }
      ]
    };
  }

  getRankOption() {
    this.rankOption = {
      style: {
        height: 800
      },

      // backgroundColor: 'black',
      tooltip: {
        trigger: "axis"
      },
      grid: {
        height: 800,
        top: "0.5%",
        left: "3%",
        right: "11%",
        bottom: "2.5%",
        containLabel: true
      },
      yAxis: [
        {
          show: false,
          type: "category",
          data: [
            "华为mateXS",
            "19",
            "18",
            "17",
            "16",
            "15",
            "14",
            "13",
            "12",
            "11",
            "10",
            "9",
            "8",
            "7",
            "6",
            "5",
            "4",
            "3",
            "2",
            "1"
          ],
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
              color: "#2548ac"
            }
          }
        }
      ],
      xAxis: [
        {
          show: false,
          type: "value",
          axisLabel: {
            margin: 10,
            interval: 1, // 横轴信息全部显示
            rotate: -30, // -15度角倾斜显示
            textStyle: {
              fontSize: 18,
              color: "white"
            }
          },
          axisLine: {
            lineStyle: {
              color: "#192469"
            }
          },
          splitLine: {
            lineStyle: {
              color: "#17367c"
            }
          }
        }
      ],
      series: [
        {
          name: "Top 20",
          type: "bar",
          barWidth: 10,
          data: [
            88,
            74,
            7433,
            7133,
            6382,
            522,
            4826,
            3901,
            382,
            222,
            333,
            222,
            111,
            309,
            382,
            222,
            333,
            222,
            111,
            309
          ],
          label: {
            normal: {
              show: true,
              position: "left",
              textStyle: {
                color: "#999999", // color of value
                fontSize: 18
              }
            }
          },
          itemStyle: {
            normal: {
              color: "#5B8FF9"
            }
          }
        }
      ]
    };
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(["/login"]);
  }

  init() {
    this.getAccessOption();
    this.getPvOption();
    this.getRetentionOption();
    this.getTurnoverOption();
    this.getRankOption();
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit() {
    this.init();
  }
}
