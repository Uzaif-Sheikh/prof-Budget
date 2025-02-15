import TextField from '@mui/material/TextField';
import SvgIcon from '@mui/material/SvgIcon';
import "./Register.css";
import { registerApi } from "../../API/auth";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useFormik } from "formik";
import * as Yup from 'yup';
import Alert from '@mui/material/Alert';
import Cookies from 'js-cookie';
import useUserInfo from '../../utils/LocalStorage';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import PageTemplate from '../../components/PageTemplate/PageTemplate';
import CircularProgress from '@mui/material/CircularProgress';

import { RegisterBodyType } from '../Types';
import { sessionActive } from '../../utils/utils';


function HomeIcon() {
  return (
    <SvgIcon >
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </SvgIcon>
  );
}

function Register() {
  const navigate = useNavigate();

  const [screenSize, setScreenSize] = useState(getCurrentDimension());
  const [errorAlert, setErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);


  const { setUserData } = useUserInfo();

  function getCurrentDimension() {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    }
  }


  const registerClick = async (body: RegisterBodyType) => {
    setLoading(true);
    const response = await registerApi(body);

    if (response.data !== null && response.error === null) {
      setErrorMessage("");
      if(response.data.session && response.data.user) {
        const refreshToken = response.data.session.refresh_token;
        Cookies.set('refreshToken', refreshToken);
      
        setUserData(response.data.user);
        navigate(`/welcome/${response.data.user.id}`)
      }
    } else {
      setErrorAlert(true);
      setErrorMessage(`${response.error?.name} - ${response.error?.message}`)
    }
    setLoading(false);
  }

  useEffect(() => {
    const updateDimension = () => {
      setScreenSize(getCurrentDimension())
    }
    window.addEventListener('resize', updateDimension);


    if (sessionActive()) {
      navigate("/budget");
    }


    return (() => {
      window.removeEventListener('resize', updateDimension);
    })
  }, [screenSize])

  const initialValues = {
    email: "",
    password: "",
    confirmPassword: "",
  }

  const validationSchema = Yup.object({
    email: Yup.string().required("Email is required.").email("Invalid Email."),
    password: Yup.string().required("Password is required.").min(6, "Password must be 6 characters long."),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), ""], 'Password Must match.')
      .required("Confirm Password is required.")
  });

  const formit = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const body = {
        displayName: "",
        email: values.email,
        password: values.password,
      }
      registerClick(body);
    },
  });

  return (
    <PageTemplate showNavbar={false} showBox={false}>
      <div className="register-page">

        <div className="register-container">
          <form className="register-form" onSubmit={formit.handleSubmit}>
            <div className="register-title">Register</div>
            {errorAlert && <Alert severity="error" sx={{ color: "white", background: "#f56262" }}>{errorMessage}</Alert>}
            <div className="username">
              <TextField
                id="outlined-basic"
                variant="outlined"
                label="Email"
                value={formit.values.email}
                onChange={formit.handleChange("email")}
                onBlur={formit.handleBlur("email")}
              />
              <div className="error">{formit.touched.email && formit.errors.email ? (
                <>
                  <ErrorOutlineIcon color="error" fontSize="small" />
                  {formit.errors.email}
                </>
              ) : null}</div>

            </div>
            <div className="password">
              <TextField
                id="outlined-basic"
                variant="outlined"
                label="Password"
                type={"password"}
                value={formit.values.password}
                onChange={formit.handleChange("password")}
                onBlur={formit.handleBlur("password")}
              />
              <div className="error">{formit.touched.password && formit.errors.password ? (
                <>
                  <ErrorOutlineIcon color="error" fontSize="small" />
                  {formit.errors.password}
                </>
              ) : null}</div>

            </div>
            <div className="confirm-password">
              <TextField
                id="outlined-basic"
                variant="outlined"
                label="Confirm Password"
                value={formit.values.confirmPassword}
                onChange={formit.handleChange("confirmPassword")}
                onBlur={formit.handleBlur("confirmPassword")}
                type='password'
              />
              <div className="error">{formit.touched.confirmPassword && formit.errors.confirmPassword ? (
                <>
                  <ErrorOutlineIcon color="error" fontSize="small" />
                  {formit.errors.confirmPassword}
                </>
              ) : null}</div>
            </div>
            <div>
              <button className="register-button" type='submit'>
                <span className="text">Register</span>
              </button>
            </div>
            <div>
              {loading
                &&
                <CircularProgress color="success" />
              }
            </div>
            <div className="login-link">Already have an account ? <Link to={"/login"}>Login here</Link> </div>
            <div className="home-link">
              <div className="homeIcon" style={{ cursor: "pointer" }} onClick={() => navigate('/')}><HomeIcon /></div>
            </div>
          </form>
        </div>

      </div>
    </PageTemplate>
  );
};

export default Register;
