import { Alert, Button, Label, TextInput, FileInput } from "flowbite-react";
import {useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { useState } from "react";
import "react-quill/dist/quill.snow.css";
import { getDownloadURL, getStorage,uploadBytesResumable, ref,} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useSelector } from "react-redux";

export default function AddReport() {
  const { currentUser } = useSelector((state) => state.user);
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [reportError, setReportError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [sumError, setSumError] = useState(null);
  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError("Пожалуйста выберете изображение");
        setSuccess(null);
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = "report/" +  currentUser.user.id + "/" + new Date().getTime() +"-" +file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
          setSuccess(null);
        },
        (error) => {
          setImageUploadError("Не удалось загрузить изображение");
          setImageUploadProgress(null);
          setSuccess(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setSuccess(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Не удалось загрузить изображение");
      setSuccess(null);

      setImageUploadProgress(null);
      console.log(error.message);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setFormData({ ...formData, organization_ogrn: currentUser.user.id });
      const res = await fetch("/api/organization/addReport", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setReportError(data.error);
        setSuccess(null);

        return;
      }

      if (res.ok) {
        setReportError(null);
        setSuccess("Отчет успешно отправлен)\nБлагодарим за честность!");
      }
    } catch (error) {
      setReportError("Упс... Что-то пошло не так");
    }
  };
  return (
    <div className="p-3 max-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Добавление Отчета</h1>
      <form className=" sm:items-center  flex flex-col max-w mx-auto " onSubmit={handleSubmit} >
        <div class="   border border-yellow-300  rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-yellow-700">
          <div className="grid gap-4 mb-6">
            <div>
              <TextInput type="text" placeholder="Заголовок" required id="title" className="flex-1"
                onChange={(e) => { setFormData({ ...formData, title: e.target.value }); 
                setFormData({
                    ...formData,
                    organization_ogrn: currentUser.user.id,}); }}/>
            </div>
            <div>
              <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
                <FileInput type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])}/>
                <Button type="button" gradientDuoTone="purpleToBlue" size="sm" outline onClick={handleUploadImage} disabled={imageUploadProgress}>
                  {imageUploadProgress ? (
                    <div className="w-16 h-16">
                      <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`}/>:</div>
                  ) : (
                    "Загрузить изображение"
                  )}
                </Button>
              </div>
              {imageUploadError && (
                <Alert color="failure">{imageUploadError}</Alert>
              )}
              {formData.image && (
                <img src={formData.image} alt="upload" className="w-full h-72 object-cover "/>
              )}
            </div>
            <div><Label value="Сумма" />
              <TextInput type="text" placeholder="Сумма" id="sum"
                onChange={(e) =>
                  setFormData({ ...formData, sum: e.target.value })
                }
              />
            </div>
            {sumError && (
              <Alert className="mt-5" color="failure">
                {sumError}
              </Alert>
            )}
          </div>
          <Button gradientDuoTone="redToYellow" type="submit" outline>
            {" "}
            Сохранить{" "}
          </Button>
          {reportError && (
            <Alert className="mt-5" color="failure">
              {reportError}
            </Alert>
          )}
          {success && (
            <Alert className="mt-5" color="success">
              {success}
            </Alert>
          )}
        </div>
      </form>
    </div>
  );
}
