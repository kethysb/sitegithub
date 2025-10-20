const Shaders = {
    // Shader for distortion effect
    distortion: {
        vertex: `
            varying vec2 vUv;
            varying vec3 vPosition;
            uniform float time;
            
            void main() {
                vUv = uv;
                vPosition = position;
                vec3 pos = position;
                float displacement = sin(position.x * 5.0 + time) * 0.1;
                pos.z += displacement;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragment: `
            varying vec2 vUv;
            varying vec3 vPosition;
            uniform float time;
            uniform vec3 color;
            
            void main() {
                vec2 p = vUv * 2.0 - 1.0;
                float r = length(p);
                float angle = atan(p.y, p.x);
                
                float intensity = 0.5 + 0.5 * sin(r * 10.0 - time);
                vec3 finalColor = color * intensity;
                
                gl_FragColor = vec4(finalColor, 1.0);
            }
        `
    },

    // Shader for wave effect
    wave: {
        vertex: `
            varying vec2 vUv;
            uniform float time;
            
            void main() {
                vUv = uv;
                vec3 pos = position;
                float wave = sin(pos.x * 5.0 + time) * cos(pos.y * 5.0 + time) * 0.1;
                pos.z += wave;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
            }
        `,
        fragment: `
            varying vec2 vUv;
            uniform float time;
            uniform vec3 color;
            
            void main() {
                float pattern = sin(vUv.x * 10.0 + time) * sin(vUv.y * 10.0 + time);
                vec3 finalColor = color * (0.5 + 0.5 * pattern);
                gl_FragColor = vec4(finalColor, 1.0);
            }
        `
    },

    // Shader for noise effect
    noise: {
        vertex: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragment: `
            varying vec2 vUv;
            uniform float time;
            
            float random(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
            }
            
            void main() {
                vec2 st = vUv;
                float noise = random(st + time * 0.1);
                vec3 color = vec3(noise);
                gl_FragColor = vec4(color, 1.0);
            }
        `
    }
};
