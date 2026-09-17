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
 * Creates the 3D Store Owner / AI Clone Avatar: Marcus Vance
 */
export function createOwnerAvatar(): { group: THREE.Group; headGroup: THREE.Group; tabletScreen: THREE.Mesh } {
  const avatar = new THREE.Group();
  avatar.position.set(3.4, 0, 2.3);
  avatar.rotation.y = -Math.PI / 4; // Angled toward car & visitor

  const suitMat = new THREE.MeshStandardMaterial({ color: '#1E222A', roughness: 0.6, metalness: 0.2 });
  const shirtMat = new THREE.MeshStandardMaterial({ color: '#F1F5F9', roughness: 0.4 });
  const tieMat = new THREE.MeshStandardMaterial({ color: '#991B1B', roughness: 0.3 });
  const skinMat = new THREE.MeshStandardMaterial({ color: '#D4A373', roughness: 0.7 });
  const hairMat = new THREE.MeshStandardMaterial({ color: '#332924', roughness: 0.8 });
  const shoesMat = new THREE.MeshStandardMaterial({ color: '#0A0A0A', roughness: 0.2, metalness: 0.6 });

  // Legs & Trousers
  [-0.12, 0.12].forEach((x) => {
    const legGeo = new THREE.CylinderGeometry(0.09, 0.075, 0.88, 16);
    const leg = new THREE.Mesh(legGeo, suitMat);
    leg.position.set(x, 0.44, 0);
    avatar.add(leg);

    const shoeGeo = new THREE.BoxGeometry(0.12, 0.09, 0.24);
    const shoe = new THREE.Mesh(shoeGeo, shoesMat);
    shoe.position.set(x, 0.045, 0.05);
    avatar.add(shoe);
  });

  // Torso / Blazer
  const torsoGeo = new THREE.BoxGeometry(0.48, 0.65, 0.28);
  const torso = new THREE.Mesh(torsoGeo, suitMat);
  torso.position.y = 1.15;
  avatar.add(torso);

  // Shirt Collar & Red Lapel Tie
  const shirtGeo = new THREE.BoxGeometry(0.18, 0.35, 0.04);
  const shirt = new THREE.Mesh(shirtGeo, shirtMat);
  shirt.position.set(0, 1.25, 0.13);
  avatar.add(shirt);

  const tieGeo = new THREE.BoxGeometry(0.06, 0.4, 0.02);
  const tie = new THREE.Mesh(tieGeo, tieMat);
  tie.position.set(0, 1.18, 0.155);
  avatar.add(tie);

  // Arms & Posture (Holding digital dealership tablet)
  const armLeftGeo = new THREE.CylinderGeometry(0.065, 0.055, 0.62, 12);
  const armLeft = new THREE.Mesh(armLeftGeo, suitMat);
  armLeft.position.set(-0.3, 1.1, 0.12);
  armLeft.rotation.x = 0.55;
  armLeft.rotation.z = 0.2;
  avatar.add(armLeft);

  const armRightGeo = new THREE.CylinderGeometry(0.065, 0.055, 0.62, 12);
  const armRight = new THREE.Mesh(armRightGeo, suitMat);
  armRight.position.set(0.3, 1.1, 0.12);
  armRight.rotation.x = 0.55;
  armRight.rotation.z = -0.2;
  avatar.add(armRight);

  // Dealership iPad / Hologram Configurator Tablet in hands
  const tabGeo = new THREE.BoxGeometry(0.32, 0.015, 0.22);
  const tabMat = new THREE.MeshStandardMaterial({ color: '#1E293B', metalness: 0.9, roughness: 0.2 });
  const tablet = new THREE.Mesh(tabGeo, tabMat);
  tablet.position.set(0, 0.95, 0.35);
  tablet.rotation.x = 0.4;
  avatar.add(tablet);

  // Glowing Tablet Screen
  const screenGeo = new THREE.PlaneGeometry(0.28, 0.18);
  const screenMat = new THREE.MeshBasicMaterial({ color: '#38BDF8', side: THREE.DoubleSide });
  const screen = new THREE.Mesh(screenGeo, screenMat);
  screen.rotation.x = -Math.PI / 2 + 0.4;
  screen.position.set(0, 0.965, 0.35);
  avatar.add(screen);

  // Head Group (for subtle breathing / nodding animations)
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.58, 0);

  const headGeo = new THREE.SphereGeometry(0.125, 20, 20);
  const head = new THREE.Mesh(headGeo, skinMat);
  head.scale.set(0.9, 1.15, 1.0);
  headGroup.add(head);

  // Styled Hair
  const hairGeo = new THREE.SphereGeometry(0.13, 16, 16);
  const hair = new THREE.Mesh(hairGeo, hairMat);
  hair.position.set(0, 0.04, -0.02);
  hair.scale.set(0.95, 0.7, 1.05);
  headGroup.add(hair);

  avatar.add(headGroup);

  return { group: avatar, headGroup, tabletScreen: screen };
}

