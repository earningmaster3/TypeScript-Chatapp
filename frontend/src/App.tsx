import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar";
import Login from "./pages/loginPage";
import Signup from "./pages/signupPage";
import Profile from "./pages/profilePage";
import Home from "./pages/homePage"

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
};

export default App;
