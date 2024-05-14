import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextInput, Select, Button, Alert, FileInput } from "flowbite-react";
import { CircularProgressbar } from "react-circular-progressbar";
import { getStorage, uploadBytesResumable } from "firebase/storage";
import { useSelector } from "react-redux"


export default function CreateProjectOrEvent() {
    const { currentUser } = useSelector(state => state.user);
  const [type, setType] = useState("project"); // Тип: проект или мероприятие
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("uncategorized");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [info, setInfo] = useState("");
  const [collectionType, setCollectionType] = useState(""); // Тип сбора: вещи, продукты или деньги
  const [collectionAmount, setCollectionAmount] = useState(""); // Сумма сбора денег
  const [collectionPurpose, setCollectionPurpose] = useState(""); // Цель сбора денег
  const [files, setFiles] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFiles([...files, ...e.target.files]);
  }

  const handleUploadImage = async () => {
    try {
        if(files.length === 0) {
            setImageUploadError('Пожалуйста, загрузите файлы)');
            return;
        }
        setImageUploadError(null);
        const storage = getStorage(app);

        const uploadPromises = files.map(async (file) => {
            const fileName = 'projects/' +currentUser.user.id+ '/' + new Date().getTime() + '-' + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storage, file);
            return new Promise((resolve, reject) => {
                uploadTask.on(
                  'state_changed',
                  (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setImageUploadProgress(progress.toFixed(0));
                  },
                  (error) => {
                    setImageUploadError('Не удалось загрузить файлы');
                    setImageUploadProgress(null);
                    reject(error);
                  },
                  async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL);
                  }
                );
              });
            });
        
            const downloadURLs = await Promise.all(uploadPromises);
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, files: downloadURLs });
          } catch (error) {
            setImageUploadError('Не удалось загрузить файлы');
            setImageUploadProgress(null);
            console.log(error.message);
          }
        };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) {
      setError("Пожалуйста, введите заголовок");
      return;
    }

    if (type === "event" && (!date || !time || !location || !info)) {
      setError("Пожалуйста, заполните все обязательные поля для мероприятия");
      return;
    }

    if (type === "project" && !collectionType) {
      setError("Пожалуйста, выберите тип сбора для проекта");
      return;
    }

    if (
      collectionType === "money" &&
      (!collectionAmount || !collectionPurpose)
    ) {
      setError("Пожалуйста, введите сумму сбора и цель сбора денег");
      return;
    }

    try {
      const res = await fetch("/api/organization/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          title,
          category,
          date,
          time,
          location,
          info,
          collectionType,
          collectionAmount,
          collectionPurpose,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setError(null);
      navigate(`/${type}/${data.project.id}`);
    } catch (error) {
      setError("Упс... Что-то пошло не так");
    }
  };

  return (
    <div className="p-3 max-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">
        Создать {type === "project" ? "проект" : "мероприятие"}
      </h1>
      {error && <Alert color="failure">{error}</Alert>}
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Заголовок"
            required
            id="title"
            className="flex-1"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Select
            value={type}
            id="type"
            onChange={(e) => setType(e.target.value)}
          >
            <option value="project">Проект</option>
            <option value="event">Мероприятие</option>
          </Select>
          <Select
            value={category}
            id="category"
            onChange={(e) => setCategory(e.target.value)}
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
            onChange={handleFileChange}
            multiple
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
              </div>
            ) : (
              "Загрузить файлы"
            )}
          </Button>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {/* Отображение загруженного изображения */}
        {type === "event" ? (
          <div>
            <div className="mb-3">
              <TextInput
                type="date"
                placeholder="Дата"
                required
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <TextInput
                type="time"
                placeholder="Время"
                required
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <TextInput
                type="text"
                placeholder="Место/адрес"
                required
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <TextInput
                type="textarea"
                placeholder="Информация"
                required
                id="info"
                value={info}
                onChange={(e) => setInfo(e.target.value)}
              />
            </div>
          </div>
        ) : (
          <div>
             <div className="mb-3">
            <Select
              value={collectionType}
              id="collectionType"
              onChange={(e) => setCollectionType(e.target.value)}
            >
              <option value="">-- Выберите тип сбора --</option>
              <option value="things">Вещи</option>
              <option value="food">Продукты</option>
              <option value="money">Деньги</option>
            </Select>
            </div>

            <div className="mb-3">
                <TextInput
                  type="text"
                  placeholder="Цель сбора"
                  id="collectionPurpose"
                  value={collectionPurpose}
                  onChange={(e) => setCollectionPurpose(e.target.value)}
                />
                </div>
            {collectionType === "money" && (
              <div>
                <div className="mb-3">
                <TextInput
                  type="number"
                  placeholder="Сумма сбора"
                  id="collectionAmount"
                  value={collectionAmount}
                  onChange={(e) => setCollectionAmount(e.target.value)}
                />
                </div>
                
              </div>
            )}
          </div>
        )}
        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Опубликовать
        </Button>
      </form>
    </div>
  );
}
