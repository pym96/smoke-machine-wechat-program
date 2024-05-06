const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}


// 封装请求api
const fetch = (options, success, fail) => {
	wx.request({
	  url: options.url,
    method : options.method,
    data : options.data,
	  success : (res) => {
		  success(res);
	  },
	  fail : (res) => {
		  fail(res);
	  }
	})
}

module.exports = {
  formatTime,
  fetch
}
