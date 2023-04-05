import React from "react";
import Axios from "axios";
import "./App.css";
import { API_URL } from "./helper";
import { useEffect, useState } from "react";
import { loginAction } from "./actions/userAction";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Landing from "./pages/Landing";
import Register from "./pages/Register";
import NewUser from "./pages/NewUser";
import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/UserProfile";
import NotFound from "./pages/NotFound";
import ReportSales from "./pages/SalesReport";

function App() {
  // KODE DARI PURWADHIKA
  // const [message, setMessage] = useState("");

  // useEffect(() => {
  //   (async () => {
  //     const { data } = await axios.get(
  //       `${process.env.REACT_APP_API_BASE_URL}/greetings`
  //     );
  //     setMessage(data?.message || "");
  //   })();
  // }, []);

  const [loading, setLoading] = React.useState(true);

  const dispatch = useDispatch();
  const { role } = useSelector((state) => {
    return {
      role: state.userReducer.role,
    };
  });
  const admin = [2, 3];

  //KEEP LOGIN
  const keepLogin = async () => {
    try {
      let getLocalStorage = localStorage.getItem("cnc_login");
      if (getLocalStorage) {
        let res = await Axios.get(API_URL + `/user/keep`, {
          headers: {
            Authorization: `Bearer ${getLocalStorage}`,
          },
        });
        delete res.data.password;
        dispatch(loginAction(res.data)); // menjalankan fungsi action
        setLoading(false); // loading dimatikan ketika berhasil mendapat response
        localStorage.setItem("cnc_login", res.data.token);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  //USE EFFECT
  useEffect(() => {
    keepLogin();
  }, []);

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/regis" element={<Register />} />
        <Route path="/newuser" element={<NewUser />} />
        <Route path="/resetPassword" element={<ResetPassword />} />

        {/* semua yang butuh login user taruh dalam <></> bawah ini */}
        {role == 1 && (
          <>
            <Route path="/profile" element={<Profile />} />
          </>
        )}
        {/* semua yang butuh minimal admin taruh didalam <> bawah ini */}
        {admin.includes(role) && (
          <>
            <Route path="/admin/salesreport" element={<ReportSales />} />
          </>
        )}
        {/* semua yang butuh superadmin taruh dalam <></> bawah ini */}
        {role == 3 && <></>}
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
