import { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import OrganizationsCard from '../components/OrganizationsCard';
import PostCard from '../components/PostCard';

import { Blockquote } from "flowbite-react";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [organizations, setOrganizations] = useState([]);


  useEffect(() => {
    const fetchPosts = async() => {
      const res = await fetch('/api/post/getposts');
      const data = await res.json();
      setPosts(data.posts);

    }

    const fetchOrganizations = async() => {
      const res = await fetch('/api/organization/getOrganizations');
      const data = await res.json();
      setOrganizations(data.organizations);

    };
    fetchOrganizations();
    fetchPosts();
  }, []);
    return (
     <div>
      <div  className="flex flex-col gap-6 p-28 px-3 mx-w-6xl mx-auto">
        <h1 className="text-3xl font-bold lg:text-5xl text-gray-800 dark:text-white">
        Добро пожаловать на DobroVmeste
        </h1>
        <Blockquote className="text-gray-700 text-lg   dark:text-white">
        - единое веб-пространство, объединяющее некоммерческие организации для более эффективной помощи нуждающимся!
        </Blockquote>
      
          
      </div>
      <div className='max-w-6xl mx-auto p-4 flex flex-col gap-8 py-7'>
      
        {
          organizations && organizations.length > 0 && (
            <div className='flex flex-col gap-6'>
              <h2 className='text-2xl font-semibold text-center'>Благотворительные организации</h2>
              <div className='flex flex-row gap-4'>
                {organizations.map((organization) => (
                <OrganizationsCard  key={organization._id} organization={organization}/>
                
                ))}

              </div>
              <Link to={'/search'} className="text-lg sm:text-sm text-blue-700 
      font-bold hover:underline text-center">Перейти к организациям</Link>
              
            </div>
          )
        }
        {
          posts && posts.length > 0 && (
            <div className='flex flex-col gap-6'>
              <h2 className='text-2xl font-semibold text-center'>Публикации</h2>
              <div className='flex flex-row gap-4'>
                {posts.map((post) => (
                <PostCard  key={post._id} post={post}/>
                
                ))}

              </div>
              <Link to={'/search'} className="text-lg sm:text-sm text-blue-700 
      font-bold hover:underline text-center">Перейти к публикациям</Link>
              
            </div>
          )
        }
      </div>


     </div>
    )
  }
  