export const VENDOR_INFO = 'VENDOR_INFO';

export const vendorAction = (vendorOBJ) => ({    
    type:VENDOR_INFO,
    vendorOBJ
})


export const setVendorData  = (vendorOBJ) => (dispatch) => {
    localStorage.setItem("vendor", JSON.stringify(vendorOBJ));
    dispatch(vendorAction(vendorOBJ));
}