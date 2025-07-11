import { animate, createTimer, utils, svg, createTimeline, stagger, eases, createAnimatable } from './lib/anime.esm.js';

// === SVG LINE DRAWING ANIMATION ===
function createSVGBackground() {
    const svgContainer = document.createElement('div');
    svgContainer.style.position = 'fixed';
    svgContainer.style.top = '0';
    svgContainer.style.left = '0';
    svgContainer.style.width = '100%';
    svgContainer.style.height = '100%';
    svgContainer.style.pointerEvents = 'none';
    svgContainer.style.zIndex = '-2';
    svgContainer.style.opacity = '0.1';
    
    const svgContent = `
        <svg width="100%" height="100%" viewBox="0 0 1200 800">
            <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.3" />
                    <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0.1" />
                </linearGradient>
            </defs>
            <g id="animated-lines">
                <line class="svg-line" x1="100" y1="100" x2="300" y2="200" stroke="url(#lineGrad)" stroke-width="2"/>
                <line class="svg-line" x1="800" y1="150" x2="1000" y2="250" stroke="url(#lineGrad)" stroke-width="2"/>
                <line class="svg-line" x1="200" y1="600" x2="400" y2="500" stroke="url(#lineGrad)" stroke-width="2"/>
                <line class="svg-line" x1="900" y1="600" x2="1100" y2="700" stroke="url(#lineGrad)" stroke-width="2"/>
                <circle class="svg-circle" cx="600" cy="400" r="50" fill="none" stroke="url(#lineGrad)" stroke-width="1"/>
                <circle class="svg-circle" cx="200" cy="200" r="30" fill="none" stroke="url(#lineGrad)" stroke-width="1"/>
                <circle class="svg-circle" cx="1000" cy="500" r="40" fill="none" stroke="url(#lineGrad)" stroke-width="1"/>
            </g>
        </svg>
    `;
    
    svgContainer.innerHTML = svgContent;
    document.body.appendChild(svgContainer);
    
    // Animate SVG elements
    createTimeline({
        loop: true,
        defaults: {
            ease: 'inOut(2)',
            duration: 8000,
        }
    })
    .add(svg.createDrawable('.svg-line'), {
        draw: ['0 0', '0 1', '1 1'],
    }, stagger(1000))
    .add(svg.createDrawable('.svg-circle'), {
        draw: ['0 0', '0 1', '1 1'],
    }, stagger(800))
    .init();
}

// === GRID STAGGERING ANIMATION ===
function createGridBackground() {
    const gridContainer = document.createElement('div');
    gridContainer.className = 'grid-container';
    gridContainer.style.position = 'fixed';
    gridContainer.style.top = '0';
    gridContainer.style.left = '0';
    gridContainer.style.width = '100%';
    gridContainer.style.height = '100%';
    gridContainer.style.pointerEvents = 'none';
    gridContainer.style.zIndex = '-3';
    gridContainer.style.display = 'grid';
    gridContainer.style.gridTemplateColumns = 'repeat(20, 1fr)';
    gridContainer.style.gridTemplateRows = 'repeat(15, 1fr)';
    gridContainer.style.gap = '2px';
    gridContainer.style.opacity = '0.05';
    
    const gridItems = [];
    for (let i = 0; i < 300; i++) {
        const gridItem = document.createElement('div');
        gridItem.style.background = 'white';
        gridItem.style.borderRadius = '2px';
        gridItem.style.transform = 'scale(0)';
        gridContainer.appendChild(gridItem);
        gridItems.push(gridItem);
    }
    
    document.body.appendChild(gridContainer);
    
    // Animate grid items
    function animateGrid() {
        const randomIndex = utils.random(0, gridItems.length - 1);
        
        animate(gridItems, {
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            duration: 2000,
            delay: stagger(50, { from: randomIndex, grid: [20, 15] }),
            ease: 'inOut(2)',
            onComplete: () => setTimeout(animateGrid, 3000)
        });
    }
    
    setTimeout(animateGrid, 2000);
}

// === CURSOR FOLLOWING PARTICLES ===
const particlesContainer = document.querySelector('.particles-container');
const particles = [];
const maxParticles = 80;

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

// Create particles
function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = utils.random(0, window.innerWidth) + 'px';
    particle.style.top = utils.random(0, window.innerHeight) + 'px';
    particle.style.opacity = utils.random(0.2, 0.6);
    particle.style.transform = 'scale(0)';
    particlesContainer.appendChild(particle);
    return particle;
}

