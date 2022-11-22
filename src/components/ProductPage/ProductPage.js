import React from 'react';
import './ProductPage.css';
import { Link } from 'react-router-dom';
import Login from '../Login/Login';
import ReactModal from 'react-modal';
import { withRouter } from 'react-router';
import { FaPinterest, FaFacebook, FaTwitter, FaEnvelope,FaHeart } from 'react-icons/fa';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser';
import {connect} from 'react-redux';
import {setVendorData} from  '../../store/action/vendor';
import {checkoutDataSet,setCheckoutDataSet} from  '../../store/action/checkout';


const apiUrl = "https://boutive.test";
// need to replace "fakedata" with whatever the object name is



class ProductPage extends React.PureComponent {

  constructor(props) {
      super(props);
      this.state = {
        nav1: null,
        nav2: null,
        productID : (this.props.match.params.productId) ? this.props.match.params.productId : null,
        vendorID : null,
        vendorInfo : null,
        productData : {title:"", price: "", images: [{"src":""}], variants:[{"price":""}]},
        favClicked: false,
        showModal : false,
        variantId : null,
      };
    };


    fetchProdDtl = () => {
      axios({
        method: 'GET',
        url: `${apiUrl}/getProductDetail`,
        params: {productID: this.props.match.params.productId,userID : this.props.auth.userId  }
      }).then(res => {//var obj = JSON.parse(txt);

       this.setState({productData :  JSON.parse(res.data.data.productData),
        vendorID : res.data.data.vendorID,
        vendorInfo : res.data.data.boutive,
        // vendorInfo : `${res.data.data.domain}/${res.data.data.provider_token}`,
        productID :  res.data.data.productID,
        nav1: this.slider1,
        nav2: this.slider2,
        favClicked : ( (res.data.data.fabID == null) ? false : true),
      });
      })
      .catch(error => {
          console.error('There was an error!', error.message);
      })
    }
    componentDidMount() {
      this.fetchProdDtl();
    }

  /***
   * ADD TO FAB LIST
   */
    handleModal = () => {
      this.setState({showModal: true});
      }

    handleCloseModal = () => {
        this.setState({showModal: false});
      }


    createRemoveFav =() => {
      const favorite = { productId: this.state.productID,userID : this.props.auth.userId };
      if(!this.state.favClicked){
        axios.post( `${apiUrl}/favorite/create`, favorite)
        .then(response => console.log(response))
        .catch(error => {
            this.setState({ errorMessage: error.message });
            console.error('There was an error!', error);
        });
      }
      else {
        axios.post( `${apiUrl}/favorite/remove`, favorite)
        .then(response => console.log(response))
        .catch(error => {
            this.setState({ errorMessage: error.message });
            console.error('There was an error!', error);
        });
      }
    }

    componentDidUpdate(prevProps) {
        if(prevProps.auth.userId !== this.props.auth.userId) {
          if(this.props.auth.userId){
            const favorite = { productId: this.state.productID,userID : this.props.auth.userId };
            this.setState({favClicked:true});
            axios.post( `${apiUrl}/favorite/create`, favorite)
            .then(response => console.log(response))
            .catch(error => {
                this.setState({ errorMessage: error.message });
                console.error('There was an error!', error);
            });

      }
    }
  }
    favoriteClick = () => {
        this.setState(
      {
        showModal :(this.props.auth.userId === null) ? true: false
      },
      () => {

        if(this.props.auth.userId){
          this.setState({favClicked: !(this.state.favClicked)});
          this.createRemoveFav();
        }


      }
  );
    }



    handleVendorInfo = () => {
      let vendor = {
        id : this.state.vendorID,
        storeName : this.state.vendorInfo
      }
      this.props.setVendor(vendor);
    }


    handleCheckout = () => {
       /**
       * variation title
         variation price
         variation ID
       */
      let productD = this.state.productData.variants;

       const result = productD.find((tree, i) => {
        if (tree.id == this.state.variantId) return true;
      });

     const productInfo = [{
        variantDtl : this.state.variantId,
        productName : this.state.productData.title,
        brand : this.state.productData.vendor,
        price : result.price,
        title : result.title,
        vendor :    this.state.vendorID ,
        productId : this.state.productID,
        image : this.state.productData.image.src
      }]
      this.props.setCheckoutDataSet(productInfo);
      this.props.history.push('/checkout');

    }




