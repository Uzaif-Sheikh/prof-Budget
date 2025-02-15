import { useNavigate } from "react-router-dom";
import "./SideNav.css"

function SideNav () {

    const navigate = useNavigate();

    return (
        <>
        <div className="side-nav">
            <div className="side-nav-item" onClick={() => navigate("/income-expenditure-analyse")}>Income Expenditure Analysis</div>
        </div>
        </>
    );
}

export default SideNav;