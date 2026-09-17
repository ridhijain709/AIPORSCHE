import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { VehicleConfig, CameraPreset } from '../types';
import { 
  createShowroomPavilion, 
  createTaycanShowroomCar, 
  createGT3RSShowroomCar, 
  createOwnerAvatar, 
  createCustomerAvatar 
} from '../utils/showroomArchitect';

interface ShowroomCanvasProps {
  config: VehicleConfig;
  cameraPreset: CameraPreset;
  onCameraChange?: (preset: CameraPreset) => void;
  isAutoRotating?: boolean;
  showAvatars?: boolean;
  onSelectCar?: (carId: string) => void;
  onSelectAvatar?: (avatarType: 'owner' | 'customer') => void;
}

// Preset camera positions & targets
const CAMERA_PRESETS: Record<CameraPreset, { pos: THREE.Vector3; target: THREE.Vector3 }> = {
  hero: {
    pos: new THREE.Vector3(4.2, 2.0, 4.8),
    target: new THREE.Vector3(0, 0.6, 0),
  },
  front: {
    pos: new THREE.Vector3(0.0, 1.4, 5.8),
    target: new THREE.Vector3(0, 0.65, 0),
  },
  side: {
    pos: new THREE.Vector3(5.8, 1.3, 0.0),
    target: new THREE.Vector3(0, 0.65, 0),
  },
  rear: {
    pos: new THREE.Vector3(-0.2, 1.6, -5.6),
    target: new THREE.Vector3(0, 0.65, 0),
  },
  top: {
    pos: new THREE.Vector3(0.1, 7.5, 0.2),
    target: new THREE.Vector3(0, 0.5, 0),
  },
  engine: {
    pos: new THREE.Vector3(-1.6, 2.2, -2.4),
    target: new THREE.Vector3(0, 0.7, -1.2),
  },
  wheel_detail: {
    pos: new THREE.Vector3(2.6, 0.9, 2.2),
    target: new THREE.Vector3(1.1, 0.45, 1.5),
  },
  interior: {
    pos: new THREE.Vector3(0.8, 1.3, 0.4),
    target: new THREE.Vector3(-0.3, 0.8, 0.2),
  },
  showroom_overview: {
    pos: new THREE.Vector3(0.0, 5.5, 12.6),
    target: new THREE.Vector3(0, 0.6, -0.5),
  },
  taycan_bay: {
    pos: new THREE.Vector3(-4.8, 2.2, 2.0),
    target: new THREE.Vector3(-7.2, 0.7, -2.5),
  },
  gt4_bay: {
    pos: new THREE.Vector3(4.8, 2.2, 2.0),
    target: new THREE.Vector3(7.2, 0.7, -2.5),
  },
  owner_desk: {
    pos: new THREE.Vector3(4.5, 1.8, 4.4),
    target: new THREE.Vector3(3.4, 1.2, 2.3),
  },
};

