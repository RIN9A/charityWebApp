import { Modal, Table, Button } from 'flowbite-react';
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useState } from "react"
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import ProjectsCard from '../components/ProjectsCard';



export default function Projects() {

const {currentUser} = useSelector((state) => state.user)
const [projects, setProjects] = useState([])
const [showMore, setShowMore] = useState(true);
const [showModal, setShowModal] = useState(false);
useEffect(() => {
    const fetchProjects = async() => {
        try {
            const res = await fetch(`/api/project/getprojects`);
            const data = await res.json()
            if(res.ok) {
                setProjects(data.projects)
                console.log(data.countAllProjetcs.count)
                console.log(data.projects[0].title)
                if(data.projects.length < 9){
                    setShowMore(false)
                }

            }
        }catch(error) {
            console.log(error.message)
        
        }
    };

   fetchProjects();
}, [currentUser.user.id]);








    return (
      <main>
     
        <div className='flex flex-col gap-6 items-center mb-5'>
              <h2 className='text-2xl mt-3 font-semibold text-center'>Проекты</h2>
              <div className='flex flex-row gap-4 '>
        { projects.map((project) => (
         <ProjectsCard  key={project._id} project={project}/>

     
        )) }
</div>
        </div>
        </main>
        

    )
  }
  