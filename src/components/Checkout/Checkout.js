import React from 'react';
import './Checkout.css';
import { Link } from 'react-router-dom';
import {connect} from 'react-redux';
import {url} from '../../Constants/api_config';
import axios from 'axios';
import {checkoutDataSet,setCheckoutDataSet} from  '../../store/action/checkout';


class Checkout extends React.PureComponent {
  constructor(props) {
      super(props);
      this.state = {
      checkout: {},
      shippingToken : null,
      section: "address",
      price:{
        shippingRatesHandle : "",
        shipping: "Calculated at shipping",
        tax: "Calculated at shipping",
        subTotal:(this.props.checkout.productInfo[0].price)?this.props.checkout.productInfo[0].price : 0,
        totalPrice : (this.props.checkout.productInfo[0].price)?this.props.checkout.productInfo[0].price : 0,
      },
      fields: {
        province_code : 'AL',
        billing_province_code : 'AL',
      },
      shippingRates : [{"title":""}],
      errors: {},
      successOpen: false,
      failedPayment: false

        };

    };



     handleValidation=() =>{
      let fields = this.state.fields;
      let errors = {};
      let formIsValid = true;

      //Email
      if (!fields["email"]) {
          formIsValid = false;
          errors["email"] = "Email cannot be empty";
      }

      if (typeof fields["email"] !== "undefined") {
          let lastAtPos = fields["email"].lastIndexOf('@');
          let lastDotPos = fields["email"].lastIndexOf('.');

          if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') == -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
              formIsValid = false;
              errors["email"] = "Email is not valid";
          }
      }

      if (!fields["phone"]) {
        formIsValid = false;
        errors["phone"] = "Phone Number cannot be empty";
      }
      if (!fields["first_name"]) {
          formIsValid = false;
          errors["first_name"] = "First Name cannot be empty";
      }

      if (!fields["last_name"]) {
        formIsValid = false;
        errors["last_name"] = "Last Name cannot be empty";
      }
      if (!fields["address1"]) {
        formIsValid = false;
        errors["address1"] = "Address cannot be empty";
      }
      if (!fields["city"]) {
        formIsValid = false;
        errors["city"] = "City cannot be empty";
      }
      if (!fields["province_code"]) {
        formIsValid = false;
        errors["province_code"] = "State cannot be empty";
      }
      if (!fields["zip"]) {
        formIsValid = false;
        errors["zip"] = "Zip cannot be empty";
      }
      if (!fields["billing_first_name"]) {
        formIsValid = false;
        errors["billing_first_name"] = "Billing First Name cannot be empty";
      }
      if (!fields["billing_last_name"]) {
        formIsValid = false;
        errors["billing_last_name"] = "Billing Last Name cannot be empty";
      }

