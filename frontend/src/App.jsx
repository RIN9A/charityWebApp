import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import About from "./pages/About";
import Home from "./pages/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import UserPrivateRoute from "./components/UserPrivateRoute";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import PostPage from "./pages/PostPage";
import AddOrganization from "./pages/AddOrganization";
import OrganizationPage from "./pages/OrganizationPage";
import DashOrganizations from "./components/DashOrganizations";
import Organizations from "./pages/Organizations";
import CreatePostOrg from "./pages/CreatePostOrg";
import UpdateOrgnPost from "./pages/UpdateOrgnPost";
import CreateProjectOrEvent from "./pages/CreateProjectOrEvent";
import Posts from "./pages/Posts";
import AddReport from "./pages/AddReport";
import OrganizationList from "./pages/ExpertSistem";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/experts" element={<OrganizationList />}></Route>
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/post/:postSlug" element={<PostPage />} />
          <Route path="/organizations" element={<Organizations />} />
          <Route path="/posts-head" element={<Posts />} />
          <Route path="/projects" element={<Projects />} />
          <Route
            path="/organization/:organizationId"
            element={<OrganizationPage />}
          />
        </Route>
        <Route element={<UserPrivateRoute />}>
          <Route path="/add-report" element={<AddReport />} />

          <Route path="/organization/create-post" element={<CreatePostOrg />} />
          <Route
            path="/organization/update-post/:postId/:ogrn"
            element={<UpdateOrgnPost />}
          />
          <Route
            path="/organization/project-event"
            element={<CreateProjectOrEvent />}
          ></Route>
          <Route element={<OnlyAdminPrivateRoute />}>
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/update-post/:postId" element={<UpdatePost />} />
            <Route
              path="/organization/update-post/:postId"
              element={<UpdateOrgnPost />}
            />
            <Route path="/add-organization" element={<AddOrganization />} />
            <Route path="/get-organizations" element={<DashOrganizations />} />
          </Route>
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
