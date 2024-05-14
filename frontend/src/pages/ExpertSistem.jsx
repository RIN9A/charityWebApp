import { useEffect, useState } from 'react';

const OrganizationList = () => {
  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch('/api/organization/expert');
        setOrganizations(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrganizations();
  }, []);

  return (
    <div>
      <h1>Список благотворительных организаций</h1>
      <ul>
        {organizations.map((org) => (
          <li key={org.id}>
            <h2>{org.name}</h2>
            <p>Оценка репутации: {org.reputationScore.toFixed(2)}</p>
            <p>Общая сумма пожертвований: {org.total_donations}</p>
            <p>Общая потраченная сумма: {org.total_spent}</p>
            <p>Уровень активности: {org.activity_level}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrganizationList;