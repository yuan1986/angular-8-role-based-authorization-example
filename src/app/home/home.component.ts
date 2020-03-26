import { Component } from '@angular/core';
import { User } from '@app/models';
import { AuthenticationService } from '@app/services';
import { Router } from '@angular/router';
import { EChartOption } from 'echarts';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
  loading = false;
  currentUser: User;
  userFromApi: User;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }
  retentionOption: EChartOption = {
    color: ['#5B8FF9', '#5AD8A6'],
    title: {
        text: '留存率',
        left:40,
        top:20,
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        top:20,
        right: 50,
        data: ['次日留存率', '七日留存率']
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
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            name: '次日留存率',
            type: 'line',
            stack: '总量',
            data: [120, 132, 101, 134, 90, 230, 210],
            symbol: 'circle',
            lineStyle: { color: '#5B8FF9' }
        },
        {
            name: '七日留存率',
            type: 'line',
            stack: '总量',
            data: [220, 182, 191, 234, 290, 330, 310],
            symbol: 'circle',
            lineStyle: { color: '#5AD8A6' }
        }
    ]
};


turnoverOption: EChartOption = {
    color: ['#5AD8A6', '#5B8FF9', '#5D7092', '#F6BD16', '#833080'],
    title: {
        text: '成交额',
        left: 'left',
        top: 20,
        textStyle: {
            color: 'rgba(0,0,0,0.85)',
            fontSize: 20
        }
    },
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
        orient: 'vertical',
        right: 10,
        bottom: 180,
        data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
    },
    graphic: [{
        type: "text",
        left: "center",
        top: "40%",
        style: {
            text: "总成交",
            textAlign: "center",
            fill: "rgba(0,0,0,0.45)",
            fontSize: 12,

        }
    }, {
        type: "text",
        left: "41%",
        top: "50%",
        style: {
            text: "1430",
            textAlign: "center",
            fill: "rgba(0,0,0,85)",
            fontSize: 32,


        }
    }, {
        type: "text",
        left: "55%",
        top: "51%",
        style: {
            text: "万",
            textAlign: "center",
            fill: "rgba(0,0,0,0.45)",
            fontSize: 24,

        }
    }],
    series: [
        {
            name: '成交额',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
                show: true,
                position: 'inside',
                fontSize: 12,
                color: "rgba(44,53,66,0.65)"
            },
            emphasis: {
                label: {
                    show: true,

                }
            },
            labelLine: {
                show: false
            },
            data: [
                { value: 335, name: '直接访问' },
                { value: 310, name: '邮件营销' },
                { value: 234, name: '联盟广告' },
                { value: 135, name: '视频广告' },
                { value: 1548, name: '搜索引擎' }
            ]
        }
    ]
};
rankOption: EChartOption = {
    style: {
        height: 800,
    },

    // backgroundColor: 'black',
    tooltip: {
        trigger: 'axis',

    },
    grid: {
        height: 800,
        top: '0.5%',
        left: '3%',
        right: '11%',
        bottom: '2.5%',
        containLabel: true
    },
    yAxis: [{
        show: false,
        type: 'category',
        data: ['华为mateXS', '19', '18', '17', '16', '15', '14', '13', '12', '11', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1'],
        inverse: true,
        axisTick: {
            alignWithLabel: true,
        },
        axisLabel: {
            margin: 10,
            textStyle: {
                fontSize: 18,
            }
        },
        axisLine: {
            lineStyle: {
                color: '#2548ac'
            }
        },

    }],
    xAxis: [{
        show: false,
        type: 'value',
        axisLabel: {
            margin: 10,
            interval: 1, //横轴信息全部显示  
            rotate: -30, //-15度角倾斜显示  
            textStyle: {
                fontSize: 18,
                color: 'white',
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
    }],
    series: [{
        name: 'Top 20',
        type: 'bar',
        barWidth: 10,
        data: [88, 74, 7433, 7133, 6382, 522, 4826, 3901, 382, 222, 333, 222, 111, 309, 382, 222, 333, 222, 111, 309],
        label: {
            normal: {
                show: true,
                position: 'left',
                textStyle: {
                    color: '#999999', //color of value
                    fontSize: 18,
                }
            }
        },
        itemStyle: {

            normal: {

                color: '#5B8FF9',

            }
        }
    }]
};

  ngOnInit() {}

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  calc() {
    alert(1);
  }

}
