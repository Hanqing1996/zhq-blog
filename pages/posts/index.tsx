import {GetStaticProps, NextPage} from "next";
import React, {useEffect, useState} from "react";
import usePosts from "../../hooks/usePosts";
import {getPosts} from "../../lib/posts";


const PostsIndex:NextPage<{posts:Post []}>=(props)=>{

    console.log(props.posts);

    return(
        <div>
            <h1>文章列表</h1>
            {props.posts.map(post=><div key={post.id}>{post.title}-{post.date}</div>)}
        </div>
    )
}

export default PostsIndex

export const getStaticProps=async ()=>{
    const posts=await getPosts()
    return {
        props:{
            posts
        }
    }
}