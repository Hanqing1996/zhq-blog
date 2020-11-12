import Head from "next/dist/next-server/lib/head";
import React from "react";
//import 'styles/global.css'

export default function App({Component,pageProps}) {
    return <div className='myBlog'>

        <Head>
            <title>我的博客</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <Component {...pageProps}/>
    </div>
}