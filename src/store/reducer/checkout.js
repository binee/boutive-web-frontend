import { connectAdvanced } from 'react-redux';
import {CHECKOUT} from '../action/checkout';

const initialState = {
    productInfo : null
}

export default (state = initialState,action) => {
    switch(action.type){
        case CHECKOUT :
            return{
                productInfo : action.productOBJ,
            };
        default:
            return state;
    }
}