// script.js - put this file at https://24sports-net.github.io/24spn/script.js

(function(global){
  // Configuration
  const API_URL = "https://raw.githubusercontent.com/abusaeeidx/CricHd-playlists-Auto-Update-permanent/main/api.json";
  const DEFAULT_REFRESH_MS = 5 * 60 * 1000; // 5 minutes

  // simple fetch wrapper
  async function fetchJson(url) {
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok) throw new Error("Fetch failed: " + res.status);
    return await res.json();
  }

  // get channel object by id
  async function getChannelById(id) {
    if (!id) return null;
    try {
      const list = await fetchJson(API_URL);
      if (!Array.isArray(list)) throw new Error("API returned non-array");
      return list.find(item => String(item.id) === String(id)) || null;
    } catch (err) {
      console.error("getChannelById error:", err);
      return null;
    }
  }

  /**
   * Public: getChannelInfo
   * @param {string} channelId
   * @returns {Promise<Object|null>}
   */
  global.getChannelInfo = async function(channelId) {
    return await getChannelById(channelId);
  };

  /**
   * Auto-refresh logic:
   * Periodically refetches API_URL and updates the Clappr player if the stream link changed.
   * @param {Clappr.Player} player
   * @param {string} channelId
   * @param {number} intervalMs
   */
  global.autoRefreshPlayer = function(player, channelId, intervalMs) {
    const interval = (typeof intervalMs === "number" && intervalMs > 0) ? intervalMs : DEFAULT_REFRESH_MS;
    if (!player || !channelId) return;

    // store current source on player object (used to detect changes)
    if (!player._currentSource) player._currentSource = player.options && player.options.source ? player.options.source : null;

    async function checkAndUpdate() {
      try {
        const channel = await getChannelById(channelId);
        if (!channel) {
          console.warn("autoRefreshPlayer: channel not found:", channelId);
          return;
        }

        // if the link changed (or player has no _currentSource), reload
        if (!player._currentSource || player._currentSource !== channel.link) {
          console.log("autoRefreshPlayer: updating player source for", channelId);
          try {
            // Clappr player load method - safe way to switch source
            if (typeof player.load === "function") {
              player.load(channel.link);
            } else {
              // fallback: destroy and recreate minimal player (rare)
              console.warn("player.load not available; manual reload needed");
            }
            player._currentSource = channel.link;
          } catch (err) {
            console.error("Error reloading player:", err);
          }
        } else {
          // unchanged
          // console.log("autoRefreshPlayer: link unchanged");
        }
      } catch (err) {
        console.error("autoRefreshPlayer check error:", err);
      }
    }

    // run immediately, then set interval
    checkAndUpdate();
    const timer = setInterval(checkAndUpdate, interval);

    // return a handle so caller can clear it if needed
    return {
      stop: () => clearInterval(timer)
    };
  };

})(window);
