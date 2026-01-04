// --- THREE.JS 3D BACKGROUND ---
let scene, camera, renderer, particles, particleSystem, icosahedron;

function initThreeJS() {
    // Scene
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000010, 0.001);

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 50;

    // Renderer
    renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('threejs-canvas'),
        alpha: true,
        antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create particle system
    const particleCount = 2000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
        // Positions
        positions[i] = (Math.random() - 0.5) * 200;
        positions[i + 1] = (Math.random() - 0.5) * 200;
        positions[i + 2] = (Math.random() - 0.5) * 200;

        // Colors
        const color = new THREE.Color();
        color.setHSL(Math.random(), 1.0, 0.7);
        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Material
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.6
    });

    // Particle system
    particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);

    // Add some 3D objects
    const geometry = new THREE.IcosahedronGeometry(10, 0);
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x00f3ff, 
        wireframe: true,
        transparent: true,
        opacity: 0.2
    });
    icosahedron = new THREE.Mesh(geometry, material);
    icosahedron.position.set(20, 10, -50);
    scene.add(icosahedron);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x00f3ff, 0.1);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xff00ff, 0.5);
    pointLight.position.set(50, 50, 50);
    scene.add(pointLight);

    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        particleSystem.rotation.x += 0.0005;
        particleSystem.rotation.y += 0.001;
        
        icosahedron.rotation.x += 0.005;
        icosahedron.rotation.y += 0.005;
        
        renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// --- MATRIX RAIN EFFECT ---
let matrixChars = "01ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$+-*/=%\"'#&_(),.;:?!\\|{}<>[]^~";

function createMatrixRain() {
    const container = document.getElementById('matrix');
    const charCount = 80; // Reduced for better performance
    
    for (let i = 0; i < charCount; i++) {
        const char = document.createElement('div');
        char.className = 'matrix-char';
        char.textContent = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        char.style.left = `${Math.random() * 100}%`;
        char.style.top = `${Math.random() * 100}%`;
        char.style.animationDelay = `${Math.random() * 5}s`;
        char.style.animationDuration = `${1 + Math.random() * 3}s`;
        container.appendChild(char);
        
        // Animate the character
        animateChar(char);
    }
}

function animateChar(char) {
    let opacity = 1;
    let top = parseFloat(char.style.top);
    
    function update() {
        opacity -= 0.01;
        top += 0.5;
        
        if (opacity <= 0 || top > 100) {
            opacity = 1;
            top = -5;
            char.textContent = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        }
        
        char.style.opacity = opacity;
        char.style.top = `${top}%`;
        
        requestAnimationFrame(update);
    }
    
    update();
}

// --- INTERACTIVE 3D CUBE ---
function initInteractiveCube() {
    const interactiveCube = document.getElementById('interactive-cube');
    
    document.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth / 2 - e.clientX) / 50;
        const y = (window.innerHeight / 2 - e.clientY) / 50;
        
        interactiveCube.style.transform = `rotateX(${-y}deg) rotateY(${x}deg)`;
    });

    interactiveCube.addEventListener('mouseleave', () => {
        interactiveCube.style.transform = 'rotateX(-10deg) rotateY(-10deg)';
    });
}

// --- DATA SPHERE INTERACTIONS ---
function initDataSpheres() {
    const dataSpheres = document.querySelectorAll('.data-sphere');
    
    dataSpheres.forEach(sphere => {
        sphere.addEventListener('mouseenter', () => {
            const info = sphere.getAttribute('data-info');
            showInfoPopup(info, sphere);
        });
        
        sphere.addEventListener('mouseleave', () => {
            hideInfoPopup();
        });
        
        // Add click effect
        sphere.addEventListener('click', () => {
            sphere.style.animation = 'none';
            setTimeout(() => {
                sphere.style.animation = 'floatSphere 15s infinite ease-in-out';
            }, 100);
        });
    });
}

function showInfoPopup(text, element) {
    let popup = document.querySelector('.info-popup');
    if (!popup) {
        popup = document.createElement('div');
        popup.className = 'info-popup';
        popup.style.cssText = `
            position: fixed;
            background: rgba(0, 0, 0, 0.9);
            color: var(--neon-cyan);
            padding: 10px 20px;
            border-radius: 10px;
            border: 2px solid var(--neon-cyan);
            z-index: 1000;
            font-family: 'Orbitron', monospace;
            box-shadow: 0 0 20px var(--neon-cyan);
            pointer-events: none;
            transition: all 0.3s;
            font-size: 0.9rem;
        `;
        document.body.appendChild(popup);
    }
    
    const rect = element.getBoundingClientRect();
    popup.textContent = `> ${text}`;
    popup.style.left = `${rect.left + rect.width / 2}px`;
    popup.style.top = `${rect.top - 50}px`;
    popup.style.transform = 'translateX(-50%)';
    popup.style.opacity = '1';
}

