// URL of your GitHub API JSON
const apiURL = "https://raw.githubusercontent.com/abusaeeidx/CricHd-playlists-Auto-Update-permanent/main/api.json";

const channelList = document.getElementById("channel-list");
const videoPlayer = document.getElementById("video-player");

async function fetchChannels() {
    try {
        const response = await fetch(apiURL);
        const channels = await response.json();

        channels.forEach(channel => {
            const li = document.createElement("li");
            li.className = "channel-item";

            li.innerHTML = `
                <img src="${channel.logo}" alt="${channel.name}" class="channel-logo">
                <span>${channel.name}</span>
            `;

            li.addEventListener("click", () => {
                playChannel(channel);
            });

            channelList.appendChild(li);
        });

    } catch (error) {
        console.error("Error fetching channels:", error);
        channelList.innerHTML = "<li>Error loading channels</li>";
    }
}

function playChannel(channel) {
    if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(channel.link);
        hls.attachMedia(videoPlayer);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            videoPlayer.play();
        });
    } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
        videoPlayer.src = channel.link;
        videoPlayer.play();
    } else {
        alert("Your browser does not support HLS.");
    }

    console.log("Now playing:", channel.name);
}

// Initialize
fetchChannels();
