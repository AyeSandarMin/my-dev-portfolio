import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { gsap } from 'gsap';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float uTime;
  uniform float uHover;
  uniform vec2 uMouse;
  uniform float uTransition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    
    vec3 pos = position;
    float distance = length(uMouse - uv);
    float maxDistance = 0.5;
    float influence = 1.0 - smoothstep(0.0, maxDistance, distance);
    
    // Base hover displacement
    float hoverDisplacement = sin(pos.x * 10.0 + uTime * 1.2) * 0.01 * uHover * influence;
    hoverDisplacement += cos(pos.y * 10.0 + uTime * 0.8) * 0.01 * uHover * influence;
    
    // Transition-specific vertex displacement
    float transitionIntensity = sin(uTransition * 3.14159) * 3.0; // Peak intensity at 50% transition
    
    // Wave-based vertex distortion during transition
    float waveDisplacement = sin(pos.x * 30.0 + uTime * 6.0 + uTransition * 15.0) * 0.02 * transitionIntensity;
    waveDisplacement += cos(pos.y * 25.0 + uTime * 4.0 + uTransition * 12.0) * 0.015 * transitionIntensity;
    
    // Radial displacement from mouse position
    vec2 mouseInfluence = uMouse - uv;
    float mouseEffect = sin(length(mouseInfluence) * 40.0 - uTime * 10.0) * 0.008 * transitionIntensity * influence;
    
    // Combine all displacements
    pos.z += hoverDisplacement + waveDisplacement + mouseEffect;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform sampler2D uTexture1;
  uniform sampler2D uTexture2;
  uniform float uTime;
  uniform float uHover;
  uniform vec2 uMouse;
  uniform float uDistortion;
  uniform float uTransition;
  
  // Noise function for organic distortion
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }
  
  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    
    vec2 u = f * f * (3.0 - 2.0 * f);
    
    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  
  void main() {
    vec2 uv = vUv;
    
    float distance = length(uMouse - uv);
    float maxDistance = 0.3;
    float influence = 1.0 - smoothstep(0.0, maxDistance, distance);
    
    // Base hover distortion
    vec2 baseDistortion = vec2(
      sin(uv.x * 10.0 + uTime * 1.2) * 0.02,
      cos(uv.y * 10.0 + uTime * 0.8) * 0.02
    ) * uHover * influence * uDistortion;
    
    // Transition-specific distortion with multiple layers
    float transitionProgress = uTransition;
    float transitionIntensity = sin(transitionProgress * 3.14159) * 2.0; // Peak at 0.5 transition
    
    // Wave-based transition distortion
    vec2 waveDistortion = vec2(
      sin(uv.y * 20.0 + uTime * 5.0 + transitionProgress * 10.0) * 0.05,
      cos(uv.x * 15.0 + uTime * 4.0 + transitionProgress * 8.0) * 0.03
    ) * transitionIntensity;
    
    // Noise-based organic distortion
    float noiseScale = 8.0;
    vec2 noiseDistortion = vec2(
      noise(uv * noiseScale + uTime * 0.5) - 0.5,
      noise(uv * noiseScale + vec2(100.0) + uTime * 0.3) - 0.5
    ) * 0.04 * transitionIntensity;
    
    // Radial burst effect from mouse position
    vec2 mouseDirection = normalize(uv - uMouse);
    float mouseDistance = length(uv - uMouse);
    vec2 radialDistortion = mouseDirection * sin(mouseDistance * 30.0 - uTime * 8.0) * 0.02 * transitionIntensity * influence;
    
    // Combine all distortions
    vec2 totalDistortion = baseDistortion + waveDistortion + noiseDistortion + radialDistortion;
    
    // Apply different distortion amounts to each texture
    vec2 uv1 = uv + totalDistortion * (1.0 - transitionProgress * 0.5);
    vec2 uv2 = uv + totalDistortion * (1.0 + transitionProgress * 0.7);
    
    // Sample textures
    vec4 color1 = texture2D(uTexture1, uv1);
    vec4 color2 = texture2D(uTexture2, uv2);
    
    // Enhanced transition curve for more dramatic effect
    float transition = smoothstep(0.1, 0.9, uTransition);
    transition = transition * transition * (3.0 - 2.0 * transition); // Smooth hermite interpolation
    
    // Mix colors with position-based variation
    float positionVariation = sin(uv.x * 10.0) * sin(uv.y * 8.0) * 0.1;
    float finalTransition = clamp(transition + positionVariation * transitionIntensity, 0.0, 1.0);
    vec4 color = mix(color1, color2, finalTransition);
    
    // Enhanced chromatic aberration during transition
    float chromatic = (0.005 * uHover * influence) + (0.008 * transitionIntensity);
    
    if (finalTransition > 0.5) {
      color.r = texture2D(uTexture2, uv2 + vec2(chromatic, 0.0)).r;
      color.g = texture2D(uTexture2, uv2).g;
      color.b = texture2D(uTexture2, uv2 - vec2(chromatic, 0.0)).b;
    } else {
      color.r = texture2D(uTexture1, uv1 + vec2(chromatic, 0.0)).r;
      color.g = texture2D(uTexture1, uv1).g;
      color.b = texture2D(uTexture1, uv1 - vec2(chromatic, 0.0)).b;
    }
    
    // Add subtle glow effect during transition
    float glow = transitionIntensity * 0.1;
    color.rgb += glow;
    
    gl_FragColor = color;
  }
