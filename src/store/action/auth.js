
export const LOGIN = 'LOGIN';
export const LOGOUT= 'LOGOUT';


const url = 'https://boutive.test';
export const loginFacebook = (name,email,id) => {
    // await fetch (`${api.url}/facebook/callback`,requestOptions);
    return async dispatch => {
        const response = await fetch(`${url}/facebook/callback`,
          {
              method : 'POST',
              headers : {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({
                email : email,
                name : name,
                id:id
            })

          });
          if(!response.ok){
            throw new Error('Login Fail');
        }
        const resDate  = await response.json();
        console.log(resDate);
        localStorage.setItem('token',resDate.data.token);
    localStorage.setItem('userId',resDate.data.user.id);
        dispatch({type : LOGIN,token:resDate.data.token,userId:resDate.data.user.id});
        
    }
}
export const login = (email,password) => {
    return async dispatch => {
        const response = await fetch(`${url}/facebook/login`,
          {
              method : 'POST',
              headers : {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({
                email : email,
                password : password,
            })

          });
          if(!response.ok){
            throw new Error('Login Fail');
          }
        const resDate  = await response.json();
        if(!resDate.success){
            throw new Error(resDate.message);

        }
            localStorage.setItem('token',resDate.token);
            localStorage.setItem('userId',resDate.user.id);
            dispatch({type : LOGIN,token:resDate.token,userId:resDate.user.id});  
    }
}

export const signUp = (name,email,password) => {
    return async dispatch => {
console.log(name);
        const response = await fetch(`${url}/facebook/signup`,
          {
            method : 'POST',
             headers : {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({
                name : name,
                email : email,
                password : password,
            })

          });
          if(!response.ok){
            throw new Error('SignUp Fail');
          }
        const resDate  = await response.json();
        if(!resDate.success){
            throw new Error(resDate.message);

        }          
        localStorage.setItem('token',resDate.token);
        localStorage.setItem('userId',resDate.user.id);
        dispatch({type : LOGIN,token:resDate.token,userId:resDate.user.id});  
    }
}
export const authSet = (token,userId) => ({
    type:LOGIN,
    token,
    userId

})
export const logout = () => {
    return async dispatch => {
        localStorage.clear();
        dispatch({type:LOGOUT})
    }
   
}
