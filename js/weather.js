document.addEventListener("DOMContentLoaded", () => {
    const maxRaindrops = 120; 
    const raindrops = [];
    let mouseX = -1000;
    let mouseY = -1000;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    class Raindrop {
        constructor(isInitial) {
            this.el = document.createElement("div");
            this.el.style.position = "fixed";
            this.el.style.top = "0px";
            this.el.style.left = "0px";
            
            // SOFT MINT WHITE: High visibility but blends with dark green
            this.el.style.background = "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(200,255,230,0.6) 100%)";
            
            this.el.style.pointerEvents = "none";
            this.el.style.zIndex = "9999";
            
            document.body.appendChild(this.el);
            this.reset(isInitial);
        }

        reset(isInitial = false) {
            // SLEEK: 2px is the "sweet spot" for rain
            this.width = 2; 
            this.height = Math.random() * 20 + 20; 
            
            this.x = Math.random() * window.innerWidth;
            this.y = isInitial ? Math.random() * window.innerHeight : -100;
            
            this.vy = Math.random() * 10 + 15; 
            
            this.el.style.width = `${this.width}px`;
            this.el.style.height = `${this.height}px`;
            this.el.style.borderRadius = "1px"; 
        }

        update() {
            // Subtler mouse interaction so it doesn't look chaotic
            const dx = this.x - mouseX;
            const dy = this.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 80) {
                this.x += (dx / distance) * 5;
            }

            this.y += this.vy;

            if (this.y > window.innerHeight + 50) {
                this.reset(false);
            }

            this.el.style.transform = `translate(${this.x}px, ${this.y}px)`;
        }
    }

    for (let i = 0; i < maxRaindrops; i++) {
        raindrops.push(new Raindrop(true));
    }

    function animate() {
        for (let i = 0; i < raindrops.length; i++) {
            raindrops[i].update();
        }
        requestAnimationFrame(animate);
    }

    animate();
});