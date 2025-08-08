import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { getAuthUser } from '../lib/api'

const useAuthUser = () => {
  const authUser = useQuery({
      queryKey:["authUser"],
      // use effect just send once and sits, but thanks to useQuery it retryies it self many times
      queryFn : getAuthUser,
      retry:false
    })
    return {isLoading: authUser.isLoading, authUser:authUser.data?.user}
}

export default useAuthUser
