import {VENDOR_INFO} from '../action/vendor';

const initialState = {
    vendor : null
}

export default (state = initialState,action) => {
    switch(action.type){
        case VENDOR_INFO :
            return{
                vendor : action.vendorOBJ,
            };
        default:
            return state;
    }
}