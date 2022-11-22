import React, { useState,useEffect, useCallback } from 'react'
import './Boutique.css';
import Masonry from 'react-masonry-css';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {useSelector} from 'react-redux';
import Login from '../Login/Login';
import ReactModal from 'react-modal';

const apiUrl = "https://boutive.test";

const  breakpoints = {
  default: 4,
  1260: 3,
  940: 2,
  630: 1
};

  const  Boutique = (props) => {

    const storeName = useSelector(state => state.vendor.vendor);
  const loginInfo = useSelector(state=>state.auth);
  const loginUser = loginInfo.userId;
  const VendorID = storeName.id;

  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [productData, setProductData] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(null);
  const [lastPage, setLastPage] = useState(null);//
  const [follow,setFollow] = useState(false);
  const [showModal,setShowModal]   = useState(false);
  const [chkLogin, setChkLogin ] = useState((loginUser) ? true : false);
  const [loginName, setLoginName ] = useState(loginInfo.userId);


  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    axios({
      method: 'GET',
      url: `${apiUrl}/getProductGallery`,
     params: {page: pageNumber ,vendorID : VendorID,userID : loginUser},
      cancelToken: new axios.CancelToken(c => cancel = c)
    }).then(res => {
      setProductData(prevProductData => {
        return [...prevProductData,...res.data.data.data]
      })
      setFollow(res.data.follow);
      setCurrentPage(res.data.data.current_page);
      setLastPage(res.data.data.last_page)
      setHasMore(res.data.data.data.length>0);
      setLoading(false);
    }).catch(e => {
      if (axios.isCancel(e)) return
      setError(true)
    })
    return () => cancel()
  }, [pageNumber])

  const fetchData = useCallback(node => {
    if(currentPage-lastPage!==0 && hasMore){
      setPageNumber(prevPageNumber => prevPageNumber + 1)
    }
    else{
      setHasMore(false);
    }
  }, [hasMore,currentPage,lastPage])



const  addRemoveFollow =() => {
    const followInfo = { vendorId: VendorID,userID : loginUser };
      //
    if(!follow){
      axios.post( `${apiUrl}/follow/create`, followInfo)
      .then(response => console.log(response))
      .catch(error => {
        setError(error.message);
          console.error('There was an error!', error);
      });
    }
    else {
      axios.post( `${apiUrl}/follow/remove`, followInfo)
      .then(response => console.log(response))
      .catch(error => {
        setError(error.message);
        console.error('There was an error!', error);
      });
    }
  }

const  handleFollowClick = () => {
  setShowModal(loginUser === null ? true : false);
    if(loginUser){
      setFollow(!follow);
       addRemoveFollow();
    }

}
const  handleOpenModal = () => {
  setShowModal(true);
  setChkLogin(false)

  }



const handleOpenFollowModal =useCallback(async() =>{

  if(!chkLogin){
    setShowModal(true);
    const loginUser = await loginInfo.userId;
    setLoginName(loginUser);
    if(loginName){
      console.log('HERER')
      setChkLogin(true);
      setFollow(!follow);
      setShowModal(false);
      const followInfo = { vendorId: VendorID,userID : loginUser };
      axios.post( `${apiUrl}/follow/create`, followInfo)
      .then(response => console.log(response))
      .catch(error => {
        setError(error.message);
          console.error('There was an error!', error);
      });   
  
     }
  }

},[loginName]);




// useEffect(() => {
//   handleOpenFollowModal();
// }, [loginUser]);


const handleCloseModal= () => {
setShowModal(false);
setChkLogin(false)
}


return (

  <div className="MainGallery">
    <h1>{storeName.storeName}</h1>


    <button className ="Boutique-follow-button" onClick={loginUser === null ? handleOpenFollowModal : handleFollowClick}>
    {(!follow) ? 'Follow' : 'Unfollow'}
      </button>
    <InfiniteScroll
      dataLength={productData.length} //This is important field to render the next data
      next={fetchData}
      hasMore={hasMore}
      loader={(loading)?<h4>Loading...</h4>:null}
      endMessage={
        <p style={{ textAlign: 'center' }}>
          <b>Yay! You have seen it all</b>
        </p>
      }
    >

      <Masonry
        breakpointCols={breakpoints}
        className="Main-masonry-grid"
        columnClassName="Main-masonry-grid_column"
      >

   {productData.map(function(item) {
     var itemVariants =  JSON.parse(item.variants)


    return <div key={item.id}>
      <Link to = {`/product/${item.productID}`} >
        <div className="Item-card">
          <img alt="Image" className="Item-card-image" src={item.img}/>
          <div className="Item-card-information">
            <div className="Flexer-center">
              <div>
                {item.name}
              </div>
              <div>
                ${itemVariants[0].price}
              </div>
            </div>
            <div>
              {item.boutive}
            </div>
          </div>
        </div>
      </Link>
    </div>
    })}



     </Masonry>

    </InfiniteScroll>

    <ReactModal
           isOpen={showModal}
           overlayClassName="Modal-overlay"
           className="Modal"
           shouldCloseOnOverlayClick={true}
           onRequestClose={handleOpenModal}
           >
           <div className="Modal-title">
            <p className="Modal-title-close" onClick={handleCloseModal}>X</p>
            </div>
          <Login closeModal = {handleCloseModal}/>
        </ReactModal>

  </div>
)


};

export default Boutique;
