# demo-express-mongo

> Express+Mongo基于NodeJs的restful后台Api开发

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

## 启动脚本
```
$> npm install

$> 启动一下mongodb数据库,修改对应的配置Setting.js

$> npm run dev 6000
```

------------


** `如果感觉本资源帮到了您,给个star,鼓励一下作者吧!`**