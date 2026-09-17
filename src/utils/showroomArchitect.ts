import * as THREE from 'three';

/**
 * Creates the flagship architectural dealership showroom pavilion
 */
export function createShowroomPavilion(): THREE.Group {
  const pavilion = new THREE.Group();

  // 1. Expansive Polished Dealership Floor (36m x 36m)
  const floorGeo = new THREE.PlaneGeometry(42, 36);
  const floorMat = new THREE.MeshStandardMaterial({
    color: '#080A0E',
    roughness: 0.16,
    metalness: 0.82,
  });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -0.01;
  floor.receiveShadow = true;
  pavilion.add(floor);

  // Studio Grid Lines
  const grid = new THREE.GridHelper(36, 36, '#1E293B', '#0F172A');
  grid.position.y = 0.005;
  pavilion.add(grid);

  // 2. Left Display Plinth (Bay A - EV Pavilion for Taycan)
  const plinthAGeo = new THREE.CylinderGeometry(4.2, 4.4, 0.12, 48);
  const plinthAMat = new THREE.MeshStandardMaterial({
    color: '#0B0F17',
    roughness: 0.25,
    metalness: 0.5,
  });
  const plinthA = new THREE.Mesh(plinthAGeo, plinthAMat);
  plinthA.position.set(-7.2, 0.05, -2.5);
  plinthA.receiveShadow = true;
  pavilion.add(plinthA);

  // Cyan Neon Perimeter Glow on Bay A Plinth
  const ringAGeo = new THREE.RingGeometry(4.25, 4.38, 48);
  const ringAMat = new THREE.MeshBasicMaterial({ color: '#38BDF8', side: THREE.DoubleSide });
  const ringA = new THREE.Mesh(ringAGeo, ringAMat);
  ringA.rotation.x = -Math.PI / 2;
  ringA.position.set(-7.2, 0.12, -2.5);
  pavilion.add(ringA);

  // 3. Right Display Plinth (Bay B - Motorsport Wing for GT3 RS)
  const plinthBGeo = new THREE.CylinderGeometry(4.2, 4.4, 0.12, 48);
  const plinthBMat = new THREE.MeshStandardMaterial({
    color: '#0B0F17',
    roughness: 0.25,
    metalness: 0.5,
  });
  const plinthB = new THREE.Mesh(plinthBGeo, plinthBMat);
  plinthB.position.set(7.2, 0.05, -2.5);
  plinthB.receiveShadow = true;
  pavilion.add(plinthB);

  // Amber/Racing Yellow Neon Perimeter Glow on Bay B Plinth
  const ringBGeo = new THREE.RingGeometry(4.25, 4.38, 48);
  const ringBMat = new THREE.MeshBasicMaterial({ color: '#EAB308', side: THREE.DoubleSide });
  const ringB = new THREE.Mesh(ringBGeo, ringBMat);
  ringB.rotation.x = -Math.PI / 2;
  ringB.position.set(7.2, 0.12, -2.5);
  pavilion.add(ringB);

  // 4. Back Feature Wall with Architectural Lighting (Z = -9.5)
  const wallGeo = new THREE.PlaneGeometry(42, 10);
  const wallMat = new THREE.MeshStandardMaterial({
    color: '#0D0F14',
    roughness: 0.6,
    metalness: 0.3,
  });
  const wall = new THREE.Mesh(wallGeo, wallMat);
  wall.position.set(0, 5, -9.5);
  pavilion.add(wall);

  // Glass Windows & Exterior Skyline View
  const glassGeo = new THREE.PlaneGeometry(42, 6);
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: '#0F172A',
    transparent: true,
    opacity: 0.4,
    roughness: 0.05,
    metalness: 0.1,
    transmission: 0.7,
  });
  const glass = new THREE.Mesh(glassGeo, glassMat);
  glass.position.set(0, 4, -9.4);
  pavilion.add(glass);

  // Brand Signage Backlit Panel
  const signBackGeo = new THREE.BoxGeometry(11, 1.2, 0.1);
  const signBackMat = new THREE.MeshStandardMaterial({ color: '#181A20', roughness: 0.3 });
  const signBack = new THREE.Mesh(signBackGeo, signBackMat);
  signBack.position.set(0, 6.5, -9.35);
  pavilion.add(signBack);

  // Illuminated Porsche Lettering Bar
  const signBarGeo = new THREE.BoxGeometry(10.6, 0.08, 0.12);
  const signBarMat = new THREE.MeshBasicMaterial({ color: '#CA8A04' });
  const signBar = new THREE.Mesh(signBarGeo, signBarMat);
  signBar.position.set(0, 6.9, -9.3);
  pavilion.add(signBar);

  const signBarBottom = new THREE.Mesh(signBarGeo, signBarMat);
  signBarBottom.position.set(0, 6.1, -9.3);
  pavilion.add(signBarBottom);

  // Architectural Columns (Matte Carbon Finish)
  const colLocations = [-14, -7, 7, 14];
  colLocations.forEach((x) => {
    const colGeo = new THREE.BoxGeometry(0.6, 10, 0.6);
    const colMat = new THREE.MeshStandardMaterial({ color: '#16181D', roughness: 0.4, metalness: 0.7 });
    const col = new THREE.Mesh(colGeo, colMat);
    col.position.set(x, 5, -9.2);
    pavilion.add(col);

    // Downlight spot on each column
    const spot = new THREE.SpotLight('#FFFFFF', 1.5, 12, Math.PI / 5, 0.4);
    spot.position.set(x, 8.5, -8.8);
    spot.target.position.set(x, 0, -4);
    pavilion.add(spot);
    pavilion.add(spot.target);
  });

  // 5. Overhead Architectural Lighting Trusses
  [-3, 3].forEach((zPos) => {
    const trussGeo = new THREE.BoxGeometry(32, 0.15, 0.15);
    const trussMat = new THREE.MeshStandardMaterial({ color: '#334155', metalness: 0.9 });
    const truss = new THREE.Mesh(trussGeo, trussMat);
    truss.position.set(0, 7.8, zPos);
    pavilion.add(truss);

    // Glowing LED linear diffuser panel underneath truss
    const ledGeo = new THREE.PlaneGeometry(28, 0.4);
    const ledMat = new THREE.MeshBasicMaterial({ color: '#F8FAFC', side: THREE.DoubleSide });
    const led = new THREE.Mesh(ledGeo, ledMat);
    led.rotation.x = Math.PI / 2;
    led.position.set(0, 7.72, zPos);
    pavilion.add(led);
  });

  // 6. Porsche Rapid DC Destination Charger Station (In Bay A)
  const chargerGroup = new THREE.Group();
  chargerGroup.position.set(-10.2, 0, -2.5);

  const chargerTotemGeo = new THREE.BoxGeometry(0.5, 2.2, 0.4);
  const chargerTotemMat = new THREE.MeshStandardMaterial({ color: '#0F172A', roughness: 0.2, metalness: 0.8 });
  const chargerTotem = new THREE.Mesh(chargerTotemGeo, chargerTotemMat);
  chargerTotem.position.y = 1.1;
  chargerGroup.add(chargerTotem);

  // Charger LED Status Ring
  const chargerLedGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.05, 24);
  const chargerLedMat = new THREE.MeshBasicMaterial({ color: '#38BDF8' });
  const chargerLed = new THREE.Mesh(chargerLedGeo, chargerLedMat);
  chargerLed.rotation.x = Math.PI / 2;
  chargerLed.position.set(0, 1.7, 0.21);
  chargerGroup.add(chargerLed);

  // Charger Cable Curve to vehicle
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(0, 0.9, 0.2),
    new THREE.Vector3(1.2, 0.1, 0.5),
    new THREE.Vector3(2.2, 0.6, 0.2)
  );
  const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.03, 8, false);
  const tubeMat = new THREE.MeshStandardMaterial({ color: '#1E293B', roughness: 0.8 });
  const tube = new THREE.Mesh(tubeGeo, tubeMat);
  chargerGroup.add(tube);

  pavilion.add(chargerGroup);

  // 7. Founder / Sales Specialist Presentation Stand (near Marcus AI Clone)
  const deskGroup = new THREE.Group();
  deskGroup.position.set(4.2, 0, 2.8);

  const deskGeo = new THREE.CylinderGeometry(0.65, 0.75, 1.05, 32);
  const deskMat = new THREE.MeshStandardMaterial({ color: '#181A20', roughness: 0.3, metalness: 0.7 });
  const desk = new THREE.Mesh(deskGeo, deskMat);
  desk.position.y = 0.525;
  deskGroup.add(desk);

  // Gold inlay ring on desk
  const deskRingGeo = new THREE.CylinderGeometry(0.66, 0.66, 0.04, 32);
  const deskRingMat = new THREE.MeshBasicMaterial({ color: '#CA8A04' });
  const deskRing = new THREE.Mesh(deskRingGeo, deskRingMat);
  deskRing.position.y = 0.75;
  deskGroup.add(deskRing);

  // Digital Catalog Terminal on desk
  const termGeo = new THREE.BoxGeometry(0.35, 0.02, 0.25);
  const termMat = new THREE.MeshStandardMaterial({ color: '#334155', metalness: 0.9 });
  const term = new THREE.Mesh(termGeo, termMat);
  term.position.set(0, 1.07, 0);
  term.rotation.x = 0.3;
  deskGroup.add(term);

  pavilion.add(deskGroup);

  return pavilion;
}

