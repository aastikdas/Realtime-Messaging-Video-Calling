import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import toast from 'react-hot-toast'
import { login } from '../lib/api'

const useLogin = () => {
    const queryClient= useQueryClient();
  const {mutate, isPending, error} = useMutation({
    mutationFn: login,
    onSuccess: ()=>{
      toast.success("Login Successful."),
      // queryClient.clear();
      queryClient.invalidateQueries({ queryKey: ["authUser"] })
    },
    onError: ()=>{
      toast.error("Login unsuccessful ",error.response.data.message)
    },    
  })
  return {loginMutation:mutate, isPending, error}
}

export default useLogin
