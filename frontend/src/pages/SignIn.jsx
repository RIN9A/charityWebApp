import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [errorPublish, setErrorPublish] = useState("");

  const {loading, error: errorMessage } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  const handleSubmit = async(e) => {
    e.preventDefault();
    if(!formData.email || !formData.password) {
      return dispatch(signInFailure('Все поля должны быть заполнены :)'));
    }
  try {
    dispatch(signInStart());
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    const data = await res.json();
    if(data.success !== true) {
       dispatch(signInFailure(data.errors[0].msg));
       setErrorPublish(data.errors[0].msg);
    }
    if(res.ok) {
      dispatch(signInSuccess(data));
      navigate('/')
    }
  } catch(error) {
    dispatch(signInFailure(error.errorMessage));
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
          С возвращением!
        </p>
      </div>
      {/* right */}
      <div className='flex-1'>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
          <div>
            <Label value='Введите адрес электронной почты'/>
            <TextInput
            type='email'
            placeholder='example@exmpl.com'
            id='email' onChange={handleChange}/>
            
          </div>
          <div>
            <Label value='Введите пароль'/>
            <TextInput
            type='password'
            placeholder='********'
            id='password' onChange={handleChange}/>

          </div>
          <Button gradientDuoTone='purpleToBlue' type='submit' disabled={loading}>
            {
              loading ? (
                <>
                <Spinner size="sm"/>
                <span className='pl-3'>Loading...</span>
                </>
              ) : ('Войти')
            }
          </Button>
        </form>
      <div className='flex gap-2 text-sm mt-5'>
        <span>Еще не зарегистрированы?</span>
        <Link to='/sign-up' className='text-blue-500'>Регистрация</Link>
      </div>
     
      {
        errorMessage && (
          <Alert className='mt-5' color='failure'>
            {errorMessage}
          </Alert>

          
        )
      }
      {
        errorPublish && (
          <Alert className='mt-5' color='failure'>
            {errorPublish}
          </Alert>

          
        )
      }
      </div>
    </div>
    </div>

  );
}