/**
 * Creates the 3D Porsche Taycan Turbo GT in Bay A
 */
export function createTaycanShowroomCar(): THREE.Group {
  const car = new THREE.Group();
  car.position.set(-7.2, 0.12, -2.5);
  car.rotation.y = Math.PI / 5;

  // Car Paint (Frozen Berry Metallic)
  const paintMat = new THREE.MeshStandardMaterial({
    color: '#9D6B78',
    metalness: 0.88,
    roughness: 0.22,
  });

  const carbonMat = new THREE.MeshStandardMaterial({ color: '#141416', roughness: 0.4, metalness: 0.5 });
  const glassMat = new THREE.MeshPhysicalMaterial({ color: '#0F172A', transmission: 0.7, opacity: 0.9, roughness: 0.1 });

  // Main Aerodynamic Body (Slightly longer EV silhouette)
  const bodyGeo = new THREE.BoxGeometry(1.9, 0.58, 4.4);
  const body = new THREE.Mesh(bodyGeo, paintMat);
  body.position.y = 0.55;
  car.add(body);

  // Sweeping Greenhouse / Roof
  const roofGeo = new THREE.CylinderGeometry(0.72, 0.92, 2.2, 16);
  const roof = new THREE.Mesh(roofGeo, glassMat);
  roof.rotation.x = Math.PI / 2;
  roof.position.set(0, 0.96, -0.2);
  car.add(roof);

  // Front Matrix Quad-Light Clusters
  const lightBarGeo = new THREE.BoxGeometry(1.7, 0.06, 0.1);
  const lightBarMat = new THREE.MeshBasicMaterial({ color: '#E0F2FE' });
  const lightBar = new THREE.Mesh(lightBarGeo, lightBarMat);
  lightBar.position.set(0, 0.58, 2.18);
  car.add(lightBar);

  // Rear Continuous Red LED Light Strip
  const rearLightGeo = new THREE.BoxGeometry(1.76, 0.05, 0.08);
  const rearLightMat = new THREE.MeshBasicMaterial({ color: '#EF4444' });
  const rearLight = new THREE.Mesh(rearLightGeo, rearLightMat);
  rearLight.position.set(0, 0.65, -2.18);
  car.add(rearLight);

  // Carbon Front Splitter & Rear Diffuser
  const splitterGeo = new THREE.BoxGeometry(1.85, 0.06, 0.4);
  const splitter = new THREE.Mesh(splitterGeo, carbonMat);
  splitter.position.set(0, 0.28, 2.15);
  car.add(splitter);

  const diffuserGeo = new THREE.BoxGeometry(1.82, 0.15, 0.4);
  const diffuser = new THREE.Mesh(diffuserGeo, carbonMat);
  diffuser.position.set(0, 0.32, -2.15);
  car.add(diffuser);

  // 4 Forged Aero Blade Wheels
  const wheelOffsets = [
    { x: 0.98, z: 1.35 },
    { x: -0.98, z: 1.35 },
    { x: 0.98, z: -1.35 },
    { x: -0.98, z: -1.35 },
  ];

  const rimMat = new THREE.MeshStandardMaterial({ color: '#090A0E', metalness: 0.85, roughness: 0.2 });
  const calMat = new THREE.MeshStandardMaterial({ color: '#38BDF8', metalness: 0.4 }); // Cyan EV calipers

  wheelOffsets.forEach((pos) => {
    const wheelGroup = new THREE.Group();
    wheelGroup.position.set(pos.x, 0.42, pos.z);

    const tireGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.28, 24);
    const tireMat = new THREE.MeshStandardMaterial({ color: '#18181B', roughness: 0.9 });
    const tire = new THREE.Mesh(tireGeo, tireMat);
    tire.rotation.z = Math.PI / 2;
    wheelGroup.add(tire);

    const rimGeo = new THREE.CylinderGeometry(0.33, 0.33, 0.29, 16);
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.z = Math.PI / 2;
    wheelGroup.add(rim);

    // Cyan Caliper
    const calGeo = new THREE.BoxGeometry(0.08, 0.2, 0.1);
    const cal = new THREE.Mesh(calGeo, calMat);
    cal.position.set(pos.x > 0 ? -0.04 : 0.04, 0.1, 0.05);
    wheelGroup.add(cal);

    car.add(wheelGroup);
  });

  return car;
}

