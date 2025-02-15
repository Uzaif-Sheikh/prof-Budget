import './Home.css'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sessionActive } from '../../utils/utils';

function Home() {

  const navigate = useNavigate();

  useEffect(() => {


    if(sessionActive()) {
			navigate("/budget");
		}
  }, [])

  return (
    <div className="landing-page">

      <div className="landingpage-title-button-container">

        <div className="landingpage-title-container">
          <h1>Professor Budget</h1>
        </div>

        <div className="landingpage-intro">
          <p>Professor Budget is a budgeting app built by <a href='https://github.com/17Ayaan28' target='_blank'>Ayaan Adil</a> and <a href='https://github.com/Uzaif-Sheikh' target='_blank'>Uzaif Sheikh</a>. It is a work in progess and we keep adding to the features. 
            The app was built to help people track expenses during the rental crisis in Sydney, which has caused 
            severe financial pressure on the community.</p>
        </div>


        <div className="landingpage-button-container">

          <div>
            <button className="landing-page-button" onClick={() => navigate("/login")}>
              <span>Start Budgeting Now!</span>
            </button>
          </div>

        </div>
        
      </div>

    </div>
  );
};

export default Home;