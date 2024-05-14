import { Modal, Table, Button } from 'flowbite-react';
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useState } from "react"
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import OrganizationsCard from '../components/OrganizationsCard';


export default function Organizations() {

const {currentUser} = useSelector((state) => state.user)
const [organizations, setOrganizations] = useState([])
const [showMore, setShowMore] = useState(true);
const [showModal, setShowModal] = useState(false);
useEffect(() => {
    const fetchOrganizations= async() => {
        try {
            const res = await fetch(`/api/organization/getOrganizations`);
            const data = await res.json()
            if(res.ok) {
                setOrganizations(data.organizations)
                if(data.organizations.length < 9){
                    setShowMore(false)
                }

            }
        }catch(error) {
            console.log(error.message)
        
        }
    };

   fetchOrganizations();
}, [currentUser.user.id]);








    return (
      <main>
     
        <div className='flex flex-col gap-6 items-center mb-5'>
              <h2 className='text-2xl mt-3 font-semibold text-center'>Благотворительные организации</h2>
              <div className='flex flex-row gap-4 '>
        { organizations.map((organization) => (
         <OrganizationsCard  key={organization._id} organization={organization}/>

     
        )) }
</div>
        </div>
        </main>
        

    )
  }
  