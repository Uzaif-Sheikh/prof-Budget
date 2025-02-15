import React from "react";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import { Box } from "@mui/material";
import { sessionActive } from "../../utils/utils";
// import { refreshTokenFunc } from "../../utils/utils";

type Props = {
  children: React.ReactNode;
  showNavbar?: boolean;
  showBox?: boolean;
};

const PageTemplate = ({
  children,
  showNavbar = true,
  showBox = true,
}: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    if (
      (!sessionActive()) &&
      path != "/login" &&
      path != "/Register"
    ) {
      navigate("/login");
      return;
    }

  }, []);

  return (
    <>
      {showNavbar && <NavBar />}
      {showBox ? <Box mt={8}>{children}</Box> : children}
    </>
  );
};

export default PageTemplate;
