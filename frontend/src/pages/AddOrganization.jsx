import {
  Alert,
  Button,
  Label,
  Textarea,
  TextInput,
  Select,
} from "flowbite-react";
import {useNavigate } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { useState } from "react";
import { InputMask } from "primereact/inputmask";

export default function AddOrganization() {
  const [formData, setFormData] = useState({});
  const [organizationError, setOrganizationError] = useState(null);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/organization/addOrganization", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setOrganizationError(data.errors[0].msg);
        return;
      }

      if (res.ok) {
        setOrganizationError(null);
        navigate(`/organization/${data.organization.id}`);
      }
    } catch (error) {
      setOrganizationError("Упс... Что-то пошло не так");
    }
  };
  return (
    <div className="p-3 max-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">
        Добавить организацию
      </h1>
      <form
        className=" sm:items-center  flex flex-col max-w mx-auto  "
        onSubmit={handleSubmit}
      >
        <div class="   border border-yellow-300  rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-yellow-700">
          <div className="grid gap-4 mb-6 md:grid-cols-2">
            <div>
              <Label value="Полное наименование оргнаизации" />
              <TextInput
                type="text"
                placeholder="Наименование"
                id="name"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label value="Регион" />
              <TextInput
                type="text"
                placeholder="Регион"
                id="region"
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label value="Адрес" />
              <TextInput
                type="text"
                placeholder="Адрес"
                id="addres"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="ОГРН" />
              <TextInput
                type="text"
                placeholder="1234567890000"
                id="ogrn"
                onChange={handleChange}
                required
              />
            </div>

            <div class="mb-6">
              <Label value="Форма организации" />
              <Select onChange={handleChange} id="form">
                <option value="uncategorized">Выбрать форму организации</option>
                <option value="Автономная некоммерческая организация">
                  Автономная некоммерческая организация
                </option>
                <option value="Ассоциация(союз)">Ассоциация(союз)</option>
                <option value="Общественная организация">
                  Общественная организация
                </option>
                <option value="Общественное движение">
                  Общественное движение
                </option>
                <option value="Политическая партияt">
                  Политическая партия
                </option>
                <option value="Профессиональный союз">
                  Профессиональный союз
                </option>
                <option value="Учреждение">Учреждение</option>
                <option value="Фонд">Фонд</option>
              </Select>
            </div>
          </div>
          <div>
            <h3 className="text-center text-2xl my-3">
              Данные официального представителя
            </h3>
          </div>
          <div className="grid gap-4 mb-6 md:grid-cols-2">
            <div>
              <Label value="Фамилия" />
              <TextInput
                type="text"
                placeholder="Фамилия"
                id="last_name"
                onChange={handleChange}
              />
            </div>

            <div>
              <Label value="Имя" />
              <TextInput
                type="text"
                placeholder="Имя"
                id="first_name"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Отчество" />
              <TextInput
                type="text"
                placeholder="Отчество"
                id="otchestvo"
                onChange={handleChange}
              />
            </div>

            <div>
              <Label htmlFor="phone">Номер телефона</Label>

              <InputMask
                mask="+7(999)999-99-99"
                placeholder="+7(___)___-__-__"
                onChange={handleChange}
                id="phone"
                type="tel"
                className="block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500 p-2.5 text-sm rounded-lg"
              />
            </div>

            <div>
              <Label value="Адрес электронной почты" />
              <TextInput
                type="email"
                placeholder="example@exmpl.com"
                id="email"
                onChange={handleChange}
              />
            </div>

            <div>
              <Label value="Пароль" />
              <TextInput
                type="password"
                placeholder="********"
                id="password"
                onChange={handleChange}
              />
            </div>
          </div>

          <div class="mb-6">
            <Label value="Миссия организации" />
            <Textarea
              placeholder="Написать миссию"
              id="mission"
              onChange={handleChange}
            />
          </div>
          <Button gradientDuoTone="redToYellow" type="submit" outline>
            {" "}
            Сохранить{" "}
          </Button>
          {organizationError && (
            <Alert className="mt-5" color="failure">
              {organizationError}
            </Alert>
          )}
        </div>
      </form>
    </div>
  );
}
