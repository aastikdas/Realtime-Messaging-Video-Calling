import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import useAuthUser from '../hooks/useAuthUser';
import { useQuery } from '@tanstack/react-query';
import { getStreamToken } from '../lib/api';
import {
  StreamVideo,
  StreamVideoClient,
  StreamCall,
  CallControls,
  SpeakerLayout,
  StreamTheme,
  CallingState,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import toast from "react-hot-toast";
import PageLoader from "../components/PageLoader";
import { useNavigate } from 'react-router';
const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

const CallPage = () => {
  const {id:callId} = useParams();
  const [client, setClient] = React.useState(null);
  const [call, setCall] = React.useState(null);
  const[ isConnecting, setIsConnecting] = React.useState(true);  

  const {authUser, isLoading} = useAuthUser();

  const {data:tokenData}= useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser
  })
  useEffect(() => {
    const initCall = async () => {
      if(!tokenData.token || !authUser || !callId) return;

      try {
        console.log("Initializing call with token:");
        const user ={
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.avatar,
        }
        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
        });
        const callInstance = videoClient.call("default", callId)
        await callInstance.join({create: true});
        toast.success("Joined call successfully");

        setClient(videoClient);
        setCall(callInstance);
        
      } catch (error) {
        toast.error("Failed to join call. Try again later.");
        console.error("Error initializing call:", error);
      } finally {
        setIsConnecting(false);
      }
    }
    initCall()
  }, [tokenData, authUser, callId]); 

  if( isLoading || isConnecting) {
    return <PageLoader />
  }
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="relative">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Could not initialize call. Please refresh or try again later.</p>
          </div>
        )}
      </div>
    </div>
  );
};
const CallContent = () => {
  const { useCallCallingState } = useCallStateHooks();
  const callingState = useCallCallingState();

  const navigate = useNavigate();

  if (callingState === CallingState.LEFT) return navigate("/");

  return (
    <StreamTheme>
      <SpeakerLayout />
      <CallControls />
    </StreamTheme>
  );
};

export default CallPage
