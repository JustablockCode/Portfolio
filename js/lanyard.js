const DISCORD_ID = "994265989120278619";

const STATUS_LABELS = {
    online: 'Online',
    idle:   'Away',
    dnd:    'Do Not Disturb',
    offline: 'Offline'
};

function resolveAssetUrl(activity, fallback) {
    const img = activity.assets?.large_image;
    if (!img) return fallback;
    if (img.startsWith('mp:external') || img.includes('external')) {
        return `https://${img.split('https/')[1]}`;
    }
    return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${img}.png`;
}

function elapsedMin(start) {
    return Math.round((Date.now() - start) / 60000);
}

function activityItem(iconSrc, iconClass, title, detail, sub) {
    return `
        <div class="activity-item">
            <img src="${iconSrc}" class="activity-icon${iconClass ? ` ${iconClass}` : ''}" loading="lazy"
                 onerror="this.style.display='none'">
            <div class="activity-text">
                <h4>${title}</h4>
                <p>${detail}</p>
                ${sub ? `<small>${sub}</small>` : ''}
            </div>
        </div>`;
}

async function fetchStatus() {
    try {
        const res  = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const { data } = await res.json();

        const dot      = document.getElementById('status-dot');
        const statusEl = document.getElementById('status-text');
        dot.className  = `status-indicator status-${data.discord_status}`;
        statusEl.innerText = STATUS_LABELS[data.discord_status] ?? 'Offline';

        const container = document.getElementById('lanyard-activity');
        container.innerHTML = '';

        const vsc      = data.activities.find(a => a.name === 'Visual Studio Code');
        const spotify  = data.listening_to_spotify;
        const games    = data.activities.filter(a =>
            a.name !== 'Visual Studio Code' &&
            a.id   !== 'custom' &&
            a.type !== 2
        );

        if (!vsc && !spotify && games.length === 0) {
            container.style.display = 'none';
            return;
        }

        container.style.display = 'flex';

        if (vsc) {
            const elapsed = vsc.timestamps ? `Elapsed: ${elapsedMin(vsc.timestamps.start)}m` : '';
            container.innerHTML += activityItem('./images/icons/vsc.png', '', vsc.details || 'Code', vsc.state || 'In Workspace', elapsed);
        }

        if (spotify) {
            container.innerHTML += activityItem(
                data.spotify.album_art_url, 'spotify-art',
                'Listening to Spotify', data.spotify.song,
                `by ${data.spotify.artist}`
            );
        }

        for (const game of games) {
            const icon = resolveAssetUrl(
                game,
                'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/960px-Steam_icon_logo.svg.png'
            );
            const elapsed = game.timestamps ? `Elapsed: ${elapsedMin(game.timestamps.start)}m` : '';
            container.innerHTML += activityItem(icon, '', game.name, game.details || game.state || 'Playing', elapsed);
        }

    } catch (err) {
        console.error('Lanyard error:', err);
    }
}

fetchStatus();
setInterval(fetchStatus, 15000);