/**
 * Creates the 3D Porsche 911 GT3 RS in Bay B
 */
export function createGT3RSShowroomCar(): THREE.Group {
  const car = new THREE.Group();
  car.position.set(7.2, 0.12, -2.5);
  car.rotation.y = -Math.PI / 5;

  // Car Paint (Python Green Glossy)
  const paintMat = new THREE.MeshStandardMaterial({
    color: '#15803D',
    metalness: 0.75,
    roughness: 0.15,
  });

  const carbonMat = new THREE.MeshStandardMaterial({ color: '#171717', roughness: 0.3, metalness: 0.6 });
  const glassMat = new THREE.MeshPhysicalMaterial({ color: '#1E293B', transmission: 0.8, opacity: 0.85, roughness: 0.1 });

  // Main 911 Flyline Body
  const bodyGeo = new THREE.BoxGeometry(1.88, 0.54, 4.25);
  const body = new THREE.Mesh(bodyGeo, paintMat);
  body.position.y = 0.54;
  car.add(body);

  // Carbon Roof with dual aerodynamic fins
  const roofGeo = new THREE.CylinderGeometry(0.68, 0.88, 2.0, 16);
  const roof = new THREE.Mesh(roofGeo, carbonMat);
  roof.rotation.x = Math.PI / 2;
  roof.position.set(0, 0.94, -0.15);
  car.add(roof);

  // Hood Aerodynamic Heat Extraction Vents (Carbon Louvers)
  const ventGeo = new THREE.BoxGeometry(0.9, 0.05, 0.7);
  const vent = new THREE.Mesh(ventGeo, carbonMat);
  vent.position.set(0, 0.76, 1.1);
  car.add(vent);

  // Front Fender Arch Louvers
  [-0.82, 0.82].forEach((x) => {
    const louverGeo = new THREE.BoxGeometry(0.25, 0.05, 0.5);
    const louver = new THREE.Mesh(louverGeo, carbonMat);
    louver.position.set(x, 0.72, 1.25);
    car.add(louver);
  });

  // Massive Swan-Neck Dual-Element GT3 RS Carbon Rear Wing
  const wingGroup = new THREE.Group();
  wingGroup.position.set(0, 1.35, -1.8);

  const mainBladeGeo = new THREE.BoxGeometry(1.85, 0.04, 0.42);
  const mainBlade = new THREE.Mesh(mainBladeGeo, carbonMat);
  wingGroup.add(mainBlade);

  // Endplates with Python Green RS accent
  [-0.93, 0.93].forEach((x) => {
    const epGeo = new THREE.BoxGeometry(0.04, 0.28, 0.48);
    const ep = new THREE.Mesh(epGeo, paintMat);
    ep.position.set(x, 0.05, 0);
    wingGroup.add(ep);
  });

  // Twin Swan-Neck Carbon Upright Mounts
  [-0.45, 0.45].forEach((x) => {
    const strutGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.65, 12);
    const strut = new THREE.Mesh(strutGeo, carbonMat);
    strut.position.set(x, -0.3, -0.05);
    strut.rotation.x = -0.2;
    wingGroup.add(strut);
  });

  car.add(wingGroup);

  // 4 Magnesium Lightweight BBS Forged Wheels (Aurum Gold)
  const wheelOffsets = [
    { x: 0.98, z: 1.35 },
    { x: -0.98, z: 1.35 },
    { x: 1.02, z: -1.35 },
    { x: -1.02, z: -1.35 },
  ];

  const rimGoldMat = new THREE.MeshStandardMaterial({ color: '#CA8A04', metalness: 0.92, roughness: 0.18 });
  const yellowCalMat = new THREE.MeshStandardMaterial({ color: '#EAB308', metalness: 0.3 }); // PCCB Yellow

  wheelOffsets.forEach((pos) => {
    const wheelGroup = new THREE.Group();
    wheelGroup.position.set(pos.x, 0.42, pos.z);

    const tireGeo = new THREE.CylinderGeometry(0.43, 0.43, 0.32, 24);
    const tireMat = new THREE.MeshStandardMaterial({ color: '#18181B', roughness: 0.9 });
    const tire = new THREE.Mesh(tireGeo, tireMat);
    tire.rotation.z = Math.PI / 2;
    wheelGroup.add(tire);

    const rimGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.33, 16);
    const rim = new THREE.Mesh(rimGeo, rimGoldMat);
    rim.rotation.z = Math.PI / 2;
    wheelGroup.add(rim);

    // Yellow Caliper
    const calGeo = new THREE.BoxGeometry(0.09, 0.22, 0.12);
    const cal = new THREE.Mesh(calGeo, yellowCalMat);
    cal.position.set(pos.x > 0 ? -0.05 : 0.05, 0.12, 0.05);
    wheelGroup.add(cal);

    car.add(wheelGroup);
  });

  return car;
}

/**
 * Creates a highly detailed 3D Store Owner / AI Clone Avatar: Marcus Vance
 * Uses organic geometries for a realistic humanoid appearance
 */