  render(){
    const fabStyle = {
      color: "#FA7782"
    };
    const inputStyle = {
      borderColor: "FA7782",
      color : 'gray'
    };
    function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", marginRight:"28px", color:"gray", zIndex:1 }}
        onClick={onClick}
      />
    );
    }
    function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", marginLeft:"28px", color:"gray", zIndex:1, }}
        onClick={onClick}
      />
    );
    }

    const productData = this.state.productData;
    return (

    <div className="ProductPage">

      <div className="Product-wrapper">

        <div className="Product-page-info-section">
          <div className="Flex-product">

            <div>

              <div className="Product-page-image-container">
                <Slider
                  asNavFor={this.state.nav2}
                  ref={slider => (this.slider1 = slider)}
                  arrows={false}
                  infinite={false}
                >
                 {productData.images.map(function(item, index) {
                  return <img key={index} alt="Image" className="Product-page-main-image" src={item.src}/>
                  })}
                </Slider>

                <Slider
                  asNavFor={this.state.nav1}
                  ref={slider => (this.slider2 = slider)}
                  slidesToShow={3}
                  swipeToSlide={true}
                  focusOnSelect={true}
                  arrows={true}
                  infinite={false}
                  nextArrow={<SampleNextArrow />}
                  prevArrow={<SamplePrevArrow />}

                >
                  {productData.images.map(function(item, index) {
                  return <div key={index} className="Product-page-image-thumbnails-container">
                  <img alt="Image" className="Product-page-image-thumbnails" src={item.src}/>
                  </div>
                  })
                  }
                </Slider>
              </div>

            </div>

            <div className="Product-page-main-info">

              <div className="Social-fab-icon" >
                <a href="#" onClick={this.favoriteClick}
                 style={(this.state.favClicked) ? fabStyle : inputStyle}><FaHeart className="Favorite-icon"/></a>
              </div>

              <h1 className="Product-page-product-title">{productData.title}</h1>
              <Link onClick={this.handleVendorInfo} to= {`/seller/${this.state.vendorID}`}><h2 className="Product-page-product-seller">{this.state.vendorInfo}</h2></Link>
              <h3 className="Product-page-product-price">${productData.variants[0].price}</h3>

              
              <select name="Size" className="Variant-selector" onChange={(e)=>this.setState({variantId:e.target.value})} defaultValue="select">
                <option value="select" disabled> Select Option </option>
                {productData.variants.map(function(item, index) {
                return <option value={item.id} key={index}>
                {item.title}
                </option>
                })
                }
              </select>

              {/* <Link to="/checkout"> */}
                <button className="Buy-now-button" onClick={this.handleCheckout}>Buy Now</button>
                {/* </Link> */}

              <div className="Product-page-social-share">
                <FaPinterest className="Product-page-social-icons"/>
                <FaTwitter className="Product-page-social-icons"/>
                <FaFacebook className="Product-page-social-icons"/>
                <FaEnvelope className="Product-page-social-icons"/>
              </div>

            </div>

          </div>
        </div>

        <div className="Product-page-description-section">

          <h3>Description</h3>
          <p>
            {ReactHtmlParser(productData.body_html)}
          </p>

        </div>

      </div>

      <ReactModal
           isOpen={this.state.showModal}
           overlayClassName="Modal-overlay"
           className="Modal"
           shouldCloseOnOverlayClick={true}
           onRequestClose={this.handleOpenModal}
           >
           <div className="Modal-title">
            <p className="Modal-title-close" onClick={this.handleCloseModal}>X</p>
            </div>
          <Login closeModal = {this.handleCloseModal}/>
        </ReactModal>
    </div>
  );
              }

}
const mapStateToProps = state => ({
  auth : state.auth
  });



const mapDispatchToProps = (dispatch) => ({
   setCheckoutDataSet: (productInfo) => dispatch(setCheckoutDataSet(productInfo)),
  setVendor: (vendorInfo) => dispatch(setVendorData(vendorInfo))
});
ProductPage.propTypes = {};



export default  connect(mapStateToProps,mapDispatchToProps)(withRouter(ProductPage));
