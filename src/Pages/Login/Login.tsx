import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import HomeIcon from '@mui/icons-material/Home';
import './Login.css';
import { Link } from "react-router-dom";
import { demoLoginApi, loginApi, oAuthLoginApi } from "../../API/auth";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useFormik } from "formik";
import * as Yup from 'yup';
import Alert from '@mui/material/Alert';
import Cookies from 'js-cookie';
import useUserInfo from '../../utils/LocalStorage';
import CircularProgress from '@mui/material/CircularProgress';
import PageTemplate from '../../components/PageTemplate/PageTemplate';
import { LoginBodyType } from '../Types';
import { sessionActive } from '../../utils/utils';
import { Divider } from '@mui/material';


function Login() {

  const navigate = useNavigate();

  const [screenSize, setScreenSize] = useState(getCurrentDimension());
  const [errorAlert, setErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { userData, setUserData } = useUserInfo();


  function getCurrentDimension() {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }

  const demoLogin = () => {
    const resp = demoLoginApi();
    if (resp) {
      setUserData({id: '1234', email: 'test@test.com'});
      navigate(`/welcome/${Date.now()}`);
    } else {
      setErrorAlert(true);
      setErrorMessage(`Demo is not working.`);
    }
  }

  const oAuthlogin = async (e: any) => {
    e.preventDefault();
    navigate('/oauth');
    return;
    const resp = await oAuthLoginApi();

    if (resp.data !== null && resp.error === null) {
      setErrorMessage("");
    } else {
      setErrorAlert(true);
      setErrorMessage(`${resp.error?.name} - ${resp.error?.message}`);
    }

  };

  const loginClick = async (body :LoginBodyType) => {
    setLoading(true);
    try {
      const response = await loginApi(body);

      if (response.data !== null && response.error === null) {
        setErrorMessage("");
        if(response.data.session && response.data.user) {
          const refreshToken = response.data.session.refresh_token;
          Cookies.set('refreshToken', refreshToken);

          setUserData(response.data.user);
          // refreshTokenFunc(navigate, userData, setUserData);
          navigate("/budget");
        }
      } else {
        setErrorAlert(true);
        setErrorMessage(`${response.error?.name} - ${response.error?.message}`)
      }
    } catch (error) {
      setErrorAlert(true);
      setErrorMessage(String(error));
    }

    setLoading(false);
  }

  useEffect(() => {
    const updateDimension = () => {
      setScreenSize(getCurrentDimension())
    }
    window.addEventListener('resize', updateDimension);

    if(sessionActive()) {
      navigate("/budget");
    }

    return (() => {
      window.removeEventListener('resize', updateDimension);
    });

  }, [screenSize, userData])

  const initialValues = {
    email: "",
    password: "",
  }

  const validationSchema = Yup.object({
    email: Yup.string().required("Email is required.").email("Invalid Email."),
    password: Yup.string().required("Password is required."),
  });

  const formit = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      loginClick(values);
    },
  });

  return (
    <PageTemplate showNavbar={false} showBox={false}>
      <div className="login-page">
          <div className="login-container">
            <div>
            <Alert severity="info" sx={{color: "white", background: "#00000094"}}>Database service is paused due to inactivity. You can still explore the app using the 'Demo Login' option.</Alert>
            <form className="login-form" onSubmit={formit.handleSubmit}>
              <div className="login-title">Login</div>
              {errorAlert && <Alert severity="error" sx={{color: "white", background: "#f56262"}}>{errorMessage}</Alert>}
              <div className="username">
                <TextField
                id="outlined-basic"
                variant="outlined"
                value={formit.values.email}
                onChange={formit.handleChange("email")}
                onBlur={formit.handleBlur("email")}
                label={"Email"}
                />
                <div className="error">{formit.touched.email && formit.errors.email ? (
                      <>
                        <ErrorOutlineIcon color="error" fontSize="small"/>
                        {formit.errors.email}
                      </>
                    ) : null}</div>
                  </div>
              <div className="password">
                <TextField
                id="outlined-basic"
                variant="outlined"
                value={formit.values.password}
                onChange={formit.handleChange("password")}
                onBlur={formit.handleBlur("password")}
                label="Password"
                type={"password"}
                />
                <div className="error">{formit.touched.password && formit.errors.password ? (
                    <>
                      <ErrorOutlineIcon color="error" fontSize="small"/>
                      {formit.errors.password}
                    </>
                  ) : null}
                  </div>
              </div>
              <div>
                <button className="login-button">
                  <span className="text">Login</span>
                </button>
              </div>
              <div>
                {loading
                &&
                <CircularProgress color="success" />
                }
              </div>
              <div className="registration-link">Don't have an account ? <Link to={"/Register"}>Register here</Link></div>
              <div className="home-link">
                <div className="homeIcon" style={{cursor: "pointer"}} onClick={() => navigate('/')}><HomeIcon/></div>
                </div>
            </form>
            </div>
            <Divider className="divider-st" />
            <button className="gsi-material-button" onClick={e => oAuthlogin(e)}>
                <div className="gsi-material-button-state"></div>
                <div className="gsi-material-button-content-wrapper">
                  <div className="gsi-material-button-icon">
                    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlnsXlink="http://www.w3.org/1999/xlink" style={{display: "block"}}>
                      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                      <path fill="none" d="M0 0h48v48H0z"></path>
                    </svg>
                  </div>
                  <span className="gsi-material-button-contents">Sign in with Google</span>
                </div>
            </button>
            <div>
              <button className="login-button" onClick={() => demoLogin()}>
                <span className="text">Demo Login</span>
              </button>
            </div>
          </div>

        </div>
    </PageTemplate>

  );
};

export default Login;