`;

interface DistortedPlaneProps {
  texture1: THREE.Texture;
  texture2: THREE.Texture;
  onHover: (hovered: boolean) => void;
}

const DistortedPlane: React.FC<DistortedPlaneProps> = ({ texture1, texture2, onHover }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const targetHover = useRef(0);
  const currentHover = useRef(0);
  const targetTransition = useRef(0);
  const currentTransition = useRef(0);
  
  const uniforms = useMemo(() => ({
    uTexture1: { value: texture1 },
    uTexture2: { value: texture2 },
    uTime: { value: 0 },
    uHover: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uDistortion: { value: 1.0 },
    uTransition: { value: 0 }
  }), [texture1, texture2]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      
      currentHover.current = THREE.MathUtils.lerp(
        currentHover.current,
        targetHover.current,
        0.03
      );
      materialRef.current.uniforms.uHover.value = currentHover.current;
      
      currentTransition.current = THREE.MathUtils.lerp(
        currentTransition.current,
        targetTransition.current,
        0.04
      );
      materialRef.current.uniforms.uTransition.value = currentTransition.current;
      
      materialRef.current.uniforms.uMouse.value.lerp(
        new THREE.Vector2(mouse.current.x, 1 - mouse.current.y),
        0.1
      );
    }
  });

  const handlePointerMove = (event: THREE.Event) => {
    if (event.intersections && event.intersections[0]) {
      const { uv } = event.intersections[0];
      if (uv) {
        mouse.current.x = uv.x;
        mouse.current.y = uv.y;
      }
    }
  };

  const handlePointerEnter = () => {
    targetHover.current = 1;
    targetTransition.current = 1;
    onHover(true);
  };

  const handlePointerLeave = () => {
    targetHover.current = 0;
    targetTransition.current = 0;
    onHover(false);
  };

  return (
    <mesh
      ref={meshRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <planeGeometry args={[2, 2, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

interface DistortedImageProps {
  src: string;
  hoverSrc: string;
  alt: string;
  className?: string;
}

const DistortedImage: React.FC<DistortedImageProps> = ({ src, hoverSrc, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const texture1 = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(src);
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }, [src]);

  const texture2 = useMemo(() => {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(hoverSrc);
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }, [hoverSrc]);

  const handleHover = (hovered: boolean) => {
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        scale: hovered ? 1.05 : 1,
        duration: 0.6,
        ease: "power2.out"
      });
    }
  };

  return (
    <div ref={containerRef} className={className}>
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        style={{ width: '100%', height: '100%' }}
      >
        <DistortedPlane texture1={texture1} texture2={texture2} onHover={handleHover} />
      </Canvas>
    </div>
  );
};

export default DistortedImage;