import { Modal, Alert, Button, TextInput, Label } from 'flowbite-react';

import { useState } from "react";
import {useSelector} from 'react-redux'
import CurrencyInput from 'react-currency-input-field';
import { Link, useParams } from "react-router-dom";


export default function DonationModal() {
  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState('');
  const {currentUser} = useSelector(state => state.user);
  const [disabledOther, setDisabledOther] = useState(true);
  const { organizationId } = useParams();
  const [success, setSuccess] = useState(null);
  const [publishError, setPublishError] = useState(null)

  const [formData, setFormData] = useState({
    amount: "100",
    time_pay: "only-one",
    email: currentUser.user.email,

  });

  //const [selectedValue, setSelectedValue] = useState("")



  function onCloseModal() {
    setOpenModal(false);
    setEmail('');
    setSuccess(null)
    setPublishError(null)
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
        const res = await fetch(`/api/donation/addDonation/${organizationId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        if(!res.ok || !res.success) {
            setPublishError(data.message);
            setSuccess(null);
            return
        }
        
        if(res.ok) {
            setSuccess("Благодарим за помощь!\nВаше пожертвование успешно отрпавено.")
            setPublishError(null)
            //navigate(`/post/${data.updatePost.slug}`)
        }
    } catch (error) {
        console.log(error.message)
        setSuccess(null)
        //setPublishError('Упс... Что-то пошло не так')

    }
}

  return (
    <>
      <Button gradientDuoTone="purpleToPink" onClick={() => setOpenModal(true)}>
       Помочь
      </Button>
      <Modal show={openModal} size="lg" onClose={onCloseModal} popup className=''>
     <Modal.Header className='bg-slate-200' />
     <Modal.Body className='bg-slate-200'>
     <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <div className="mb-2 block justify-between">
      <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-3">Помогите нам сделать этот мир лучше!</h3>

       <div class="flex flex-wrap mb-2">
        <div class="flex items-center ">
        <input
         type="radio" id="time-pay-one" name="time-pay" value="only-one" class="hidden peer"  
        onChange={(e) =>
            setFormData({...formData, time_pay: e.target.value}) }
        required defaultChecked/>
        <label for="time-pay-one" class="inline-flex text-sm  items-center justify-between  p-2 text-gray-500 bg-white border border-gray-200 rounded-l-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
            <div class="block">
                <div>Один раз</div>
            </div>
            
        </label>
        </div>
        <div class="flex items-center">
        <input type="radio" id="time-pay-month" 
        onChange={(e) =>
            setFormData({...formData, time_pay: e.target.value}) }
        name="time-pay" value="every-month" class="hidden peer"  />
        <label for="time-pay-month" class="inline-flex text-sm   items-center justify-between  p-2 text-gray-500 bg-white border border-gray-200 rounded-r-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
            <div class="block">
                <div>Ежмемесячно</div>
            </div>
            
        </label>
        </div>
       </div>
        <p className='mb-2'>Выберите сумму пожертования</p>
        <div class="flex flex-wrap">
        <div class="flex items-center me-1 mb-2">
        <input type="radio" id="amount-100"
         name="amount" value="100" class="hidden peer" required defaultChecked   onClick={(event) =>
         { setDisabledOther(true), setFormData({...formData, amount: event.target.value})}}/>
        <label for="amount-100" class="inline-flex text-sm   items-center justify-between  p-2 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
            <div class="block">
                <div>100 р</div>
            </div>
            
        </label>
        </div>
        <div class="flex items-center me-1 mb-2">

        <input type="radio" id="amount-200" name="amount" value="200" class="hidden peer"  onClick={(event) =>
         { setDisabledOther(true), setFormData({...formData, amount: event.target.value})}}/>
        <label for="amount-200" class="inline-flex text-sm   items-center justify-between  p-2 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700" >                           
            <div class="block">
                <div>200 р</div>
            </div>
            
        </label>
        </div>
        <div class="flex items-center me-1 mb-2">
        <input type="radio" id="amount-500" name="amount" value="500" class="hidden peer"  onClick={(event) =>
         { setDisabledOther(true), setFormData({...formData, amount: event.target.value})}}/>
        <label for="amount-500" class="inline-flex text-sm   items-center justify-between p-2 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
            <div class="block">
                <div>500 р</div>
            </div>
            
        </label>
        </div>
        <div class="flex items-center me-1 mb-2">
        <input type="radio" id="amount-1000" name="amount" value="1000" class="hidden peer"  onClick={(event) =>
         { setDisabledOther(true), setFormData({...formData, amount: event.target.value})}} />
        <label for="amount-1000" class="inline-flex text-sm  items-center justify-between p-2 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
            <div class="block">
                <div>1000 р</div>
            </div>
            
        </label>
        </div>
        <div class="flex items-center me-1 mb-2">
        <input type="radio" id="amount-3000" name="amount" value="3000" class="hidden peer"  onClick={(event) =>
         { setDisabledOther(true), setFormData({...formData, amount: event.target.value})}} />
        <label for="amount-3000" class="inline-flex text-sm   items-center justify-between p-2 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
            <div class="block">
                <div>3000 р</div>
            </div> 
        </label>
        </div>
        <div class="flex items-center me-1">
        <input type="radio" id="amount-other" name="amount" class="hidden peer" onClick={(event) => setDisabledOther(false)}/>
        <label for="amount-other" class="inline-flex text-sm   items-center justify-between p-2 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700">                           
            <div class="block">
                <div>Другая сумма  
                </div>
          
            </div> 
            
        </label>
        <CurrencyInput intlConfig={{ locale: 'ru', currency: 'RUB'}} id="currency-input" 
        className="text-sm  text-gray-900 bg-gray-50 rounded-lg  border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-s-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500" placeholder="Enter amount"  
        onChange={(event) => setFormData({...formData, amount: event.target.value})}
        disabled={disabledOther}  defaultValue={formData.amount}/>

        </div>
        </div>
        <div>
        <Label htmlFor ="email" value='Введите адрес электронной почты'/>
            <TextInput
            type='email'
            placeholder='example@email.com'
            id='email'
            defaultValue={currentUser.user.email}
            onChange={(event) => setFormData({...formData, email: event.target.value })}  
            required
            />
               
            
            </div>

      </div>
      <Button outline  gradientMonochrome="info" type='submit'>Пожертвовать</Button>
      {success && (
            <Alert className="mt-5" color="success">
              {success}
            </Alert>
          )}
          {publishError && (
            <Alert className="mt-5" color="failure">
              {publishError}
            </Alert>
          )}
      </form>

     </Modal.Body>
     </Modal>
    </>
    
  )
}
