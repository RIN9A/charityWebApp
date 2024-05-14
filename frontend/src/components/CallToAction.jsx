
import { Button } from "flowbite-react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"

export default function CallToAction() {
  const { currentUser } = useSelector(state => state.user)
  return (
    
    
    <div>
      <div className='flex flex-col sm:flex-row p-3 border border-teal-500
      justify-center items-center rounded-tl-3xl rounded-br-3xl text-center '>
        
        <div className='flex-1 justify-center flex flex-col'>
          
          <h2 className='text-2xl'>
            Хотите узнать больше о мероприятиях нашей организации ?
          </h2>
          <p className='text-gray-500 my-2'>
            Посмотрите мероприятия, которые мы проводим
          </p>
          
          <Button gradientDuoTone='purpleToBlue' className='rounded-tl-xl rounded-bl-none'>
            <a href="https:/www/projectsOrganization.com" target="_blank" rel='something'>
              Проекты и меропиятия  
            </a>
        </Button>
        </div>
        
        <div className="p-7 flex-2">
            <img src="https://firebasestorage.googleapis.com/v0/b/dobrovmeste-da020.appspot.com/o/adminImage%2FPictoreCallToAction.png?alt=media&token=00a271a1-31b6-46e0-a764-061f386583ec" 
            className='max-h-[150px]  object-center'/>
        </div>
       
    </div>
   
    </div>
  )}
    

