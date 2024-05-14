import { Modal, Table, Button } from 'flowbite-react';
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useState } from "react"
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from 'react-icons/hi';


export default function DashPosts() {
    const {currentUser} = useSelector((state) => state.user)
    const [userPosts, setUserPosts] = useState([])
    const [showMore, setShowMore] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [postIdToDelete, setPostIdToDelete] = useState('');
    const [openModal, setOpenModal] = useState(false);
    useEffect(() => {
        const fetchPosts = async() => {
            let res ='';
        try {
            if(currentUser.user.isAdmin){
             res = await fetch(`/api/post/getposts`); 
            } else if(currentUser.user.isPersnOrg){
                res = await fetch(`/api/post/getposts?userId=${currentUser.user.id}`); 

            }
                const data = await res.json()
                if(res.ok) {
                    setUserPosts(data.posts)
                    if(data.posts.length < 9){
                        setShowMore(false)
                    }

                }
            }catch(error) {
                console.log(error.message)
            
            }
        };

        if(currentUser.user.isPersnOrg){
            fetchPosts();
        } 
    
    }, [currentUser.user.id]);

    const handleShowMore = async () => {
        const startIndex = userPosts.length;
        let res ='';
        try {
            if(currentUser.user.isAdmin){
             res = await fetch(`/api/post/getposts?startIndex=${startIndex}`); 
            } else if(currentUser.user.isPersnOrg){
                res = await fetch(`/api/post/getposts?userId=${currentUser.user.id}&startIndex=${startIndex}`); 

            }
         

            const data = await res.json();
            if(res.ok) {
                setUserPosts((prev) => [...prev, ...data.posts]);
                 if(data.posts.length < 9) {
                    setShowMore(false);
                 }
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    const handleDeletePost = async () => {
        setShowModal(false);
        try{
        const res = await fetch(`/api/user/deletepost/${postIdToDelete}/${currentUser.user.id}`,{
            method: 'DELETE',
        });
        const data = await res.json();
        if(!res.ok) {
            console.log(data.errors[0].msg)
        } else {
            setUserPosts((prev) =>
            prev.filter((post) => post.id !== postIdToDelete));
        }
        }catch(error) {
            console.log(error.message)
        }
    }


  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar
     scrollbar-track-slate-100 scrollbar-thumb-slate-300
     dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
        {(currentUser.user.isPersnOrg ) && userPosts.length > 0 ? (
            <>
            <Table hoverable className="shadow-md">
                <Table.Head>
                    <Table.HeadCell>Дата последнего обновления</Table.HeadCell>
                    <Table.HeadCell>Изображение</Table.HeadCell>
                    <Table.HeadCell>Заголовок</Table.HeadCell>
                    <Table.HeadCell>Категория</Table.HeadCell>
                    <Table.HeadCell>Статус</Table.HeadCell>
                    {(currentUser.user.isAdmin ) &&
                    <Table.HeadCell>Удалить</Table.HeadCell>  } 
                    {(currentUser.user.isAdmin ) &&
                    <Table.HeadCell>
                        <span>Изменить</span>
                    </Table.HeadCell>}
                </Table.Head>
                {userPosts.map((post) => (
                    <Table.Body className='divide-y'>
                        <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                            <Table.Cell>
                                {new Date(post.updatedAt).toLocaleDateString()}
                            </Table.Cell>
                            <Table.Cell>
                                <Link to={(`/post/${post.slug}`)}>
                                    <img 
                                        src={post.image}
                                        alt={post.title}
                                        className="w-20 h-10 object-cover bg-gray-500"
                                    />
                                </Link>
                            </Table.Cell>
                            <Table.Cell>
                                <Link className='font-medium text-gray-900 dark:text-white' 
                                to={`/post/${post.slug}`}>
                                    {post.title}</Link>
                            </Table.Cell>
                            <Table.Cell>
                                {post.category}
                            </Table.Cell>
                            <Table.Cell>
                    
                                {post.status}
                            </Table.Cell>
                            {(currentUser.user.isAdmin ) &&
                            <Table.Cell className='font-medium text-red-500 hover:underline cursor-pointer'>
                                <span onClick={() => {setShowModal(true);
                                setPostIdToDelete(post.id)}}>Удалить</span>
                            </Table.Cell>
                            }
                            {(currentUser.user.isAdmin ) &&
                            <Table.Cell>
                                <Link className='text-blue-600 hover:underline cursor-pointer' to={`/update-post/${post.id}`}>
                                <span>
                                    Изменить
                                </span>
                                </Link>
                            </Table.Cell>
                            }
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
            <p>Список ваших постов еще пуст!</p>
        ) }
        <Modal show={showModal} onClose={() => setShowModal(false)}
              popup size='md'>
                <Modal.Header />
                <Modal.Body>
                    <div className="text-center">
                        <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400
                        dark:text-gray-200 mb-4 mx-auto' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:to-gray-400'>Вы уверены, что хотите удалить пост?</h3>
                    </div>
                    <div className='flex justify-center gap-4'>
                        <Button gradientMonochrome="failure"  outline onClick={handleDeletePost}>Да</Button>
                        <Button gradientMonochrome="cyan" outline onClick={() => setShowModal(false)}>Нет, отмена</Button>
                    </div>
                </Modal.Body>

                    
             </Modal>
        </div>
     
  )

}