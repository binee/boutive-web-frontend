export const CHECKOUT = 'CHECKOUT';

export const checkoutDataSet = (productOBJ) => ({    
    type:CHECKOUT,
    productOBJ
})


export const setCheckoutDataSet  = (productOBJ) => (dispatch) => {
    localStorage.setItem("checkoutData", JSON.stringify(productOBJ));
    dispatch(checkoutDataSet(productOBJ));
}