// Enhanced cursor following
function createCursorFollowingParticles() {
    const followingParticles = [];
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'following-particle';
        particle.style.position = 'fixed';
        particle.style.width = '3px';
        particle.style.height = '3px';
        particle.style.background = 'rgba(255, 255, 255, 0.4)';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '10';
        particle.style.boxShadow = '0 0 6px rgba(255, 255, 255, 0.3)';
        document.body.appendChild(particle);
        followingParticles.push(particle);
    }
    
    // Mouse tracking
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        followingParticles.forEach((particle, index) => {
            const delay = index * 50;
            const distance = index * 15;
            const angle = (index * Math.PI) / 10;
            
            setTimeout(() => {
                particle.style.left = (mouseX + Math.cos(angle) * distance) + 'px';
                particle.style.top = (mouseY + Math.sin(angle) * distance) + 'px';
            }, delay);
        });
    });
}

// Animate particles with cursor influence
function animateParticle(particle) {
    const duration = utils.random(4000, 8000);
    const targetX = utils.random(0, window.innerWidth);
    const targetY = utils.random(0, window.innerHeight);
    
    // Calculate influence of mouse position
    const distanceFromMouse = Math.sqrt(
        Math.pow(mouseX - parseInt(particle.style.left), 2) + 
        Math.pow(mouseY - parseInt(particle.style.top), 2)
    );
    
    const influence = Math.max(0, 200 - distanceFromMouse) / 200;
    const mouseInfluenceX = (mouseX - parseInt(particle.style.left)) * influence * 0.1;
    const mouseInfluenceY = (mouseY - parseInt(particle.style.top)) * influence * 0.1;
    
    animate(particle, {
        x: targetX + mouseInfluenceX,
        y: targetY + mouseInfluenceY,
        opacity: [utils.random(0.2, 0.6), utils.random(0.1, 0.3)],
        scale: [0, utils.random(0.8, 1.5), 0],
        duration: duration,
        ease: 'inOut(2)',
        onComplete: () => animateParticle(particle)
    });
}

// Create and animate all particles
for (let i = 0; i < maxParticles; i++) {
    const particle = createParticle();
    particles.push(particle);
    setTimeout(() => animateParticle(particle), i * 100);
}

// === ENHANCED TYPEWRITER EFFECT ===
const heroInput = document.querySelector('.hero-input');
const placeholderTexts = [
    "Ask agentimate to create anything...",
    "Design a landing page...",
    "Create a mobile app...",
    "Design a logo...",
    "Build a dashboard...",
    "Create a poster...",
    "Design a website..."
];

let currentTextIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;

function enhancedTypeWriter() {
    const currentText = placeholderTexts[currentTextIndex];
    
    if (isDeleting) {
        heroInput.placeholder = currentText.substring(0, currentCharIndex - 1);
        currentCharIndex--;
        
        if (currentCharIndex === 0) {
            isDeleting = false;
            currentTextIndex = (currentTextIndex + 1) % placeholderTexts.length;
        }
    } else {
        heroInput.placeholder = currentText.substring(0, currentCharIndex + 1);
        currentCharIndex++;
        
        if (currentCharIndex === currentText.length) {
            setTimeout(() => {
                isDeleting = true;
            }, 2000);
        }
    }
    
    // More realistic typing speed with variations
    const baseSpeed = isDeleting ? 40 : 80;
    const speedVariation = utils.random(0.5, 1.5);
    const speed = baseSpeed * speedVariation;
    
    setTimeout(enhancedTypeWriter, speed);
}

// === ENHANCED FLOATING SHAPES ===
const shapes = document.querySelectorAll('.shape');
shapes.forEach((shape, index) => {
    // Create complex layered animations
    const animationDuration = utils.random(8000, 15000);
    
    createTimeline({
        loop: true,
        defaults: {
            ease: 'inOut(2)',
        }
    })
    .add(shape, {
        translateX: [0, utils.random(-100, 100), utils.random(-50, 50), 0],
        translateY: [0, utils.random(-80, 80), utils.random(-40, 40), 0],
        rotate: [0, utils.random(-180, 180), utils.random(-90, 90), 0],
        scale: [1, utils.random(0.8, 1.4), utils.random(0.9, 1.2), 1],
        opacity: [0.1, 0.3, 0.2, 0.1],
        duration: animationDuration,
        delay: index * 2000
    })
    .init();
    
    // Mouse interaction
    document.addEventListener('mousemove', (e) => {
        const shapeRect = shape.getBoundingClientRect();
        const shapeCenterX = shapeRect.left + shapeRect.width / 2;
        const shapeCenterY = shapeRect.top + shapeRect.height / 2;
        
        const distance = Math.sqrt(
            Math.pow(e.clientX - shapeCenterX, 2) + Math.pow(e.clientY - shapeCenterY, 2)
        );
        
        if (distance < 150) {
            const intensity = (150 - distance) / 150;
            const moveX = (e.clientX - shapeCenterX) * intensity * 0.2;
            const moveY = (e.clientY - shapeCenterY) * intensity * 0.2;
            
            animate(shape, {
                x: moveX,
                y: moveY,
                scale: 1 + intensity * 0.3,
                opacity: 0.1 + intensity * 0.4,
                duration: 800,
                ease: 'out(3)'
            });
        }
    });
});

