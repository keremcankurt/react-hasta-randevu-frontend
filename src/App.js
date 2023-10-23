import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import VatandasLogin from "./pages/vatandas/login/Login";
import VatandasRegister from "./pages/vatandas/register/Register";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUser } from "./features/user/userSlice";
import VatandasHome from "./pages/vatandas/home/Home";
import RandevuAl from "./pages/vatandas/randevuAl/RandevuAl";
import DoctorLogin from "./pages/doktor/login/Login";
import DoctorRegister from "./pages/doktor/register/Register";
import DoctorHome from "./pages/doktor/home/Home";
import NotFound from "./components/notFound/NotFound";

function App() {
  const {user} = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if(user){
      dispatch(getUser());
    }
  },[dispatch,user])
  return (
    <>
      <Routes>
        <Route path="/vatandas" >
          <Route index={true} element={<VatandasHome/>}/>
          <Route path="login" element={<VatandasLogin/>}/>
          <Route path="register" element={<VatandasRegister/>}/>
          <Route path="randevual" element={<RandevuAl/>}/>
        </Route>
        <Route path="/doctor" >
          <Route index={true} element={<DoctorHome/>}/>
          <Route path="login" element={<DoctorLogin/>}/>
          <Route path="register" element={<DoctorRegister/>}/>
          <Route path="randevual" element={<RandevuAl/>}/>
        </Route>
          <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer/>
    </>
  );
}

export default App;
