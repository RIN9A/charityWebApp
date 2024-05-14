import { useState } from "react"
import { useSelector } from "react-redux"
import { useEffect } from "react"
import { HiArrowNarrowUp, HiDocumentText } from "react-icons/hi"
import { HiBuildingOffice2 } from "react-icons/hi2"
import { BiDonateHeart } from "react-icons/bi"
import { Button, Table } from "flowbite-react"
import {Link} from 'react-router-dom'

export default function DashboardComp() {

    //const [users, setUsers] = useState([])
    const [posts, setPosts] = useState([])
    const [organizations, setOrganizations] = useState([])
    const [donations, setDonations] = useState([])

    const [totalPosts, setTotalPosts] = useState(0)
    const [totalOrganizations, setTotalOrganizations] = useState(0)
    const [lastMonthUsers, setLastMonthUsers] = useState(0)
    const [lastMonthPosts, setLastMonthPosts] = useState(0)
    const [lastMonthOrganizations, setLastMonthOrganizations] = useState(0)
    const [totalDonations, setTotalDonations] = useState(0)
    const [lastMonthDonations, setLastMonthDonations] = useState(0)
    const [totalSumDonations, setTotalSumDonations] = useState(0);
    const [sumLastDonations, setSumLastDonations] = useState(0);

    const { currentUser } = useSelector((state) => state.user)
    
    useEffect(() => {
        /*
        const fetchUsers = async () => {
            const res = await fetch('/api/users/getusers?limit=5')
            const data = await res.json()
            if(res.ok) {
                //setUsers(data.users)
                setTotalUsers(data.totalUsers)
                setLastMonthUsers(data.lastMonthUsers)
            }
        }
        */

        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/post/getposts?limit=5')
                const data = await res.json()
                if(res.ok) {
                    setPosts(data.posts)
                    setTotalPosts(data.countAllPosts.count);
                    setLastMonthPosts(data.countLastMonthPosts.count)
                }

            } catch (error) {
                console.log(error.message)
            }

        }

        const fetchOrganizations = async () => {
            try {
                const res = await fetch('/api/organization/getOrganizations?limit=5')
                const data = await res.json()
                if(res.ok) {
                    setOrganizations(data.organizations)
                    setTotalOrganizations(data.countAllOrganizations.count);
                    setLastMonthOrganizations(data.lastMonthOrganizations.count)
                }

            } catch (error) {
                console.log(error.message)
            }


        }
        const fetchDonations = async () => {
            try{
                const res = await fetch('/api/donation/getDonationsOne')
                const data = await res.json()
                if(res.ok) {
                    setDonations(data.donations)
                    setTotalDonations(data.countAllDonations.count)
                    setLastMonthDonations(data.countLastMonthDonations.count)
                    setTotalSumDonations(data.totalSumDonation.sum)
                    setSumLastDonations(data.lastSumDonation.sum)
                }
            }catch (error) {
                console.log(error.message)
            }
        }

        if(currentUser.user.isAdmin) {
            //fetchUsers()
            fetchPosts()
            fetchOrganizations()
            fetchDonations()
        }

    }, [currentUser])




    

  return (
    <div className="p-3 md:mx-auto">
        <div className="flex-wrap flex gap-4 justify-center">
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full
        rounded-md shadow-md">
            <div className="flex justify-between">
                <div className="">
                <h3 className="text-gray-500 text-md uppercase">Все Посты</h3>
                <p className="text-2xl">{totalPosts}</p>
                </div>
                <HiDocumentText className="bg-blue-800 text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>
            <div className="flex gap-2 text-sm">
                <span className="text-green-500 flex items-center">
                    <HiArrowNarrowUp />
                    {lastMonthPosts}
                </span>
                <div>За последний месяц</div>

            </div>
            </div>
            <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full
        rounded-md shadow-md">
            <div className="flex justify-between">
                <div className="">
                <h3 className="text-gray-500 text-md uppercase">Все Организации</h3>
                <p className="text-2xl">{totalOrganizations}</p>
                </div>
                <HiBuildingOffice2 className="bg-teal-700 text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>
            <div className="flex gap-2 text-sm">
                <span className="text-green-500 flex items-center">
                    <HiArrowNarrowUp />
                    {lastMonthOrganizations}
                </span>
                <div>За последний месяц</div>
            </div>
            </div>
            <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full
        rounded-md shadow-md">
            <div className="flex justify-between">
                <div className="">
                <h3 className="text-gray-500 text-md uppercase">Сумма пожертвоаний</h3>
                {/*<p className="text-xl"> Количество: {totalDonations}</p> */}
                <p className="text-xl">{totalSumDonations} руб.</p>
                </div>
                <BiDonateHeart className="bg-rose-600 text-white rounded-full text-5xl p-3 shadow-lg" />
            </div>
            <div className="flex gap-2 text-sm">
                {/* 
            <div>Количество</div>

                <span className="text-green-500 flex items-center">
                    <HiArrowNarrowUp />
                    {lastMonthDonations}
                </span>
                <div>За последний месяц</div>
            </div>
            */}

                <span className="text-green-500 flex">
                    <HiArrowNarrowUp />
                    {sumLastDonations} руб.
                </span>
                <div>За последний месяц</div>

            </div>
            </div>
            </div>
            <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
                <div className="flex flex-col w-full md:w-auto border border-blue-300 shadow-md p-2 rounded-md dark:bg-gray-800">
                    <div className="flex justify-between p-3 text-sm font-semibold">
                        <h1 className="text-center p-2">Недавние посты</h1>
                        <Button outline gradientDuoTone="cyanToBlue" >
                            <Link to={'/dashboard?tab=posts'}>Посмотреть все</Link>
                        </Button>
                    </div>
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>Изображение</Table.HeadCell>
                            <Table.HeadCell className="text-center">Заголовок</Table.HeadCell>
                            <Table.HeadCell>Категория</Table.HeadCell>
                        </Table.Head>
                        {posts && posts.map((post) => (
                            <Table.Body key={post.id} className="divide-y">
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell>
                                    <img
                        src={post.image}
                        alt='user'
                        className='w-14 h-10 rounded-md bg-gray-500'
                      />
                                    </Table.Cell>
                                    <Table.Cell className='w-96 text-center'>{post.title}</Table.Cell>
                    <Table.Cell className='w-5'>{post.category}</Table.Cell>

                                </Table.Row>

                            </Table.Body>
                        ))}

                    </Table>

                </div>
                <div className="flex flex-col w-full md:w-auto shadow-md border border-blue-300 p-2 rounded-md  dark:bg-gray-800">
                    <div className="flex justify-between p-3 text-sm font-semibold ">
                        <h1 className="text-center p-2">Недавно добавленные организации</h1>
                        <Button outline gradientDuoTone='cyanToBlue'>
                            <Link to={'/dashboard?tab=organizations'}>Посмотреть все</Link>
                        </Button>
                    </div>
                    <Table hoverabl >
                        <Table.Head>
                            <Table.HeadCell className="text-center">Наименование</Table.HeadCell>
                            <Table.HeadCell className="text-center">Регион</Table.HeadCell>
                            <Table.HeadCell className="text-center">Вид организации</Table.HeadCell>
                        </Table.Head>
                        {organizations && organizations.map((organization) => (
                            <Table.Body key={organization.id} className="divide-y">
                                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    
                                    <Table.Cell className='w-96'>{organization.name}</Table.Cell>
                    <Table.Cell className='w-5 text-center'>{organization.region}</Table.Cell>
                    <Table.Cell className='w-5 text-center'>{organization.form}</Table.Cell>

                                </Table.Row>

                            </Table.Body>
                        ))}

                    </Table>

                </div>
            </div>


        </div>
        

  )
}