      if (!fields["billing_phone"]) {
        formIsValid = false;
        errors["billing_phone"] = "Billing Phone Number cannot be empty";
      }
      if (!fields["billing_address1"]) {
        formIsValid = false;
        errors["billing_address1"] = "Billing Address1 cannot be empty";
      }
      if (!fields["billing_city"]) {
        formIsValid = false;
        errors["billing_city"] = "Billing City cannot be empty";
      }
      if (!fields["billing_zip"]) {
        formIsValid = false;
        errors["billing_zip"] = "Billing ZipCode cannot be empty";
      }
      this.setState({errors: errors});
      return formIsValid;
    }

    handleChange = (field, e) => {
        let fields = this.state.fields;
        fields[field] = e.target.value;
        this.setState({fields});
    }

    handleSubmit = (e)=>{
      e.preventDefault();
      if (this.handleValidation()) {
        this.setState({successOpen: true});

        this.setShippingPage();
          return true;
      } else {
          return false;
      }
    }


    setShippingPage = async() => {
      let errors = {};
      let formIsValid = true;
       const response = await fetch(`${url}/checkout`,
          {

              method : 'POST',
              headers : {
                'Content-Type': 'application/json',
             },
            body : JSON.stringify({
            "variant_id": this.props.checkout.productInfo[0].variantDtl,
            "quantity": 1,
            "vendor" : this.props.checkout.productInfo[0].vendor,
            "productId" : this.props.checkout.productInfo[0].productId,
            "email":this.state.fields['email'],
            "userId" : this.props.auth.userId,
            "shipping_address": {
            "first_name": this.state.fields['first_name'],
            "last_name": this.state.fields['last_name'],
            "address1":  this.state.fields['address1'], //'1734 N 2600 W',
            "address2":  this.state.fields['address2'],
            "city": this.state.fields['city'], //'Lehi',
            "province_code":this.state.fields['province_code'], //'UT',//
            "country_code": "US",
            "phone": this.state.fields['phone'],
            "zip": this.state.fields['zip'] //'84043',
            },
            "billing_address": {
              "first_name": this.state.fields['billing_first_name'],
              "last_name": this.state.fields['billing_last_name'],
              "address1":  this.state.fields['billing_address1'], //'1734 N 2600 W',
              "address2":  this.state.fields['billing_address2'],
              "city": this.state.fields['billing_city'], //'Lehi',
              "province_code":this.state.fields['billing_province_code'], //'UT',//
              "country_code": "US",
              "phone": this.state.fields['billing_phone'],
              "zip": this.state.fields['billing_zip'] //'84043',
              }
          })
        });
        if(!response.ok){
          formIsValid = false;
          errors["err"] = " Please Try Again. Something went Wrong...";
          this.setState({errors: errors});
           return formIsValid;
      }
        try{
      const resDate  = await response.json();// this.setState({successOpen: true})
     this.setState(
      {
        shippingRates : resDate.shippingRate,
        shippingToken : resDate.checkout.token,
        section: "shipping",
        successOpen : true
      },
      () => {});
     }

  catch(err){
           formIsValid = false;
            errors["err"] = err.message;
            this.setState({errors: errors});
            return formIsValid;
          }

    }



    
    updateCheckout = async() => {
      console.log(this.state.shippingToken);
      console.log(this.state.price);
      let errors = {};
      let formIsValid = true;
      const response = await fetch(`${url}/checkout/update`,
          {

              method : 'POST',
              headers : {
                'Content-Type': 'application/json',
             },
            body : JSON.stringify({
            "checkoutToken": this.state.shippingToken,  
            "vendor" : this.props.checkout.productInfo[0].vendor,        
            "checkout": {
           "shipping_line" : {
            "handle" : this.state.price.shippingRatesHandle
           },
            },
          })
        });

        if(!response.ok){
          formIsValid = false;
          errors["err"] = " Please Try Again. Something went Wrong...";
          this.setState({errors: errors});
           return formIsValid;
      }
        try{
      const resDate  = await response.json();
     this.setState(
      {
        successOpen : false,
        section: "payment"
      },
      () => {});
     }

  catch(err){
           formIsValid = false;
            errors["err"] = err.message;
            this.setState({errors: errors});
            return formIsValid;
          }
    }
    setSummaryPage = () => {
      this.setState({
        section: "summary"
      })
    }
    setAddressPage = () => {
      this.setState({
        section: "address"
      })
    }

    onRadioChange = (e) => {
    var getFilteredCodes = (array, key, value) => array.filter(x => x[key] === value);
    const shippingRate = this.state.shippingRates;
    const FilterList = getFilteredCodes(shippingRate,'id',e.target.value);
if(FilterList.length>=1){
    const priceArray = [];
    priceArray['tax'] =  FilterList[0].checkout.total_tax;
    priceArray['subTotal'] =  FilterList[0].checkout.subtotal_price;
    priceArray['totalPrice'] =  FilterList[0].checkout.total_price;
    priceArray['shipping'] =  FilterList[0].price;
    priceArray['shippingRatesHandle'] =FilterList[0].handle;
    this.setState({
      price: priceArray,
      successOpen : false,
      });
}

}

