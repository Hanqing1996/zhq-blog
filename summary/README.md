#### docker 安装 postgresql
> 注意用户名为 blog
```
docker run -v "$PWD/blog-data":/var/lib/postgresql/data -p 5432:5432 -e POSTGRES_USER=blog -e POSTGRES_HOST_AUTH_METHOD=trust -d postgres:12.2
```
* 开启容器并登录 postgresql 客户端(参考[`mysql`登录流程](https://github.com/Hanqing1996/docker-notes#%E5%9C%A8%E6%9C%AC%E6%9C%BA%E7%99%BB%E5%BD%95-mysql))
> psql1 为我设置的容器名
```
docker start psql1
```
```
docker exec -it psql1 bash
```
```
psql -U blog
```
#### psql
* 创建数据库 blog_development
```
CREATE DATABASE blog_development ENCODING 'UTF8' LC_COLLATE 'en_US.utf8' LC_CTYPE 'en_US.utf8';
```
* 查看数据库
```
\l
```
* 转到 blog 数据库
```
\c blog
```
* 展示当前数据库下所有 table
```
\dt
```
* 删除 user 表
```
drop table user;
``` 


#### 数据库最佳实践
* blog_development
* blog_test
* blog_production

#### 使用 babel 运行 src/entity/User.ts
* typeORM 只支持以 ts-node 方式运行 ts 文件（这也是 install typeORM 时会悄悄给我们装上 ts-node 的原因）
* Next.js 只支持使用 babel 方式运行 ts 文件

为了统一，我们要使用 babel 来运行 typeORM 相关的 ts 文件

这期间要修改 ormconfig.json，创建 .babelrc

> 把 src 目录下的 ts 转译成 js
```
npx babel ./src --out-dir dist --extensions ".ts,.tsx"
```
> 运行 dist/index.js 以建立与数据库联系
```
node dist/index.js
```

#### ormconfig.json
指定文件类型，比如 dist/migration/**/*.js 是 migrations 类型，当执行 typeorm migration:run 时会自动执行 dist/migration 下的 js 文件
```
"entities": [
  "dist/entity/**/*.js"
],
"migrations": [
  "dist/migration/**/*.js"
],
"subscribers": [
  "src/subscriber/**/*.js"
]
```






#### [migration ](https://typeorm.io/#/migrations)
* 用于数据库表的版本迁移
> 比如修改 post 表的字段，将列名 title 改为 name
* 创建 migration 文件
```
npx typeorm migration:create -n CreatePost
```
* 执行 up 函数
```
typeorm migration:run
```
* 执行 down 函数
```
typeorm migration:revert
```