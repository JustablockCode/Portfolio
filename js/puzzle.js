const Puzzle = {
    state: JSON.parse(localStorage.getItem('puzzle_state')) || {
        active: false,
        history: [],
        step: 1
    },

    save() {
        localStorage.setItem('puzzle_state', JSON.stringify(this.state));
    },

    print(text, type = "default") {
        const body = document.getElementById('terminal-body');
        if (!body) return;
        const line = document.createElement('div');
        
        const colors = {
            error: "#f85149",
            success: "#3fb950",
            hint: "#d29922",
            story: "#8b949e",
            default: "#e6edf3"
        };
        
        line.style.color = colors[type] || colors.default;
        if (type === "story") line.style.fontStyle = "italic";
        
        line.textContent = text;
        body.appendChild(line);
        body.scrollTop = body.scrollHeight;
        
        this.state.history.push({text, type});
        this.save();
    },

    reset() {
        this.state = { active: false, history: [], step: 1 };
        this.save();
        const term = document.getElementById('terminal-container');
        if(term) term.style.display = 'none';
        location.reload();
    }
};

function handleCommand(cmd) {
    const input = cmd.toLowerCase().trim();
    
    if (input === 'clear') {
        Puzzle.print("Resetting connection... session terminated.");
        setTimeout(() => Puzzle.reset(), 1000);
        return;
    }

    if (input === 'help') {
        Puzzle.print("Available directives: status, clear, query [parameter]");
        return;
    }

    if (input === 'status') {
        switch(Puzzle.state.step) {
            case 1:
                Puzzle.print("NODE_04: DORMANT", "error");
                Puzzle.print("Diagnostic: 'Ledger 01' variable RENT is undefined.", "story");
                Puzzle.print("Hint: Whats the basic price?", "hint");
                break;
            case 2:
                Puzzle.print("NODE_04: SEMI-STABLE", "hint");
                Puzzle.print("Diagnostic: Thermal spike detected in 'Current Plans'.", "story");
                Puzzle.print("Hint: Locate the overheating hardware value.", "hint");
                break;
            case 3:
                Puzzle.print("NODE_04: AWAKE", "success");
                Puzzle.print("Diagnostic: Archive locked. Key is held by the 'Top External Node'.", "story");
                Puzzle.print("Hint: Type the name of Justablock's most active external GitHub repo.", "hint");
                break;
        }
        return;
    }

    if (Puzzle.state.step === 1) {
        if (input === '2' || input === '2$') {
            Puzzle.print("Ledger 01 synced. Entry 'Basic Hosting' validated.", "success");
            Puzzle.print("Waking hardware... [ERR] Sensor_Pi not responding with celsius values.", "error");
            Puzzle.state.step = 2;
            Puzzle.save();
            return;
        }
    }

    if (Puzzle.state.step === 2) {
        if (input === '58') {
            Puzzle.print("Cooling sequence initiated... Temperature nominal.", "success");
            Puzzle.print("Accessing Justablock Archive... [LOCKED]", "error");
            Puzzle.print("External authentication required. Query the name of the most active External Node.", "story");
            Puzzle.state.step = 3;
            Puzzle.save();
            return;
        }
    }

    if (Puzzle.state.step === 3) {
        const firstExtRepo = document.querySelector('#ext-list .repo-name');
        if (firstExtRepo && input === firstExtRepo.textContent.toLowerCase().trim()) {
            Puzzle.print("External sync complete. Justablock Identity Verified.", "success");
            Puzzle.state.step = 4;
            Puzzle.save();
            triggerFinalEffect();
            return;
        }
    }

    Puzzle.print(`Command '${input}' not recognized or unauthorized.`, "error");
}

function triggerFinalEffect() {
    Puzzle.print("Finalizing Boot Sequence... 100%", "success");
    Puzzle.print("System Optimized. Welcome back, Admin.");
    
    document.body.style.transition = "all 2s ease";
    document.body.style.filter = "contrast(1.2) sepia(0.2)";
    
    const statusText = document.getElementById('status-text');
    if (statusText) {
        statusText.innerText = "ONLINE (SECURED)";
        statusText.style.color = "#3fb950";
    }

    setTimeout(() => {
        document.body.style.filter = "none";
        Puzzle.print("Challenge Complete. Terminal self-destructing in 10s...");
        setTimeout(() => Puzzle.reset(), 10000);
    }, 5000);
}

document.addEventListener('DOMContentLoaded', () => {
    const term = document.getElementById('terminal-container');
    const input = document.getElementById('terminal-input');
    const trigger = document.getElementById('start-trigger');

    if (Puzzle.state.active && term) {
        term.style.display = 'flex';
        const body = document.getElementById('terminal-body');
        body.innerHTML = '';
        Puzzle.state.history.forEach(h => {
            const d = document.createElement('div');
            d.textContent = h.text;
            const colors = { error: "#f85149", success: "#3fb950", hint: "#d29922", story: "#8b949e" };
            d.style.color = colors[h.type] || "#e6edf3";
            body.appendChild(d);
        });
    }

    input?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const val = input.value;
            input.value = "";
            Puzzle.print(`$ ${val}`);
            handleCommand(val);
        }
    });

    if (trigger) {
        trigger.onclick = () => {
            if (!Puzzle.state.active) {
                Puzzle.state.active = true;
                if(term) term.style.display = 'flex';
                Puzzle.print("--- REMOTE ACCESS ESTABLISHED ---", "success");
                Puzzle.print("Justablock Node-04 [Version 1.0.4]");
                Puzzle.print("System is in emergency sleep mode. Type 'status' to begin recovery.", "story");
                Puzzle.save();
            }
        };
    }
});