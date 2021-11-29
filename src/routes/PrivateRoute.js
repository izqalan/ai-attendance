import React, { PureComponent } from 'react';
import { Route, Redirect } from 'react-router';

class PrivateRoute extends PureComponent {
  renderComponent(props) {
    const { component: Component, token } = this.props;
    if (token === null) {
      return <Redirect to={{ pathname: '/login' }} />;
    }

    return <Component {...props} />;
  }

  render() {
    const { component: Component, token, ...rest } = this.props;

    return <Route {...rest} render={props => this.renderComponent(props)} />;
  }
}

export default PrivateRoute;