export function createOwnerAvatar(): { group: THREE.Group; headGroup: THREE.Group; tabletScreen: THREE.Mesh } {
  const avatar = new THREE.Group();
  avatar.position.set(3.4, 0, 2.3);
  avatar.rotation.y = -Math.PI / 4;

  // --- Materials ---
  const suitMat = new THREE.MeshStandardMaterial({ color: '#1A1E27', roughness: 0.55, metalness: 0.18 });
  const suitLightMat = new THREE.MeshStandardMaterial({ color: '#242830', roughness: 0.5, metalness: 0.15 });
  const shirtMat = new THREE.MeshStandardMaterial({ color: '#F0F4FA', roughness: 0.45 });
  const tieMat = new THREE.MeshStandardMaterial({ color: '#991B1B', roughness: 0.28, metalness: 0.05 });
  const skinMat = new THREE.MeshStandardMaterial({ color: '#C68642', roughness: 0.72, metalness: 0.0 });
  const skinDarkMat = new THREE.MeshStandardMaterial({ color: '#B5722F', roughness: 0.75, metalness: 0.0 });
  const hairMat = new THREE.MeshStandardMaterial({ color: '#1A0F08', roughness: 0.85 });
  const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: '#F5F5F5', roughness: 0.3 });
  const irisMat = new THREE.MeshStandardMaterial({ color: '#3B2506', roughness: 0.2 });
  const pupilMat = new THREE.MeshBasicMaterial({ color: '#050505' });
  const shoesMat = new THREE.MeshStandardMaterial({ color: '#0A0A0A', roughness: 0.18, metalness: 0.65 });
  const beltMat = new THREE.MeshStandardMaterial({ color: '#0D0D0D', roughness: 0.2, metalness: 0.7 });

  // --- FEET & SHOES ---
  [-0.115, 0.115].forEach((x) => {
    // Ankle
    const ankleGeo = new THREE.SphereGeometry(0.065, 12, 12);
    const ankle = new THREE.Mesh(ankleGeo, skinMat);
    ankle.position.set(x, 0.13, 0);
    avatar.add(ankle);
    // Shoe body
    const shoeGeo = new THREE.CapsuleGeometry(0.058, 0.18, 6, 10);
    const shoe = new THREE.Mesh(shoeGeo, shoesMat);
    shoe.rotation.x = Math.PI / 2;
    shoe.position.set(x, 0.07, 0.06);
    avatar.add(shoe);
    // Shoe toe cap
    const toeGeo = new THREE.SphereGeometry(0.065, 12, 8);
    const toe = new THREE.Mesh(toeGeo, shoesMat);
    toe.scale.set(0.9, 0.6, 1.1);
    toe.position.set(x, 0.07, 0.18);
    avatar.add(toe);
  });

  // --- LEGS ---
  [-0.115, 0.115].forEach((x) => {
    // Lower leg (calf-shin)
    const lowerLegGeo = new THREE.CapsuleGeometry(0.072, 0.45, 8, 12);
    const lowerLeg = new THREE.Mesh(lowerLegGeo, suitMat);
    lowerLeg.position.set(x, 0.42, 0);
    avatar.add(lowerLeg);
    // Knee
    const kneeGeo = new THREE.SphereGeometry(0.082, 12, 12);
    const knee = new THREE.Mesh(kneeGeo, suitMat);
    knee.position.set(x, 0.67, 0.01);
    avatar.add(knee);
    // Upper thigh
    const thighGeo = new THREE.CapsuleGeometry(0.088, 0.38, 8, 12);
    const thigh = new THREE.Mesh(thighGeo, suitMat);
    thigh.position.set(x, 0.90, 0);
    avatar.add(thigh);
  });

  // Belt
  const beltGeo = new THREE.CylinderGeometry(0.24, 0.23, 0.055, 24);
  const belt = new THREE.Mesh(beltGeo, beltMat);
  belt.position.set(0, 1.12, 0);
  avatar.add(belt);
  // Belt buckle
  const buckleGeo = new THREE.BoxGeometry(0.07, 0.055, 0.02);
  const buckleMat = new THREE.MeshStandardMaterial({ color: '#C0A060', metalness: 0.9, roughness: 0.1 });
  const buckle = new THREE.Mesh(buckleGeo, buckleMat);
  buckle.position.set(0, 1.12, 0.23);
  avatar.add(buckle);

  // --- TORSO / BLAZER ---
  // Main torso body
  const torsoGeo = new THREE.CapsuleGeometry(0.22, 0.55, 8, 16);
  const torso = new THREE.Mesh(torsoGeo, suitMat);
  torso.position.set(0, 1.24, 0);
  torso.scale.set(1.05, 1.0, 0.72);
  avatar.add(torso);

  // Chest pec volume
  [-0.09, 0.09].forEach((x) => {
    const pecGeo = new THREE.SphereGeometry(0.115, 12, 10);
    const pec = new THREE.Mesh(pecGeo, suitMat);
    pec.position.set(x, 1.28, 0.1);
    pec.scale.set(1.0, 0.7, 0.7);
    avatar.add(pec);
  });

  // Shirt front panel
  const shirtGeo = new THREE.BoxGeometry(0.145, 0.42, 0.025);
  const shirt = new THREE.Mesh(shirtGeo, shirtMat);
  shirt.position.set(0, 1.24, 0.165);
  avatar.add(shirt);

  // Tie
  const tieGeo = new THREE.BoxGeometry(0.055, 0.38, 0.018);
  const tie = new THREE.Mesh(tieGeo, tieMat);
  tie.position.set(0, 1.16, 0.175);
  avatar.add(tie);
  // Tie knot
  const tieKnotGeo = new THREE.BoxGeometry(0.062, 0.055, 0.022);
  const tieKnot = new THREE.Mesh(tieKnotGeo, tieMat);
  tieKnot.position.set(0, 1.38, 0.172);
  avatar.add(tieKnot);

  // Jacket left lapel
  const lapelGeo = new THREE.BoxGeometry(0.095, 0.32, 0.022);
  [-0.095, 0.095].forEach((x, i) => {
    const lapel = new THREE.Mesh(lapelGeo, suitLightMat);
    lapel.position.set(x, 1.32, 0.162);
    lapel.rotation.z = i === 0 ? 0.18 : -0.18;
    avatar.add(lapel);
  });

  // Jacket pocket square
  const squareGeo = new THREE.BoxGeometry(0.05, 0.038, 0.015);
  const squareMat = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.3 });
  const square = new THREE.Mesh(squareGeo, squareMat);
  square.position.set(-0.165, 1.38, 0.16);
  avatar.add(square);

  // Shoulders
  [-0.22, 0.22].forEach((x) => {
    const shoulderGeo = new THREE.SphereGeometry(0.11, 12, 10);
    const shoulder = new THREE.Mesh(shoulderGeo, suitMat);
    shoulder.position.set(x, 1.46, 0);
    shoulder.scale.set(1.0, 0.85, 0.82);
    avatar.add(shoulder);
  });

  // --- ARMS ---
  // Left arm (holding tablet)
  const armLGeo = new THREE.CapsuleGeometry(0.062, 0.42, 8, 10);
  const armL = new THREE.Mesh(armLGeo, suitMat);
  armL.position.set(-0.28, 1.18, 0.08);
  armL.rotation.x = 0.52;
  armL.rotation.z = 0.22;
  avatar.add(armL);
  // Left forearm
  const forearmLGeo = new THREE.CapsuleGeometry(0.052, 0.32, 8, 10);
  const forearmL = new THREE.Mesh(forearmLGeo, suitMat);
  forearmL.position.set(-0.22, 0.96, 0.26);
  forearmL.rotation.x = 0.7;
  forearmL.rotation.z = 0.12;
  avatar.add(forearmL);

  // Right arm
  const armRGeo = new THREE.CapsuleGeometry(0.062, 0.42, 8, 10);
  const armR = new THREE.Mesh(armRGeo, suitMat);
  armR.position.set(0.28, 1.18, 0.08);
  armR.rotation.x = 0.52;
  armR.rotation.z = -0.22;
  avatar.add(armR);
  // Right forearm
  const forearmRGeo = new THREE.CapsuleGeometry(0.052, 0.32, 8, 10);
  const forearmR = new THREE.Mesh(forearmRGeo, suitMat);
  forearmR.position.set(0.22, 0.96, 0.26);
  forearmR.rotation.x = 0.7;
  forearmR.rotation.z = -0.12;
  avatar.add(forearmR);

  // Cuff links
  [-0.195, 0.195].forEach((x, i) => {
    const cuffGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.028, 10);
    const cuffMat = new THREE.MeshStandardMaterial({ color: '#C8A020', metalness: 0.95, roughness: 0.1 });
    const cuff = new THREE.Mesh(cuffGeo, cuffMat);
    cuff.position.set(x, 0.85, 0.34);
    cuff.rotation.z = Math.PI / 2;
    avatar.add(cuff);
  });

  // --- HANDS ---
  [-0.16, 0.16].forEach((x, i) => {
    const palmGeo = new THREE.SphereGeometry(0.058, 12, 10);
    const palm = new THREE.Mesh(palmGeo, skinMat);
    palm.position.set(x, 0.8, 0.4);
    palm.scale.set(0.85, 0.6, 1.0);
    avatar.add(palm);
    // Fingers (4 visible)
    for (let f = 0; f < 4; f++) {
      const fingerGeo = new THREE.CapsuleGeometry(0.012, 0.07, 4, 6);
      const finger = new THREE.Mesh(fingerGeo, skinMat);
      const fx = x + (f - 1.5) * 0.022;
      finger.position.set(fx, 0.77, 0.46 + f * 0.002);
      finger.rotation.x = 0.4;
      avatar.add(finger);
    }
  });

  // Tablet
  const tabGeo = new THREE.BoxGeometry(0.32, 0.015, 0.22);
  const tabMat = new THREE.MeshStandardMaterial({ color: '#1A2030', metalness: 0.92, roughness: 0.18 });
  const tablet = new THREE.Mesh(tabGeo, tabMat);
  tablet.position.set(0, 0.92, 0.38);
  tablet.rotation.x = 0.42;
  avatar.add(tablet);
  // Tablet screen with glowing UI
  const screenGeo = new THREE.PlaneGeometry(0.29, 0.19);
  const screenMat = new THREE.MeshBasicMaterial({ color: '#1AABFF', side: THREE.DoubleSide });
  const screen = new THREE.Mesh(screenGeo, screenMat);
  screen.rotation.x = -Math.PI / 2 + 0.42;
  screen.position.set(0, 0.928, 0.38);
  avatar.add(screen);
  // Glowing screen edge
  const screenBorderGeo = new THREE.PlaneGeometry(0.305, 0.205);
  const screenBorderMat = new THREE.MeshBasicMaterial({ color: '#005599', side: THREE.DoubleSide });
  const screenBorder = new THREE.Mesh(screenBorderGeo, screenBorderMat);
  screenBorder.rotation.x = -Math.PI / 2 + 0.42;
  screenBorder.position.set(0, 0.925, 0.38);
  avatar.add(screenBorder);

  // --- NECK ---
  const neckGeo = new THREE.CylinderGeometry(0.065, 0.075, 0.14, 14);
  const neck = new THREE.Mesh(neckGeo, skinMat);
  neck.position.set(0, 1.55, 0);
  avatar.add(neck);
  // Collar
  const collarGeo = new THREE.CylinderGeometry(0.078, 0.082, 0.06, 16);
  const collar = new THREE.Mesh(collarGeo, shirtMat);
  collar.position.set(0, 1.535, 0);
  avatar.add(collar);

  // --- HEAD GROUP (for breathing / nodding animation) ---
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.62, 0);

  // Main skull form — ellipsoid
  const skullGeo = new THREE.SphereGeometry(0.128, 24, 20);
  const skull = new THREE.Mesh(skullGeo, skinMat);
  skull.scale.set(0.92, 1.12, 1.02);
  headGroup.add(skull);

  // Forehead brow ridge
  const browGeo = new THREE.SphereGeometry(0.09, 12, 8);
  const brow = new THREE.Mesh(browGeo, skinMat);
  brow.position.set(0, 0.07, 0.09);
  brow.scale.set(1.1, 0.45, 0.6);
  headGroup.add(brow);

  // Cheekbones (left & right)
  [-0.09, 0.09].forEach((x) => {
    const cheekGeo = new THREE.SphereGeometry(0.07, 10, 8);
    const cheek = new THREE.Mesh(cheekGeo, skinMat);
    cheek.position.set(x, 0.0, 0.1);
    cheek.scale.set(0.8, 0.55, 0.65);
    headGroup.add(cheek);
  });

  // Nose — bridge + tip
  const noseBridgeGeo = new THREE.CapsuleGeometry(0.015, 0.055, 6, 8);
  const noseBridge = new THREE.Mesh(noseBridgeGeo, skinDarkMat);
  noseBridge.position.set(0, 0.028, 0.125);
  noseBridge.rotation.x = Math.PI / 2;
  headGroup.add(noseBridge);
  // Nose tip
  const noseTipGeo = new THREE.SphereGeometry(0.028, 10, 8);
  const noseTip = new THREE.Mesh(noseTipGeo, skinMat);
  noseTip.position.set(0, -0.008, 0.148);
  noseTip.scale.set(0.9, 0.75, 0.85);
  headGroup.add(noseTip);
  // Nostrils
  [-0.025, 0.025].forEach((x) => {
    const nostrilGeo = new THREE.SphereGeometry(0.016, 8, 8);
    const nostril = new THREE.Mesh(nostrilGeo, skinDarkMat);
    nostril.position.set(x, -0.012, 0.144);
    nostril.scale.set(0.7, 0.55, 0.8);
    headGroup.add(nostril);
  });

  // Upper lip
  const upperLipGeo = new THREE.CapsuleGeometry(0.008, 0.058, 6, 8);
  const upperLip = new THREE.Mesh(upperLipGeo, skinDarkMat);
  upperLip.position.set(0, -0.042, 0.127);
  upperLip.rotation.z = Math.PI / 2;
  headGroup.add(upperLip);
  // Lower lip (fuller)
  const lowerLipGeo = new THREE.CapsuleGeometry(0.012, 0.062, 6, 8);
  const lowerLip = new THREE.Mesh(lowerLipGeo, skinDarkMat);
  lowerLip.position.set(0, -0.058, 0.126);
  lowerLip.rotation.z = Math.PI / 2;
  headGroup.add(lowerLip);

  // Chin / jaw
  const chinGeo = new THREE.SphereGeometry(0.068, 10, 8);
  const chin = new THREE.Mesh(chinGeo, skinMat);
  chin.position.set(0, -0.085, 0.062);
  chin.scale.set(0.88, 0.65, 0.88);
  headGroup.add(chin);

  // Eyes (white sclera + iris + pupil)
  [-0.055, 0.055].forEach((x) => {
    // Eye socket (slightly recessed)
    const socketGeo = new THREE.SphereGeometry(0.032, 12, 10);
    const socket = new THREE.Mesh(socketGeo, skinDarkMat);
    socket.position.set(x, 0.042, 0.118);
    socket.scale.set(1.2, 0.9, 0.8);
    headGroup.add(socket);
    // Sclera
    const scleraGeo = new THREE.SphereGeometry(0.028, 12, 10);
    const sclera = new THREE.Mesh(scleraGeo, eyeWhiteMat);
    sclera.position.set(x, 0.042, 0.123);
    sclera.scale.set(1.1, 0.82, 0.75);
    headGroup.add(sclera);
    // Iris
    const irisGeo = new THREE.CircleGeometry(0.016, 12);
    const iris = new THREE.Mesh(irisGeo, irisMat);
    iris.position.set(x, 0.042, 0.152);
    headGroup.add(iris);
    // Pupil
    const pupilGeo = new THREE.CircleGeometry(0.009, 10);
    const pupil = new THREE.Mesh(pupilGeo, pupilMat);
    pupil.position.set(x, 0.042, 0.1525);
    headGroup.add(pupil);
    // Eyelid upper
    const lidGeo = new THREE.SphereGeometry(0.03, 10, 6);
    const lid = new THREE.Mesh(lidGeo, skinMat);
    lid.position.set(x, 0.052, 0.122);
    lid.scale.set(1.2, 0.38, 0.7);
    headGroup.add(lid);
  });

  // Eyebrows
  [-0.056, 0.056].forEach((x) => {
    const browHairGeo = new THREE.CapsuleGeometry(0.006, 0.052, 4, 6);
    const browHair = new THREE.Mesh(browHairGeo, hairMat);
    browHair.position.set(x, 0.072, 0.114);
    browHair.rotation.z = x > 0 ? -0.18 : 0.18;
    browHair.rotation.x = -0.15;
    headGroup.add(browHair);
  });

  // Ears
  [-0.128, 0.128].forEach((x) => {
    const earGeo = new THREE.SphereGeometry(0.038, 12, 10);
    const ear = new THREE.Mesh(earGeo, skinMat);
    ear.position.set(x, 0.02, 0);
    ear.scale.set(0.42, 0.72, 0.58);
    headGroup.add(ear);
    // Ear inner detail
    const innerEarGeo = new THREE.SphereGeometry(0.024, 10, 8);
    const innerEar = new THREE.Mesh(innerEarGeo, skinDarkMat);
    innerEar.position.set(x > 0 ? x - 0.006 : x + 0.006, 0.02, 0);
    innerEar.scale.set(0.28, 0.52, 0.45);
    headGroup.add(innerEar);
  });

  // Styled hair — short professional cut
  const hairCapGeo = new THREE.SphereGeometry(0.132, 20, 16);
  const hairCap = new THREE.Mesh(hairCapGeo, hairMat);
  hairCap.position.set(0, 0.052, -0.015);
  hairCap.scale.set(0.94, 0.62, 1.02);
  headGroup.add(hairCap);
  // Side hair (temple coverage)
  [-0.122, 0.122].forEach((x) => {
    const sideHairGeo = new THREE.SphereGeometry(0.075, 10, 8);
    const sideHair = new THREE.Mesh(sideHairGeo, hairMat);
    sideHair.position.set(x, 0.01, -0.02);
    sideHair.scale.set(0.42, 0.72, 0.88);
    headGroup.add(sideHair);
  });
  // Hairline fade front
  const frontHairGeo = new THREE.SphereGeometry(0.12, 14, 10);
  const frontHair = new THREE.Mesh(frontHairGeo, hairMat);
  frontHair.position.set(0, 0.088, 0.065);
  frontHair.scale.set(0.9, 0.32, 0.72);
  headGroup.add(frontHair);

  avatar.add(headGroup);

  return { group: avatar, headGroup, tabletScreen: screen };
}

