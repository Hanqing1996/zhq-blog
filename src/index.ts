
import 'reflect-metadata';
import {createConnection} from 'typeorm';
import {Post} from './entity/Post';

createConnection().then(async connection => {
    const posts = await connection.manager.find(Post);
    console.log(posts);
    await connection.manager.delete(Post,{title:'post 1'})
    const posts2 = await connection.manager.find(Post);
    console.log(posts2);
    await connection.close();
}).catch(error => console.log(error));