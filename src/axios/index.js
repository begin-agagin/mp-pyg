import Vue from 'vue'
import axios from 'axios'
// 设置基准地址
axios.defaults.baseURL = 'http://127.0.0.1:8899/api/public/v1/'
axios.defaults.adapter = config => {
  return new Promise((resolve, reject) => {
    mpvue.request({
      url: config.url, // 开发者服务器接口地址",
      data: config.data, // 请求的参数",
      method: config.method,
      dataType: 'json', // 如果设为json，会尝试对返回的数据做一次 JSON.parse
      success: res => {
        resolve(res)
      },
      fail: err => {
        reject(err)
      },
      complete: () => { }
    })
  })
}

Vue.prototype.$axios = axios
