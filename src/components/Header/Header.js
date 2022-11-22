import './Header.css';
import logo from '../../assets/heart.svg';
import ReactModal from 'react-modal';
import React,{useEffect, useState,useCallback} from 'react';
import { withRouter } from 'react-router';
import Login from '../Login/Login';
import { Link } from 'react-router-dom';
import {FaBars, FaHeart , FaUserCircle} from 'react-icons/fa';
import {useSelector} from 'react-redux';
import UserNavbar from '../UserNavbar/UserNavbar';
import MainMenuNavbar from '../MainMenuNavbar/MainMenuNavbar';
import { useDispatch } from 'react-redux';
import * as search from '../../store/action/search';

//class Header extends React.Component {

    const  Header = (props) => {
      const dispatch = useDispatch();
    const[showModal,setShowModal] = useState(false);
    const [sidebarOpened, setOpened ] = useState(false);
    const [mainMenuOpened, setMainMenu ] = useState(false);
    const [chkLogin, setChkLogin ] = useState(false);
    const [keyword, setKeyword] = useState(null);

    const loginToken = useSelector(state => state.auth.token);
 const  handleOpenModal = () => {
  setShowModal(true);
  setChkLogin(false)

  }

  const handleOpenFabModal = () =>{
    setShowModal(true);
    setChkLogin(true);
  }

 const handleCloseModal= () => {
  setShowModal(false);
  setChkLogin(false)
  }
  const openSidenav =() =>{
    setOpened(!sidebarOpened);
  }
  const openMainMenu =() =>{
    setMainMenu(!mainMenuOpened);
  }

  const handleSearch = useCallback((e) => {

      if (e.key === 'Enter') {
       setKeyword(e.target.value)
        dispatch(search.setVendorData(e.target.value));
        setKeyword(null);
        e.preventDefault();
        Array.from(document.querySelectorAll("input")).forEach(
          input => (input.value = "")
        );
        props.history.push('/search');
      }
      },[keyword]);



  return(
      <div>
       <MainMenuNavbar sidebar={mainMenuOpened} showSidebar={openMainMenu}/>
       <UserNavbar sidebar={sidebarOpened} showSidebar={openSidenav}/>
    <header className="Header">
      <button  onClick={openMainMenu}><FaBars className="Main-Menu"/>ggggg</button>
        <Link to="/"><div className="App-logo">
          <img src={logo} alt="heart logo" />
          <h1 className="Boutive">
            BOUTIVE
          </h1>
        </div></Link>
        <form>
        <input type="text"
        value={keyword}
         placeholder="Search"
     onKeyPress={(e) => handleSearch(e)}/>
</form>


      <Link to ="/about" className="Header-links">About</Link>
      <a className="Header-links">Sell with us</a>
        {loginToken === null  ?
     <FaHeart style={{cursor:'pointer'}} onClick={handleOpenFabModal} className="Favorite-heart"/>: <Link to="/favorites"><FaHeart className="Favorite-heart"/></Link>}

        {loginToken === null  ?
      <button className="Header-button" onClick={handleOpenModal}>Sign in</button> : <button  onClick={openSidenav}><FaUserCircle className="Favorite-heart"/></button>}
        <ReactModal
           isOpen={showModal}
           overlayClassName="Modal-overlay"
           className="Modal"
           shouldCloseOnOverlayClick={true}
           onRequestClose={handleCloseModal}
           >
           <div className="Modal-title">
            <p className="Modal-title-close" onClick={handleCloseModal}>X</p>
            </div>
          <Login closeModal = {handleCloseModal} chkLogUser={chkLogin}/>
        </ReactModal>
            </header>
           {/* { (keyword) ?  <Search inputData={keyword}/> : '' } */}
    </div>
  );
    }

export default withRouter(Header);
