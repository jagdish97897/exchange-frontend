import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserAsync, selectUserData } from '../authSlice';

export default function User() {
    const dispatch = useDispatch();
    const user = useSelector(selectUserData);

    useEffect(() => {
        dispatch(fetchUserAsync())
    }, [])

  return (
    <div>
      {user && user.data && user.data.user.name}
    </div>
  )
}
