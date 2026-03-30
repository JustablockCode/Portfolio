const plans = [
  { text: "No plans at all ngl", status: "completed" }
];

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
            entry.target.style.transition = '0.6s ease';
        }
    });
});

function renderRoadmap() {
    const container = document.querySelector('.roadmap');
    if (!container) return;

    const activeIndex = plans.findIndex(p => p.status === 'active');
    
    const showBefore = 3;
    const showAfter = 3;

    const start = Math.max(0, activeIndex - showBefore);
    const end = Math.min(plans.length, activeIndex + showAfter + 1);
    const visiblePlans = plans.slice(start, end);

    container.innerHTML = visiblePlans.map((plan, index) => {
        const isLast = index === visiblePlans.length - 1;
        return `
            <div class="step ${plan.status} ${isLast ? 'fade-out-bottom' : ''}">
                <div class="node"></div>
                <div class="content">
                    ${plan.status === 'active' ? '<span class="status-tag">NOW</span>' : ''}
                    <p>${plan.text}</p>
                </div>
            </div>
        `;
    }).join('');
}

async function fetchDetailedStats() {
    const user = "JustablockCode";
    
    try {
        const commitRes = await fetch(`https://api.github.com/search/commits?q=author:${user}`);
        const commitData = await commitRes.json();
        
        const prRes = await fetch(`https://api.github.com/search/issues?q=author:${user}+type:pr`);
        const prData = await prRes.json();

        let ownStats = {};
        let extStats = {};
        let ownTotal = 0;
        let extTotal = 0;

        if (commitData.items) {
            commitData.items.forEach(item => {
                const fullName = item.repository.full_name; 
                const nameOnly = item.repository.name;

                if (fullName.startsWith(`${user}/`)) {
                    ownStats[nameOnly] = (ownStats[nameOnly] || 0) + 1;
                    ownTotal++;
                } else {
                    extStats[fullName] = (extStats[fullName] || 0) + 1;
                    extTotal++;
                }
            });
        }

        if (prData.items) {
            prData.items.forEach(item => {
                const parts = item.repository_url.split('/');
                const repoOwner = parts[parts.length - 2];
                const repoName = parts[parts.length - 1];
                const fullName = `${repoOwner}/${repoName}`;

                if (repoOwner === user) {
                    ownTotal++;
                    ownStats[repoName] = (ownStats[repoName] || 0) + 1;
                } else {
                    extTotal++;
                    extStats[fullName] = (extStats[fullName] || 0) + 1;
                }
            });
        }

        const grandTotal = ownTotal + extTotal;
        document.getElementById('total-contributions').innerText = grandTotal.toString().padStart(3, '0');
        document.getElementById('own-projects-contrib').innerText = ownTotal;
        document.getElementById('ext-projects-contrib').innerText = extTotal;

        if (grandTotal > 0) {
            document.getElementById('own-bar').style.width = (ownTotal / grandTotal * 100) + "%";
            document.getElementById('ext-bar').style.width = (extTotal / grandTotal * 100) + "%";
        }

        const renderList = (statsObj, elementId) => {
            const sorted = Object.entries(statsObj).sort((a, b) => b[1] - a[1]).slice(0, 5);
            document.getElementById(elementId).innerHTML = sorted.map(([path, count]) => `
                <li>
                    <span class="repo-name">${path}</span>
                    <span class="repo-count">${count} ACT.</span>
                </li>
            `).join('');
        };

        renderList(ownStats, 'own-list');
        renderList(extStats, 'ext-list');

    } catch (e) {
        console.error("Link Failure:", e);
    }
}

let clickCount = 0;
function glitchMe() {
    clickCount++;
    const avatar = document.getElementById('discord-avatar');
    
    if (clickCount === 10) {
        avatar.style.filter = "contrast(200%) brightness(50%) sepia(100%) saturate(1000%) hue-rotate(90deg)";
        avatar.style.transform = "rotate(15deg)";
        const statusEl = document.getElementById('status-text');
        alert("Stop. Im warning you.");
        if (statusEl) {
            statusEl.innerText = "SYSTEM_FAILURE: AVATAR_GLITCH";
            statusEl.style.color = "red";
        }
        console.log("HIDDEN LOG: Pi connection lost at 0x04F2...");
    }
    
    if (clickCount === 20) {
        document.body.classList.add('shake'); 
        document.getElementById('status-text').innerText = "SYSTEM_OVERLOAD: SHUTTING_DOWN";
        alert("Well this is awkward...");
        avatar.style.filter = "";
        avatar.style.transform = "";
        const statusEl = document.getElementById('status-text');
        if (statusEl) statusEl.style.color = "red";
    }
    if (clickCount === 40) {
        document.body.classList.add('shake'); 
        alert("Phew the system is rebooting...");
        avatar.style.filter = "";
        avatar.style.transform = "";
        const statusEl = document.getElementById('status-text');
        if (statusEl) {
            statusEl.innerText = "SYSTEM_RESTARTING";
            statusEl.style.color = "yellow";
        } 
        document.body.classList.remove('shake');
    }
}

document.addEventListener('DOMContentLoaded', fetchDetailedStats);            
document.addEventListener('DOMContentLoaded', renderRoadmap);
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

console.log("%c Well hello there. ", "color: red; font-size: 40px; font-weight: bold;");
