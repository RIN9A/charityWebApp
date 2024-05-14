import { Modal, Table, Button } from "flowbite-react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Link } from "react-router-dom";
import { BiDonateHeart } from "react-icons/bi";
import { HiArrowNarrowUp, HiDocumentText } from "react-icons/hi";

import { HiOutlineExclamationCircle } from "react-icons/hi";

export default function DashDonations() {
  const { currentUser } = useSelector((state) => state.user);
  const [donations, setDonations] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [totalSumDonations, setTotalSumDonations] = useState(0);
  const [sumLastDonations, setSumLastDonations] = useState(0);
  const [totalDonations, setTotalDonations] = useState(0);
  const [lastMonthDonations, setLastMonthDonations] = useState(0);
  const [realSum, setRealSum] = useState(0);
  const [minusSum, setMinusSum] = useState(0);

  useEffect(() => {
    const fetchDonationAll = async () => {
      try {
        const res = await fetch(`/api/donation/getDonationsOne`);
        const data = await res.json();
        if (res.ok) {
          setDonations(data.donations);
          setTotalDonations(data.countAllDonations.count);
          setLastMonthDonations(data.countLastMonthDonations.count);
          setTotalSumDonations(data.totalSumDonation.sum);
          setSumLastDonations(data.lastSumDonation.sum);

          if (data.donations.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchDonationOrg = async () => {
      try {
        const res = await fetch(
          `/api/donation/getDonationsOne?ogrn=${currentUser.user.id}`
        );
        const data = await res.json();
        if (res.ok) {
          setDonations(data.donations);
          setTotalDonations(data.countAllDonations.count);
          setLastMonthDonations(data.countLastMonthDonations.count);
          setTotalSumDonations(data.totalSumDonation.sum);
          setSumLastDonations(data.lastSumDonation.sum);
          setRealSum(data.realSum);
          setMinusSum(data.minusSum);

          if (data.donations.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchDonationUser = async () => {
      try {
        const res = await fetch(
          `/api/donation/getDonationsOne?userId=${currentUser.user.id}`
        );
        const data = await res.json();
        if (res.ok) {
          setDonations(data.donations);
          setTotalDonations(data.countAllDonations.count);
          setLastMonthDonations(data.countLastMonthDonations.count);
          setTotalSumDonations(data.totalSumDonation.sum);
          setSumLastDonations(data.lastSumDonation.sum);
          if (data.donations.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    if (currentUser.user.isAdmin) {
      fetchDonationAll();
    } else if (currentUser.user.isPersnOrg) {
      fetchDonationOrg();
    } else {
      fetchDonationUser();
    }
  }, [currentUser.user.id]);

  const handleShowMore = async () => {
    const startIndex = donations.length;
    try {
      var res = "";

      if (currentUser.user.isAdmin) {
        res = await fetch(
          `/api/donation/getDonationsOne?startIndex=${startIndex}`
        );
      } else if (currentUser.user.isPersnOrg) {
        res = await fetch(
          `/api/donation/getDonationsOne?ogrn=${currentUser.user.id}&startIndex=${startIndex}`
        );
      } else {
        res = await fetch(
          `/api/donation/getDonationsOne?userId=${currentUser.user.id}&startIndex=${startIndex}`
        );
      }
      const data = await res.json();
      if (res.ok) {
        setDonations((prev) => [...prev, ...data.donations]);
        if (data.donations.length < 9) {
          setShowMore(false);
        }
      } else {
        console.log(data.errors[0].msg);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div
      className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar
     scrollbar-track-slate-100 scrollbar-thumb-slate-300
     dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500"
    >
      {donations.length > 0 ? (
        <>
          <div className="p-3 md:mx-auto">
            <div className="flex-wrap flex gap-4 justify-center mb-3">
              <div
                className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full
        rounded-md shadow-md"
              >
                <div className="flex justify-between">
                  <div className="">
                    <h3 className="text-gray-500 text-md uppercase">
                      Сумма пожертвоаний
                    </h3>
                    {/*<p className="text-xl"> Количество: {totalDonations}</p> */}
                    <p className="text-2xl mt-6">{totalSumDonations} руб.</p>
                  </div>
                  <BiDonateHeart className="bg-rose-600 text-white rounded-full text-5xl p-3 shadow-lg" />
                </div>
                <div className="flex gap-2 text-sm mt-6">
                  <span className="text-green-500 flex items-center">
                    <HiArrowNarrowUp />
                    {sumLastDonations} руб.
                  </span>
                  <div>За последний месяц</div>
                </div>
              </div>

              {(!currentUser.user.isAdmin && currentUser.user.isPersnOrg) && (
                <>
              <div
                className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full
        rounded-md shadow-md"
              >
                <div className="flex justify-between">
                  <div className="">
                    <h3 className="text-gray-500 text-md uppercase">
                      Остаток суммы
                    </h3>
                    {/*<p className="text-xl"> Количество: {totalDonations}</p> */}
                    <p className="text-2xl mt-6">{realSum} руб.</p>
                  </div>
                  <BiDonateHeart className="bg-emerald-600 text-white rounded-full text-5xl p-3 shadow-lg" />
                </div>

              </div>
               <div
               className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full
       rounded-md shadow-md"
             >
               <div className="flex justify-between">
                 <div className="">
                   <h3 className="text-gray-500 text-md uppercase">
                     Потрачено
                   </h3>
                   {/*<p className="text-xl"> Количество: {totalDonations}</p> */}
                   <p className="text-2xl mt-6">{minusSum} руб.</p>
                 </div>
                 <BiDonateHeart className="bg-cyan-600 text-white rounded-full text-5xl p-3 shadow-lg" />
               </div>

             </div>
             </>
             )}
              <div
                className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full
        rounded-md shadow-md"
              >
                <div className="flex justify-between">
                  <div className="">
                    <h3 className="text-gray-500 text-md uppercase">
                      Количество пожертвоаний
                    </h3>
                    <p className="text-2xl">{totalDonations}</p>
                  </div>
                  <BiDonateHeart className="bg-blue-800 text-white rounded-full text-5xl p-3 shadow-lg" />
                </div>
                <div className="flex gap-2 text-sm mt-6">
                  <span className="text-green-500 flex items-center">
                    <HiArrowNarrowUp />
                    {lastMonthDonations}
                  </span>
                  <div>За последний месяц</div>
                </div>
              </div>
            </div>
            {(!currentUser.user.isAdmin && currentUser.user.isPersnOrg) && (
            <div className="items-center mb-2 flex justify-end">
              <a
                href="/add-report"
                className="rounded-lg  px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Добавить отчет
              </a>
            </div>
            )}
            <Table hoverable className="shadow-md">
              <Table.Head className="text-center">
                <Table.HeadCell>Дата</Table.HeadCell>
                {(currentUser.user.isAdmin || currentUser.user.isPersnOrg) && (
                  <Table.HeadCell>Email</Table.HeadCell>
                )}

                {(currentUser.user.isAdmin || !currentUser.user.isPersnOrg) && (
                  <Table.HeadCell>ОГРН Организации</Table.HeadCell>
                )}
                <Table.HeadCell>Сумма</Table.HeadCell>
              </Table.Head>
              {donations.map((donation) => (
                <Table.Body className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 ">
                    <Table.Cell className="text-center">
                      {new Date(donation.payDate).toLocaleDateString()}
                    </Table.Cell>
                    {(currentUser.user.isAdmin ||
                      currentUser.user.isPersnOrg) && (
                      <Table.Cell className="text-center">{donation.email}</Table.Cell>
                    )}
                    {(currentUser.user.isAdmin ||
                      !currentUser.user.isPersnOrg) && (
                      <Table.Cell className="text-center">
                        <Link
                          className="font-medium text-gray-900 dark:text-white"
                          to={`/organization/${donation.organization_id}`}
                        >
                          {donation.ogrn}
                        </Link>
                      </Table.Cell>
                    )}
                    <Table.Cell className="text-center">+ {donation.amount}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
            </Table>
          </div>

          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Загрузить еще
            </button>
          )}
        </>
      ) : (
        <p>Пожертвоаний еще не было!</p>
      )}
    </div>
  );
}
