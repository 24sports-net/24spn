/**
 * script.js
 * Handles fetching channel info and auto-refreshing expired HLS links
 */

(function(global) {

  // Config: set your JSON API URL here
  const API_URL = "https://raw.githubusercontent.com/abusaeeidx/CricHd-playlists-Auto-Update-permanent/main/api.json";
  const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

  function getParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  async function fetchChannels() {
    try {
      const res = await fetch(API_URL, { cache: "no-cache" });
      if (!res.ok) throw new Error(`Failed to fetch API: ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Invalid API format: expected an array");
      return data;
    } catch (err) {
      console.error("Error fetching channels:", err);
      return [];
    }
  }

  async function getChannelById(id) {
    if (!id) return null;
    const channels = await fetchChannels();
    return channels.find(c => c.id === id) || null;
  }

  async function updatePlayer(player, channelId) {
    const channel = await getChannelById(channelId);
    if (!channel) {
      console.warn("Channel not found during refresh:", channelId);
      return;
    }

    // Only update if link changed
    if (player.source !== channel.link) {
      console.log("Updating player link for channel:", channel.name);
      player.load(channel.link);
      player.source = channel.link; // store current link
    }
  }

  global.getChannelInfo = async function() {
    const id = getParam("id");
    if (!id) return null;
    return await getChannelById(id);
  };

  global.autoRefreshPlayer = function(player) {
    const channelId = getParam("id");
    if (!channelId) return;
    setInterval(() => updatePlayer(player, channelId), REFRESH_INTERVAL);
  };

})(window);
