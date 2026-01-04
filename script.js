// ================= THREE.JS BACKGROUND =================
let scene, camera, renderer, particleSystem, icosahedron;

function initThreeJS() {
    const canvas = document.getElementById('threejs-canvas');
    if (!canvas || !window.THREE) return;

    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000010, 0.001);

    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.z = 50;

    renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Particles
    const count = 1500;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 200;
        positions[i + 1] = (Math.random() - 0.5) * 200;
        positions[i + 2] = (Math.random() - 0.5) * 200;

        const c = new THREE.Color().setHSL(Math.random(), 1, 0.7);
        colors[i] = c.r;
        colors[i + 1] = c.g;
        colors[i + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.5,
        vertexColors: true,
        transparent: true,
        opacity: 0.6
    });

    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    // Icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(10, 0);
    const icoMat = new THREE.MeshBasicMaterial({
        color: 0x00f3ff,
        wireframe: true,
        transparent: true,
        opacity: 0.25
    });

    icosahedron = new THREE.Mesh(icoGeo, icoMat);
    icosahedron.position.set(20, 10, -50);
    scene.add(icosahedron);

    function animate() {
        requestAnimationFrame(animate);
        particleSystem.rotation.y += 0.0006;
        icosahedron.rotation.x += 0.004;
        icosahedron.rotation.y += 0.004;
        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// ================= MATRIX EFFECT =================
const matrixChars =
    "01ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%";

function createMatrixRain() {
    const container = document.getElementById('matrix');
    if (!container) return;

    for (let i = 0; i < 60; i++) {
        const el = document.createElement('div');
        el.className = 'matrix-char';
        el.textContent =
            matrixChars[Math.floor(Math.random() * matrixChars.length)];
        el.style.left = Math.random() * 100 + '%';
        el.style.top = Math.random() * 100 + '%';
        container.appendChild(el);
        animateMatrixChar(el);
    }
}

function animateMatrixChar(el) {
    let y = Math.random() * 100;
    let opacity = 1;

    function fall() {
        y += 0.3;
        opacity -= 0.004;

        if (y > 100 || opacity <= 0) {
            y = -5;
            opacity = 1;
            el.textContent =
                matrixChars[Math.floor(Math.random() * matrixChars.length)];
        }

        el.style.top = y + '%';
        el.style.opacity = opacity;
        requestAnimationFrame(fall);
    }
    fall();
}

// ================= INTERACTIVE CUBE =================
function initInteractiveCube() {
    const cube = document.getElementById('interactive-cube');
    if (!cube) return;

    document.addEventListener('mousemove', e => {
        const x = (window.innerWidth / 2 - e.clientX) / 40;
        const y = (window.innerHeight / 2 - e.clientY) / 40;
        cube.style.transform = `rotateX(${-y}deg) rotateY(${x}deg)`;
    });
}

// ================= NAVIGATION =================
function updateActiveSection() {
    const sections = document.querySelectorAll('section');
    const dots = document.querySelectorAll('.nav-dot');
    let current = '';

    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 200) {
            current = sec.id;
        }
    });

    dots.forEach(dot => {
        dot.classList.remove('active');
        if (
            dot.dataset.section.toLowerCase() === current ||
            (current === 'hero' && dot.dataset.section === 'Home')
        ) {
            dot.classList.add('active');
        }
    });
}

function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}
window.scrollToSection = scrollToSection;

// ================= TEXT EFFECTS =================
function initTypingEffect() {
    const el = document.querySelector('.hero-text .holo-card-3d p');
    if (!el) return;

    const text = el.innerHTML;
    el.innerHTML = '';
    let i = 0;

    function type() {
        if (i < text.length) {
            el.innerHTML += text.charAt(i++);
            setTimeout(type, 25);
        }
    }
    setTimeout(type, 800);
}

function initGlitchEffect() {
    const el = document.querySelector('.glitch');
    if (!el) return;

    const original = el.textContent;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    el.addEventListener('mouseenter', () => {
        let i = 0;
        const interval = setInterval(() => {
            el.textContent = original
                .split('')
                .map((c, idx) => (idx < i ? original[idx] : chars[Math.floor(Math.random() * chars.length)]))
                .join('');

            if (i >= original.length) {
                clearInterval(interval);
                el.textContent = original;
            }
            i += 0.5;
        }, 30);
    });
}

// ================= DATE =================
function setCurrentDate() {
    const el = document.getElementById('current-date');
    if (!el) return;
    el.textContent = `SYSTEM TIME: ${new Date().toLocaleString()}`;
}

// ================= INIT =================
document.addEventListener('DOMContentLoaded', () => {
    initThreeJS();
    createMatrixRain();
    initInteractiveCube();
    initTypingEffect();
    initGlitchEffect();
    setCurrentDate();

    window.addEventListener('scroll', updateActiveSection);

    console.log('%cSYSTEM ONLINE', 'color:#00f3ff;font-size:14px;');
});
