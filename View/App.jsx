import React from "react";
import { Route,Routes } from "react-router";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import HomePage from "./pages/HomePage";
import Stories from "./pages/Stories";
import Destinations from "./pages/Destinations";
import Admin from "./pages/Admin"

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import StoryDetailPage from "./pages/StoryDetailPage";
export default function App() {
  return (
    <>
      <Header/>
      <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/stories" element={<Stories/>}/> //add id in stories/:id
      <Route path="/destinations" element={<Destinations/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/profile" element={<Profile/>}/>
      <Route path="/admin" element={<Admin/>}/>
      <Route path="/storydetail" element={<StoryDetailPage/>}/>
      </Routes>
      <Footer />
    </>
  );
}
