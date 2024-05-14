import {Link} from 'react-router-dom'
import { Progress } from "flowbite-react";


export default function ProjectsCard({ project }) {

    return(
        <div className='group relative w-full border border-indigo-500 hover:border-2 h-[400px] overflow-hidden rounded-lg sm:w-[380px] transition-all'>
       
                <img src={project.img}
                alt='project cover'
                className='h-[200px] w-full object-cover group-hover:h-[150px] transition-all duration-300 z-20' />
        
            <div className='p-2 flex flex-col gap-2'>
                <p className='text-lg font-semibold line-clamp-2'>{project.title}</p>
                <span className='italic text-sm'>{project.mission}</span>

                <div class="flex justify-between mb-1">
                     <span class="text-base font-medium text-blue-700 dark:text-white">Собрано: {project.sumNow}</span>
                      <span class="text-base font-medium text-blue-700 dark:text-white">Цель {project.endSum}</span>
                      </div>
                      <Progress progress={Math.round(project.sumNow / project.endSum * 100)} color="indigo" progressLabelPosition="inside" labelProgress size='lg'/>
            </div>

        </div>
    )
}