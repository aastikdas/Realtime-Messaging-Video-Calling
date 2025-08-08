import { useState } from "react"
import useAuthUser from "../hooks/useAuthUser"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { completeOnboarding } from "../lib/api"
import toast from "react-hot-toast"
import { CameraIcon, LoaderIcon, MapPin, MapPinCheck, MapPinCheckIcon, MapPinHouseIcon, ShipWheelIcon, ShuffleIcon } from "lucide-react"
const OnboardingPage = () => {

  const { authUser } = useAuthUser()

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    location: authUser?.location || "",
    avatar: authUser?.avatar || "",
  })

  const queryClient = useQueryClient()
  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
        toast.success("Profile Onboarding Complete."),
        queryClient.invalidateQueries({ queryKey: ["authUser"] })
    },
    onError: (error)=>{
      toast.error(error.response.data.message)
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation(formState)
  }
  const handleRandomAvatar = (e) => {
    e.preventDefault();
    const idx = Math.floor(Math.random()*100) +1
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`
    setFormState({...formState, avatar:randomAvatar})
    // toast.success("Random profile picture generated!")
  }


  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-3xl shadow-xl">
        <div className="card-body p-2 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Complete Your Profile</h1>
            <form onSubmit={handleSubmit} className="space-y-2">
                {/* Profile picture */}
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                      {formState.avatar? 
                      (<img
                         src={formState.avatar}
                         alt="Avatar Image"
                         className="w-full h-full object-cover"
                         onLoad={() => toast.success("Random profile picture loaded!")}
                         >
                      </img>)
                      :
                      (<div className="flex items-center justify-center h-full">
                        <CameraIcon className="size-12 text-base-content opacity-40"/>
                      </div>)}
                    </div>
                    {/* generate random avatar */}
                    <div className="flex items-center gap-2">
                      <button
                      onClick={handleRandomAvatar}
                      className="btn btn-accent">
                        <ShuffleIcon/>
                        Generate Random Avatar
                      </button>
                    </div>
                  </div>
                  {/* FULL NAME */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formState.fullName}
                  onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                  className="input input-bordered w-full"
                  placeholder="Your full name"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Bio</span>
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formState.bio}
                  onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                  className="input input-bordered w-full"
                  placeholder="About yourself ..."
                />
              </div>

              {/* LOCATION */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Location</span>
              </label>
              <div className="relative">
                <MapPinHouseIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
                <input
                  type="text"
                  name="location"
                  value={formState.location}
                  onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                  className="input input-bordered w-full pl-10"
                  placeholder="City, Country"
                />
              </div>
            </div>
            <button className="btn btn-primary w-full" disabled={isPending} type="submit">
              {!isPending ? 
              (
                <>
                  <ShipWheelIcon className="hover:animate-spin size-5 mr-2" />
                  Complete Onboarding
                </>
              ) : 
              (
                <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                  Onboarding...
                </>
              )}
            </button>

            </form>
        </div>
      </div>
    </div>
  )
}

export default OnboardingPage
// 3.21.51