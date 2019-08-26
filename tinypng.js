const fs = require('fs')
const path = require('path')
const https = require('https')
const { URL } = require('url')

const options = {
  method: 'POST',
  hostname: 'tinypng.com',
  path: '/web/shrink',
  headers: {
    rejectUnauthorized: false,
    'Postman-Token': Date.now(),
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent':
      'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36'
  }
}

const exts = ['.png'] // 图片格式
const max = 5200000 // 5MB
const ratio = 90 // 压缩比例
let imgs = [] // 源图片

// 获取图片list
function getImages(dir) {
  let files = fs.readdirSync(dir)
  files.forEach(fileName => {
    let fullname = path.join(dir, fileName)
    let stats = fs.statSync(fullname)
    if (stats.isDirectory()) {
      getImages(fullname + '/')
    }
    if (
      stats.size <= max &&
      stats.isFile() &&
      exts.includes(path.extname(fullname))
    ) {
      imgs.push(fullname)
    }
  })
}

// 上传需要压缩的图片
function uploadImage(img) {
  return new Promise(function(resolve, reject) {
    const req = https.request(options, res => {
      res.on('data', buf => {
        const obj = JSON.parse(buf.toString())
        if (obj.error) {
          console.log(`[${img}]：压缩失败！报错：${obj.message}`)
          reject(obj.message)
        } else {
          downloadImage(img, obj, resolve, reject)
        }
      })

      res.on('error', _ => {
        reject(_)
      })
    })

    req.write(fs.readFileSync(img), 'binary')
    req.end()
  }).catch(_ => {
    failedList.push(img)
  })
}

// 下载压缩后的图片
function downloadImage(imgpath, obj, resolve, reject) {
  const options = new URL(obj.output.url)

  const req = https.request(options, res => {
    let body = ''
    res.setEncoding('binary')
    res.on('data', data => (body += data))

    res.on('end', () => {
      fs.writeFile(imgpath, body, 'binary', e => {
        if (e) return reject(e)
        console.log(
          `[${imgpath}] \n 压缩成功，原始大小----${
            obj.input.size
          }，压缩大小----${obj.output.size}，优化比例----${obj.output.ratio}`
        )
        obj.output.ratio * 100 < ratio ? reject('error') : resolve(imgpath)
      })
    })
  })

  req.on('error', _ => {
    reject(_)
  })
  req.end()
}

function handlePromise() {
  if (failedList.length > 0) {
    requestList = failedList.splice(0, 2)
    const promises = requestList.map(img => uploadImage(img))
    Promise.all(promises)
      .then(resolve => {
        result = result.concat(resolve.filter(i => i))
        let failedLength = failedList.length
        if (failedLength > 0 && requestTime < maxRequestTime) {
          // 如果失败列表里有数据，并且请求次数不超过设定的值，就进行下一次请求
          console.log(
            `第${requestTime}次请求完成，其中成功${
              result.length
            }个，待处理${failedLength}个，正在进行第${++requestTime}次请求...`
          )
          // 间隔时间2s，防止too many files uploaded at once
          setTimeout(() => handlePromise(), 2000)
        } else {
          // 所有请求都成功了，或者达到了最大请求次数
          console.log(
            `请求完成，共请求${requestTime}次, 其中成功${
              result.length
            }个，失败${failedLength}个\n`,
            result
          )
        }
      })
      .catch(e => {
        console.log(e)
      })
  }
}

let requestList = []
let failedList = []

let requestTime = 1
let maxRequestTime = Math.round(failedList.length / 2) + 5
let result = []

const imgPath = process.argv[2].replace(/"$/, '')

if (fs.existsSync(imgPath)) {
  if (fs.statSync(imgPath).isFile() && exts.includes(path.extname(imgPath))) {
    imgs = [imgPath]
  } else if (fs.statSync(imgPath).isDirectory()) {
    getImages(imgPath)
  }
  failedList = imgs
  handlePromise()
} else {
  console.log('请输入要压缩的图片路径')
}
