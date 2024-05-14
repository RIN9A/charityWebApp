import { Card, Typography } from '@material-tailwind/react';

export default function About() {
  return (
   <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100b ">
      <Card className="max-w-4xl mx-4 p-8  border border-yellow-300 bg-white  rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-yellow-700">
        <Typography variant="h2" className="mb-4">
          О нас
        </Typography>
        <Typography variant="lead" className="mb-6">
          DobroVmeste - это веб-платформа, объединяющая некоммерческие и благотворительные организации для более эффективной совместной работы и помощи нуждающимся.
        </Typography>

        <Typography variant="h4" className="mb-4">
          Наша миссия
        </Typography>
        <Typography variant="paragraph" className="mb-6">
          Мы стремимся сделать процесс помощи и благотворительности более простым, прозрачным и результативным. DobroVmeste предоставляет единое пространство, где некоммерческие организации могут объединить усилия, ресурсы и опыт для большего охвата людей, нуждающихся в поддержке.
        </Typography>

        <Typography variant="h4" className="mb-4">
          Наши возможности
        </Typography>
        <ul className="list-disc pl-6 mb-6">
          <li>Централизованная платформа для сбора пожертвований и распределения средств</li>
          <li>Обмен опытом, знаниями и лучшими практиками между организациями</li>
          <li>Аналитика и отчетность для оценки эффективности деятельности</li>
          <li>Продвижение и поддержка благотворительных инициатив</li>
        </ul>

        <Typography variant="lead" className="mb-6">
          Вместе мы можем сделать больше! Присоединяйтесь к DobroVmeste, чтобы объединить усилия и изменить жизни людей к лучшему.
        </Typography>

        <Typography variant="lead" className="mb-6">
        </Typography>
      </Card>
    </div>
  );
};