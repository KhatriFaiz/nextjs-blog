"use client";

import {
  Dispatch,
  ReactNode,
  createContext,
  useEffect,
  useReducer,
} from "react";

interface User {
  _id?: string;
  name?: string;
  username?: string;
  email?: string;
}

interface ActionLogin {
  type: "login";
  user: User;
}

interface ActionLogout {
  type: "logout";
  user: null;
}

type Action = ActionLogin | ActionLogout;

export const AuthContext = createContext<{
  auth: null | User;
  dispatch: Dispatch<Action>;
}>({
  auth: null,
  dispatch: () => null,
});

function authReducer(auth: User | null, action: Action) {
  switch (action.type) {
    case "login":
      return action.user;

    case "logout":
      return action.user;
  }
}

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [auth, dispatch] = useReducer(authReducer, null);
  useEffect(() => {
    const refreshSession = async () => {
      const response = await fetch("/api/auth/refresh");
      const result = await response.json();
      if (result.success) {
        dispatch({ type: "login", user: result.user });
      }
    };
    refreshSession();
  }, []);
  return (
    <AuthContext.Provider value={{ auth, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
