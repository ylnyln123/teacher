
const Koa = require('koa');
const Router = require('koa-router')
const Cors = require('koa-cors')
const SuperAgentRequest = require('superagent');
const Index = require('./index')
const app = new Koa();
const route = new Router();
//要爬哪个网站的数据，启动服务前，在options添加数据后，去更改name即可，这种写法方便后续扩展
const name = 'teacher';
const options = {
  'db': {
    'source': 'db',//自定义，与上面的name相对应即可
    'url': 'https://book.douban.com/top250?icn=index-book250-all'
    //为了防止不必要的争端，此处隐去详细url，根据自己的需要来填写即可
  },
  'teacher': {
    'source': 'teacher',//自定义，与上面的name相对应即可
    'url': 'http://jszk.eeafj.cn/20220326A.html'
  }
}

//使用koa-cors解决跨域问题
//前端是使用live-server起的服务，端口号是http://127.0.0.1:5500,可以根据自己的live-server配置来填写
app.use(Cors({
  origin: function () {
    return 'http://127.0.0.1:8080'
  },
  maxAge: 10, //指定本次预检请求的有效期，单位为秒。
  credentials: true, //是否允许发送Cookie
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
}));
let webData = {}

// 这里单独封装一个promise的方法
function getData() {
  return new Promise((resolve, reject) => {
    SuperAgentRequest.get(options[name].url).end(async (err, res) => {
      let sourceData = {}
      if (res.ok) {
        //这里用switch主要是为了后续扩展，毕竟不可能只爬这一个网站不是
        //当然，也可以以文件的形式作区分，方法很多
        switch (options[name].source) {
          case 'db':
            sourceData = await Index.dbHandle(res.text);
            break;
          case 'teacher':
            sourceData = await Index.teacherHandle(res.text);
            break;
          default:
            break;
        }
        webData = {
          status: 200,
          data: sourceData
        };
        resolve()
      } else {
        console.log('失败', err);
        webData = {
          status: 404,
          data: {}
        };
        reject();
      }

    }, err => {
      webData = {
        status: 404,
        data: {}
      };
      console.log('数据获取失败了');
      reject()
    })
  })

}

//创建接口
route.get('/hello', async (ctx) => {
  await getData();
  // ctx.body = webData;
  // 也可用promise函数来显式返回
  return getData().then(res => {
    ctx.body = webData
  })
})

app.use(route.routes()).use(route.allowedMethods())// 注册接口
app.listen(3000)