export const ShowroomCanvas: React.FC<ShowroomCanvasProps> = ({
  config,
  cameraPreset,
  isAutoRotating = false,
  showAvatars = true,
  onSelectCar,
  onSelectAvatar,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Dynamic references to 3D sub-assemblies for animation and updates
  const carGroupRef = useRef<THREE.Group | null>(null);
  const bodyMeshRef = useRef<THREE.Mesh | null>(null);
  const bodyMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const glassMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const rimMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const caliperMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const interiorMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const headlightMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const taillightMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);

  // Showroom Fleet & Avatars Refs
  const avatarGroupRef = useRef<THREE.Group | null>(null);
  const ownerHeadRef = useRef<THREE.Group | null>(null);
  const taycanCarRef = useRef<THREE.Group | null>(null);
  const gt3rsCarRef = useRef<THREE.Group | null>(null);

  // Moving elements
  const spoilerGroupRef = useRef<THREE.Group | null>(null);
  const doorLeftRef = useRef<THREE.Group | null>(null);
  const doorRightRef = useRef<THREE.Group | null>(null);
  const engineBayGroupRef = useRef<THREE.Group | null>(null);
  const wheelsGroupRef = useRef<THREE.Group[]>([]);
  const hoodGroupRef = useRef<THREE.Group | null>(null);
  const chassisGroupRef = useRef<THREE.Group | null>(null);

  // Camera animation state
  const targetCamPos = useRef<THREE.Vector3>(CAMERA_PRESETS[cameraPreset].pos.clone());
  const targetCamLook = useRef<THREE.Vector3>(CAMERA_PRESETS[cameraPreset].target.clone());
  const currentCamLook = useRef<THREE.Vector3>(CAMERA_PRESETS[cameraPreset].target.clone());

  // Orbit control interaction state
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const orbitSpherical = useRef(new THREE.Spherical(6.5, Math.PI / 3, Math.PI / 4));

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#090A0D');
    scene.fog = new THREE.FogExp2('#090A0D', 0.04);
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    const initialPreset = CAMERA_PRESETS[cameraPreset];
    camera.position.copy(initialPreset.pos);
    camera.lookAt(initialPreset.target);
    cameraRef.current = camera;
    currentCamLook.current.copy(initialPreset.target);
    orbitSpherical.current.setFromVector3(initialPreset.pos);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Studio Lighting Rig
    // Ambient light
    const ambientLight = new THREE.AmbientLight('#B0B7C3', 0.85);
    scene.add(ambientLight);

    // Key studio light (overhead softbox)
    const keyLight = new THREE.DirectionalLight('#FFFFFF', 2.8);
    keyLight.position.set(4, 8, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 25;
    keyLight.shadow.bias = -0.0005;
    const d = 5;
    keyLight.shadow.camera.left = -d;
    keyLight.shadow.camera.right = d;
    keyLight.shadow.camera.top = d;
    keyLight.shadow.camera.bottom = -d;
    scene.add(keyLight);

    // Fill rim light (rear top-left)
    const rimLight = new THREE.DirectionalLight('#A5C4FF', 1.8);
    rimLight.position.set(-6, 5, -5);
    scene.add(rimLight);

    // Side contrast light (warm metallic kicker)
    const sideLight = new THREE.DirectionalLight('#FFEACC', 1.2);
    sideLight.position.set(-5, 3, 4);
    scene.add(sideLight);

    // 5. Studio Showroom Pavilion Architecture & Lighting
    const showroomPavilion = createShowroomPavilion();
    scene.add(showroomPavilion);

    // Central Configurable Turntable Stage
    const floorRadius = 4.8;
    const floorGeo = new THREE.CylinderGeometry(floorRadius, floorRadius, 0.15, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: '#0A0C10',
      roughness: 0.14,
      metalness: 0.85,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = 0.05;
    floor.receiveShadow = true;
    scene.add(floor);

    // Glowing stage edge ring
    const ringGeo = new THREE.RingGeometry(floorRadius - 0.08, floorRadius + 0.04, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: '#D1001C',
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = 0.13;
    scene.add(ringMesh);

    // 6. Showroom Bay A Vehicle: Porsche Taycan Turbo GT (EV Wing)
    const taycan = createTaycanShowroomCar();
    scene.add(taycan);
    taycanCarRef.current = taycan;

    // 7. Showroom Bay B Vehicle: Porsche 911 GT3 RS (Track Wing)
    const gt3rs = createGT3RSShowroomCar();
    scene.add(gt3rs);
    gt3rsCarRef.current = gt3rs;

    // 8. 3D Avatars: Store Owner AI Clone & VIP Client
    const avatarsContainer = new THREE.Group();
    const { group: ownerAvatar, headGroup: ownerHead } = createOwnerAvatar();
    const customerAvatar = createCustomerAvatar();
    avatarsContainer.add(ownerAvatar);
    avatarsContainer.add(customerAvatar);
    scene.add(avatarsContainer);
    avatarGroupRef.current = avatarsContainer;
    ownerHeadRef.current = ownerHead;

    // 9. Assemble the Detailed 3D Luxury Sports Car on Center Stage
    const car = createCarModel();
    scene.add(car);
    carGroupRef.current = car;

    // 10. Mouse Orbit & Touch Controls
    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !cameraRef.current) return;
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;

      const cam = cameraRef.current;
      const offset = cam.position.clone().sub(currentCamLook.current);
      const spherical = new THREE.Spherical().setFromVector3(offset);

      spherical.theta -= deltaX * 0.007;
      spherical.phi = Math.max(0.15, Math.min(Math.PI / 2 - 0.05, spherical.phi - deltaY * 0.007));

      offset.setFromSpherical(spherical);
      cam.position.copy(currentCamLook.current).add(offset);
      cam.lookAt(currentCamLook.current);

      targetCamPos.current.copy(cam.position);
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      const cam = cameraRef.current;
      const offset = cam.position.clone().sub(currentCamLook.current);
      const distance = offset.length();
      const newDist = Math.max(2.2, Math.min(14, distance + e.deltaY * 0.005));
      offset.setLength(newDist);
      cam.position.copy(currentCamLook.current).add(offset);
      targetCamPos.current.copy(cam.position);
    };

    // Touch support for mobile/tablets
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging.current = true;
        previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current || e.touches.length !== 1 || !cameraRef.current) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.current.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.current.y;

      const cam = cameraRef.current;
      const offset = cam.position.clone().sub(currentCamLook.current);
      const spherical = new THREE.Spherical().setFromVector3(offset);

      spherical.theta -= deltaX * 0.008;
      spherical.phi = Math.max(0.15, Math.min(Math.PI / 2 - 0.05, spherical.phi - deltaY * 0.008));

      offset.setFromSpherical(spherical);
      cam.position.copy(currentCamLook.current).add(offset);
      cam.lookAt(currentCamLook.current);

      targetCamPos.current.copy(cam.position);
      previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove);
    container.addEventListener('touchend', handleTouchEnd);

    // 8. Resize Observer for dynamic responsive sizing
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    });
    resizeObserver.observe(container);

    // 9. Main Animation Render Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);

      // Camera lerping to target preset position and lookAt point
      if (cameraRef.current) {
        const cam = cameraRef.current;

        // Auto-rotation when enabled and user not dragging
        if (isAutoRotating && !isDragging.current) {
          const offset = cam.position.clone().sub(currentCamLook.current);
          const spherical = new THREE.Spherical().setFromVector3(offset);
          spherical.theta += delta * 0.25;
          offset.setFromSpherical(spherical);
          targetCamPos.current.copy(currentCamLook.current).add(offset);
        }

        if (!isDragging.current) {
          cam.position.lerp(targetCamPos.current, delta * 4.5);
          currentCamLook.current.lerp(targetCamLook.current, delta * 4.5);
          cam.lookAt(currentCamLook.current);
        }
      }

      // Smooth mechanics animations
      // 1. Active Aerodynamic Spoiler
      if (spoilerGroupRef.current) {
        const targetY = config.spoilerActive ? 1.32 : 1.05;
        const targetRotX = config.spoilerActive ? 0.18 : 0.0;
        spoilerGroupRef.current.position.y += (targetY - spoilerGroupRef.current.position.y) * delta * 6;
        spoilerGroupRef.current.rotation.x += (targetRotX - spoilerGroupRef.current.rotation.x) * delta * 6;
      }

      // 2. Opening Doors
      if (doorLeftRef.current && doorRightRef.current) {
        const targetAngle = config.doorsOpen ? 0.75 : 0.0;
        doorLeftRef.current.rotation.y += (-targetAngle - doorLeftRef.current.rotation.y) * delta * 5;
        doorRightRef.current.rotation.y += (targetAngle - doorRightRef.current.rotation.y) * delta * 5;
      }

      // 3. Exploded Architecture View
      if (hoodGroupRef.current && engineBayGroupRef.current && chassisGroupRef.current) {
        const exp = config.explodedView ? 1 : 0;
        // Body elevates
        const targetBodyY = exp * 0.85;
        if (carGroupRef.current) {
          carGroupRef.current.position.y += ((0.0 + targetBodyY) - carGroupRef.current.position.y) * delta * 4;
        }

        // Engine bay pulls back
        const targetEngZ = exp * -0.9;
        engineBayGroupRef.current.position.z += (targetEngZ - engineBayGroupRef.current.position.z) * delta * 4;

        // Wheels spread outward
        wheelsGroupRef.current.forEach((wheel, idx) => {
          const side = idx % 2 === 0 ? 1 : -1;
          const targetX = (side * 1.05) + (side * exp * 0.6);
          wheel.position.x += (targetX - wheel.position.x) * delta * 4;
        });
      }

      // 4. Subtle Avatar Idle Breathing / Head Turning
      if (ownerHeadRef.current) {
        const time = clock.getElapsedTime();
        ownerHeadRef.current.position.y = 1.58 + Math.sin(time * 1.8) * 0.008;
        ownerHeadRef.current.rotation.y = Math.sin(time * 0.9) * 0.07;
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Toggle Avatars Visibility
  useEffect(() => {
    if (avatarGroupRef.current) {
      avatarGroupRef.current.visible = showAvatars;
    }
  }, [showAvatars]);

  // Update Camera Target when cameraPreset changes
  useEffect(() => {
    const preset = CAMERA_PRESETS[cameraPreset] || CAMERA_PRESETS.hero;
    targetCamPos.current.copy(preset.pos);
    targetCamLook.current.copy(preset.target);
  }, [cameraPreset]);

  // Update Materials & Car Colors dynamically when config updates
  useEffect(() => {
    // 1. Body Paint material update
    if (bodyMaterialRef.current) {
      bodyMaterialRef.current.color.set(config.bodyColor);
      if (config.finish === 'matte') {
        bodyMaterialRef.current.roughness = 0.88;
        bodyMaterialRef.current.metalness = 0.15;
      } else if (config.finish === 'metallic') {
        bodyMaterialRef.current.roughness = 0.22;
        bodyMaterialRef.current.metalness = 0.85;
      } else {
        // Glossy
        bodyMaterialRef.current.roughness = 0.12;
        bodyMaterialRef.current.metalness = 0.45;
      }
      bodyMaterialRef.current.needsUpdate = true;
    }

    // 2. Rims Color & Finish
    rimMaterialsRef.current.forEach(mat => {
      mat.color.set(config.rimColor);
      mat.needsUpdate = true;
    });

    // 3. Brake Calipers Color
    caliperMaterialsRef.current.forEach(mat => {
      mat.color.set(config.caliperColor);
      mat.needsUpdate = true;
    });

    // 4. Interior Leather / Race-Tex
    if (interiorMaterialRef.current) {
      interiorMaterialRef.current.color.set(config.interiorColor);
      interiorMaterialRef.current.needsUpdate = true;
    }

    // 5. Headlights On/Off illumination
    headlightMaterialsRef.current.forEach(mat => {
      if (config.headlightsOn) {
        mat.emissive.set('#93C5FD');
        mat.emissiveIntensity = 2.4;
      } else {
        mat.emissive.set('#1E293B');
        mat.emissiveIntensity = 0.2;
      }
      mat.needsUpdate = true;
    });

    // 6. Taillight Bar illumination
    if (taillightMaterialRef.current) {
      if (config.headlightsOn) {
        taillightMaterialRef.current.emissive.set('#EF4444');
        taillightMaterialRef.current.emissiveIntensity = 2.2;
      } else {
        taillightMaterialRef.current.emissive.set('#7F1D1D');
        taillightMaterialRef.current.emissiveIntensity = 0.4;
      }
      taillightMaterialRef.current.needsUpdate = true;
    }
  }, [config]);

  // Construct the 3D Car Model Procedurally with Three.js
  const createCarModel = (): THREE.Group => {
    const car = new THREE.Group();

    // Body Paint Material
    const bodyMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(config.bodyColor),
      roughness: config.finish === 'matte' ? 0.88 : (config.finish === 'metallic' ? 0.22 : 0.12),
      metalness: config.finish === 'matte' ? 0.15 : (config.finish === 'metallic' ? 0.85 : 0.45),
    });
    bodyMaterialRef.current = bodyMat;

    // Dark Carbon Fiber / Plastic Trim Material
    const carbonMat = new THREE.MeshStandardMaterial({
      color: '#121316',
      roughness: 0.45,
      metalness: 0.7,
    });

    // Glass Window Material (PBR physical glass)
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: '#0A0F1D',
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.85,
      thickness: 0.5,
      transparent: true,
      opacity: 0.85,
    });
    glassMaterialRef.current = glassMat;

    // Interior Upholstery Material
    const interiorMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(config.interiorColor),
      roughness: 0.85,
      metalness: 0.1,
    });
    interiorMaterialRef.current = interiorMat;

    // Headlight Lens Material
    const headlightMat = new THREE.MeshStandardMaterial({
      color: '#FFFFFF',
      emissive: new THREE.Color('#93C5FD'),
      emissiveIntensity: 2.4,
      roughness: 0.1,
    });
    headlightMaterialsRef.current = [headlightMat];

    // Taillight Bar Material
    const taillightMat = new THREE.MeshStandardMaterial({
      color: '#DC2626',
      emissive: new THREE.Color('#EF4444'),
      emissiveIntensity: 2.2,
      roughness: 0.2,
    });
    taillightMaterialRef.current = taillightMat;

    // Chrome / Exhaust Material
    const chromeMat = new THREE.MeshStandardMaterial({
      color: '#E5E7EB',
      roughness: 0.1,
      metalness: 0.95,
    });

    // 1. Lower Chassis & Flat Underbody Underbelly
    const chassisGeo = new THREE.BoxGeometry(1.85, 0.22, 4.4);
    const chassisMesh = new THREE.Mesh(chassisGeo, carbonMat);
    chassisMesh.position.set(0, 0.25, 0);
    chassisMesh.castShadow = true;
    chassisMesh.receiveShadow = true;
    car.add(chassisMesh);
    chassisGroupRef.current = chassisMesh as any;

    // Front Splitter
    const splitterGeo = new THREE.BoxGeometry(1.9, 0.06, 0.45);
    const splitterMesh = new THREE.Mesh(splitterGeo, carbonMat);
    splitterMesh.position.set(0, 0.16, 2.2);
    splitterMesh.castShadow = true;
    car.add(splitterMesh);

    // Rear Aerodynamic Diffuser with fins
    const diffuserGeo = new THREE.BoxGeometry(1.88, 0.18, 0.6);
    const diffuserMesh = new THREE.Mesh(diffuserGeo, carbonMat);
    diffuserMesh.position.set(0, 0.22, -2.15);
    diffuserMesh.castShadow = true;
    car.add(diffuserMesh);

    // Dual Titanium Exhaust Tips
    [-0.35, 0.35].forEach((xPos) => {
      const exhaustGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.25, 24);
      const exhaustMesh = new THREE.Mesh(exhaustGeo, chromeMat);
      exhaustMesh.rotation.x = Math.PI / 2;
      exhaustMesh.position.set(xPos, 0.22, -2.42);
      car.add(exhaustMesh);
    });

    // 2. Sculpted Main Body (Porsche 911 Iconic Silhouette)
    // Central Main Cabin Tub
    const mainBodyGeo = new THREE.BoxGeometry(1.92, 0.48, 4.1);
    const mainBody = new THREE.Mesh(mainBodyGeo, bodyMat);
    mainBody.position.set(0, 0.52, 0);
    mainBody.castShadow = true;
    mainBody.receiveShadow = true;
    car.add(mainBody);
    bodyMeshRef.current = mainBody;

    // Front Hood Slope
    const hoodGroup = new THREE.Group();
    const hoodGeo = new THREE.BoxGeometry(1.84, 0.3, 1.4);
    const hoodMesh = new THREE.Mesh(hoodGeo, bodyMat);
    hoodMesh.position.set(0, 0.52, 1.4);
    hoodMesh.rotation.x = -0.12;
    hoodMesh.castShadow = true;
    hoodGroup.add(hoodMesh);

    // Porsche Crest Badge on Nose
    const badgeGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.02, 16);
    const badgeMat = new THREE.MeshStandardMaterial({ color: '#CA8A04', metalness: 0.9, roughness: 0.2 });
    const badge = new THREE.Mesh(badgeGeo, badgeMat);
    badge.position.set(0, 0.61, 2.05);
    badge.rotation.x = -0.25;
    hoodGroup.add(badge);

    car.add(hoodGroup);
    hoodGroupRef.current = hoodGroup;

    // Flared Wheel Arches (Fenders) - Front Left, Front Right, Rear Left, Rear Right
    const archPositions = [
      { x: 0.96, z: 1.4, sX: 0.15, sY: 0.44, sZ: 0.8 },
      { x: -0.96, z: 1.4, sX: 0.15, sY: 0.44, sZ: 0.8 },
      { x: 1.02, z: -1.35, sX: 0.22, sY: 0.48, sZ: 0.95 }, // Wider rear haunches
      { x: -1.02, z: -1.35, sX: 0.22, sY: 0.48, sZ: 0.95 },
    ];
    archPositions.forEach((pos) => {
      const archGeo = new THREE.BoxGeometry(pos.sX, pos.sY, pos.sZ);
      const archMesh = new THREE.Mesh(archGeo, bodyMat);
      archMesh.position.set(pos.x, 0.52, pos.z);
      archMesh.castShadow = true;
      car.add(archMesh);
    });

    // 3. Fastback Greenhouse Cabin & Curved Roofline
    const cabinGeo = new THREE.BoxGeometry(1.58, 0.48, 2.1);
    const cabin = new THREE.Mesh(cabinGeo, bodyMat);
    cabin.position.set(0, 0.86, -0.15);
    cabin.castShadow = true;
    car.add(cabin);

    // Front Windshield (Raked angle)
    const windshieldGeo = new THREE.PlaneGeometry(1.5, 0.78);
    const windshield = new THREE.Mesh(windshieldGeo, glassMat);
    windshield.position.set(0, 0.88, 0.85);
    windshield.rotation.x = -Math.PI / 3.4;
    car.add(windshield);

    // Rear Teardrop Window Sloping Down to Engine Lid
    const rearWindowGeo = new THREE.PlaneGeometry(1.42, 1.15);
    const rearWindow = new THREE.Mesh(rearWindowGeo, glassMat);
    rearWindow.position.set(0, 0.82, -1.1);
    rearWindow.rotation.x = Math.PI / 3.8;
    car.add(rearWindow);

    // Side Windows
    [-0.78, 0.78].forEach((xPos) => {
      const sideWindowGeo = new THREE.PlaneGeometry(1.7, 0.38);
      const sideWindow = new THREE.Mesh(sideWindowGeo, glassMat);
      sideWindow.position.set(xPos, 0.9, -0.15);
      sideWindow.rotation.y = xPos > 0 ? Math.PI / 2 : -Math.PI / 2;
      car.add(sideWindow);
    });

    // 4. Cockpit Interior (Dashboard, Sports Seats, Steering Wheel)
    // Dashboard Binnacle
    const dashGeo = new THREE.BoxGeometry(1.4, 0.22, 0.5);
    const dashMesh = new THREE.Mesh(dashGeo, interiorMat);
    dashMesh.position.set(0, 0.75, 0.65);
    car.add(dashMesh);

    // Steering Wheel
    const wheelRingGeo = new THREE.TorusGeometry(0.12, 0.02, 16, 24);
    const wheelRing = new THREE.Mesh(wheelRingGeo, carbonMat);
    wheelRing.position.set(0.35, 0.8, 0.45);
    wheelRing.rotation.x = 0.35;
    car.add(wheelRing);

    // Twin Carbon Bucket Sports Seats
    [-0.35, 0.35].forEach((xPos) => {
      const seatGroup = new THREE.Group();
      // Seat Cushion
      const cushionGeo = new THREE.BoxGeometry(0.48, 0.12, 0.52);
      const cushion = new THREE.Mesh(cushionGeo, interiorMat);
      cushion.position.set(0, 0.42, -0.05);
      seatGroup.add(cushion);

      // Seat Backrest with Bolsters
      const backGeo = new THREE.BoxGeometry(0.46, 0.54, 0.12);
      const back = new THREE.Mesh(backGeo, interiorMat);
      back.position.set(0, 0.68, -0.3);
      back.rotation.x = -0.15;
      seatGroup.add(back);

      // Headrest
      const headGeo = new THREE.BoxGeometry(0.24, 0.16, 0.09);
      const head = new THREE.Mesh(headGeo, interiorMat);
      head.position.set(0, 0.98, -0.36);
      seatGroup.add(head);

      seatGroup.position.x = xPos;
      car.add(seatGroup);
    });

    // 5. Headlights & Iconic Quad-Point Matrix DRLs
    [-0.65, 0.65].forEach((xPos) => {
      // Oval Headlamp Pod
      const podGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.1, 24);
      const pod = new THREE.Mesh(podGeo, headlightMat);
      pod.rotation.x = Math.PI / 2.3;
      pod.position.set(xPos, 0.65, 1.96);
      car.add(pod);

      // Inner Matrix Projector Lens
      const lensGeo = new THREE.SphereGeometry(0.08, 16, 16);
      const lens = new THREE.Mesh(lensGeo, chromeMat);
      lens.position.set(xPos, 0.65, 2.02);
      car.add(lens);
    });

    // 6. Seamless Full-Width 3D LED Taillight Bar with PORSCHE Typography
    const lightBarGeo = new THREE.BoxGeometry(1.78, 0.065, 0.1);
    const lightBar = new THREE.Mesh(lightBarGeo, taillightMat);
    lightBar.position.set(0, 0.72, -2.06);
    car.add(lightBar);

    // 7. Doors with Interactive Pivoting Hinges
    const doorGeo = new THREE.BoxGeometry(0.08, 0.45, 1.6);

    const doorLeft = new THREE.Group();
    doorLeft.position.set(0.96, 0.52, 0.8);
    const doorLeftMesh = new THREE.Mesh(doorGeo, bodyMat);
    doorLeftMesh.position.set(0, 0, -0.8);
    doorLeftMesh.castShadow = true;
    doorLeft.add(doorLeftMesh);
    car.add(doorLeft);
    doorLeftRef.current = doorLeft;

    const doorRight = new THREE.Group();
    doorRight.position.set(-0.96, 0.52, 0.8);
    const doorRightMesh = new THREE.Mesh(doorGeo, bodyMat);
    doorRightMesh.position.set(0, 0, -0.8);
    doorRightMesh.castShadow = true;
    doorRight.add(doorRightMesh);
    car.add(doorRight);
    doorRightRef.current = doorRight;

    // 8. Rear Boxer Powertrain Bay (Engine Details for Inspection)
    const engineBay = new THREE.Group();
    // Boxer-6 Crankcase
    const blockGeo = new THREE.BoxGeometry(0.9, 0.35, 0.8);
    const blockMat = new THREE.MeshStandardMaterial({ color: '#374151', metalness: 0.85, roughness: 0.3 });
    const block = new THREE.Mesh(blockGeo, blockMat);
    block.position.set(0, 0.45, -1.45);
    engineBay.add(block);

    // Red Cylinder Head Covers (Opposed Flat-6)
    [-0.48, 0.48].forEach((xPos) => {
      const coverGeo = new THREE.BoxGeometry(0.12, 0.22, 0.75);
      const coverMat = new THREE.MeshStandardMaterial({ color: '#DC2626', metalness: 0.5, roughness: 0.3 });
      const cover = new THREE.Mesh(coverGeo, coverMat);
      cover.position.set(xPos, 0.45, -1.45);
      engineBay.add(cover);
    });

    // Twin Turbochargers with gold heat shielding
    [-0.32, 0.32].forEach((xPos) => {
      const turboGeo = new THREE.TorusGeometry(0.11, 0.04, 16, 24);
      const turboMat = new THREE.MeshStandardMaterial({ color: '#F59E0B', metalness: 0.9, roughness: 0.2 });
      const turbo = new THREE.Mesh(turboGeo, turboMat);
      turbo.rotation.y = Math.PI / 2;
      turbo.position.set(xPos, 0.38, -1.9);
      engineBay.add(turbo);
    });

    car.add(engineBay);
    engineBayGroupRef.current = engineBay;

    // 9. Active Aerodynamic Rear Wing
    const spoilerGroup = new THREE.Group();
    spoilerGroup.position.set(0, 1.05, -1.92);

    // Wing Aerofoil blade
    const wingGeo = new THREE.BoxGeometry(1.68, 0.04, 0.28);
    const wingMesh = new THREE.Mesh(wingGeo, carbonMat);
    wingMesh.castShadow = true;
    spoilerGroup.add(wingMesh);

    // Twin Hydraulic Actuator Struts
    [-0.52, 0.52].forEach((xPos) => {
      const strutGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.32, 16);
      const strut = new THREE.Mesh(strutGeo, chromeMat);
      strut.position.set(xPos, -0.15, 0);
      spoilerGroup.add(strut);
    });

    car.add(spoilerGroup);
    spoilerGroupRef.current = spoilerGroup;

    // 10. Wheels & Brakes (Front 20" / Rear 21")
    rimMaterialsRef.current = [];
    caliperMaterialsRef.current = [];
    wheelsGroupRef.current = [];

    const wheelLocations = [
      { x: 1.05, y: 0.42, z: 1.4, radius: 0.42, width: 0.3 },   // Front Right
      { x: -1.05, y: 0.42, z: 1.4, radius: 0.42, width: 0.3 },  // Front Left
      { x: 1.08, y: 0.44, z: -1.35, radius: 0.44, width: 0.36 }, // Rear Right (wider staggered)
      { x: -1.08, y: 0.44, z: -1.35, radius: 0.44, width: 0.36 } // Rear Left
    ];

    wheelLocations.forEach((loc, idx) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(loc.x, loc.y, loc.z);

      // Rubber Tire with tread grooves
      const tireGeo = new THREE.CylinderGeometry(loc.radius, loc.radius, loc.width, 32);
      const tireMat = new THREE.MeshStandardMaterial({
        color: '#121214',
        roughness: 0.9,
        metalness: 0.1,
      });
      const tire = new THREE.Mesh(tireGeo, tireMat);
      tire.rotation.z = Math.PI / 2;
      tire.castShadow = true;
      wheelGroup.add(tire);

      // Cross-Drilled High-Performance Brake Rotor
      const rotorGeo = new THREE.CylinderGeometry(loc.radius * 0.74, loc.radius * 0.74, 0.04, 24);
      const rotorMat = new THREE.MeshStandardMaterial({
        color: '#9CA3AF',
        metalness: 0.9,
        roughness: 0.25,
      });
      const rotor = new THREE.Mesh(rotorGeo, rotorMat);
      rotor.rotation.z = Math.PI / 2;
      rotor.position.x = loc.x > 0 ? -0.05 : 0.05;
      wheelGroup.add(rotor);

      // Colored Monobloc Brake Caliper
      const caliperGeo = new THREE.BoxGeometry(0.1, 0.24, 0.15);
      const caliperMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(config.caliperColor),
        metalness: 0.3,
        roughness: 0.2,
      });
      caliperMaterialsRef.current.push(caliperMat);
      const caliper = new THREE.Mesh(caliperGeo, caliperMat);
      caliper.position.set(loc.x > 0 ? -0.05 : 0.05, 0.14, 0.05);
      wheelGroup.add(caliper);

      // Wheel Rim & Spoke Architecture
      const rimMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(config.rimColor),
        metalness: 0.88,
        roughness: 0.2,
      });
      rimMaterialsRef.current.push(rimMat);

      // Outer Rim Barrel
      const rimBarrelGeo = new THREE.CylinderGeometry(loc.radius * 0.8, loc.radius * 0.8, loc.width * 0.9, 32);
      const rimBarrel = new THREE.Mesh(rimBarrelGeo, rimMat);
      rimBarrel.rotation.z = Math.PI / 2;
      wheelGroup.add(rimBarrel);

      // Wheel Spokes (10-spoke or multi-spoke)
      const spokeCount = 10;
      for (let s = 0; s < spokeCount; s++) {
        const angle = (s / spokeCount) * Math.PI * 2;
        const spokeGeo = new THREE.BoxGeometry(0.04, loc.radius * 0.76, 0.035);
        const spoke = new THREE.Mesh(spokeGeo, rimMat);
        spoke.rotation.x = angle;
        spoke.position.set(loc.x > 0 ? 0.08 : -0.08, 0, 0);
        wheelGroup.add(spoke);
      }

      // Center Lock Cap with Gold Porsche Emblem
      const centerGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.06, 16);
      const centerMat = new THREE.MeshStandardMaterial({ color: '#CA8A04', metalness: 0.9, roughness: 0.1 });
      const center = new THREE.Mesh(centerGeo, centerMat);
      center.rotation.z = Math.PI / 2;
      center.position.set(loc.x > 0 ? 0.12 : -0.12, 0, 0);
      wheelGroup.add(center);

      car.add(wheelGroup);
      wheelsGroupRef.current.push(wheelGroup);
    });

    return car;
  };

  return (
    <div className="relative w-full h-full select-none overflow-hidden" ref={containerRef}>
      {/* Subtle overlay hint */}
      <div className="absolute bottom-4 left-4 z-10 pointer-events-none flex items-center gap-2 bg-neutral-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-neutral-800 text-xs text-neutral-400 font-mono">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
        <span>Drag to Orbit • Scroll to Zoom • Touch Enabled</span>
      </div>
    </div>
  );
};
