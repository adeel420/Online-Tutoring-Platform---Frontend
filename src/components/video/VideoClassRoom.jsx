import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../Loader";
import RealtimeChat from "../chat/RealtimeChat";
import { getSessionWindow } from "../../utils/time";

const getIceServers = () => {
  const turnUrl = import.meta.env.VITE_TURN_URL;
  const turnUsername = import.meta.env.VITE_TURN_USERNAME;
  const turnCredential = import.meta.env.VITE_TURN_CREDENTIAL;

  const servers = [{ urls: "stun:stun.l.google.com:19302" }];

  if (turnUrl && turnUsername && turnCredential) {
    servers.push({
      urls: turnUrl,
      username: turnUsername,
      credential: turnCredential,
    });
  }

  return servers;
};

const getLocalMediaStream = async () => {
  if (!navigator.mediaDevices?.getUserMedia) {
    return new MediaStream();
  }

  try {
    return await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
  } catch {
    try {
      toast("Camera unavailable. Joining with microphone only.");
      return await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true,
      });
    } catch {
      toast("Camera and microphone unavailable. Joining in view-only mode.");
      return new MediaStream();
    }
  }
};

const getCameraAccessMessage = (error) => {
  if (!window.isSecureContext) {
    return "Camera requires localhost or HTTPS. Open the app on http://localhost or deploy it with HTTPS.";
  }

  if (error?.name === "NotAllowedError" || error?.name === "SecurityError") {
    return "Camera permission is blocked. Click the lock/camera icon in your browser address bar and allow camera access.";
  }

  if (error?.name === "NotFoundError" || error?.name === "OverconstrainedError") {
    return "No camera device was found. Connect a camera and try again.";
  }

  if (error?.name === "NotReadableError") {
    return "Camera is already being used by another app. Close that app and try again.";
  }

  return "Camera access is unavailable. Check browser permissions and try again.";
};

