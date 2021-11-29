import React, { PureComponent } from 'react';
import { Navigate } from 'react-router-dom';

class PrivateRoute extends PureComponent {
  render(props) {
    const { component: Component, auth } = this.props;
    if (auth === null) {
      return <Navigate to="/login" />;
    }
    return <Component {...props} />;
  }
}

export default PrivateRoute;
