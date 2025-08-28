import React from "react";
import { Route,Routes,useLocation } from "react-router";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import HomePage from "./pages/HomePage";
import Stories from "./pages/Stories";
import Destinations from "./pages/Destinations";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StoryDetail from "./pages/StoryDetail";
import HotelRestaurants from "./pages/HotelRestaurants";
import HotelRestaurantDetail from "./pages/HotelRestaurantDetail";
import Addreview from "./pages/Addreview";
import UserProfile from "./pages/UserProfile";
import AdminPanel from "./pages/AdminPanel";
import AdminHeader from "./components/Header/AdminHeader";

export default function App() {
  const location = useLocation();
  return (
    <>
      {location.pathname === "/admin" ? <AdminHeader /> : <Header />}
      <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/stories" element={<Stories/>}/> 
      <Route path="/destinations" element={<Destinations/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Signup/>}/>
      <Route path="/profile" element={<UserProfile/>}/>
      <Route path="/user/:userId" element={<UserProfile/>}/>
      <Route path="/story/:id" element={<StoryDetail/>}/>
      <Route path="/hotel_restaurants" element={<HotelRestaurants/>}/>
      <Route path="/hotel/:id" element={<HotelRestaurantDetail/>}/>
      <Route path="/restaurant/:id" element={<HotelRestaurantDetail/>}/>
      <Route path="/addreview" element={<Addreview/>}/>
      <Route path="/admin" element={<AdminPanel/>}/>
      </Routes>
      <Footer />
    </>
  );
}
