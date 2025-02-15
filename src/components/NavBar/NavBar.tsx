import { AppBar } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css"
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';

import useUserInfo from "../../utils/LocalStorage";
import Cookie from 'js-cookie';
import { logoutApi } from "../../API/auth";



function NavBar() {

	const { userData, clearLocalStorage } = useUserInfo();
	const navigate = useNavigate();

	return (
		<AppBar sx={{ background: 'white' }} className="app-bar">
			<div className="header-container">
				<div className="header-contains" onClick={() => navigate('/budget')}>
					Professor Budget
				</div>
				<div className="header-contains-2">
					{(userData != null && userData.id != "") && <Link className="links-btn" to={"/budget"}>Transactions</Link>}
					{(userData != null && userData.id != "") && <Link className="links-btn" to={"/reminder"}>Reminders</Link>}
					{(userData != null && userData.id != "") && <Link className="links-btn" to={"/income-expenditure-analyse"}>Budget</Link>}
					{(userData != null && userData.id != "") ?
						<>

							<Box sx={{ flexGrow: 0 }}>
								<Tooltip title="">
									<IconButton sx={{ p: 0, width: '30px', height: '30px' }}>
										<Avatar sx={{ width: '40px', height: '40px' }} alt={userData.email + "emy Sharp"} src={userData?.user_metadata?.avatar_url || userData?.user_metadata?.picture} />
									</IconButton>
								</Tooltip>
							</Box>
							<button className="logout-button" onClick={async () => {
								await logoutApi();
								clearLocalStorage();
								Cookie.remove('refreshToken');
								navigate("/");
								window.location.reload();
							}}>Logout</button>
						</>
						:
						<>
							<Link className="links-btn" to={"/login"}>Login</Link>
							<Link className="links-btn" to={"/register"}>Register</Link>
						</>
					}
				</div>
			</div>
		</AppBar>
	);
}

export default NavBar;