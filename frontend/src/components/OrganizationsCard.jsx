import { Link } from 'react-router-dom'

export default function OrganizationsCard ({ organization }) {

    return(
        <div className='group relative w-full border border-indigo-500 hover:border-2 h-[350px] overflow-hidden rounded-lg sm:w-[380px] transition-all'>
            <Link to={`/organization/${organization.id}`}>
                <img src={organization.img}
                alt='organization cover'
                className='h-[210px] w-full object-cover group-hover:h-[150px] transition-all duration-300 z-20' />
            </Link>
            <div className='p-3 flex flex-col gap-2'>
                <p className='text-base font-semibold line-clamp-3'>{organization.name}</p>
                <span className='italic text-sm'>{organization.region}</span>
                <Link to={`/organization/${organization.id}`} className='z-10 group-hover:bottom-0 absolute bottom-[-150px] left-0 right-0 border border-indigo-700 text-indigo-700 hover:text-white transition-all duration-300 text-center
                py-2 rounded-md !rounded-tl-none m-2'>Перейти
                </Link>
            </div>

        </div>
    )
}