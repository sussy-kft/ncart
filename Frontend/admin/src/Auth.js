import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Auth(Component) {
  return function AuthComponent(props) {
    const [authorized, setAuthorized] = React.useState(false);
    const navigate = useNavigate();

    useEffect(() => {
      if (Math.random() > 0.5) {
        setAuthorized(true);
      } else {
        navigate('/login');
      }
    }, []);

    if (authorized) {
      return <Component {...props} />;
    }

    return null;
  };
}

export default Auth;