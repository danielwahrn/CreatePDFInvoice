
import { userConstants } from './constants';
import Api from '../../Api'

const actions = {
    login,
    register
};

function login(user) {
    console.log('user', this);
    return dispatch => {
        dispatch(request({ user }));
        
        if(user.username !== '' && user.password !== ''){
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...user })
            };
        
            Api.apiFetch('/auth/admin/login', requestOptions)
            .then(result => {
                if(result.success){
                    Api.saveToken(result.token)
                    Api.saveUser(result.user)
                    dispatch(success(result.user));
                    this.history.push('/dashboard/users')
                    return true;
                }
                else{
                    alert(result.message)
                    return false;
                }
            })
            
        }
    };

    function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } } 
}

function register(user) {
    return dispatch => {
        dispatch(request(user));

        // userService.register(user)
        //     .then(
        //         user => {
        //             dispatch(success());
        //             this.props.history.push('/login');
        //         },
        //         error => {
        //             dispatch(failure(error.toString()));
        //         }
        //     );
    };

    function request(user) { return { type: userConstants.REGISTER_REQUEST, user } }
    function success(user) { return { type: userConstants.REGISTER_SUCCESS, user } }
    function failure(error) { return { type: userConstants.REGISTER_FAILURE, error } }
}

export default actions;