// === HERO ANIMATIONS ===
animate('.hero-title', {
    opacity: [0, 1],
    y: [50, 0],
    scale: [0.9, 1],
    duration: 1200,
    ease: 'out(3)',
    delay: 300
});

animate('.hero-subtitle', {
    opacity: [0, 1],
    y: [30, 0],
    duration: 1000,
    ease: 'out(3)',
    delay: 600
});

animate('.input-container', {
    opacity: [0, 1],
    y: [10, 0],
    scale: [0.95, 1],
    duration: 600,
    ease: 'out(3)',
    delay: 900
});

// === COMMUNITY CARDS ANIMATION ===
animate('.community-card', {
    opacity: [0, 1],
    y: [40, 0],
    scale: [0.9, 1],
    duration: 800,
    ease: 'out(3)',
    delay: function(el, i) { return i * 100; }
});

// === INTERACTIVE BUTTON ANIMATIONS ===
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        animate(btn, {
            scale: 1.05,
            y: -2,
            duration: 300,
            ease: 'out(2)'
        });
    });
    
    btn.addEventListener('mouseleave', () => {
        animate(btn, {
            scale: 1,
            y: 0,
            duration: 300,
            ease: 'out(2)'
        });
    });
});

// === INPUT FIELD ANIMATIONS ===
const inputBtn = document.querySelector('.input-btn');

heroInput.addEventListener('focus', () => {
    animate(heroInput, {
        scale: 1.02,
        duration: 300,
        ease: 'out(2)'
    });
    
    animate(inputBtn, {
        scale: 1.1,
        rotate: 5,
        duration: 300,
        ease: 'out(2)'
    });
});

heroInput.addEventListener('blur', () => {
    animate(heroInput, {
        scale: 1,
        duration: 300,
        ease: 'out(2)'
    });
    
    animate(inputBtn, {
        scale: 1,
        rotate: 0,
        duration: 300,
        ease: 'out(2)'
    });
});

// === LOGO ANIMATION ===
const logoIcon = document.querySelector('.logo-icon');
animate(logoIcon, {
    rotate: [0, 360],
    duration: 20000,
    ease: 'linear',
    loop: true
});

// === SCROLL-TRIGGERED ANIMATIONS ===
let ticking = false;

function updateOnScroll() {
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    
    // Parallax effect for particles
    particles.forEach((particle, index) => {
        const speed = (index % 3 + 1) * 0.3;
        const currentTop = parseInt(particle.style.top);
        particle.style.transform = `translateY(${scrollTop * speed}px)`;
    });
    
    // Animate community cards on scroll
    const communityCards = document.querySelectorAll('.community-card');
    communityCards.forEach((card, index) => {
        const cardTop = card.getBoundingClientRect().top;
        if (cardTop < windowHeight - 100) {
            animate(card, {
                y: [20, 0],
                opacity: [0.8, 1],
                scale: [0.98, 1],
                duration: 600,
                ease: 'out(2)',
                delay: index * 50
            });
        }
    });
    
    ticking = false;
}

function onScroll() {
    if (!ticking) {
        requestAnimationFrame(updateOnScroll);
        ticking = true;
    }
}

window.addEventListener('scroll', onScroll);

// === SPARKLE EFFECT ON BUTTON CLICK ===
inputBtn.addEventListener('click', () => {
    // Create sparkle effect
    for (let i = 0; i < 15; i++) {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'absolute';
        sparkle.style.width = '4px';
        sparkle.style.height = '4px';
        sparkle.style.background = 'white';
        sparkle.style.borderRadius = '50%';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.left = '50%';
        sparkle.style.top = '50%';
        sparkle.style.zIndex = '1000';
        inputBtn.appendChild(sparkle);
        
        animate(sparkle, {
            x: utils.random(-60, 60),
            y: utils.random(-60, 60),
            scale: [0, 1, 0],
            opacity: [1, 0],
            rotate: utils.random(0, 360),
            duration: 1000,
            ease: 'out(2)',
            onComplete: () => sparkle.remove()
        });
    }
    
    // Enhanced button press effect
    animate(inputBtn, {
        scale: [1, 0.9, 1.1, 1],
        rotate: [0, -5, 5, 0],
        duration: 400,
        ease: 'out(2)'
    });
});

// === WINDOW RESIZE HANDLER ===
window.addEventListener('resize', () => {
    particles.forEach(particle => {
        if (parseInt(particle.style.left) > window.innerWidth) {
            particle.style.left = utils.random(0, window.innerWidth) + 'px';
        }
        if (parseInt(particle.style.top) > window.innerHeight) {
            particle.style.top = utils.random(0, window.innerHeight) + 'px';
        }
    });
});

// === INITIALIZE ALL ANIMATIONS ===
setTimeout(() => {
    createSVGBackground();
    createGridBackground();
    createCursorFollowingParticles();
    enhancedTypeWriter();
}, 1000); 