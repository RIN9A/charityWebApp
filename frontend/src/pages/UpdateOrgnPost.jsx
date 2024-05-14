﻿import { TextInput, Select, FileInput, Button, Alert } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import { app } from "../firebase";
import { useState, useEffect } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UpdateOrgnPost() {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);
  const { postId } = useParams();

  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    try {
      const fetchPosts = async () => {
        const res = await fetch(
          `/api/organization/post/getposts?postId=${postId}`
        );

        console.log(postId);
        const data = await res.json();
        console.log(data);
        if (!res.ok) {
          console.log(data.errors[0].msg);
          setPublishError(data.errors[0].msg);
          setUpdateSuccess(null);
          return;
        }
        if (res.ok) {
          setPublishError(null);
          setUpdateSuccess(null);
          setFormData(data.posts[0]);
          console.log(formData);
        }
      };
      fetchPosts();
    } catch (error) {
      console.log(error.message);
    }
  }, [postId]);

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Пожалуйста выберете изображение");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = 'posts/' + currentUser.user.id + '/' + new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Не удалось загрузить изображение");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Не удалось загрузить изображение");
      setImageUploadProgress(null);
      console.log(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      let res;
      if(currentUser.user.isAdmin){
       res = await fetch(`/api/organization/update-post/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
    } else if(currentUser.user.isPersnOrg) {
      res = await fetch (`/api/organization/update-post/${postId}/${currentUser.user.isPersnOrg}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
    }
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.errors[0].msg);
        setUpdateSuccess(null);

        return;
      }

      if (res.ok) {
        setPublishError(null);
        console.log(data);
        setUpdateSuccess("Данные успешно обновлены!");

        if (data.updatePost.status === "Опубликован") {
          navigate(`/post/${data.updatePost.slug}`);
        } else {
          setUpdateSuccess("Данные успешно обновлены!");
        }
      }
    } catch (error) {
      console.log(error.message);
      setPublishError("Упс... Что-то пошло не так");
      setUpdateSuccess(null);
    }
  };
  return (
    <div className="p-3 max-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">
        Изменить запись
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Заголовок"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            value={formData.title}
          />

          {currentUser.user.isAdmin && (
            <>
              {formData.status == "Опубликован" ? (
                <Select
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  value={formData.status}
                  id="status"
                  disabled
                >
                  <option value="Ждет обработки">Ждет обработки</option>
                  <option value="Опубликован">Опубликован</option>
                  <option value="Отказ">Отказ</option>
                </Select>
              ) : (
                <Select
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  value={formData.status}
                  id="status"
                >
                  <option value="Ждет обработки">Ждет обработки</option>
                  <option value="Опубликован">Опубликован</option>
                  <option value="Отказ">Отказ</option>
                </Select>
              )}
            </>
          )}

          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            value={formData.category}
            id="category"
          >
            <option value="uncategorized">Выбрать категорию</option>
            <option value="Здравоохранение и ЗОЖ">Здравоохранение и ЗОЖ</option>
            <option value="ЧС">ЧС</option>
            <option value="Ветераны">Ветераны</option>
            <option value="Дети">Дети</option>
            <option value="Животные">Животные</option>
            <option value="Экология">Экология</option>
            <option value="Старшее поколение">Старшее поколение</option>
            <option value="Люди с ОВЗ">Люди с ОВЗ</option>
            <option value="Ментальное здоровье">Ментальное здоровье</option>
            <option value="Права человека">Права человека</option>
            <option value="Культура">Культура</option>
            <option value="Наука">Наука</option>
            <option value='Информация'>Информация</option>
            <option value="Другое">Другое</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={handleUploadImage}
            disabled={imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={imageUploadProgress}
                  text={`${imageUploadProgress || 0}%`}
                />
                :
              </div>
            ) : (
              "Загрузить изображение"
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover "
          />
        )}
        <ReactQuill
          theme="snow"
          value={formData.content}
          placeholder="Напишите что-нибудь..."
          className="h-72 mb-12"
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Обновить
        </Button>
        {updateSuccess && (
          <Alert className="mt-5" color="success">
            {updateSuccess}
          </Alert>
        )}

        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}