/**
 * Creates a highly detailed 3D Customer VIP Avatar: Alexander Wright
 * Uses CapsuleGeometry and organic ellipsoids for realistic humanoid form
 */
export function createCustomerAvatar(): THREE.Group {
  const avatar = new THREE.Group();
  avatar.position.set(-2.6, 0, 1.4);
  avatar.rotation.y = Math.PI / 3;

  // Materials
  const jacketMat = new THREE.MeshStandardMaterial({ color: '#212124', roughness: 0.48, metalness: 0.12 });
  const jacketLightMat = new THREE.MeshStandardMaterial({ color: '#2D2D31', roughness: 0.45, metalness: 0.1 });
  const pantsMat = new THREE.MeshStandardMaterial({ color: '#6B6560', roughness: 0.58 });
  const skinMat = new THREE.MeshStandardMaterial({ color: '#D4956A', roughness: 0.70, metalness: 0.0 });
  const skinDarkMat = new THREE.MeshStandardMaterial({ color: '#BA7D50', roughness: 0.74, metalness: 0.0 });
  const hairMat = new THREE.MeshStandardMaterial({ color: '#0F0B09', roughness: 0.88 });
  const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: '#F2F2F2', roughness: 0.28 });
  const irisMat = new THREE.MeshStandardMaterial({ color: '#2C4A1E', roughness: 0.25 });
  const pupilMat = new THREE.MeshBasicMaterial({ color: '#040404' });
  const sneakerMat = new THREE.MeshStandardMaterial({ color: '#E8E8E8', roughness: 0.28 });
  const sneakerSoleMat = new THREE.MeshStandardMaterial({ color: '#C0C0C0', roughness: 0.45, metalness: 0.1 });
  const sneakerAccentMat = new THREE.MeshStandardMaterial({ color: '#CC2200', roughness: 0.3 });

  // Sneakers
  [-0.108, 0.108].forEach((x) => {
    const ankleGeo = new THREE.SphereGeometry(0.06, 12, 10);
    const ankle = new THREE.Mesh(ankleGeo, skinMat);
    ankle.position.set(x, 0.12, 0);
    avatar.add(ankle);
    const sneakerGeo = new THREE.CapsuleGeometry(0.056, 0.2, 6, 10);
    const sneaker = new THREE.Mesh(sneakerGeo, sneakerMat);
    sneaker.rotation.x = Math.PI / 2;
    sneaker.position.set(x, 0.072, 0.065);
    avatar.add(sneaker);
    const soleGeo = new THREE.CapsuleGeometry(0.058, 0.2, 4, 8);
    const sole = new THREE.Mesh(soleGeo, sneakerSoleMat);
    sole.rotation.x = Math.PI / 2;
    sole.position.set(x, 0.038, 0.065);
    sole.scale.set(1.05, 0.4, 1.02);
    avatar.add(sole);
    const stripeGeo = new THREE.BoxGeometry(0.008, 0.055, 0.18);
    const stripe = new THREE.Mesh(stripeGeo, sneakerAccentMat);
    stripe.position.set(x > 0 ? x - 0.056 : x + 0.056, 0.072, 0.065);
    avatar.add(stripe);
    const toeGeo = new THREE.SphereGeometry(0.062, 12, 8);
    const toeCap = new THREE.Mesh(toeGeo, sneakerMat);
    toeCap.scale.set(0.88, 0.58, 1.08);
    toeCap.position.set(x, 0.072, 0.19);
    avatar.add(toeCap);
  });

  // Legs
  [-0.108, 0.108].forEach((x) => {
    const lLGeo = new THREE.CapsuleGeometry(0.068, 0.44, 8, 12);
    const lL = new THREE.Mesh(lLGeo, pantsMat);
    lL.position.set(x, 0.40, 0);
    avatar.add(lL);
    const kneeGeo = new THREE.SphereGeometry(0.078, 12, 10);
    const knee = new THREE.Mesh(kneeGeo, pantsMat);
    knee.position.set(x, 0.65, 0.01);
    avatar.add(knee);
    const thighGeo = new THREE.CapsuleGeometry(0.085, 0.36, 8, 12);
    const thigh = new THREE.Mesh(thighGeo, pantsMat);
    thigh.position.set(x, 0.88, 0);
    avatar.add(thigh);
  });

  // Torso
  const torsoGeo = new THREE.CapsuleGeometry(0.21, 0.50, 8, 16);
  const torso = new THREE.Mesh(torsoGeo, jacketMat);
  torso.position.set(0, 1.22, 0);
  torso.scale.set(1.04, 1.0, 0.70);
  avatar.add(torso);
  [-0.085, 0.085].forEach((x) => {
    const pecGeo = new THREE.SphereGeometry(0.11, 12, 10);
    const pec = new THREE.Mesh(pecGeo, jacketLightMat);
    pec.position.set(x, 1.26, 0.1);
    pec.scale.set(1.0, 0.68, 0.68);
    avatar.add(pec);
  });
  const zipGeo = new THREE.BoxGeometry(0.018, 0.38, 0.022);
  const zipMat = new THREE.MeshStandardMaterial({ color: '#888888', metalness: 0.8, roughness: 0.2 });
  const zip = new THREE.Mesh(zipGeo, zipMat);
  zip.position.set(0, 1.22, 0.168);
  avatar.add(zip);
  const colGeo = new THREE.BoxGeometry(0.28, 0.09, 0.025);
  const col = new THREE.Mesh(colGeo, jacketLightMat);
  col.position.set(0, 1.42, 0.16);
  col.rotation.x = -0.12;
  avatar.add(col);
  [-0.21, 0.21].forEach((x) => {
    const sGeo = new THREE.SphereGeometry(0.105, 12, 10);
    const s = new THREE.Mesh(sGeo, jacketMat);
    s.position.set(x, 1.44, 0);
    s.scale.set(1.0, 0.82, 0.80);
    avatar.add(s);
  });

  // Arms
  const armLGeo = new THREE.CapsuleGeometry(0.06, 0.40, 8, 10);
  const armL = new THREE.Mesh(armLGeo, jacketMat);
  armL.position.set(-0.26, 1.17, 0.04);
  armL.rotation.x = 0.18; armL.rotation.z = 0.28;
  avatar.add(armL);
  const forearmLGeo = new THREE.CapsuleGeometry(0.052, 0.30, 8, 10);
  const forearmL = new THREE.Mesh(forearmLGeo, jacketMat);
  forearmL.position.set(-0.30, 0.95, 0.06);
  forearmL.rotation.x = 0.25; forearmL.rotation.z = 0.1;
  avatar.add(forearmL);
  const armRGeo = new THREE.CapsuleGeometry(0.06, 0.40, 8, 10);
  const armR = new THREE.Mesh(armRGeo, jacketMat);
  armR.position.set(0.26, 1.17, 0.04);
  armR.rotation.x = 0.18; armR.rotation.z = -0.28;
  avatar.add(armR);
  const forearmRGeo = new THREE.CapsuleGeometry(0.052, 0.30, 8, 10);
  const forearmR = new THREE.Mesh(forearmRGeo, jacketMat);
  forearmR.position.set(0.30, 0.95, 0.06);
  forearmR.rotation.x = 0.25; forearmR.rotation.z = -0.1;
  avatar.add(forearmR);

  // Hands
  [-0.295, 0.295].forEach((x) => {
    const palmGeo = new THREE.SphereGeometry(0.054, 12, 10);
    const palm = new THREE.Mesh(palmGeo, skinMat);
    palm.position.set(x, 0.80, 0.10);
    palm.scale.set(0.88, 0.60, 1.0);
    avatar.add(palm);
    for (let f = 0; f < 4; f++) {
      const fGeo = new THREE.CapsuleGeometry(0.011, 0.065, 4, 6);
      const finger = new THREE.Mesh(fGeo, skinMat);
      finger.position.set(x + (f - 1.5) * 0.02, 0.77, 0.14);
      finger.rotation.x = 0.3;
      avatar.add(finger);
    }
  });

  // Neck
  const neckGeo = new THREE.CylinderGeometry(0.062, 0.072, 0.13, 14);
  const neck = new THREE.Mesh(neckGeo, skinMat);
  neck.position.set(0, 1.53, 0);
  avatar.add(neck);

  // Head group
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.615, 0);
  avatar.add(headGroup);

  const skullGeo = new THREE.SphereGeometry(0.124, 24, 20);
  const skull = new THREE.Mesh(skullGeo, skinMat);
  skull.scale.set(0.93, 1.10, 1.01);
  headGroup.add(skull);

  // Brow, cheeks
  const browRidgeGeo = new THREE.SphereGeometry(0.088, 12, 8);
  const browRidge = new THREE.Mesh(browRidgeGeo, skinMat);
  browRidge.position.set(0, 0.065, 0.088);
  browRidge.scale.set(1.1, 0.42, 0.58);
  headGroup.add(browRidge);
  [-0.088, 0.088].forEach((x) => {
    const ckGeo = new THREE.SphereGeometry(0.068, 10, 8);
    const ck = new THREE.Mesh(ckGeo, skinMat);
    ck.position.set(x, -0.002, 0.098);
    ck.scale.set(0.78, 0.52, 0.62);
    headGroup.add(ck);
  });

  // Nose
  const nBGeo = new THREE.CapsuleGeometry(0.013, 0.052, 6, 8);
  const nB = new THREE.Mesh(nBGeo, skinDarkMat);
  nB.position.set(0, 0.025, 0.122); nB.rotation.x = Math.PI / 2;
  headGroup.add(nB);
  const nTGeo = new THREE.SphereGeometry(0.025, 10, 8);
  const nT = new THREE.Mesh(nTGeo, skinMat);
  nT.position.set(0, -0.006, 0.144); nT.scale.set(0.92, 0.78, 0.88);
  headGroup.add(nT);
  [-0.022, 0.022].forEach((x) => {
    const nGeo = new THREE.SphereGeometry(0.015, 8, 8);
    const n = new THREE.Mesh(nGeo, skinDarkMat);
    n.position.set(x, -0.01, 0.14); n.scale.set(0.72, 0.55, 0.78);
    headGroup.add(n);
  });

  // Lips
  const ulGeo = new THREE.CapsuleGeometry(0.008, 0.056, 6, 8);
  const ul = new THREE.Mesh(ulGeo, skinDarkMat);
  ul.position.set(0, -0.040, 0.124); ul.rotation.z = Math.PI / 2;
  headGroup.add(ul);
  const llGeo = new THREE.CapsuleGeometry(0.011, 0.060, 6, 8);
  const ll = new THREE.Mesh(llGeo, skinDarkMat);
  ll.position.set(0, -0.056, 0.123); ll.rotation.z = Math.PI / 2;
  headGroup.add(ll);

  // Chin
  const chinGeo = new THREE.SphereGeometry(0.065, 10, 8);
  const chin = new THREE.Mesh(chinGeo, skinMat);
  chin.position.set(0, -0.082, 0.058); chin.scale.set(0.86, 0.62, 0.86);
  headGroup.add(chin);

  // Eyes
  [-0.054, 0.054].forEach((x) => {
    const sockGeo = new THREE.SphereGeometry(0.030, 12, 10);
    const sock = new THREE.Mesh(sockGeo, skinDarkMat);
    sock.position.set(x, 0.040, 0.116); sock.scale.set(1.22, 0.90, 0.82);
    headGroup.add(sock);
    const scleraGeo = new THREE.SphereGeometry(0.026, 12, 10);
    const sclera = new THREE.Mesh(scleraGeo, eyeWhiteMat);
    sclera.position.set(x, 0.040, 0.121); sclera.scale.set(1.1, 0.82, 0.75);
    headGroup.add(sclera);
    const irisGeo = new THREE.CircleGeometry(0.015, 12);
    const iris = new THREE.Mesh(irisGeo, irisMat);
    iris.position.set(x, 0.040, 0.148);
    headGroup.add(iris);
    const pupilGeo = new THREE.CircleGeometry(0.008, 10);
    const pupil = new THREE.Mesh(pupilGeo, pupilMat);
    pupil.position.set(x, 0.040, 0.1485);
    headGroup.add(pupil);
    const lidGeo = new THREE.SphereGeometry(0.028, 10, 6);
    const lid = new THREE.Mesh(lidGeo, skinMat);
    lid.position.set(x, 0.050, 0.120); lid.scale.set(1.2, 0.36, 0.68);
    headGroup.add(lid);
  });

  // Eyebrows
  [-0.054, 0.054].forEach((x) => {
    const ebGeo = new THREE.CapsuleGeometry(0.006, 0.050, 4, 6);
    const eb = new THREE.Mesh(ebGeo, hairMat);
    eb.position.set(x, 0.070, 0.112);
    eb.rotation.z = x > 0 ? -0.15 : 0.15; eb.rotation.x = -0.12;
    headGroup.add(eb);
  });

  // Ears
  [-0.124, 0.124].forEach((x) => {
    const earGeo = new THREE.SphereGeometry(0.036, 12, 10);
    const ear = new THREE.Mesh(earGeo, skinMat);
    ear.position.set(x, 0.018, 0); ear.scale.set(0.42, 0.70, 0.56);
    headGroup.add(ear);
    const iEGeo = new THREE.SphereGeometry(0.022, 10, 8);
    const iE = new THREE.Mesh(iEGeo, skinDarkMat);
    iE.position.set(x > 0 ? x - 0.005 : x + 0.005, 0.018, 0);
    iE.scale.set(0.26, 0.50, 0.42);
    headGroup.add(iE);
  });

  // Hair
  const hairCapGeo = new THREE.SphereGeometry(0.130, 20, 16);
  const hairCap = new THREE.Mesh(hairCapGeo, hairMat);
  hairCap.position.set(0, 0.055, -0.012); hairCap.scale.set(0.96, 0.65, 1.04);
  headGroup.add(hairCap);
  [-0.118, 0.118].forEach((x) => {
    const sHGeo = new THREE.SphereGeometry(0.072, 10, 8);
    const sH = new THREE.Mesh(sHGeo, hairMat);
    sH.position.set(x, 0.015, -0.018); sH.scale.set(0.40, 0.70, 0.90);
    headGroup.add(sH);
  });
  const tuftGeo = new THREE.SphereGeometry(0.115, 14, 10);
  const tuft = new THREE.Mesh(tuftGeo, hairMat);
  tuft.position.set(0.012, 0.092, 0.058); tuft.scale.set(0.88, 0.30, 0.70);
  headGroup.add(tuft);

  return avatar;
}
