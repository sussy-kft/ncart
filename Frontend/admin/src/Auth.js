import { set } from 'lodash';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Auth(Component) {
  return function AuthComponent(props) {
    const [authorized, setAuthorized] = React.useState(false);
    const navigate = useNavigate();


    useEffect(() => {
      if (localStorage.getItem('token')) {
        setAuthorized(true);
        console.log("Authorized");
        setTimeout(() => {
          setAuthorized(false);
          localStorage.removeItem('token');
          navigate('/login');
        }, 3600000);
      } else {
        localStorage.removeItem('token');
        navigate('/login');
        setAuthorized(false);
      }
    }, [navigate]);

    if (authorized) {
      return <Component {...props} />;
    }

    return null;
  };
}

export default Auth;