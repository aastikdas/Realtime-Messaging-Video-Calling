import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { getOutgoingFriendReqs, getRecommendedUsers, getUserFriends, sendFriendRequest } from '../lib/api';
import { useEffect } from 'react';
import { Link } from 'react-router';
import { CheckCheckIcon, LoaderIcon, MapPin, MapPinIcon, UserPlus2Icon, UserSearchIcon, UsersIcon } from 'lucide-react';
import FriendsCard from '../components/FriendsCard';
import NoFriendsFound from '../components/NoFriendsFound';
// import useQueryClient from 
const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds]= useState(new Set())

  const {data:friends=[],isLoading: loadingFriends} = useQuery({
    queryKey:["friends"],
    queryFn: getUserFriends,
  })
  const {data:recommendedUsers=[],isLoading: loadingUsers} = useQuery({
    queryKey:["users"],
    queryFn: getRecommendedUsers,
  })

  const {data:outgoingFriendReqs}= useQuery({
    queryKey:["outgoingFriendReqs"],
    queryFn:getOutgoingFriendReqs,
  })
  const {mutate: sendRequestMutation, isPending} = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: ()=> queryClient.invalidateQueries({queryKey:["outgoingFriendReqs"],})
  })
  
  useEffect(() => {
    const outgoingIds = new Set()
    if(outgoingFriendReqs && outgoingFriendReqs.length>0){
      outgoingFriendReqs.forEach((req) => {
        if (req?.recipient?._id) {
        console.log("Outgoing Request:", req);
        outgoingIds.add(req.recipient._id); // ✅ Safe access
      } else {
        console.warn("Malformed request object:", req);
      }
      });
      setOutgoingRequestsIds(outgoingIds)
    }
  }, [outgoingFriendReqs])
  
  return (
    <div className="p-4 sm:p-6 lg:p-8 data-theme={light}">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
          <Link to="/notifications" className="btn btn-outline btn-sm">
            <UsersIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>
        {loadingFriends?
        (
          <div className='flex justify-center py-12'>
            <span className='loading loading-spinner loading-lg' />
          </div>
        ): friends.length===0 ? (
          <NoFriendsFound/>
        ):( 
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 '>
            {friends.map((friend)=>(
              <FriendsCard key={friend._id} friend={friend}/>
            ))}
          </div>

        )}
        <section>
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Meet New People</h2>
                <p className="opacity-70">
                  Discover
                </p>
              </div>
            </div>
          </div>
          {loadingUsers?(
            <div className='flex justify-center py-12'>
            <span className='loading loading-spinner loading-lg' />
            </div>
          ): recommendedUsers.length === 0 ? (<div className="card bg-base-200 p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">No recommendations available</h3>
              <p className="text-base-content opacity-70">
                Check back later!
              </p>
            </div>):(
              <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 '>
                {recommendedUsers.map((user)=>{
                  const hasRequestBeenSent = outgoingRequestsIds?.has(user._id);
                  return (
                    <div key={user._id} className='border rounded-xl p-2'>
                      <div className='card-body  p-5 space-y-4'>
                        <div className='flex items-center gap-3'>
                          <div className="avatar size-16 rounded-full">
                          <img src={user.avatar} alt={user.fullName} />
                          </div> 
                          <div>
                          <h3 className="font-semibold text-lg">{user.fullName}</h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-70 mt-1">
                              <MapPinIcon className="size-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                        </div>
                     
                    {user.bio && <p className="text-sm opacity-70">Bio: {user.bio}</p>}
                    <button
                    className={`btn w-full mt-2 ${hasRequestBeenSent? " btn-disabled ": " btn-primary"}`}
                    disabled={hasRequestBeenSent || isPending}
                    onClick={()=>sendRequestMutation(user._id)}
                    >
                      {hasRequestBeenSent? (
                        <>
                        <CheckCheckIcon className='size-4 mr-2'/>
                        Request Sent
                        </>
                      ) :(
                         <>
                        <UserPlus2Icon className='size-4 mr-2'/>
                        Send Friend Request
                        </>
                      )}
                    </button>
                     </div>
                    </div>
                  )
                })}
              </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default HomePage
