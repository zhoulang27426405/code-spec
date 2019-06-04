const fs = require('fs')
const path = require('path')
const https = require('https')
const { URL } = require('url')

const root = './src/' // 根目录
const exts = ['.jpg', '.jpeg', '.png'] // 图片格式
const max = 5200000 // 5MB
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
const ratio = 90 // 压缩比例
let imgs = [] // 源图片

if (process.argv[2] == '--all') {
  getImages(root)
} else {
  imgs = process.argv.slice(2)
}

optImage()
function optImage() {
  if (imgs.length <= 0) return
  let img = imgs.shift()
  uploadImage(img)
}

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

// 压缩图片
function uploadImage(img) {
  let req = https.request(options, function(res) {
    res.on('data', buf => {
      let obj = JSON.parse(buf.toString())
      if (obj.error) {
        console.log(`[${img}]：压缩失败！报错：${obj.message}`)
        imgs.push(img)
      } else {
        downloadImage(img, obj)
      }
      optImage()
    })
  })
  req.write(fs.readFileSync(img), 'binary')
  req.on('error', e => {
    console.error(e)
  })
  req.end()
}

// 下载压缩后的图片
function downloadImage(imgpath, obj) {
  let options = new URL(obj.output.url)
  let req = https.request(options, res => {
    let body = ''
    res.setEncoding('binary')
    res.on('data', function(data) {
      body += data
    })

    res.on('end', function() {
      fs.writeFile(imgpath, body, 'binary', err => {
        if (err) return console.error(err)
        console.log(
          `[${imgpath}] \n 压缩成功，原始大小----${
            obj.input.size
          }，压缩大小----${obj.output.size}，优化比例----${obj.output.ratio}`
        )
        obj.output.ratio * 100 < ratio && imgs.push(imgpath)
      })
    })
  })
  req.on('error', e => {
    console.error(e)
  })
  req.end()
}
