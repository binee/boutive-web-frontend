import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router'
import { useDispatch } from 'react-redux';
import * as authActions from '../../store/action/auth';
import { MainMenuSidebarData } from './MainMenuSidebarData';
import './MainMenuNavbar.css';
import {FaSignOutAlt, FaLightbulb, FaHandshake} from 'react-icons/fa';

const  MainMenuNavbar = (props) => {
  const dispatch = useDispatch();
    const {sidebar,showSidebar} = props;

    const logout = () =>{
      window.localStorage.removeItem('token','Main-menuID');
      dispatch(authActions.logout());
      props.history.push('/');
     // window.location.reload();
        }



  return (
      <div className="Main-menunavbar">
        <div className={sidebar ? 'Main-menu-nav-opacity visible' : 'Main-menu-nav-opacity'} onClick={showSidebar}></div>
        <nav className={sidebar ? 'Main-menu-nav-menu active' : 'Main-menu-nav-menu'}>
          <ul className='Main-menu-nav-menu-items' onClick={showSidebar}>
            <li className='Main-menu-navbar-toggle'>
              <Link to='#' className='Main-menu-menu-bars'>
                &times;
              </Link>
            </li>
            {MainMenuSidebarData.map((item, index) => {
             // console.log(item.path);
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span style={{marginLeft:"16px",}}>{item.title}</span>
                  </Link>
                </li>

              );
            })}
            <li className="User-nav-text">
              <a href="https://forms.gle/NWcqGam7deN1aJ1y7" target="_blank">
                <FaLightbulb className="User-icon-color"/>
                <span style={{marginLeft:"16px",}}>Feedback</span>
              </a>
            </li>
            <li className="User-nav-text">
              <a href="https://forms.gle/RYQh2Rebn2xZVEtW6" target="_blank">
                <FaHandshake className="User-icon-color"/>
                <span style={{marginLeft:"16px",}}>Sell with us</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
  );
}

export default withRouter(MainMenuNavbar);
