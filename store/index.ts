import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import menuReducer from './features/menuSlice';
import orderReducer from './features/orderSlice';

const store = configureStore({
        reducer: {
            menu: menuReducer,
            order: orderReducer
        },
    }
);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch

export default store;