const DISCORD_ID = "994265989120278619"; 

async function fetchStatus() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const { data } = await response.json();

        const dot = document.getElementById('status-dot');
        const statusText = document.getElementById('status-text');

        dot.className = 'status-indicator'; 
        dot.classList.add(`status-${data.discord_status}`);

        const statusMap = {
            'online': 'Online',
            'idle': 'Away',
            'dnd': 'Do Not Disturb',
            'offline': 'Offline'
        };

        statusText.innerText = statusMap[data.discord_status] || 'Offline';

        const container = document.getElementById('lanyard-activity');
        container.innerHTML = ''; 

        const vsc = data.activities.find(a => a.name === "Visual Studio Code");
        const roblox = data.activities.find(a => a.name === "Roblox");
        const spotify = data.listening_to_spotify;

        const otherGames = data.activities.filter(a => 
            a.name !== "Visual Studio Code" && 
            a.name !== "Roblox" && 
            a.id !== "custom" && 
            a.type !== 2 
        );

        if (!vsc && !spotify && !roblox && otherGames.length === 0) {
            container.style.display = 'none';
            return;
        }

        container.style.display = 'flex';

        if (roblox) {
            let robloxImg = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Roblox_%282025%29_%28App_Icon%29.svg/2048px-Roblox_%282025%29_%28App_Icon%29.svg.png";
            if (roblox.assets && roblox.assets.large_image) {
                if (roblox.assets.large_image.includes("external")) {
                    robloxImg = `https://${roblox.assets.large_image.split("https/")[1]}`;
                } else {
                    robloxImg = `https://cdn.discordapp.com/app-assets/${roblox.application_id}/${roblox.assets.large_image}.png`;
                }
            }

            container.innerHTML += `
                <div class="activity-item">
                    <img src="${robloxImg}" class="activity-icon" onerror="this.src='./images/icons/roblox.png'">
                    <div class="activity-text">
                        <h4>${roblox.name}</h4> <p>${roblox.details || roblox.state || 'Main Menu'}</p>
                        ${roblox.timestamps ? `<small>Elapsed: ${Math.round((Date.now() - roblox.timestamps.start) / 1000 / 60)}m</small>` : ''}
                    </div>
                </div>
            `;
        }

        if (vsc) {
            const timeStarted = vsc.timestamps?.start ? Math.round((Date.now() - vsc.timestamps.start) / 1000 / 60) : 0;
            container.innerHTML += `
                <div class="activity-item">
                    <img src="./images/icons/vsc.png" class="activity-icon">
                    <div class="activity-text">
                        <h4>${vsc.details || 'Code'}</h4>
                        <p>${vsc.state || 'In Workspace'}</p>
                        <small>Elapsed: ${timeStarted}m</small>
                    </div>
                </div>
            `;
        }

        if (spotify) {
            container.innerHTML += `
                <div class="activity-item">
                    <img src="${data.spotify.album_art_url}" class="activity-icon spotify-art">
                    <div class="activity-text">
                        <h4>Listening to Spotify</h4>
                        <p>${data.spotify.song}</p>
                        <small>by ${data.spotify.artist}</small>
                    </div>
                </div>
            `;
        }

        if (otherGames.length > 0) {
            otherGames.forEach(game => {
                let gameIcon = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/960px-Steam_icon_logo.svg.png?20220611141426"; 

                if (game.assets && game.assets.large_image) {
                    if (game.assets.large_image.startsWith("mp:external")) {
                        gameIcon = `https://${game.assets.large_image.split("https/")[1]}`;
                    } else {
                        gameIcon = `https://cdn.discordapp.com/app-assets/${game.application_id}/${game.assets.large_image}.png`;
                    }
                }

                let elapsedHtml = '';
                if (game.timestamps && game.timestamps.start) {
                    const elapsed = Math.round((Date.now() - game.timestamps.start) / 1000 / 60);
                    elapsedHtml = `<small>Elapsed: ${elapsed}m</small>`;
                }

                container.innerHTML += `
                    <div class="activity-item">
                        <img src="${gameIcon}" class="activity-icon" onerror="this.src='./images/icons/default_game.png'">
                        <div class="activity-text">
                            <h4>${game.name}</h4>
                            <p>${game.details || game.state || 'Playing'}</p>
                            ${elapsedHtml}
                        </div>
                    </div>
                `;
            });
        }

    } catch (error) {
        console.error("Lanyard Error:", error);
    }
}

fetchStatus();
setInterval(fetchStatus, 15000);