tokenize = async() => {
  let errors = {};
  let formIsValid = true;

  //URL encode payload
  const params = new URLSearchParams();
  params.append('card[number]', this.state.fields['ccNumber']);
  params.append('card[exp_month]', this.state.fields['expMonth']);
  params.append('card[exp_year]', this.state.fields['expYear']);
  params.append('card[cvc]', this.state.fields['cvc']);

  //TODO: Move token to file and get strip-account from store set from the initial checkout request
  let headers = {
    "authorization": 'Bearer sk_test_MRLUOvSoqQJnO9NmjHSrK30w00iRtGwZuM',
    "stripe-account": 'acct_1CNprnKjUY3PRkoX',
    "Content-Type": "application/x-www-form-urlencoded"
  }

  let res = null;

  //Tokenize credit card info
  res = await axios.post('https://api.stripe.com/v1/tokens', params, { headers: headers }).catch(function(e) {
    console.log(e);
  });

  if(res !== undefined && res.status === 200) {
    this.setState({sub_id: res.data.id})
    this.setState({successOpen: true})
   const response = await fetch(`${url}/checkout/complete`,
    {

        method : 'POST',
        headers : {
          'Content-Type': 'application/json',
       },
      body : JSON.stringify({
      "checkoutToken": this.state.shippingToken,  
      "vendor" : this.props.checkout.productInfo[0].vendor,   
      "payment": {
     "request_details" : {
      "ip_address":res.data.client_ip,
      "accept_language":"en",
      "user_agent":"Chrome/54.0.2840.98"
     },
     "payment_token":{
      "payment_data":res.data.id,
      "type":"token"
   },
   "amount": this.state.price.totalPrice,          
   "unique_token":"acct_1I3wD4R6sfYHmq3l"
      },
    })
  });
  if(!response.ok){
    formIsValid = false;
    errors["err"] = " Please Try Again. Something went Wrong...";
    this.setState({errors: errors});
     return formIsValid;
}
  try{
const resDate  = await response.json();
const productInfo = [{
  variantDtl : null,
  productName : null,
  brand : null,
  price : null,
  title : null,
  vendor :    null,
  productId : null,
  image : null
}]
this.props.setCheckoutDataSet(productInfo);
this.setState(
{
  successOpen : false,
  section: "summary"
},
() => {});
}

catch(err){
     formIsValid = false;
      errors["err"] = err.message;
      this.setState({errors: errors});
      return formIsValid;
    }
    return true;
  }
  else {
    this.setState({failedPayment: true})
    return false;
  }

}