function hideInfoPopup() {
    const popup = document.querySelector('.info-popup');
    if (popup) {
        popup.style.opacity = '0';
    }
}

// --- SKILL ORB INTERACTIONS ---
function initSkillOrbs() {
    const skillOrbs = document.querySelectorAll('.skill-orb');
    
    skillOrbs.forEach(orb => {
        orb.addEventListener('mouseenter', () => {
            const skill = orb.getAttribute('data-skill');
            const percent = orb.getAttribute('data-percent');
            
            orb.setAttribute('data-original-html', orb.innerHTML);
            orb.innerHTML = `
                <div style="position: absolute; width: 100%; height: 100%; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                    <div style="font-size: 2rem; font-weight: bold; text-shadow: 0 0 15px currentColor;">${percent}%</div>
                    <div style="font-size: 1rem; margin-top: 10px; opacity: 0.9;">${skill}</div>
                </div>
            `;
        });
        
        orb.addEventListener('mouseleave', () => {
            const originalHTML = orb.getAttribute('data-original-html');
            if (originalHTML) {
                orb.innerHTML = originalHTML;
            }
        });
        
        // Add click effect
        orb.addEventListener('click', () => {
            orb.style.animation = 'none';
            setTimeout(() => {
                orb.style.animation = 'orbFloat 6s infinite ease-in-out';
            }, 100);
        });
    });
}

// --- PROJECT CARD ENHANCEMENT ---
function initProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transitionDuration = '0.5s';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transitionDuration = '0.8s';
        });
        
        // Add touch support for mobile
        card.addEventListener('touchstart', () => {
            card.style.transitionDuration = '0.5s';
            card.style.transform = card.style.transform.includes('180deg') 
                ? 'rotateY(0deg)' 
                : 'rotateY(180deg)';
        });
    });
}

// --- NAVIGATION INDICATORS ---
function initNavigation() {
    const sections = document.querySelectorAll('section');
    const navDots = document.querySelectorAll('.nav-dot');
    
    function updateActiveSection() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navDots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('data-section').toLowerCase() === current || 
                (current === 'hero' && dot.getAttribute('data-section') === 'Home')) {
                dot.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveSection);
    
    // Initialize active section
    updateActiveSection();
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// --- TYPING EFFECT FOR HERO TEXT ---
function initTypingEffect() {
    const heroText = document.querySelector('.hero-text .holo-card-3d p');
    const originalText = heroText.innerHTML;
    heroText.innerHTML = '';
    
    let charIndex = 0;
    function typeWriter() {
        if (charIndex < originalText.length) {
            heroText.innerHTML += originalText.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 30);
        }
    }
    
    setTimeout(typeWriter, 1000);
}

// --- TEXT SCRAMBLE EFFECT ---
function initGlitchEffect() {
    const glitchText = document.querySelector('.glitch');
    const originalText = glitchText.textContent;
    
    glitchText.addEventListener('mouseover', () => {
        let iterations = 0;
        const interval = setInterval(() => {
            glitchText.textContent = glitchText.textContent.split("")
                .map((char, index) => {
                    if (index < iterations) {
                        return originalText[index];
                    }
                    return "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/!@#$%"[Math.floor(Math.random() * 40)];
                })
                .join("");
            
            if (iterations >= originalText.length) {
                clearInterval(interval);
                setTimeout(() => {
                    glitchText.textContent = originalText;
                }, 100);
            }
            
            iterations += 1 / 2;
        }, 30);
    });
}

// --- SET CURRENT DATE ---
function setCurrentDate() {
    const date = new Date();
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
    };
    const dateString = date.toLocaleDateString('en-US', options);
    
    document.getElementById('current-date').textContent = `SYSTEM TIME: ${dateString}`;
}

// --- PERFORMANCE OPTIMIZATION ---
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// --- INITIALIZE EVERYTHING ---
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initThreeJS();
    createMatrixRain();
    initInteractiveCube();
    initDataSpheres();
    initSkillOrbs();
    initProjectCards();
    initNavigation();
    initTypingEffect();
    initGlitchEffect();
    setCurrentDate();
    
    // Console greeting
    console.log('%c> SYSTEM INITIALIZED', 'color: #00f3ff; font-size: 16px; font-weight: bold;');
    console.log('%c> 3D Holographic Interface v3.0 Active', 'color: #ff00ff;');
    console.log('%c> Neural Connection Established', 'color: #00ff9d;');
    console.log('%c> Welcome to the Digital Realm, Kishan', 'color: #ffd700;');
    
    // Performance optimization for scroll events
    const debouncedScroll = debounce(updateActiveSection, 100);
    window.addEventListener('scroll', debouncedScroll);
});

// Make scrollToSection available globally
window.scrollToSection = scrollToSection;