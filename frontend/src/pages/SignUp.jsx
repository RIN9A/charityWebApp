import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleSubmit = async(e) => {
    e.preventDefault();
    if(!formData.email || !formData.password) {
      return setErrorMessage('Все поля должны быть заполнены :)');
    }
    if(formData.password !== formData.passwordTwo) {
      return setErrorMessage('Пароли не совпадают!');
    }
  try {
    setErrorMessage(null);
    setLoading(true);
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if(data.success !== true) {
       return setErrorMessage(data.errors[0].msg);
    }
    setLoading(false);
    if(res.ok) {
      navigate('/sign-in')
    }
  } catch(error) {
    setErrorMessage(error.message);
    setLoading(false);
  }
}

    
  return (
    <div className="min-h-screen mt-20">
    <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row 
    md:items-center gap-5'>
      {/* left */}
      <div className='felx-1'>
      <Link 
        to="/" 
        className="font-bold dark:text-white text-4xl">
            
        <span className="px-2 py-1 bg-gradient-to-tr from-blue-600
         via-sky-400 to-cyan-300 rounded-lg text-white">
            Добро
            </span>
        Вместе
        </Link>
        <p className='text-sm mt-5'>
          Добро пожаловать в наш проект!
        </p>
      </div>
      {/* right */}
      <div className='flex-1'>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>

          <div>
            <Label value='Ваш адрес электронной почты'/>
            <TextInput
            type='email'
            placeholder='example@exmpl.com'
            id='email' onChange={handleChange}/>
            
          </div>
          <div>
            <Label value='Придумайте пароль'/>
            <TextInput
            type='password'
            placeholder='Пароль'
            id='password' onChange={handleChange}/>

          </div>

          <div>
            <Label value='Повторите пароль'/>
            <TextInput
            type='password'
            placeholder='Повторите пароль'
            id='passwordTwo' onChange={handleChange}/>

          </div>
          <Button gradientDuoTone='purpleToBlue' type='submit' disabled={loading}>
            {
              loading ? (
                <>
                <Spinner size="sm"/>
                <span className='pl-3'>Loading...</span>
                </>
              ) : ('Зарегистрироваться')
            }
          </Button>
        </form>
      <div className='flex gap-2 text-sm mt-5'>
        <span>Уже зарегистрированы?</span>
        <Link to='/sign-in' className='text-blue-500'>Вход</Link>
      </div>
      {
        errorMessage && (
          <Alert className='mt-5' color='failure'>
            {errorMessage}
          </Alert>
        )
      }
      </div>
    </div>
    </div>

  )
}