render(){
  let formStyle = {
    cursor: "not-allowed", 
  
  };
  let inputStyle = {
    pointerEvents: "none",
  
  };
   let shippingAddress = (
      <div className="Left-wrapper">
      <div className="Checkout-left-information-container">
        <h3>Contact information</h3>

        <div className="Checkout-form-full">
            <p>Email</p>
            <input type="email" name="email" placeholder="Email" className="Checkout-form" required onChange={this.handleChange.bind(this, "email")}/>
            <span className="msg_error">{this.state.errors["email"]}</span>
          </div>

          <div className="Checkout-form-full">
            <p>Phone</p>
            <input type="text" onChange={this.handleChange.bind(this, "phone")} name="phone" className="Checkout-form" placeholder="Phone Number" required/>
            <span className="msg_error">{this.state.errors["phone"]}</span>
          </div>
      </div>

      <div className="Checkout-left-information-container">
        <h3>Shipping Address</h3>

        <div className="Checkout-align-horizontal-center">
          <div className="Checkout-form-half">
            <p>First Name</p>
            <input type="text" onChange={this.handleChange.bind(this, "first_name")} name="first_name" className="Checkout-form" placeholder="First Name" required/>
            <span className="msg_error">{this.state.errors["first_name"]}</span>

          </div>

          <div className="Checkout-form-half">
            <p>Last Name</p>
            <input type="text" className="Checkout-form"  name="last_name" placeholder="Last Name"required onChange={this.handleChange.bind(this, "last_name")}/>
            <span className="msg_error">{this.state.errors["last_name"]}</span>

          </div>
        </div>

        <div className="Checkout-form-full">
          <p>Address</p>
          <input type="text" className="Checkout-form" name="address1" placeholder="Address" required onChange={this.handleChange.bind(this, "address1")}/>
          <span className="msg_error">{this.state.errors["address1"]}</span>

        </div>

        <div className="Checkout-form-full">
          <p>Address line 2</p>
          <input type="text" className="Checkout-form" name="address2" required  placeholder="Apartment, suite, etc. (optional)" required onChange={this.handleChange.bind(this, "address2")}/>
          <span className="msg_error">{this.state.errors["address2"]}</span>

        </div>


        <div className="Checkout-form-full">
          <p>City</p>
          <input type="text" className="Checkout-form" placeholder="City" name="city"  required onChange={this.handleChange.bind(this, "city")} />
          <span className="msg_error">{this.state.errors["city"]}</span>

        </div>

        <div className="Checkout-align-horizontal-center">
          <div className="Checkout-form-third">
            <p>Country</p>
            <input type="text" className="Checkout-form" placeholder="United States" disabled={true}/>
          </div>

          <div className="Checkout-form-third">
            <p>State</p>
            <select name="province_code" className="Checkout-form" required onChange={this.handleChange.bind(this, "province_code")}  >
              <option value="AL">Alabama</option>
              <option value="AK">Alaska</option>
              <option value="AZ">Arizona</option>
              <option value="AR">Arkansas</option>
              <option value="CA">California</option>
              <option value="CO">Colorado</option>
              <option value="CT">Connecticut</option>
              <option value="DE">Delaware</option>
              <option value="DC">District Of Columbia</option>
              <option value="FL">Florida</option>
              <option value="GA">Georgia</option>
              <option value="HI">Hawaii</option>
              <option value="ID">Idaho</option>
              <option value="IL">Illinois</option>
              <option value="IN">Indiana</option>
              <option value="IA">Iowa</option>
              <option value="KS">Kansas</option>
              <option value="KY">Kentucky</option>
              <option value="LA">Louisiana</option>
              <option value="ME">Maine</option>
              <option value="MD">Maryland</option>
              <option value="MA">Massachusetts</option>
              <option value="MI">Michigan</option>
              <option value="MN">Minnesota</option>
              <option value="MS">Mississippi</option>
              <option value="MO">Missouri</option>
              <option value="MT">Montana</option>
              <option value="NE">Nebraska</option>
              <option value="NV">Nevada</option>
              <option value="NH">New Hampshire</option>
              <option value="NJ">New Jersey</option>
              <option value="NM">New Mexico</option>
              <option value="NY">New York</option>
              <option value="NC">North Carolina</option>
              <option value="ND">North Dakota</option>
              <option value="OH">Ohio</option>
              <option value="OK">Oklahoma</option>
              <option value="OR">Oregon</option>
              <option value="PA">Pennsylvania</option>
              <option value="RI">Rhode Island</option>
              <option value="SC">South Carolina</option>
              <option value="SD">South Dakota</option>
              <option value="TN">Tennessee</option>
              <option value="TX">Texas</option>
              <option value="UT">Utah</option>
              <option value="VT">Vermont</option>
              <option value="VA">Virginia</option>
              <option value="WA">Washington</option>
              <option value="WV">West Virginia</option>
              <option value="WI">Wisconsin</option>
              <option value="WY">Wyoming</option>
            </select>
            <span className="msg_error">{this.state.errors["province_code"]}</span>

          </div>

          <div className="Checkout-form-third">
            <p>Zip</p>
            <input type="text" name="zip" required onChange={this.handleChange.bind(this, "zip")} className="Checkout-form" placeholder="Zipcode"/>
            <span className="msg_error">{this.state.errors["zip"]}</span>

          </div>

        </div>
      </div>

      <div className="Checkout-left-information-container">
            <h3>Billing Address</h3>

            <div className="Checkout-align-horizontal-center">
              <div className="Checkout-form-half">
                <p>First Name</p>
                <input type="text" className="Checkout-form" placeholder="First Name"  name="billing_first_name" required onChange={this.handleChange.bind(this, "billing_first_name")}/>
                <span className="msg_error">{this.state.errors["billing_first_name"]}</span>

              </div>

              <div className="Checkout-form-half">
                <p>Last Name</p>
                <input type="text" className="Checkout-form"  name="billing_last_name" placeholder="Last Name" required onChange={this.handleChange.bind(this, "billing_last_name")}/>
                <span className="msg_error">{this.state.errors["billing_last_name"]}</span>
              </div>
            </div>


            <div className="Checkout-form-full">
            <p>Phone</p>
            <input type="text" onChange={this.handleChange.bind(this, "billing_phone")} name="billing_phone" className="Checkout-form" placeholder="Phone Number" required/>
            <span className="msg_error">{this.state.errors["billing_phone"]}</span>
          </div>

            <div className="Checkout-form-full">
              <p>Address</p>
              <input type="text" className="Checkout-form" name="billing_address1" placeholder="Address" required onChange={this.handleChange.bind(this, "billing_address1")}/>
              <span className="msg_error">{this.state.errors["billing_address1"]}</span>


           </div>

            <div className="Checkout-form-full">
              <p>Address line 2</p>
              <input type="text" className="Checkout-form"   name="billing_address2" placeholder="Apartment, suite, etc. (optional)"  required onChange={this.handleChange.bind(this, "billing_address2")}/>
              <span className="msg_error">{this.state.errors["billing_address2"]}</span>

            </div>


            <div className="Checkout-form-full">
              <p>City</p>
              <input type="text" className="Checkout-form"  name="billing_city" placeholder="City" required onChange={this.handleChange.bind(this, "billing_city")}/>
              <span className="msg_error">{this.state.errors["billing_city"]}</span>

            </div>

            <div className="Checkout-align-horizontal-center">
              <div className="Checkout-form-third">
                <p>Country</p>
                <input type="text" className="Checkout-form" placeholder="United States" disabled={true}/>
              </div>

              <div className="Checkout-form-third">
                <p>State</p>
                <select name="billing_province_code" className="Checkout-form" required onChange={this.handleChange.bind(this, "billing_province_code")}  >
                  <option value="AL">Alabama</option>
                  <option value="AK">Alaska</option>
                  <option value="AZ">Arizona</option>
                  <option value="AR">Arkansas</option>
                  <option value="CA">California</option>
                  <option value="CO">Colorado</option>
                  <option value="CT">Connecticut</option>
                  <option value="DE">Delaware</option>
                  <option value="DC">District Of Columbia</option>
                  <option value="FL">Florida</option>
                  <option value="GA">Georgia</option>
                  <option value="HI">Hawaii</option>
                  <option value="ID">Idaho</option>
                  <option value="IL">Illinois</option>
                  <option value="IN">Indiana</option>
                  <option value="IA">Iowa</option>
                  <option value="KS">Kansas</option>
                  <option value="KY">Kentucky</option>
                  <option value="LA">Louisiana</option>
                  <option value="ME">Maine</option>
                  <option value="MD">Maryland</option>
                  <option value="MA">Massachusetts</option>
                  <option value="MI">Michigan</option>
                  <option value="MN">Minnesota</option>
                  <option value="MS">Mississippi</option>
                  <option value="MO">Missouri</option>
                  <option value="MT">Montana</option>
                  <option value="NE">Nebraska</option>
                  <option value="NV">Nevada</option>
                  <option value="NH">New Hampshire</option>
                  <option value="NJ">New Jersey</option>
                  <option value="NM">New Mexico</option>
                  <option value="NY">New York</option>
                  <option value="NC">North Carolina</option>
                  <option value="ND">North Dakota</option>
                  <option value="OH">Ohio</option>
                  <option value="OK">Oklahoma</option>
                  <option value="OR">Oregon</option>
                  <option value="PA">Pennsylvania</option>
                  <option value="RI">Rhode Island</option>
                  <option value="SC">South Carolina</option>
                  <option value="SD">South Dakota</option>
                  <option value="TN">Tennessee</option>
                  <option value="TX">Texas</option>
                  <option value="UT">Utah</option>
                  <option value="VT">Vermont</option>
                  <option value="VA">Virginia</option>
                  <option value="WA">Washington</option>
                  <option value="WV">West Virginia</option>
                  <option value="WI">Wisconsin</option>
                  <option value="WY">Wyoming</option>
                </select>
              </div>

              <div className="Checkout-form-third">
                <p>Zip</p>
                  <input type="text" name="billing_zip" required onChange={this.handleChange.bind(this, "billing_zip")} className="Checkout-form" placeholder="Zipcode"/>
                  <span className="msg_error">{this.state.errors["billing_zip"]}</span>

              </div>

            </div>
          </div>
     
          <div style={(this.state.successOpen) ? formStyle : null}>

      <button className="Checkout-button" style={(this.state.successOpen) ? inputStyle : null}  onClick={this.handleSubmit}> Continue to Shipping </button>
      </div>

      <button onClick={this.props.history.goBack}> Cancel </button>

      <span className="msg_error">{this.state.errors["err"]}</span>


      </div>
    )

  let  payment = (
        <div className="Left-wrapper">
          <div className="Checkout-left-information-container">
            <h3>Credit Card</h3>
            <div className="Checkout-form-full">
              <p>Card number</p>
              <input type="text" name="ccNumber" required onChange={this.handleChange.bind(this, "ccNumber")} className="Checkout-form" placeholder="1234123412341234" maxLength={16}/>
            </div>
            <div className="Checkout-form-full">
              <p>Name on card</p>
              <input type="text" className="Checkout-form" placeholder="Name"/>
            </div>
            <div className="Checkout-align-horizontal-center">
              <div className="Checkout-form-third">
                <p>Exp. Month</p>
                <select name="expMonth" required onChange={this.handleChange.bind(this, "expMonth")} className="Checkout-form" placeholder="Exp." defaultValue="month">
                  <option value="month" disabled>Month</option>
                  <option value="01">01 - January</option>
                  <option value="02">02 - February</option>
                  <option value="03">03 - March</option>
                  <option value="04">04 - April</option>
                  <option value="05">05 - May</option>
                  <option value="06">06 - June</option>
                  <option value="07">07 - July</option>
                  <option value="08">08 - August</option>
                  <option value="09">09 - September</option>
                  <option value="10">10 - October</option>
                  <option value="11">11 - November</option>
                  <option value="12">12 - December</option>
                </select>
              </div>

              <div className="Checkout-form-third">
                <p>Exp. Year</p>
                <select type="text" name="expYear" required onChange={this.handleChange.bind(this, "expYear")} className="Checkout-form" placeholder="Exp." defaultValue="year">
                  <option value="year" disabled>Year</option>
                  <option value="2021">2021</option>
                  <option value="2022">2022</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                </select>
              </div>

              <div className="Checkout-form-third">
                <p>Security code</p>
                <input type="password" name="cvc" required onChange={this.handleChange.bind(this, "cvc")} className="Checkout-form"  placeholder="CVV" maxLength={4}/>
              </div>
            </div>
          </div>


          
          <div style={(this.state.successOpen) ? formStyle : null}>

        <button className="Checkout-button"  style={(this.state.successOpen) ? inputStyle : null} onClick={this.tokenize}>Complete Checkout</button>
        </div>
        <button onClick={this.setShippingPage}> Back </button>
      </div>
    )

  let  summary = (
        <div className="Left-wrapper">
        <p> Thank you for Shopping with Us</p>
        <button onClick={this.props.history.goBack}> Back to Shopping </button>
      </div>
    )

let chooseShipping = (
        <div className="Left-wrapper">
<div className="Checkout-left-information-container">
            <h3>Choose Shipping</h3>
                        {this.state.shippingRates.map((rates,index) =>
            <div key={index} className="Checkout-radio-container">
              <div >
                  <input className="Checkout-radio"
                  type="radio"
                    id={`${rates.title}`}
                    name = "shipping"
                    value={`${rates.id}`}
                    onChange={this.onRadioChange}
                  /><label for={rates.title}>
                  {rates.title}</label><br/>
            </div>
            <div>
                <p> ${rates.price}</p>
            </div>
            </div>
 )}
</div>

<div style={(this.state.successOpen) ? formStyle : null}>
<button className="Checkout-button" style={(this.state.successOpen) ? inputStyle : null} onClick={this.updateCheckout}>Continue to Payment</button>

</div>
        <button onClick={this.setAddressPage}>  Back </button>

      </div>
    )
  const renderSwitch = (param) => {
        switch (param) {
              case "address":   return shippingAddress;
              case "shipping":  return chooseShipping;
              case "payment":   return payment;
              case "summary":   return summary;
            }
          }
    return(
  <div className="Checkout">
      <h2> Checkout </h2>
    <div className="Checkout-wrapper">
    <div className="Checkout-left">
      {renderSwitch(this.state.section)}
    </div>
    <div className="Checkout-right">
      <div className="Checkout-right-information-container">
        <div className="Checkout-line-item">
            <img  className="Checkout-image" src={this.props.checkout.productInfo[0].image}/> {/* should be product.image */}
          <div>
    <p>{this.props.checkout.productInfo[0].productName}</p> {/* should be product.title */}
    <p>{this.props.checkout.productInfo[0].brand}</p> {/* should be product.brand */}
            <p>{this.props.checkout.productInfo[0].title}</p> {/* should be variants.name */}
          </div>
        </div>
        <hr/>
        <div className="Checkout-line-item">
          <p>Subtotal</p>
    <p>${this.state.price['subTotal']}</p> {/* should be variant.price of the correct variant combination */}
        </div>
        <div className="Checkout-line-item">
          <p>Shipping</p>
    <p>${this.state.price['shipping']}</p> {/* should be be returned from shopify */}
        </div>
        <div className="Checkout-line-item">
          <p>Tax</p>
          <p>${this.state.price['tax']}</p> {/* should be be returned from shopify */}
        </div>
        <hr/>
        <div className="Checkout-line-item">
          <p>Total</p>
          <p>${this.state.price['totalPrice']}</p> {/* should be returned from shopify */}
        </div>
      </div>

    </div>
  </div>
  </div>
)
}
};
const mapStateToProps = state => ({
  checkout : state.checkout,
  auth:state.auth
});

const mapDispatchToProps = (dispatch) => ({
  setCheckoutDataSet: (productInfo) => dispatch(setCheckoutDataSet(productInfo)),
   //setVendor: (vendorInfo) => dispatch(setVendorData(vendorInfo))
});

export default connect(mapStateToProps,mapDispatchToProps)(Checkout);
