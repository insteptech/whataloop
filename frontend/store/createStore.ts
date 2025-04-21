// store/createStore.ts
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {reducers} from '@/reducersMap';

  const  createStore = (): any =>{
  return configureStore({
    reducer: combineReducers(reducers),
    devTools: process.env.NODE_ENV !== 'production',
  });
}

export default createStore