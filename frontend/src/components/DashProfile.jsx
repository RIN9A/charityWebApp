import { Alert, Button, Modal, ModalBody, TextInput, Label } from "flowbite-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateUserError(null);
    setUpdateUserSuccess(null);
    if (Object.keys(formData).length === 0) {
      setUpdateUserError("Изменения не внесены");
      return;
    }
    try {
      dispatch(updateStart());
      const res = await fetch(`/api/user/update/${currentUser.user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.errors[0].msg));
        setUpdateUserError(data.errors[0].msg);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("Данные успешно обнолвены");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };
  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser.user.id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.errors[0].msg));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.errors[0].msg);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className=" mx-auto p-3 w-full max-w-lg">
      <h1 className="my-7 text-center font-semibold text-3xl">Профиль</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 border border-yellow-300 bg-white  rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-yellow-700"
      >
        {(currentUser.user.isPersnOrg && !currentUser.user.isAdmin) && (
           

           <span>
            <Label value='ОГРН: '/><Label value={currentUser.user.id}/> 
            </span>

      
        )}
      

        <TextInput
          type="text"
          id="email"
          placeholder="email"
          defaultValue={currentUser.user.email}
          onChange={handleChange}
        />

        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={handleChange}
        />

        <Button
          type="submit"
          gradientDuoTone="purpleToBlue"
          outline
          disabled={loading}
        >
          {loading ? "Loading..." : "Изменить"}
        </Button>
        {/*
        <Link to={"/organization/project-event"}>
                <Button
                  type="button"
                  gradientDuoTone="purpleToBlue"
                  className="w-full"
                  outline
                >
                  Добавить проект/мероприятие
                </Button>
              </Link>
              */}
        {(currentUser.user.isAdmin ||  currentUser.user.isPersnOrg) && (

          <div>
             {(currentUser.user.isPersnOrg && !currentUser.user.isAdmin) && (
            <span>
              <Link to={"/organization/create-post"}>
                <Button
                  type="button"
                  gradientDuoTone="purpleToBlue"
                  className="w-full"
                  outline
                >
                  Создать публикацию
                </Button>
              </Link>
              
            </span>
             )}
             
            {currentUser.user.isAdmin && (
           <span>
            <Link to={"/create-post"}>
                <Button
                  type="button"
                  gradientDuoTone="purpleToBlue"
                  className="w-full"
                  outline
                >
                  Создать публикацию
                </Button>
              </Link>
            <Link to={"/add-organization"}>
              <Button
                type="button"
                gradientDuoTone="redToYellow"
                outline
                className="w-full mt-5"
              >
                Добавиь организацию
              </Button>
            </Link>
            </span>
            )}
          </div>
        )}
      </form>
      <div className="text-red-500 flex justify-between mt-5">
     
        <Button
          onClick={() => setShowModal(true)}
          outline
          gradientDuoTone="pinkToOrange"
          className="cursor-pointer "
        >
          Удалить аккаунт
        </Button>
        <Button
          onClick={handleSignOut}
          outline
          gradientDuoTone="pinkToOrange"
          className="cursor-pointer"
        >
          Выйти
        </Button>
      </div>
      {updateUserSuccess && (
        <Alert color="success" className="mt-5">
          {updateUserSuccess}
        </Alert>
      )}
      {updateUserError && (
        <Alert color="failure" className="mt-5">
          {updateUserError}
        </Alert>
      )}
      {error && (
        <Alert color="failure" className="mt-5">
          {error}
        </Alert>
      )}

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle
              className="h-14 w-14 text-gray-400
                        dark:text-gray-200 mb-4 mx-auto"
            />
            <h3 className="mb-5 text-lg text-gray-500 dark:to-gray-400">
              Вы уверены, что хотите удалить аккаунт?
            </h3>
          </div>
          <div className="flex justify-center gap-4">
            <Button
              gradientMonochrome="failure"
              outline
              onClick={handleDeleteUser}
            >
              Да
            </Button>
            <Button
              gradientMonochrome="cyan"
              outline
              onClick={() => setShowModal(false)}
            >
              Нет, отмена
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
