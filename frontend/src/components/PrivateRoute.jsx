import { useSelector } from "react-redux"
import { Outlet, Navigate } from "react-router-dom"
import { Alert } from "flowbite-react";
import { useState } from 'react';


export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);

  if (!currentUser) {
    alert('Пожалуйста, авторизуйтесь для доступа к этой странице.');
    return <Navigate to='/sign-in' />;
  }

  return <Outlet />;
}
