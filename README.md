# demo-express-mongo

> Express+Mongo+EJS+Log4js基于NodeJs的RestFul后台Api开发

------------
> Express官方文档  http://expressjs.com/en/4x/api.html#res.send


## 核心开发结构

```
├─core       核心框架组成
│  ├─config      配置项
│  ├─exception   异常类
│  ├─interceptor 拦截处理
│  ├─utils       工具类
│  └─valid		 验证类
├─model               业务model
├─route		       访问路由处理
└─views		  	 业务页面
│  Main.js   		 启动入口
│  Route.js  		 总路由
│  Setting.js         基本配置
```

## 启动脚本-1
```
$> npm install

$> 启动一下mongodb数据库,修改对应的配置Setting.js

$> npm run dev 6000
```

> 如果你有使用docker,docker-compose的经验,推荐一下

## 启动脚本-2
```
$> 启动一下mongodb数据库,修改对应的配置Setting.js

$> docker-compose build;

$> docker-compose up -d;
```

------------

`tips:`

> 使用淘宝加速下载 npm config set registry https://registry.npm.taobao.org

**如果感觉本资源帮到了您,给个🌟,鼓励一下作者吧!**
