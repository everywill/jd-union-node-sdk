# jd-union-node-sdk
京东开放平台京东联盟node sdk，欢迎issue和pr。

#### 安装
使用npm:
```
npm i jd-union-node-sdk -S
```
或者yarn:
```
yarn add jd-union-node-sdk
```

#### 引入文件
```
const JDClient = require('jd-union-node-sdk')
```

#### 配置
使用京东联盟的appkey，secretkey和api的endpoint进行初始化:
```
const client = new JDClient({
  appKey: 'your appkey',
  secretKey: 'your secretKey',
  url: 'JD union endpoint', // 默认为 https://router.jd.com/api
})
```

#### API
例如查询商品： 
```
client.execute('jd.union.open.goods.promotiongoodsinfo.query', {
      skuIds: '123456'
    })
```
注意调用api返回的都是promise，因此可使用async/await。
