
import { Modal, Table, Button } from 'flowbite-react';
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useState } from "react"
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from 'react-icons/hi';


export default function DashSubscriptions() {
    const {currentUser} = useSelector((state) => state.user)
    const [donations, setDonations] = useState([])
    const [showMore, setShowMore] = useState(true);
    useEffect(() => {
        const fetchDonationAll = async() => {
            try {
                const res = await fetch(`/api/donation/getSubscriptions`)
                const data = await res.json()
                if(res.ok) {
                    setDonations(data.donations)
                    if(data.donations.length < 9){
                        setShowMore(false)
                    }

                }
            }catch(error) {
                console.log(error.message)
            
            }
        };

        const fetchDonationOrg= async() => {
            try {
                const res = await fetch(`/api/donation/getSubscriptions?ogrn=${currentUser.user.id}`)
                const data = await res.json()
                if(res.ok) {
                    setDonations(data.donations)
                    if(data.donations.length < 9){
                        setShowMore(false)
                    }

                }
            }catch(error) {
                console.log(error.message)
            
            }
        };
        const fetchDonationUser = async() => {
            try {
                const res = await fetch(`/api/donation/getSubscriptions?userId=${currentUser.user.id}`)
                const data = await res.json()
                if(res.ok) {
                    setDonations(data.donations)
                    if(data.donations.length < 9){
                        setShowMore(false)
                    }

                }
            }catch(error) {
                console.log(error.message)
            
            }
            
        };

        if(currentUser.user.isAdmin ){
            fetchDonationAll();
        }
        else if(currentUser.user.isPersnOrg) {
            fetchDonationOrg();
        } else {
            fetchDonationUser();
        }
    }, [currentUser.user.id]);

    const handleShowMore = async () => {
        const startIndex = donations.length;
        try {
            var res = ''

            if(currentUser.user.isAdmin) {
                res = await fetch(`/api/donation/getDonationsOne?startIndex=${startIndex}`); }
            else if(currentUser.user.isPersnOrg) {
                res = await fetch(`/api/donation/getDonationsOne?ogrn=${currentUser.user.id}&startIndex=${startIndex}`)
            } else {
                res = await fetch(`/api/donation/getDonationsOne?userId=${currentUser.user.id}&startIndex=${startIndex}`)

            }
            const data = await res.json();
            if(res.ok) {
                setDonations((prev) => [...prev, ...data.donations]);
                 if(data.donations.length < 9) {
                    setShowMore(false);
                 }
            } else{
                console.log(data.errors[0].msg)
            }
        } catch (error) {
            console.log(error.message)
        }
    }


  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar
     scrollbar-track-slate-100 scrollbar-thumb-slate-300
     dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
        { donations.length > 0 ? (
            <>
            <Table hoverable className="shadow-md">
                <Table.Head className='text-center'>
                    <Table.HeadCell>Дата</Table.HeadCell>
                    { (currentUser.user.isAdmin || currentUser.user.isPersnOrg) && (
                    <Table.HeadCell>Email</Table.HeadCell>
                    )}

                    { (currentUser.user.isAdmin || !currentUser.user.isPersnOrg) && (
                    <Table.HeadCell>ОГРН Организации</Table.HeadCell>

                    )}
                    <Table.HeadCell>Сумма</Table.HeadCell>
                    <Table.HeadCell>Статус</Table.HeadCell>
                   
                </Table.Head>
                {donations.map((donation) => (
                    <Table.Body className='divide-y'>
                        <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                            <Table.Cell>
                                {new Date(donation.payDate).toLocaleDateString()}
                            </Table.Cell>
                            { (currentUser.user.isAdmin || currentUser.user.isPersnOrg) && (
                            <Table.Cell>
                                {donation.email}
                            </Table.Cell>
                            )}
                            { (currentUser.user.isAdmin || !currentUser.user.isPersnOrg) && (
                            <Table.Cell>
                                <Link className='font-medium text-gray-900 dark:text-white' 
                                to={`/organization/${donation.organization_id}`}
    >
                                    {donation.ogrn}</Link>
                            </Table.Cell>
                            )}
                            <Table.Cell>
                                {donation.amount}
                            </Table.Cell>
                            <Table.Cell>
                                {donation.status}
                            </Table.Cell>
                       
                        </Table.Row>
                    </Table.Body>
                ))}
            </Table>
            {
                showMore && (
                    <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'> 
                    Загрузить еще 
                    </button>
                )
            }
        </>
        ) :(
            <p>Подписку еще никто не оформил!</p>
        ) }
      
        </div>
     
  )

}