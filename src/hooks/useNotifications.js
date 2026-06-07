import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { getSocket } from "../utils/socket";

const useNotifications = () => {
  const [badges, setBadges] = useState({});
  const apiUrl = import.meta.env.VITE_SERVER_API;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    axios
      .get(`${apiUrl}/realtime/notifications`, { headers })
      .then(({ data }) => setBadges(data.summary || {}))
      .catch(() => {});

    const socket = getSocket();
    const handleNotification = (notification) => {
      setBadges((prev) => ({
        ...prev,
        [notification.tab]: (prev[notification.tab] || 0) + 1,
      }));
      toast(notification.title || "New notification");
    };

    socket?.on("notification:new", handleNotification);
    return () => socket?.off("notification:new", handleNotification);
  }, [apiUrl, token]);

  const markSeen = async (tab) => {
    if (!tab || !token) return;
    try {
      const { data } = await axios.put(
        `${apiUrl}/realtime/notifications/${tab}/seen`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setBadges(data.summary || {});
    } catch (err) {
      setBadges((prev) => ({ ...prev, [tab]: 0 }));
    }
  };

  return { badges, markSeen };
};

export default useNotifications;
