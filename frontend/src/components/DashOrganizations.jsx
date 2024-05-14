import { Modal, Table, Button, TextInput,Label } from 'flowbite-react';
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useState } from "react"
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from 'react-icons/hi';


export default function DashOrganizations() {
    const {currentUser} = useSelector((state) => state.user)
    const [organizations, setOrganizations] = useState([])
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showChangePassModal, setShowChangePassModal] = useState(false);
    const [emailOrg, setEmailOrg] = useState('');
    const [formChange, setFormChange] = useState({});
    const [changeOGRN, setChangeOGRN] = useState('');



    const [organizationIdToDelete, setOrganizationIdToDelete] = useState('');
   const [organizationIdToChangePass, setOrganizationIdToChangePass] = useState('');
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

        if(currentUser.user.isAdmin){
            fetchOrganizations();
        } 
    }, [currentUser.user.id]);

    const handleShowMore = async () => {
        const startIndex = organizations.length;
        try {
            const res = await fetch(`/api/organization/getOrganizations?startIndex=${startIndex}`);
            const data = await res.json();
            if(res.ok) {
                setOrganizations((prev) => [...prev, ...data.organizations]);
                 if(data.organizations.length < 9) {
                    setShowMore(false);
                 }
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    
    const handleDeleteOrganization = async () => {
        setShowModal(false);
        try{
        const res = await fetch(`/api/organization/delete/${organizationIdToDelete}`,{
            method: 'DELETE',
        });
        const data = await res.json();
        if(!res.ok) {
            console.log(data.errors[0].msg)
        } else {
            setOrganizations((prev) =>
            prev.filter((organization) => organization.id !== organizationIdToDelete));
            setShowModal(false);
        }
        }catch(error) {
            console.log(error.message)
        }
    }

    const handleСhangePassword = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/organization/changePass/${organizationIdToChangePass}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify(formChange),
            });
            const data = await res.json();
        
            if(!res.ok) {
                console.log(data.errors[0].msg)
            }
            else{

                setShowChangePassModal(false);
            }
        }catch(error) {
            console.log(error.msg)
        }
    }


  return (
    
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar
     scrollbar-track-slate-100 scrollbar-thumb-slate-300
     dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 justify-between'>
        <div className='items-center mb-2 flex justify-end'>
     <a href='/add-organization' className='rounded-lg  px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>Добавить организацию</a>
     </div>
        {currentUser.user.isAdmin && organizations.length > 0 ? (
            
            <>
            
             <Table hoverable className="shadow-md">
                <Table.Head className='text-center'>
                    <Table.HeadCell>Дата добавления</Table.HeadCell>
                    <Table.HeadCell>Наименование</Table.HeadCell>
                    <Table.HeadCell>Регион</Table.HeadCell>
                    <Table.HeadCell>ОГРН</Table.HeadCell>
                    <Table.HeadCell>Вид организации</Table.HeadCell>
                    <Table.HeadCell>Удалить</Table.HeadCell>   
                    <Table.HeadCell>Изменить пароль</Table.HeadCell>   

                    
                
                </Table.Head>
                {organizations.map((organization) => (
                    <Table.Body className='divide-y' key={organization.id}>
                        <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                            <Table.Cell className='text-center'>
                                {new Date(organization.createdAt).toLocaleDateString()}
                            </Table.Cell>
                        
                            <Table.Cell>
                                <Link className='font-medium text-gray-900 dark:text-white' 
                                to={`/organization/${organization.id}`}>
                                    {organization.name}</Link>
                            </Table.Cell>
                            <Table.Cell className='text-center'>
                                {organization.region}
                            </Table.Cell>
                            <Table.Cell className>
                                {organization.ogrn}
                            </Table.Cell>
                            <Table.Cell className='text-center'>
                                {organization.form}
                            </Table.Cell>
                            <Table.Cell className='font-medium text-red-500 hover:underline cursor-pointer'>
                                <span onClick={() => {setShowModal(true);
                                setOrganizationIdToDelete(organization.id)}}>Удалить</span>
                            </Table.Cell>
                            <Table.Cell className='font-medium text-red-500 hover:underline cursor-pointer'>
                                <span onClick={() => {setShowChangePassModal(true);
                                setOrganizationIdToChangePass(organization.id), setEmailOrg(organization.email), setFormChange({...formChange, ogrn: organization.ogrn})}}>Изменить пароль</span>
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
            <p>Список благотворительных организаций еще пуст!</p>
        ) }
        <Modal show={showModal} onClose={() => setShowModal(false)}
              popup size='md'>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400
                        dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:to-gray-400'>Вы уверены, что хотите удалить организацию?</h3>
                    </div>
                    <div className='flex justify-center gap-4'>
                        <Button gradientMonochrome="failure"  outline onClick={handleDeleteOrganization}>Да</Button>
                        <Button gradientMonochrome="cyan" outline onClick={() => setShowModal(false)}>Нет, отмена</Button>
                    </div>
                </Modal.Body>

                    
             </Modal>
             <Modal show={showChangePassModal} onClose={() => setShowChangePassModal(false)}
              popup size='md'>
                <Modal.Header />
                <Modal.Body>
                <div className="space-y-6">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">Изменить пароль организации</h3>                
                <div>                 
                <div className="mb-2 block">
                <Label htmlFor="email" value="Your email" />
              </div>
              <TextInput
                id="email"
                placeholder="name@company.com"
                defaultValue={emailOrg}
                onChange={(event) => setEmailOrg(event.target.value)}
                disabled
              />

                </div>
                <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Your password" />
              </div>
              <TextInput id="password" type="password" placeholder='password' onChange={(event) => setFormChange({...formChange, [event.target.id]: event.target.value})}/>
            </div>

                </div>
                <div className='flex justify-center gap-4'>
                        <Button gradientMonochrome="cyan"  outline onClick={handleСhangePassword}>Сохранить</Button>
                        <Button gradientMonochrome="failure" outline onClick={() => setShowChangePassModal(false)}>Отмена</Button>
                    </div>
                </Modal.Body>

                    
             </Modal>
        </div>
     
  )

}