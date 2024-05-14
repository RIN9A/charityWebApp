import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../components/DashSidebar";
import DashProfile from "../components/DashProfile";
import DashPosts from "../components/DashPosts";
import DashOrganizations from "../components/DashOrganizations";
import DashboardComp from "../components/DashboardComp";
import DashDonations from "../components/DashDonations";
import DashOrganizationsPosts from "../components/DashOrganizationsPosts";
import DashSubscriptions from "../components/DashSubscriptions";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFormUrl = urlParams.get("tab");
    if (tabFormUrl) {
      setTab(tabFormUrl);
    }
    console.log(tabFormUrl);
  }, [location.search]);
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-100">
        {/* Sidebar */}
        <DashSidebar />
      </div>
      {/* profile... */}
      {tab === "profile" && <DashProfile />}
      {/* posts... */}
      {tab === "posts" && <DashPosts />}
      {/* organizations-posts */}
      {tab === "organizations-posts" && <DashOrganizationsPosts />}
      {/* organizations... */}
      {tab === "organizations" && <DashOrganizations />}
      {/* donations */}
      {tab === "donations" && <DashDonations />}
      {/* subscriptions */}
      {tab === "subscriptions" && <DashSubscriptions />}
      {/* dashboard comp */}
      {tab === "dashComp" && <DashboardComp />}

    </div>
  );
}
