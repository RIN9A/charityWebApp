import { Sidebar } from "flowbite-react";
import {
  HiArrowSmRight,
  HiDocumentText,
  HiUser,
  HiChartPie,
} from "react-icons/hi";
import { GoOrganization } from "react-icons/go";
import { HiBuildingOffice2 } from "react-icons/hi2";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice";
import { useSelector } from "react-redux";
import { BiDonateHeart } from "react-icons/bi"
import { MdOutlineMarkEmailRead } from "react-icons/md";
import { CiCreditCard1 } from "react-icons/ci";



export default function DashSidebar() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const location = useLocation();
  const dispatch = useDispatch();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFormUrl = urlParams.get("tab");
    if (tabFormUrl) {
      setTab(tabFormUrl);
    }
  }, [location.search]);
  const handleSignout = async () => {
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
    <Sidebar className="w-full md:w-70 ">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          <Link to="/dashboard?tab=profile">
          {(currentUser.user.isAdmin || currentUser.user.isPersnOrg) ? (
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              
              label={currentUser.user.isAdmin ? "Администратор" : "Организация"}
              labelColor="dark"
              as="div"
            >
              Профиль
            </Sidebar.Item>) :
            <Sidebar.Item
            active={tab === "profile"}
            icon={HiUser}
            
            label="Пользователь"
            labelColor="dark"
            as="div"
          >
            Профиль
          </Sidebar.Item>}
          </Link>

          {(currentUser.user.isAdmin ||currentUser.user.isPersnOrg) && (
            <Link to="/dashboard?tab=posts">
              <Sidebar.Item
                active={tab === "posts"}
                icon={HiDocumentText}
                as="div"
              >
              Посты
              </Sidebar.Item>
            </Link>
          )}

          {currentUser.user.isAdmin && (
            <Link to="/dashboard?tab=organizations">
              <Sidebar.Item
                active={tab === "organizations"}
                icon={HiBuildingOffice2}
                as="div"
              >
                Организации
              </Sidebar.Item>
            </Link>
          )}
          {(currentUser.user.isAdmin ||currentUser.user.isPersnOrg) && (
            <Link to="/dashboard?tab=organizations-posts">
              <Sidebar.Item
                active={tab === "organizations-posts"}
                icon={MdOutlineMarkEmailRead}
                as="div"
              >
                Неопубликованные Посты 
              </Sidebar.Item>
            </Link>
          )}

          
            <Link to="/dashboard?tab=donations">
              <Sidebar.Item
                active={tab === "donations"}
                icon={BiDonateHeart}
                as="div"
              >
                Пожертвоания
              </Sidebar.Item>
            </Link>

            <Link to="/dashboard?tab=subscriptions">
              <Sidebar.Item
                active={tab === "subscriptions"}
                icon={CiCreditCard1}
                as="div"
              >
                Подписки
              </Sidebar.Item>
            </Link>
       

          {currentUser.user.isAdmin && (
            <Link to="/dashboard?tab=dashComp">
              <Sidebar.Item
                active={tab === "dashComp"}
                icon={HiChartPie}
                as="div"
              >
                Статистика
              </Sidebar.Item>
            </Link>
          )}
          <Sidebar.Item
            className="cursor-pointer"
            icon={HiArrowSmRight}
            onClick={handleSignout}
          >
            Выход
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
