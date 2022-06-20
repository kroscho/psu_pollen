import React from "react";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({
  component: Component,
  user,
  loading,
  ...rest
}: any) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (loading) {
          return <div>loading</div>;
        } else {
          if (user) {
            return <Component {...rest} {...props} />;
          } else {
            return (
              <Redirect
                to={{
                  pathname: "/login",
                  state: {
                    from: props.location,
                  },
                }}
              />
            );
          }
        }
      }}
    />
  );
};

export default ProtectedRoute;
