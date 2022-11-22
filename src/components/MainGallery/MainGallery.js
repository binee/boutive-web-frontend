import React, { useState,useEffect, useCallback } from 'react'
import './MainGallery.css';
import Masonry from 'react-masonry-css';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import { Link } from 'react-router-dom';

const apiUrl = "https://boutive.test";
// masonry grid: https://www.npmjs.com/package/react-masonry-css
// infinite scroll component: https://www.npmjs.com/package/react-infinite-scroll-component

const  breakpoints = {
  default: 4,
  1260: 3,
  940: 2,
  630: 2
};

  const  MainGallery = () => {

  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [productData, setProductData] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(null);
  const [lastPage, setLastPage] = useState(null);//
  useEffect(() => {
    setLoading(true);
    setError(false);
    let cancel;
    axios({
      method: 'GET',
      url: `${apiUrl}/getProductGallery`,
      params: {page: pageNumber },
      cancelToken: new axios.CancelToken(c => cancel = c)
    }).then(res => {

      setProductData(prevProductData => {
        return [...prevProductData,...res.data.data.data]
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
  }, [pageNumber])

  const fetchData = useCallback(node => {
    if(currentPage-lastPage!==0 && hasMore){
      setPageNumber(prevPageNumber => prevPageNumber + 1)
    }
    else{
      setHasMore(false);
    }
  }, [hasMore,currentPage,lastPage])


    return (

  <div className="MainGallery">
    <h1>Discover</h1>
    <InfiniteScroll
      dataLength={productData.length} //This is important field to render the next data
      next={fetchData}
      hasMore={hasMore}
      loader={(loading)?<h4>Loading...</h4>:null}
      endMessage={
        <p style={{ textAlign: 'center' }}>
          <b>Yay! You've seen it all</b>
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

  </div>
)


};


export default MainGallery;
