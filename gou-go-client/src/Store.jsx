import React, { createContext, useReducer, useEffect, useState } from 'react';
import { Spin } from '@douyinfe/semi-ui';
import server from 'server';
const initialState = {
  user: {},
  text: '',
  signVisible: 0,
  petVisible: false,
};

export const Context = createContext(initialState);

export const Store = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case 'SET_USER':
        return { ...state, user: action.payload };
      case 'SIGNOUT':
        localStorage.removeItem('user_jwt');
        return { ...state, user: {} };
      case 'SHOW_SIGNIN':
        return { ...state, signVisible: 1 };
      case 'SHOW_SIGNUP':
        return { ...state, signVisible: 2 };
      case 'HIDE_SIGN':
        return { ...state, signVisible: 0 };
      case 'SHOW_PET':
        return { ...state, petVisible: true };
      case 'HIDE_PET':
        return { ...state, petVisible: false };
      default:
        return state;
    }
  }, initialState);

  const [initing, setIniting] = useState(true);

  useEffect(() => {
    server
      .login()
      .then((res) => {
        if (res.data && res.data.success && res.data.data) {
          dispatch({ type: 'SET_USER', payload: res.data.data });
        }
      })
      .catch((e) => console.log(e))
      .then(() => setIniting(false));
  }, []);

  return (
    <Context.Provider value={[state, dispatch]}>
      {initing ? (
        <div className='d-flex aic jcc fullscreen'>
          <Spin size='large' />
        </div>
      ) : (
        children
      )}
    </Context.Provider>
  );
};