const VideoClassRoom = ({ booking, role, onLeave }) => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const audioSenderRef = useRef(null);
  const videoSenderRef = useRef(null);
  const seenCandidatesRef = useRef(new Set());
  const remoteDescriptionSetRef = useRef(false);
  const signalingReadyRef = useRef(false);
  const pendingCandidatesRef = useRef([]);

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [connected, setConnected] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [cameraIssue, setCameraIssue] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const apiUrl = import.meta.env.VITE_SERVER_API;
  const isTutor = role === "tutor";

  useEffect(() => {
    let mounted = true;
    let pollId;

    const headers = { Authorization: `Bearer ${token}` };

    const sendCandidate = async (sessionId, candidate) => {
      await axios.post(
        `${apiUrl}/class-sessions/${sessionId}/candidates`,
        { candidate },
        { headers },
      );
    };

    const flushPendingCandidates = async (sessionId) => {
      const pendingCandidates = pendingCandidatesRef.current.splice(0);
      for (const candidate of pendingCandidates) {
        try {
          await sendCandidate(sessionId, candidate);
        } catch (err) {
          console.warn("Could not send queued ICE candidate", err);
        }
      }
    };

    const addRemoteCandidates = async (nextSession) => {
      const candidates = nextSession?.candidates || [];
      for (const item of candidates) {
        const candidateId = item._id || `${item.sender}-${item.createdAt}`;
        const senderId = item.sender?._id || item.sender;
        if (
          seenCandidatesRef.current.has(candidateId) ||
          String(senderId) === String(user.id)
        ) {
          continue;
        }

        seenCandidatesRef.current.add(candidateId);
        try {
          if (peerRef.current?.remoteDescription) {
            await peerRef.current.addIceCandidate(new RTCIceCandidate(item.candidate));
          }
        } catch (err) {
          console.warn("Could not add ICE candidate", err);
        }
      }
    };

    const pollSession = async (sessionId) => {
      try {
        const { data } = await axios.get(`${apiUrl}/class-sessions/${sessionId}`, {
          headers,
        });
        if (!mounted) return;

        setSession(data);
        if (data.status === "ended") {
          toast("Class ended.");
          onLeave?.();
          return;
        }

        if (
          isTutor &&
          data.answer &&
          peerRef.current &&
          !remoteDescriptionSetRef.current
        ) {
          await peerRef.current.setRemoteDescription(
            new RTCSessionDescription(data.answer),
          );
          remoteDescriptionSetRef.current = true;
        }

        if (
          !isTutor &&
          data.offer &&
          peerRef.current &&
          !remoteDescriptionSetRef.current
        ) {
          await peerRef.current.setRemoteDescription(
            new RTCSessionDescription(data.offer),
          );
          remoteDescriptionSetRef.current = true;
          const answer = await peerRef.current.createAnswer();
          await peerRef.current.setLocalDescription(answer);
          await axios.put(
            `${apiUrl}/class-sessions/${sessionId}/answer`,
            { answer },
            { headers },
          );
        }

        await addRemoteCandidates(data);
      } catch (err) {
        console.warn("Class session poll failed", err);
      }
    };

    const startRoom = async () => {
      try {
        const { data: sessionData } = await axios.post(
          `${apiUrl}/class-sessions/bookings/${booking.id}`,
          {},
          { headers },
        );
        if (!mounted) return;
        setSession(sessionData);

        const localStream = await getLocalMediaStream();
        localStreamRef.current = localStream;
        setMicOn(localStream.getAudioTracks().some((track) => track.enabled));
        const hasVideoTrack = localStream
          .getVideoTracks()
          .some((track) => track.enabled);
        setCamOn(hasVideoTrack);
        setCameraIssue(
          hasVideoTrack
            ? ""
            : "Camera is not active yet. Allow camera permission, then click Start Cam.",
        );
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = localStream;
        }

        const peer = new RTCPeerConnection({ iceServers: getIceServers() });
        peerRef.current = peer;

        localStream.getTracks().forEach((track) => {
          const sender = peer.addTrack(track, localStream);
          if (track.kind === "audio") audioSenderRef.current = sender;
          if (track.kind === "video") videoSenderRef.current = sender;
        });

        if (localStream.getVideoTracks().length === 0) {
          videoSenderRef.current = peer.addTransceiver("video", {
            direction: "sendrecv",
          }).sender;
        }

        if (localStream.getAudioTracks().length === 0) {
          audioSenderRef.current = peer.addTransceiver("audio", {
            direction: "sendrecv",
          }).sender;
        }

        peer.ontrack = (event) => {
          const [remoteStream] = event.streams;
          remoteStreamRef.current = remoteStream || null;
          if (remoteVideoRef.current && remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
        };

        peer.onconnectionstatechange = () => {
          setConnected(["connected", "completed"].includes(peer.connectionState));
        };

        peer.onicecandidate = async (event) => {
          if (!event.candidate) return;
          const candidate = event.candidate.toJSON();

          if (!signalingReadyRef.current) {
            pendingCandidatesRef.current.push(candidate);
            return;
          }

          try {
            await sendCandidate(sessionData._id, candidate);
          } catch (err) {
            console.warn("Could not send ICE candidate", err);
          }
        };

        if (isTutor) {
          const offer = await peer.createOffer();
          await peer.setLocalDescription(offer);
          await axios.put(
            `${apiUrl}/class-sessions/${sessionData._id}/offer`,
            { offer },
            { headers },
          );
        }

        signalingReadyRef.current = true;
        await flushPendingCandidates(sessionData._id);

        pollId = setInterval(() => pollSession(sessionData._id), 2000);
        await pollSession(sessionData._id);
      } catch (err) {
        toast.error(
          err.response?.data?.error ||
            "Could not start video class. Please try again or refresh the page.",
        );
        onLeave?.();
      } finally {
        if (mounted) setLoading(false);
      }
    };

    startRoom();

    return () => {
      mounted = false;
      if (pollId) clearInterval(pollId);
      peerRef.current?.close();
      localStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [apiUrl, booking.id, isTutor, onLeave, token, user.id]);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((prev) => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!loading && localVideoRef.current && localStreamRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }

    if (!loading && remoteVideoRef.current && remoteStreamRef.current) {
      remoteVideoRef.current.srcObject = remoteStreamRef.current;
    }
  }, [loading]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  const toggleMic = () => {
    const audioTracks = localStreamRef.current?.getAudioTracks() || [];
    if (audioTracks.length === 0) {
      navigator.mediaDevices
        ?.getUserMedia({ audio: true, video: false })
        .then((stream) => {
          const [track] = stream.getAudioTracks();
          if (!track) {
            toast.error("No microphone found.");
            return;
          }

          localStreamRef.current?.addTrack(track);
          audioSenderRef.current?.replaceTrack(track);
          setMicOn(true);
          toast.success("Microphone started.");
        })
        .catch(() => {
          toast.error("Microphone access is blocked or unavailable.");
        });
      return;
    }
    audioTracks.forEach((track) => {
      track.enabled = !micOn;
    });
    setMicOn((prev) => !prev);
  };

  const toggleCam = () => {
    const videoTracks = localStreamRef.current?.getVideoTracks() || [];
    if (videoTracks.length === 0) {
      if (!window.isSecureContext) {
        const message = getCameraAccessMessage();
        setCameraIssue(message);
        toast.error(message);
        return;
      }

      navigator.mediaDevices
        ?.getUserMedia({ video: true, audio: false })
        .then((stream) => {
          const [track] = stream.getVideoTracks();
          if (!track) {
            toast.error("No camera found.");
            return;
          }

          localStreamRef.current?.addTrack(track);
          if (localVideoRef.current && localStreamRef.current) {
            localVideoRef.current.srcObject = localStreamRef.current;
          }
          videoSenderRef.current?.replaceTrack(track);
          setCamOn(true);
          setCameraIssue("");
          toast.success("Camera started.");
        })
        .catch((error) => {
          const message = getCameraAccessMessage(error);
          setCameraIssue(message);
          toast.error(message);
        });
      return;
    }
    videoTracks.forEach((track) => {
      track.enabled = !camOn;
    });
    setCamOn((prev) => !prev);
  };

  const shareScreen = () => {
    if (!navigator.mediaDevices?.getDisplayMedia) {
      toast.error("Screen sharing is not supported in this browser.");
      return;
    }

    navigator.mediaDevices
      .getDisplayMedia({ video: true, audio: false })
      .then((stream) => {
        const [track] = stream.getVideoTracks();
        if (!track) {
          toast.error("No screen video track available.");
          return;
        }

        localStreamRef.current
          ?.getVideoTracks()
          .forEach((oldTrack) => {
            oldTrack.stop();
            localStreamRef.current?.removeTrack(oldTrack);
          });

        localStreamRef.current?.addTrack(track);
        if (localVideoRef.current && localStreamRef.current) {
          localVideoRef.current.srcObject = localStreamRef.current;
        }
        videoSenderRef.current?.replaceTrack(track);
        setCamOn(true);
        setCameraIssue("");
        toast.success("Screen sharing started.");

        track.onended = () => {
          setCamOn(false);
          setCameraIssue("Screen sharing stopped. Connect a camera or share screen again.");
        };
      })
      .catch(() => {
        toast.error("Screen sharing was cancelled or blocked.");
      });
  };

  const leaveClass = useCallback(async (endRemote = isTutor) => {
    try {
      if (endRemote && session?._id) {
        await axios.put(
          `${apiUrl}/class-sessions/${session._id}/end`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        );
      }
    } catch (err) {
      console.warn("Could not end class session", err);
    } finally {
      onLeave?.();
    }
  }, [apiUrl, isTutor, onLeave, session?._id, token]);

  useEffect(() => {
    const windowStatus = getSessionWindow(booking);
    if (windowStatus.state !== "open" || !windowStatus.remainingMs) return undefined;

    const timer = setTimeout(() => {
      toast("Class time ended.");
      leaveClass(true);
    }, Math.max(windowStatus.remainingMs, 1000));

    return () => clearTimeout(timer);
  }, [booking, leaveClass, session?._id]);

  if (loading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <Loader size={44} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-bold text-red-600">LIVE</span>
          </div>
          <span className="font-mono text-lg font-bold text-gray-800">
            {formatTime(elapsed)}
          </span>
          <span className="text-sm text-gray-600 font-medium">
            {booking.subject || "Class Session"}
          </span>
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
              connected ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-600"
            }`}
          >
            {connected ? "Connected" : isTutor ? "Waiting for student" : "Connecting"}
          </span>
        </div>
        <button
          onClick={() => leaveClass(isTutor)}
          className="px-4 py-2 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-all cursor-pointer shadow"
        >
          {isTutor ? "End Class" : "Leave Class"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        <div className="bg-gray-950 rounded-2xl overflow-hidden aspect-video relative">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          {!connected && (
            <div className="absolute inset-0 flex items-center justify-center text-white/70 text-sm font-semibold">
              Waiting for remote video...
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-gray-900 rounded-2xl overflow-hidden aspect-video relative">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            {!camOn && (
              <div className="absolute inset-0 bg-gray-900 flex items-center justify-center text-white">
                Camera Off
              </div>
            )}
            <span className="absolute left-3 bottom-3 px-2 py-1 rounded-lg bg-black/50 text-white text-xs font-semibold">
              You
            </span>
          </div>

          {cameraIssue && (
            <div className="bg-orange-50 border border-orange-100 text-orange-700 rounded-2xl p-4 text-sm leading-relaxed">
              <p className="font-semibold mb-1">Camera needs attention</p>
              <p>{cameraIssue}</p>
              <p className="text-xs mt-2 text-orange-600">
                After allowing permission, click Start Cam again. If permission
                was blocked earlier, refresh the page after changing browser
                settings.
              </p>
            </div>
          )}

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={toggleMic}
                className={`px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  micOn
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {micOn ? "Mute" : "Unmute"}
              </button>
              <button
                onClick={toggleCam}
                className={`px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  camOn
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {camOn ? "Stop Cam" : "Start Cam"}
              </button>
              <button
                onClick={shareScreen}
                className="px-4 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer bg-green-100 text-green-700"
              >
                Share Screen
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-sm">
            <p className="font-bold text-gray-800 mb-1">
              {isTutor ? booking.student : booking.tutor}
            </p>
            <p className="text-gray-500">{booking.date}</p>
            <p className="text-gray-500">{booking.time}</p>
          </div>
        </div>
      </div>

      <RealtimeChat
        compact
        role={role}
        peerId={
          isTutor
            ? booking.studentId || session?.student?._id
            : booking.tutorId || session?.tutor?._id
        }
        peerName={
          isTutor
            ? booking.student || session?.student?.name
            : booking.tutor || session?.tutor?.name
        }
        bookingId={booking.id}
        booking={booking}
        classSessionId={session?._id}
      />
    </div>
  );
};

export default VideoClassRoom;
