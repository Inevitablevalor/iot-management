<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

const animationDuration = 3000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '320px'
    },
    infoData: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    infoData: {
      deep: true,
      handler(newValue) {
        if (newValue && (typeof newValue.alert_num_week !== 'undefined' || typeof newValue.non_alert_num_week !== 'undefined')) {
          this.chart.setOption({
            series: [
              {
                data: newValue.alert_num_week,
                animationDurationUpdate: animationDuration
              },
              {
                data: newValue.non_alert_num_week,
                animationDurationUpdate: animationDuration
              }
            ]
          })
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    getPastSevenDays() {
      const dates = []
      for (let i = 0; i < 7; i++) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        // 创建 "MM-DD" 格式的日期字符串
        const dateString = [String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-')
        dates.unshift(dateString)
      }
      return dates
    },
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function(params) {
            let total = 0
            let tooltipMarkup = params.map((item) => {
              total += item.data
              return `<br/>${item.marker} ${item.seriesName}: ${item.data}`
            }).join('')

            tooltipMarkup = `<b>${params[0].axisValueLabel}</b>${tooltipMarkup}<br/>${'<i class="fas fa-plus"></i>'} 总数: ${total}`

            return tooltipMarkup
          }
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: this.getPastSevenDays(),
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: '正常消息',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: this.infoData.non_alert_num_week,
          color: '#00c292',
          animationDuration
        }, {
          name: '报警消息',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: this.infoData.alert_num_week,
          color: '#fb9678',
          animationDuration
        }]
      })
    }
  }
}
</script>
