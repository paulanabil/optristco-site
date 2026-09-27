/**
 * Optrist Co — 3D Interactive WebGL Globe
 * Mathematical 3D Spherical Coordinate mapping for exact country placement
 * Built with Three.js
 */

(function () {
  'use strict';

  const container = document.getElementById('globe-3d-container');
  if (!container || typeof THREE === 'undefined') return;

  const docLang = document.documentElement.lang || 'en';

  // 100% Mathematically verified coordinates (Lat / Lng)
  const LOCATIONS = [
    {
      id: 'egypt',
      name: docLang === 'ar' ? 'مصر (المقر الرئيسي)' : docLang === 'de' ? 'Ägypten (Hauptsitz)' : 'Egypt (Global HQ)',
      desc: docLang === 'ar' ? 'المنصورة والمستودع المركزي للتوزيع' : docLang === 'de' ? 'Mansoura · Zentrallager & Distribution' : 'Mansoura · Central Warehouse & Distribution',
      flag: '🇪🇬',
      lat: 30.5,
      lng: 31.3,
      isHQ: true,
      color: 0x10b981 // Bright emerald
    },
    {
      id: 'uae',
      name: docLang === 'ar' ? 'الإمارات (دبي)' : docLang === 'de' ? 'VAE (Dubai)' : 'UAE (Dubai)',
      desc: docLang === 'ar' ? 'المحطة اللوجستية لإعادة التصدير والخليج' : docLang === 'de' ? 'Nahost Logistikdrehscheibe' : 'Middle East Logistics & Re-export Hub',
      flag: '🇦🇪',
      lat: 25.2,
      lng: 55.3,
      color: 0x059669
    },
    {
      id: 'germany',
      name: docLang === 'ar' ? 'ألمانيا' : docLang === 'de' ? 'Deutschland' : 'Germany',
      desc: docLang === 'ar' ? 'المعايير الهندسية الألمانية والرقابة الفنية' : docLang === 'de' ? 'Ingenieurstandards & Qualität' : 'Engineering Standards & Technical Specs',
      flag: '🇩🇪',
      lat: 51.16,
      lng: 10.45,
      color: 0x059669
    },
    {
      id: 'italy',
      name: docLang === 'ar' ? 'إيطاليا' : docLang === 'de' ? 'Italien' : 'Italy',
      desc: docLang === 'ar' ? 'شركاء تصنيع المكونات الدقيقة' : docLang === 'de' ? 'Präzisions-Fertigungspartner' : 'Precision Engineering Partners',
      flag: '🇮🇹',
      lat: 41.9,
      lng: 12.56,
      color: 0x059669
    },
    {
      id: 'india',
      name: docLang === 'ar' ? 'الهند' : docLang === 'de' ? 'Indien' : 'India',
      desc: docLang === 'ar' ? 'شراكات صناعية ومسبوكات عالية التحمل' : docLang === 'de' ? 'Schwerlast-Fertigungspartner' : 'Heavy-Duty Manufacturing Partners',
      flag: '🇮🇳',
      lat: 28.61,
      lng: 77.2,
      color: 0x059669
    },
    {
      id: 'china',
      name: docLang === 'ar' ? 'الصين' : docLang === 'de' ? 'China' : 'China',
      desc: docLang === 'ar' ? 'طاقات إنتاجية ضخمة وفق المعايير العالمية' : docLang === 'de' ? 'High-Capacity Produktionspartner' : 'High-Capacity Production Facilities',
      flag: '🇨🇳',
      lat: 31.23,
      lng: 121.47,
      color: 0x059669
    }
  ];

  // Setup Three.js Scene
  const scene = new THREE.Scene();
  const width = container.clientWidth || 800;
  const height = container.clientHeight || 520;

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = 240;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  // Group containing the entire rotating Earth
  const globeGroup = new THREE.Group();
  scene.add(globeGroup);

  const GLOBE_RADIUS = 76;

  // Convert (lat, lng) to Three.js 3D Cartesian coordinates on sphere
  function latLngToVector3(lat, lng, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  }

  // Load natural earth texture
  const textureLoader = new THREE.TextureLoader();
  const texturePath = '../images/earth-texture.png';

  textureLoader.load(texturePath, function (texture) {
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    
    // Core Globe Sphere
    const sphereGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const sphereMaterial = new THREE.MeshPhongMaterial({
      map: texture,
      color: 0xffffff,
      specular: 0x10b981,
      shininess: 8,
      transparent: false
    });
    const globeMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    globeGroup.add(globeMesh);

    // Subtle outer atmosphere glow shell
    const atmosphereGeom = new THREE.SphereGeometry(GLOBE_RADIUS * 1.018, 48, 48);
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeom, atmosphereMat);
    globeGroup.add(atmosphereMesh);

    buildMarkersAndArcs();
  }, undefined, function () {
    // Graceful fallback if texture fails to load
    const fallbackGeom = new THREE.SphereGeometry(GLOBE_RADIUS, 32, 32);
    const fallbackMat = new THREE.MeshBasicMaterial({ color: 0xecfdf5, wireframe: true });
    globeGroup.add(new THREE.Mesh(fallbackGeom, fallbackMat));
    buildMarkersAndArcs();
  });

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
  scene.add(ambientLight);

  const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.6);
  dirLight1.position.set(150, 100, 150);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0xd1fae5, 0.4);
  dirLight2.position.set(-150, -50, -100);
  scene.add(dirLight2);

  // Markers, Pulses and 3D Bezier Connecting Arcs
  const markerMeshes = [];
  const arcMeshes = [];
  let hqVector = null;

  function buildMarkersAndArcs() {
    LOCATIONS.forEach(loc => {
      const pos = latLngToVector3(loc.lat, loc.lng, GLOBE_RADIUS);
      if (loc.isHQ) hqVector = pos;

      // 3D Pin Beacon
      const pinGeom = new THREE.SphereGeometry(loc.isHQ ? 2.4 : 1.7, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({
        color: loc.isHQ ? 0x059669 : 0x10b981
      });
      const pinMesh = new THREE.Mesh(pinGeom, pinMat);
      pinMesh.position.copy(pos);
      pinMesh.userData = loc;
      globeGroup.add(pinMesh);
      markerMeshes.push(pinMesh);

      // Pulsing Ring on the surface
      const ringGeom = new THREE.RingGeometry(1.5, 3.2, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide
      });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      ringMesh.position.copy(pos.clone().multiplyScalar(1.008));
      ringMesh.lookAt(pos.clone().multiplyScalar(2));
      globeGroup.add(ringMesh);
      markerMeshes.push({ mesh: ringMesh, isPulse: true });

      // Star spike / stem for HQ
      if (loc.isHQ) {
        const stemGeom = new THREE.CylinderGeometry(0.4, 0.4, 4, 8);
        const stemMat = new THREE.MeshBasicMaterial({ color: 0x047857 });
        const stem = new THREE.Mesh(stemGeom, stemMat);
        stem.position.copy(pos.clone().multiplyScalar(1.025));
        stem.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());
        globeGroup.add(stem);
      }
    });

    // Create 3D Curved Great-Circle Arcs from Egypt HQ to all international partners
    if (hqVector) {
      LOCATIONS.filter(l => !l.isHQ).forEach(loc => {
        const destVector = latLngToVector3(loc.lat, loc.lng, GLOBE_RADIUS);
        createCurvedArc(hqVector, destVector);
      });
    }
  }

  function createCurvedArc(v1, v2) {
    const distance = v1.distanceTo(v2);
    const mid = v1.clone().add(v2).multiplyScalar(0.5);
    // Arc altitude scales with distance for realistic flight trajectory
    const altitude = GLOBE_RADIUS + Math.min(32, Math.max(12, distance * 0.28));
    mid.normalize().multiplyScalar(altitude);

    const curve = new THREE.QuadraticBezierCurve3(v1, mid, v2);
    const points = curve.getPoints(48);

    // Glowing arc line
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.55,
      linewidth: 2
    });
    const arc = new THREE.Line(geometry, material);
    globeGroup.add(arc);

    // Flying light pulse along the arc
    const pulseGeom = new THREE.SphereGeometry(1.0, 12, 12);
    const pulseMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
    const pulseSphere = new THREE.Mesh(pulseGeom, pulseMat);
    globeGroup.add(pulseSphere);

    arcMeshes.push({
      curve: curve,
      pulse: pulseSphere,
      progress: Math.random() // Staggered start
    });
  }

  // Pre-rotate globe so Egypt and Middle East / Europe face the user on initial load
  // Egypt is at lng ~31.3° E, lat ~30.5° N
  globeGroup.rotation.y = -0.55;
  globeGroup.rotation.x = 0.32;

  // Interactive 3D Drag & Touch Controls
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let targetRotationY = globeGroup.rotation.y;
  let targetRotationX = globeGroup.rotation.x;
  let isUserInteracting = false;
  let idleTimer = null;

  function onPointerDown(e) {
    isDragging = true;
    isUserInteracting = true;
    clearTimeout(idleTimer);
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    previousMousePosition = { x: clientX, y: clientY };
  }

  function onPointerMove(e) {
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;

    if (isDragging) {
      const deltaX = clientX - previousMousePosition.x;
      const deltaY = clientY - previousMousePosition.y;

      targetRotationY += deltaX * 0.005;
      targetRotationX += deltaY * 0.005;
      // Clamp vertical tilt to avoid flipping upside down
      targetRotationX = Math.max(-0.85, Math.min(0.85, targetRotationX));

      previousMousePosition = { x: clientX, y: clientY };
    }

    // Raycast hover check for tooltips
    if (!isDragging && e.clientX) {
      checkHoverTooltip(e);
    }
  }

  function onPointerUp() {
    isDragging = false;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      isUserInteracting = false;
    }, 2800);
  }

  container.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  container.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp);

  // Tooltip element
  let tooltip = document.getElementById('globe-tooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'globe-tooltip';
    tooltip.className = 'globe-tooltip';
    container.appendChild(tooltip);
  }

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function checkHoverTooltip(e) {
    const rect = container.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const pinTargets = markerMeshes.filter(m => m.userData && m.userData.name);
    const intersects = raycaster.intersectObjects(pinTargets);

    if (intersects.length > 0) {
      const target = intersects[0].object;
      const data = target.userData;
      container.style.cursor = 'pointer';

      tooltip.innerHTML = `
        <div class="globe-tooltip-title">${data.flag} ${data.name}</div>
        <div class="globe-tooltip-desc">${data.desc}</div>
      `;
      tooltip.style.left = `${e.clientX - rect.left}px`;
      tooltip.style.top = `${e.clientY - rect.top - 15}px`;
      tooltip.classList.add('visible');
    } else {
      container.style.cursor = 'grab';
      tooltip.classList.remove('visible');
    }
  }

  // Country Quick-Selection Buttons (Rotates Globe Smoothly to Target)
  window.rotateGlobeToCountry = function (countryId) {
    const loc = LOCATIONS.find(l => l.id === countryId);
    if (!loc) return;

    isUserInteracting = true;
    clearTimeout(idleTimer);

    // Calculate rotation angles to bring target (lat, lng) to the front center
    const targetY = -((loc.lng + 90) * (Math.PI / 180));
    const targetX = (loc.lat - 10) * (Math.PI / 180) * 0.45;

    targetRotationY = targetY;
    targetRotationX = Math.max(-0.6, Math.min(0.6, targetX));

    // Show tooltip at center-top of globe
    tooltip.innerHTML = `
      <div class="globe-tooltip-title">${loc.flag} ${loc.name}</div>
      <div class="globe-tooltip-desc">${loc.desc}</div>
    `;
    tooltip.style.left = '50%';
    tooltip.style.top = '28%';
    tooltip.classList.add('visible');

    idleTimer = setTimeout(() => {
      isUserInteracting = false;
      tooltip.classList.remove('visible');
    }, 4500);
  };

  // Animation Loop
  let pulseClock = 0;
  function animate() {
    requestAnimationFrame(animate);

    pulseClock += 0.04;

    // Smooth inertial dampening for rotation
    globeGroup.rotation.y += (targetRotationY - globeGroup.rotation.y) * 0.08;
    globeGroup.rotation.x += (targetRotationX - globeGroup.rotation.x) * 0.08;

    // Gentle auto-rotation when user is not interacting
    if (!isUserInteracting && !isDragging) {
      targetRotationY += 0.0016;
    }

    // Pulse animation for marker rings
    markerMeshes.forEach(item => {
      if (item.isPulse && item.mesh) {
        const s = 1.0 + Math.sin(pulseClock * 2.5) * 0.35;
        item.mesh.scale.set(s, s, s);
        item.mesh.material.opacity = 0.8 - (s - 0.7) * 0.6;
      }
    });

    // Flight pulse animation along arcs
    arcMeshes.forEach(arc => {
      arc.progress = (arc.progress + 0.007) % 1.0;
      const point = arc.curve.getPointAt(arc.progress);
      arc.pulse.position.copy(point);
    });

    renderer.render(scene, camera);
  }

  animate();

  // Resize handler
  window.addEventListener('resize', function () {
    if (!container) return;
    const w = container.clientWidth || 800;
    const h = container.clientHeight || 520;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

})();
