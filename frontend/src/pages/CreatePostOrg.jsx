import { TextInput, Select, FileInput, Button, Alert } from "flowbite-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
  ref,
} from "firebase/storage";
import { app } from "../firebase";
import { useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function CreatePostOrg() {
  const { currentUser } = useSelector((state) => state.user);

  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);

  const navigate = useNavigate();

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Пожалуйста выберете изображение");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName =
        "organization_post/" +
        currentUser.user.id +
        "/" +
        new Date().getTime() +
        "-" +
        file.name;
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
    try {
      const res = await fetch(
        `/api/organization/create-post/${currentUser.user.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.errors[0].msg);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/organization/post/${data.post.slug}`);
      }
    } catch (error) {
      setPublishError("Упс... Что-то пошло не так");
    }
  };
  return (
    <div className="p-3 max-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">
        Создать запись
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
          />
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
            <option value="Информация">Информация</option>
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
          placeholder="Напишите что-нибудь..."
          className="h-72 mb-12"
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Отправить
        </Button>
        {publishError && (
          <Alert className="mt-5" color="failure">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
}
