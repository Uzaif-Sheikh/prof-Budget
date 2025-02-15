import './App.css'
import Home from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import {
  Route, Routes, useLocation,
} from "react-router-dom";



import Budget from './Pages/Budget/Budget';
import Welcome from './Pages/Welcome/Welcome';
import ErrorPage from './Pages/404/404';
import Reminder from './Pages/Reminder/Reminder';
import IncomeExpenditureAnalysis from './Pages/IncomeExpenditureComparison/IncomeExpenditureAnalysis';
import OauthPage from './Pages/Oauth/Oauth';

function App() {

  const location = useLocation();


  return (
    <>
      <Routes key={location.pathname} location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/goals-settings" element={<>Goals Setting</>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/welcome/:uid" element={<Welcome />} />
        <Route path="/reminder" element={<Reminder />} />
        <Route path="*" element={<ErrorPage />} />
        <Route path="/oauth" element={<OauthPage />} />
        <Route path="/income-expenditure-analyse" element={<IncomeExpenditureAnalysis/>} />
      </Routes>
    </>
  )
}

export default App
