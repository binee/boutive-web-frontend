import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router'
import { useDispatch } from 'react-redux';
import * as authActions from '../../store/action/auth';
import { UserSidebarData } from './UserSidebarData';
import './UserNavbar.css';
import {FaSignOutAlt} from 'react-icons/fa';

const  UserNavbar = (props) => {
  const dispatch = useDispatch();
    const {sidebar,showSidebar} = props;

    const logout = () =>{
      window.localStorage.removeItem('token','userID');
      dispatch(authActions.logout());
      props.history.push('/');
     // window.location.reload();
        }



  return (
      <div className="Usernavbar">
        <div className={sidebar ? 'User-nav-opacity visible' : 'User-nav-opacity'} onClick={showSidebar}></div>
        <nav className={sidebar ? 'User-nav-menu active' : 'User-nav-menu'}>
          <ul className='User-nav-menu-items' onClick={showSidebar}>
            <li className='User-navbar-toggle'>
              <Link to='#' className='User-menu-bars'>
                &times;
              </Link>
            </li>
            {UserSidebarData.map((item, index) => {
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
            <li className='User-nav-text' onClick={logout}> { /* The call to signout should go in an onclick function on the li here */ }
                <FaSignOutAlt className="User-icon-color"/> <span style={{marginLeft:"16px",}}>Logout</span>
            </li>
          </ul>
        </nav>
      </div>
  );
}

export default withRouter(UserNavbar);
