import {useEffect, useState} from 'react';
import axios from "axios";

const usePosts=()=>{

    const [posts,setPosts]=useState([])
    const [isLoading,setLoading]=useState(false)
    const [isEmpty,setIsEmpty]=useState(false)

    useEffect(()=>{
        setLoading(true)
        axios.get('/api/posts').then(res=>{

            setTimeout(()=>{
                setPosts(res.data)


                if(res.data.length==0){
                    setIsEmpty(true)
                }
                setLoading(false)
            },3000)
        })
    },[])

    return {posts,isLoading,isEmpty}
}

export default usePosts