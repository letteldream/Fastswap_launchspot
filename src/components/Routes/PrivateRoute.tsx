import React from 'react'
import { Redirect, Route } from 'react-router-dom'

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            localStorage.getItem('adaToken') ? (
                <Component {...props} />
            ) : (
                <Redirect to={{ pathname: '/admin/login', state: { from: props.location } }} />
            )
        }
    />
)

export default PrivateRoute