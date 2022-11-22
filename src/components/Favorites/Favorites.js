import React, { useState,useEffect, useCallback } from 'react'
import './Favorites.css';
import Masonry from 'react-masonry-css';
import { withRouter } from 'react-router'

import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {setVendorData} from  '../../store/action/vendor';


const apiUrl = "https://boutive.test";
// masonry grid: https://www.npmjs.com/package/react-masonry-css
// infinite scroll component: https://www.npmjs.com/package/react-infinite-scroll-component

const  breakpoints = {
  default: 4,
  1260: 3,
  940: 2,
  630: 2
};

  const  Favorites = (props) => {
  const userID = useSelector(state => state.auth.userId);
  const dispatch = useDispatch();

  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [fav, setFav] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(null);
  const [lastPage, setLastPage] = useState(null);
  const [productView, setProductView] = useState(true);


  const [following, setFollowing] = useState([]);
  const [pageN, setPageN] = useState(1);
  const [hasMoreList, setHasMoreList] = useState(false);
  const [currentP, setCurrentP] = useState(null);
  const [lastP, setLastP] = useState(null);


 let changePageToProduct = () => {
   setProductView(true);
 }

 let changePageToBoutique = () => {
   setProductView(false);
 }


 const handleSellerInfo = useCallback((id,store) =>{
  let vendor = {
    id : id,
    storeName : store
  }
  dispatch(setVendorData(vendor));
    },[])
  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    const parameter = {userID : userID}
    axios({
      method: 'POST',
      url: `${apiUrl}/favorite/show`,
      params: {page: pageNumber,userID : userID},
      cancelToken: new axios.CancelToken(c => cancel = c)
    },parameter).then(res => {
      setFav(prevFav => {
        return [...prevFav,...res.data.data.data]
      })
      setCurrentPage(res.data.data.current_page);
      setLastPage(res.data.data.last_page)
      setHasMore(res.data.data.data.length>0);
      setLoading(false);
    }).catch(e => {
      if (axios.isCancel(e)) return
      setError(true)
    })
    return () => cancel()
  }, [pageNumber]);


  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
const parameter = {userID : userID}
    axios({
      method: 'POST',
      url: `${apiUrl}/follow/show`,
      params: {page: pageN,userID : userID},
      cancelToken: new axios.CancelToken(c => cancel = c)
    },parameter).then(res => {
      setFollowing(prevFollowing => {
        return [...prevFollowing,...res.data.data.data]
      })

      setCurrentP(res.data.data.current_page);
      setLastP(res.data.data.last_page)
      setHasMoreList(res.data.data.data.length>0);
      setLoading(false);
    }).catch(e => {
      if (axios.isCancel(e)) return
      setError(true)
    })
    return () => cancel()
  }, [pageN]);


  const fetchData = useCallback(node => {
    if(currentPage-lastPage!==0 && hasMore){
      setPageNumber(prevPageNumber => prevPageNumber + 1)
    }
    else{

      setHasMore(false);
    }
  }, [hasMore,currentPage,lastPage]);


  const fetchNext = useCallback(node => {
    if(currentP-lastP!==0 && hasMoreList){
      setPageN(prevPageN => prevPageN + 1)
    }
    else{

      setHasMoreList(false);
    }
  }, [hasMoreList,currentP,lastP]);
    return (

  <div className="Favorites">
    <h1>Favorites</h1>
    <div className ="Favorite-selector-container">
      <p onClick={changePageToProduct} className={(productView) ? "Favorite-selector-item Favorite-selector-active" : "Favorite-selector-item"}>
        Products
      </p>
      <p onClick={changePageToBoutique} className={(!productView) ? "Favorite-selector-item Favorite-selector-active" : "Favorite-selector-item"}>
        Boutiques
      </p>
    </div>

      {(productView) ?
    <InfiniteScroll
      dataLength={fav.length} //This is important field to render the next data
      next={fetchData}
      hasMore={hasMore}
      loader={(loading)?<h4>Loading...</h4>:null}
    >
  <Masonry
        breakpointCols={breakpoints}
        className="Main-masonry-grid"
        columnClassName="Main-masonry-grid_column"
      >

   {fav.map(function(item) {
     var itemVariants =  JSON.parse(item.variants);
    return <div key={Math.random()}>
      <Link to = {`/product/${item.productID}`} >
      <div className="Item-card">
        <img alt="Image" className="Item-card-image" src={item.img}/>
        <div className="Item-card-information">
        <div className="Flexer-center">
            <h2 className="Item-title-ellipsis">{item.name}</h2>
            <div className="Item-card-price">
              ${itemVariants[0].price}
            </div>
        </div>

            <div className="Item-card-boutique">
              {item.boutive}
            </div>


        </div>
      </div>
      </Link>
    </div>
    })}

     </Masonry>

    </InfiniteScroll>
 :

// !!! This is for the boutiques the user follows !!!

 <InfiniteScroll
   dataLength={following.length} //This is important field to render the next data
   next={fetchNext}
   hasMore={hasMoreList}
   loader={(loading)?<h4>Loading...</h4>:null}
 >

<Masonry
     breakpointCols={breakpoints}
     className="Main-masonry-grid"
     columnClassName="Main-masonry-grid_column"
   >

{/* TO DO: This is just placeholder data for now, the call should be updated to get the users following boutiques as well as the first item from the boutique for the image */}

{following.map(function(item) {
  var itemVariants =  JSON.parse(item.variants);
 return <div key={Math.random()}>
         <Link onClick={()=>handleSellerInfo(item.vendorID,item.boutive)} to = {`/seller/${item.vendorID}`} >
     <div className="Boutique-card">
       <img alt="Image" className="Boutique-card-image" src={item.img}/>
       <div className="Boutique-card-information">
           {item.boutive} {/*TO DO: This should not be the product.brand, but the vendor.store_name*/}
       </div>
     </div>
   </Link>
 </div>
 })}

  </Masonry>

 </InfiniteScroll>


}

</div>
)
};


export default withRouter(Favorites);
