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
指定命令执行时的对应 file path。比如当执行 typeorm migration:run 时会自动遵循 "dist/entity/**/*.js" 的文件路径 
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


#### 创建实体
```
typeorm entity:create -n Post
```

#### seed
快速填充数据



#### typeORM 的思想
* 一个 table 可以视为一个 class(entity),table 中的每行数据都是这个类的一个实例，整个 table 就是这些实例的集合
* 我们可以直接使用 entity+manager 实现CRUD
* 有时我们要修改 entity,也就是 class 的字段,或者新增/删除 entity,这时我们需要数据库的 table 同步我们的变更，这时我们就需要 migration:generate










#### typeORM 使用流程

> 我感觉用起来真是贼几把麻烦，主要是每次都要把生成的 ts 文件转译成 js 文件，再执行 js 文件。

* 创建 posts 表

  1. 创建名为`Post` 的 `entity` 

  ```
  typeorm entity:create -Post
  ```

  2. 在第1步生成的 `src/entity/Post.ts` 设置 `Post` 实体具体内容

  ```ts
  import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
  
  @Entity('posts')
  export class Post {
      @PrimaryGeneratedColumn('increment')
      id: number;
      @Column('varchar')
      title: string;
      @Column('text')
      content: string;
  
      constructor(attributes: Partial<Post>) {
          Object.assign(this, attributes);
      }
  }
  ```

  3. 提交变更（注意`create entity` 对应的是 `migration:create`）

  ```
  typeorm migration:create -n CreatePost
  ```

  4. 由于是 migration:create 步骤，所以此时得到的`src/migtation/CreatePostxxxx.ts` 内容如下，注意 `up`和`down`是空的

  ```ts
  import {MigrationInterface, QueryRunner, Table} from "typeorm";
  
  export class CreatePost1605319485175 implements MigrationInterface {
  
      public async up(queryRunner: QueryRunner): Promise<void> {
      }
  
      public async down(queryRunner: QueryRunner): Promise<void> {
      }
  }
  ```

  5. 我们要手动填入 `up` 和`down` 的具体内容

  ```ts
  import {MigrationInterface, QueryRunner, Table} from "typeorm";
  
  export class CreateAnimal1605334600176 implements MigrationInterface {
  
      // 在数据库中创建 posts 表
      public async up(queryRunner: QueryRunner): Promise<void> {
          await queryRunner.createTable(new Table({
              name: 'animals',
              columns: [{
                  name: 'id',
                  type: 'int',
                  isPrimary: true,
                  isGenerated: true
              },{
                  name: 'name',
                  type: 'varchar',
              }]
          }))
      }
  
      // 删除 table 表
      public async down(queryRunner: QueryRunner): Promise<void> {
          await queryRunner.dropTable('posts')
      }
  }
  ```

  6. 将变更同步到数据库。

     首先要将 src 目录下 ts 文件转译成 js 文件。  然后执行 `CreatePostxxxx.ts` 转译成的 js 文件。

     ```
     rm -rf dist;babel ./src --out-dir dist --extensions .ts,.tsx
     ```

     ```
     typeorm migration:run
     ```

     上面这条语句会自动执行所有处于`pending`状态的`migration` 。在此处只是创建了数据库中的 posts 表。注意这条语句只能作用于 js 文件。

  7. 如果我们想回撤刚才的变更，就执行

     ```
     typeorm migration:revert
     ```

     这条语句会自动执行刚才提交的`CreatePostxxxx` 的`down`函数。 在此处为删除 posts 表。

  ---

* Animal 表字段变更

  比如我们修改了 Animal 对应的 entity，增加了 food 字段。如何让数据库中的 animal 表也同步变更呢？

  1. 转译刚才修改过的 ts 文件，因为 migation 只检查 js 格式的 entity 文件变更

  ```
  rm -rf dist;babel ./src --out-dir dist --extensions .ts,.tsx
  ```

  2. 提交变更

  ```
  typeorm migration:generate -n AnimalRefactoring
  ```

  3. 查看此时的 AnimalRefactoringxxxxx.ts

  ```ts
  import {MigrationInterface, QueryRunner} from "typeorm";
  
  export class AnimalRefactoring1605334929804 implements MigrationInterface {
      name = 'AnimalRefactoring1605334929804'
  
      public async up(queryRunner: QueryRunner): Promise<void> {
          await queryRunner.query(`ALTER TABLE "animals" ADD "food" text NOT NULL`);
      }
  
      public async down(queryRunner: QueryRunner): Promise<void> {
          await queryRunner.query(`ALTER TABLE "animals" DROP COLUMN "food"`);
      }
  
  }
  ```

  **“惊喜”**地发现：migration 会将我们对 Animal 实体的语法变更自动翻译成 sql 语句，并填充到 up 函数中。而 down 函数作为撤销用途，提供了复原相关的 sql 语句。

  4. 我们需要将 AnimalRefactoringxxxxx.ts 转译成 js 文件，然后才能把本次变更同步到数据库。(实在太jb麻烦了)

     ```
     rm -rf dist;babel ./src --out-dir dist --extensions .ts,.tsx
     ```

     ```
     typeorm migration:run
     ```



#### migration 注意事项
1. `drop table` 不能用 `migration`（试过把某个 entity 文件删除，migration 发现不了）
2. 可以多次 `migration:generate` 再一次性 `migration:run`（类比多次 commit 再一次性 push）




















 

