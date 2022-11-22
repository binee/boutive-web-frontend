export const SEARCH_INFO = 'SEARCH_INFO';

export const vendorAction = (searchQuery) => ({    
    type:SEARCH_INFO,
    searchQuery
})


export const setVendorData  = (searchQuery) => (dispatch) => {
   // localStorage.setItem("vendor", JSON.stringify(vendorOBJ));
    dispatch(vendorAction(searchQuery));
}