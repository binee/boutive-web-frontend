import {SEARCH_INFO} from '../action/search';

const initialState = {
    search : null
}

export default (state = initialState,action) => {
    switch(action.type){
        case SEARCH_INFO :
            return{
                search : action.searchQuery,
            };
        default:
            return state;
    }
}