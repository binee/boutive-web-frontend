import {LOGIN , LOGOUT} from "../action/auth";

const initialState = {
    token : null,
    userId : null
}

export default (state = initialState,action) => {
    switch(action.type){
        case LOGIN :
            return{
                token : action.token,
                userId : action.userId
            };
        case LOGOUT:
            return{
                token : null,
                userId : null
            };
        default:
            return state;
    }
}