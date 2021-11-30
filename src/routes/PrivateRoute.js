import React, { PureComponent } from 'react';
import { Navigate } from 'react-router-dom';

class PrivateRoute extends PureComponent {
  render(props) {
    const hash = window.location.hash.substr(1);
    const isRecovery = new URLSearchParams(hash).get('type');
    const { component: Component, auth } = this.props;
    if (isRecovery === 'recovery') {
      return <Navigate to={`/change-password?${hash}`} />;
    }
    if (auth === null) {
      return <Navigate to="/login" />;
    }
    return <Component {...props} />;
  }
}

export default PrivateRoute;
