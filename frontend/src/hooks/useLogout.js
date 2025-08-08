import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { logout } from '../lib/api'
import toast from 'react-hot-toast'
import { Navigate, useNavigate } from 'react-router'

const useLogout = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const {mutate}=useMutation({
    mutationFn: logout,
    onSuccess:()=> {
        toast.success("Logged out Successfully")
        // queryClient.clear()
        queryClient.invalidateQueries({queryKey:["authUser"]})
       setTimeout(() => navigate('/login'), 1000)  // let auth state settle
    }
  })
  return { logoutMutation:mutate}
}

export default useLogout
