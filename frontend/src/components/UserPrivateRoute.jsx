import { useSelector } from "react-redux"
import { Outlet, Navigate } from "react-router-dom"
import { Alert } from "flowbite-react";

export default function UserPrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  return (currentUser && (currentUser.user.isAdmin || currentUser.user.isPersnOrg)) ? <Outlet /> : <Navigate to='/sign-in'  />
}
