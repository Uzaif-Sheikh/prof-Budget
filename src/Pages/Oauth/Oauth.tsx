import { useNavigate } from "react-router";
import { Typography } from "@mui/material";
import "./Oauth.css"
import { useEffect } from "react";

function OauthPage() {

    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            navigate("/budget");
        }, 2000);
    }, []);

	return (
        <>
            <Typography className="error-title" variant="h4">Redirecting.... Oauth is currently turned off due to database inactivity.</Typography>
            <div className="error-page">
                <div className="pyramid-loader">
                    <div className="wrapper">
                        <span className="side side1"></span>
                        <span className="side side2"></span>
                        <span className="side side3"></span>
                        <span className="side side4"></span>
                        <span className="shadow"></span>
                    </div>
                </div>
            </div>
        </>
	);

}

export default OauthPage;