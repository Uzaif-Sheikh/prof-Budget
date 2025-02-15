import { useNavigate } from "react-router";
import { Typography } from "@mui/material";
import "./404.css"

function ErrorPage() {
	const navigate = useNavigate();

	return (
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
			<Typography className="error-title" variant="h1">Page Not Found</Typography>
			<button className="error-button" onClick={() => navigate("/")}>
				<span className="text">Go Back</span>
			</button>
		</div>
	);

}

export default ErrorPage;