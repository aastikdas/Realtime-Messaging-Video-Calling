import { LineChart } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router'

const FriendsCard = ({friend}) => {
  return (
    <div className='card bg-base-400 hover:shadow-md transition-shadow'>
      <div className='card-body p-4'>
        <div className='flex items-center gap-4 mb-3'>
            <div className='avatar size-12'>
            <img src={friend.avatar} alt={friend.fullName} />
            </div>
            <h3 className='font-semibold truncate'>{friend.fullName}</h3>
        </div>
        <div className='flex flex-wrap mb-3'>
            <span className='text-sm'>Bio: {friend.bio}</span>
        </div>
      </div>
      <Link to={`/chat/${friend._id}`} className='btn btn-outline w-full'> 
      Message
      </Link>
    </div>
  )
}

export default FriendsCard
