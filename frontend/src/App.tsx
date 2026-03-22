import { Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Navbar from "./components/navbar";
import Login from "./pages/loginPage";
import Signup from "./pages/signupPage";
import Profile from "./pages/profilePage";
import Home from "./pages/homePage"
import { useEffect } from "react";
import {checkAuthStore} from "./store/checkAuthStore";
import { Toaster } from "react-hot-toast";

const App = () => {

  const {isAuthenticated, authUser,setIsCheckingAuth, isCheckingAuth, onlineUsers} = checkAuthStore();

  useEffect(()=>{
    setIsCheckingAuth();
  },[setIsCheckingAuth])

  console.log(isAuthenticated, authUser)
  console.log("Online Users:", onlineUsers)

  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }
  

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={isAuthenticated && authUser? <Home /> : <Login />} />
        <Route path="/login" element={!isAuthenticated && !authUser? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={!isAuthenticated && !authUser? <Signup /> : <Navigate to="/" />} />
        <Route path="/profile" element={isAuthenticated && authUser? <Profile /> : <Navigate to="/login" />} />
      </Routes>
      <Toaster />
    </div>
  );
};

export default App;