/**
 * Creates the 3D Customer VIP Avatar: Alexander Wright
 */
export function createCustomerAvatar(): THREE.Group {
  const avatar = new THREE.Group();
  avatar.position.set(-2.6, 0, 1.4);
  avatar.rotation.y = Math.PI / 3; // Gazing across driver door & front hood

  const jacketMat = new THREE.MeshStandardMaterial({ color: '#27272A', roughness: 0.5 });
  const pantsMat = new THREE.MeshStandardMaterial({ color: '#78716C', roughness: 0.6 });
  const skinMat = new THREE.MeshStandardMaterial({ color: '#E0AC69', roughness: 0.7 });
  const hairMat = new THREE.MeshStandardMaterial({ color: '#1C1917', roughness: 0.8 });
  const sneakersMat = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.3 });

  // Legs
  [-0.11, 0.11].forEach((x) => {
    const legGeo = new THREE.CylinderGeometry(0.085, 0.075, 0.88, 16);
    const leg = new THREE.Mesh(legGeo, pantsMat);
    leg.position.set(x, 0.44, 0);
    avatar.add(leg);

    const shoeGeo = new THREE.BoxGeometry(0.11, 0.08, 0.24);
    const shoe = new THREE.Mesh(shoeGeo, sneakersMat);
    shoe.position.set(x, 0.04, 0.05);
    avatar.add(shoe);
  });

  // Torso / Bomber Jacket
  const torsoGeo = new THREE.BoxGeometry(0.44, 0.62, 0.26);
  const torso = new THREE.Mesh(torsoGeo, jacketMat);
  torso.position.y = 1.14;
  avatar.add(torso);

  // Casual admiring posture (hands in pockets / inspecting vehicle)
  const armLeftGeo = new THREE.CylinderGeometry(0.06, 0.05, 0.58, 12);
  const armLeft = new THREE.Mesh(armLeftGeo, jacketMat);
  armLeft.position.set(-0.27, 1.05, 0.02);
  armLeft.rotation.z = 0.15;
  avatar.add(armLeft);

  const armRightGeo = new THREE.CylinderGeometry(0.06, 0.05, 0.58, 12);
  const armRight = new THREE.Mesh(armRightGeo, jacketMat);
  armRight.position.set(0.27, 1.05, 0.02);
  armRight.rotation.z = -0.15;
  avatar.add(armRight);

  // Head
  const headGeo = new THREE.SphereGeometry(0.12, 20, 20);
  const head = new THREE.Mesh(headGeo, skinMat);
  head.position.set(0, 1.55, 0);
  head.scale.set(0.9, 1.1, 1.0);
  avatar.add(head);

  const hairGeo = new THREE.SphereGeometry(0.125, 16, 16);
  const hair = new THREE.Mesh(hairGeo, hairMat);
  hair.position.set(0, 1.6, -0.01);
  hair.scale.set(0.92, 0.65, 1.02);
  avatar.add(hair);

  return avatar;
}
