import { Modal, Table, Button } from 'flowbite-react';
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useState } from "react"
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import PostCard from '../components/PostCard';


export default function Posts() {

const {currentUser} = useSelector((state) => state.user)
const [posts, setPosts] = useState([])
const [showMore, setShowMore] = useState(true);
const [showModal, setShowModal] = useState(false);
useEffect(() => {
    const fetchPosts= async() => {
        try {
            const res = await fetch(`/api/post/getposts`);
            const data = await res.json()
            if(res.ok) {
                setPosts(data.posts)
                if(data.posts.length < 9){
                    setShowMore(false)
                }

            }
        }catch(error) {
            console.log(error.message)
        
        }
    };

   fetchPosts();
}, [currentUser.user.id]);








    return (
      <main>
     
        <div className='flex flex-col gap-6 items-center mb-5'>
              <h2 className='text-2xl mt-3 font-semibold text-center'>Публикации</h2>
              <div className='flex flex-row gap-4 '>
        { posts.map((post) => (
         <PostCard  key={post._id} post={post}/>

     
        )) }
</div>
        </div>
        </main>
        

    )
  }
  