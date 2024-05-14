import { Link, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { Button, Spinner, Badge } from "flowbite-react";
import CallToAction from "../components/CallToAction";
import { useSelector } from "react-redux";
import { IoLocationOutline } from "react-icons/io5";
import { MdLocalPhone } from "react-icons/md";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { Card } from "flowbite-react";
import DonationModal from "../components/DonationModal";

export default function OrganizationPage() {
  const { currentUser } = useSelector((state) => state.user);

  const { organizationId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [organization, setOrganization] = useState(null);


  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/organization/getOrganizations?organizationId=${organizationId}`
        );
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setOrganization(data.organizations[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchOrganization();
  }, [organizationId]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  return (
    <main>
      <div className="grid grid-flow-col grid-col-3  gap-4 ">
        <div className="col-span-2">
          <h1
            className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto
        lg:text-4xl"
          >
            {organization && organization.name}
          </h1>

          <div className="flex flex-wrap gap-3 p-3 mx-auto w-full max-w-2xl">
            <Link
              to={`/search?form=${organization && organization.form}`}
              className="self-center mt-5 "
            >
              <Button gradientDuoTone="purpleToBlue" pill size="xs" outline>
                {organization && organization.form}
              </Button>
            </Link>

            <Link
              to={`/search?form=${organization && organization.region}`}
              className="self-center mt-5"
            >
              <Button gradientDuoTone="purpleToBlue" pill size="xs" outline>
                {organization && organization.region}
              </Button>
            </Link>
          </div>

          <div className="flex  p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs ">
            <span className="gap-2 inline-flex">
              {" "}
              <IoLocationOutline
                className="h-4 w-4 text-slate-950
                        dark:text-gray-200  "
              />{" "}
              Адрес: {organization && organization.addres}
            </span>
          </div>
          <div
            className="p-3 max-w-2xl mx-auto post-content"
            dangerouslySetInnerHTML={{
              __html: organization && organization.mission,
            }}
          ></div>
          <div className="max-w-2xl mx-auto gap-1 flex ">
            <div className="flex flex-col flex-wrap gap-3">
              <Badge size="sm" color="gray" className="rounded-full mx-auto ">
                ОГРН: {organization && organization.ogrn}
              </Badge>
              <Badge
                color="gray"
                className="gap-2 inline-flex mx-auto"
                icon={MdLocalPhone}
                size="sm"
              >
                Телефон: {organization && organization.phone}
              </Badge>
              <Badge
                color="gray"
                size="sm"
                icon={MdOutlineAlternateEmail}
                className="mx-auto inline-flex"
              >
                Email: {organization && organization.email}
              </Badge>
            </div>
          </div>
        </div>
        <div className="mt-12 max-w-xl mx-auto pt-10">
          <Card className="max-w-sm  text-gray-600 font-serif  border border-blue-300 dark:border-blue-300 ">
            <div className="flex flex-col items-center text-center">
              <img
                className="w-30 h-30 "
                src="https://firebasestorage.googleapis.com/v0/b/dobrovmeste-da020.appspot.com/o/adminImage%2Freceive.png?alt=media&token=e5549fa0-3df3-49ae-a963-7b4c4146bf9c"
                alt="Bonnie image"
              />
              <h5 className="text-xl mx-auto mb-5  dark:text-white">
                Оказать поддержку
              </h5>
              <div>
                <DonationModal />
              </div>
              <Link className="pt-5">Добавить в избранное</Link>
            </div>
          </Card>
        </div>
      </div>

      <div className="max-w-2xl mx-auto w-full mb-2 pt-10">
        <CallToAction />
      </div>
    </main>
  );
}
