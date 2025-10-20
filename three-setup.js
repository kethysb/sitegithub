class ThreeScene {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.clock = new THREE.Clock();
        this.options = options;
        this.objects = [];
        this.uniforms = {
            time: { value: 0 },
            color: { value: new THREE.Color(0x00ff88) }
        };

        this.init();
        this.addObjects();
        this.animate();
    }

    init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.camera.position.z = 5;

        // Add post-processing
        this.composer = new THREE.EffectComposer(this.renderer);
        this.renderPass = new THREE.RenderPass(this.scene, this.camera);
        this.composer.addPass(this.renderPass);

        // Add bloom effect
        const bloomPass = new THREE.UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5, 0.4, 0.85
        );
        this.composer.addPass(bloomPass);

        window.addEventListener('resize', () => this.onWindowResize(), false);
        window.addEventListener('mousemove', (e) => this.onMouseMove(e), false);
    }

    addObjects() {
        if (this.options.type === 'hero') {
            this.addHeroObjects();
        } else if (this.options.type === 'project') {
            this.addProjectObjects();
        } else if (this.options.type === 'gallery') {
            this.addGalleryObjects();
        }
    }

    addHeroObjects() {
        const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
        const material = new THREE.ShaderMaterial({
            vertexShader: Shaders.distortion.vertex,
            fragmentShader: Shaders.distortion.fragment,
            uniforms: this.uniforms,
            wireframe: true
        });

        const mesh = new THREE.Mesh(geometry, material);
        this.objects.push(mesh);
        this.scene.add(mesh);

        // Add particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 5000;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 5;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.005,
            color: 0x00ff88
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        this.objects.push(particlesMesh);
        this.scene.add(particlesMesh);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.composer.setSize(window.innerWidth, window.innerHeight);
    }

    onMouseMove(event) {
        const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

        this.objects.forEach(obj => {
            gsap.to(obj.rotation, {
                x: mouseY * 0.5,
                y: mouseX * 0.5,
                duration: 0.5
            });
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const elapsedTime = this.clock.getElapsedTime();
        this.uniforms.time.value = elapsedTime;

        this.objects.forEach(obj => {
            obj.rotation.x += 0.001;
            obj.rotation.y += 0.001;
        });

        this.composer.render();
    }
}