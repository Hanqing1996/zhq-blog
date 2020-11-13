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
* 创建数据库 blog_development
```
CREATE DATABASE blog_development ENCODING 'UTF8' LC_COLLATE 'en_US.utf8' LC_CTYPE 'en_US.utf8';
```


#### 数据库最佳实践
* blog_development
* blog_test
* blog_production