"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Abstract drifting node network + focal wireframe rendered with three.js,
 * choreographed with GSAP (intro dolly, scroll-linked parallax, cursor
 * repulsion). Colors are read from CSS custom properties so it follows the
 * site's light/dark theme without a separate config.
 */
export default function HeroScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const styles = getComputedStyle(document.documentElement);
    const accentColor = new THREE.Color(styles.getPropertyValue("--color-accent").trim() || "#2e8cb2");
    const navyColor = new THREE.Color(styles.getPropertyValue("--color-navy").trim() || "#0d3b66");

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      45,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, reduceMotion ? 13 : 21);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // --- Node cloud -------------------------------------------------------
    const NODE_COUNT = 130;
    const RADIUS_X = 9;
    const RADIUS_Y = 6;
    const RADIUS_Z = 5;

    const positions = new Float32Array(NODE_COUNT * 3);
    const basePositions = new Float32Array(NODE_COUNT * 3);
    const speeds = new Float32Array(NODE_COUNT);

    for (let i = 0; i < NODE_COUNT; i++) {
      const x = (Math.random() * 2 - 1) * RADIUS_X;
      const y = (Math.random() * 2 - 1) * RADIUS_Y;
      const z = (Math.random() * 2 - 1) * RADIUS_Z;
      positions.set([x, y, z], i * 3);
      basePositions.set([x, y, z], i * 3);
      speeds[i] = 0.15 + Math.random() * 0.35;
    }

    const nodeGeometry = new THREE.BufferGeometry();
    nodeGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const nodeMaterial = new THREE.PointsMaterial({
      color: accentColor,
      size: 0.065,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(nodeGeometry, nodeMaterial);
    scene.add(points);

    // --- Connecting lines (nearest-neighbour graph) ------------------------
    const MAX_LINK_DIST = 2.4;
    const MAX_LINKS = NODE_COUNT * 3;
    const linePositions = new Float32Array(MAX_LINKS * 2 * 3);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute("position", new THREE.BufferAttribute(linePositions, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      color: navyColor,
      transparent: true,
      opacity: 0.12,
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);

    function updateLinks() {
      let linkIndex = 0;
      for (let i = 0; i < NODE_COUNT && linkIndex < MAX_LINKS; i++) {
        const ix = i * 3;
        for (let j = i + 1; j < NODE_COUNT && linkIndex < MAX_LINKS; j++) {
          const jx = j * 3;
          const dx = positions[ix] - positions[jx];
          const dy = positions[ix + 1] - positions[jx + 1];
          const dz = positions[ix + 2] - positions[jx + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (dist < MAX_LINK_DIST) {
            const base = linkIndex * 6;
            linePositions[base] = positions[ix];
            linePositions[base + 1] = positions[ix + 1];
            linePositions[base + 2] = positions[ix + 2];
            linePositions[base + 3] = positions[jx];
            linePositions[base + 4] = positions[jx + 1];
            linePositions[base + 5] = positions[jx + 2];
            linkIndex++;
          }
        }
      }
      lineGeometry.setDrawRange(0, linkIndex * 2);
      lineGeometry.attributes.position.needsUpdate = true;
    }

    updateLinks();

    // --- Focal wireframe icosahedron --------------------------------------
    const icoGeometry = new THREE.IcosahedronGeometry(2.4, 1);
    const icoEdges = new THREE.EdgesGeometry(icoGeometry);
    const icoMaterial = new THREE.LineBasicMaterial({
      color: accentColor,
      transparent: true,
      opacity: 0.35,
    });
    const icosahedron = new THREE.LineSegments(icoEdges, icoMaterial);
    icosahedron.scale.setScalar(reduceMotion ? 1 : 0);
    scene.add(icosahedron);

    const icoInnerMaterial = new THREE.MeshBasicMaterial({
      color: navyColor,
      transparent: true,
      opacity: 0.04,
      side: THREE.DoubleSide,
    });
    const icosahedronFill = new THREE.Mesh(icoGeometry, icoInnerMaterial);
    icosahedronFill.scale.setScalar(reduceMotion ? 1 : 0);
    scene.add(icosahedronFill);

    // --- Intro choreography (GSAP) -----------------------------------------
    const introTl = gsap.timeline({ delay: 0.15 });
    if (!reduceMotion) {
      introTl
        .to(camera.position, { z: 13, duration: 2.4, ease: "power3.out" }, 0)
        .to(
          [icosahedron.scale, icosahedronFill.scale],
          { x: 1, y: 1, z: 1, duration: 1.6, ease: "elastic.out(1, 0.65)" },
          0.2
        )
        .fromTo(
          nodeMaterial,
          { opacity: 0 },
          { opacity: 0.85, duration: 1.4, ease: "power2.out" },
          0
        )
        .fromTo(lineMaterial, { opacity: 0 }, { opacity: 0.12, duration: 1.6, ease: "power2.out" }, 0.1);
    }

    // --- Scroll-linked parallax (GSAP ScrollTrigger) ------------------------
    // Created only after the intro dolly finishes so the two don't fight
    // over camera.position.z.
    let scrollTrigger: ScrollTrigger | null = null;
    function setupScrollTrigger() {
      scrollTrigger = ScrollTrigger.create({
        trigger: mount,
        start: "top top",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          camera.position.z = 13 + p * 6;
          camera.position.y = p * -1.5;
          scene.rotation.y = p * 0.35;
          renderer.domElement.style.opacity = String(1 - p * 0.9);
        },
      });
    }
    if (!reduceMotion) {
      introTl.eventCallback("onComplete", setupScrollTrigger);
    }

    // --- Mouse parallax + cursor repulsion ---------------------------------
    const pointer = { x: 0, y: 0 };
    const targetRotation = { x: 0, y: 0 };
    const ndc = new THREE.Vector2(10, 10);

    function onPointerMove(e: PointerEvent) {
      const rect = mount!.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      targetRotation.y = pointer.x * 0.25;
      targetRotation.x = pointer.y * 0.12;
      ndc.set(pointer.x, -pointer.y);
    }
    window.addEventListener("pointermove", onPointerMove);
    function onPointerLeave() {
      ndc.set(10, 10);
    }
    window.addEventListener("pointerleave", onPointerLeave);

    // --- Resize --------------------------------------------------------
    function onResize() {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    }
    window.addEventListener("resize", onResize);

    // --- Animation loop --------------------------------------------------
    let frameId = 0;
    const clock = new THREE.Clock();
    let linkRefreshAccum = 0;
    const projected = new THREE.Vector3();

    function animate() {
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const dt = clock.getDelta();

      if (!reduceMotion) {
        for (let i = 0; i < NODE_COUNT; i++) {
          const ix = i * 3;
          let px = basePositions[ix] + Math.cos(elapsed * speeds[i] * 0.6 + i) * 0.25;
          let py = basePositions[ix + 1] + Math.sin(elapsed * speeds[i] + i) * 0.35;
          const pz = basePositions[ix + 2];

          projected.set(px, py, pz).project(camera);
          const dx = projected.x - ndc.x;
          const dy = projected.y - ndc.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 0.045) {
            const dist = Math.sqrt(distSq) || 0.001;
            const push = (0.045 - distSq) * 9;
            px += (dx / dist) * push;
            py += (dy / dist) * push;
          }

          positions[ix] = px;
          positions[ix + 1] = py;
        }
        nodeGeometry.attributes.position.needsUpdate = true;

        linkRefreshAccum += dt;
        if (linkRefreshAccum > 0.15) {
          updateLinks();
          linkRefreshAccum = 0;
        }

        points.rotation.y += (targetRotation.y - points.rotation.y) * 0.02;
        points.rotation.x += (targetRotation.x - points.rotation.x) * 0.02;
        lines.rotation.y = points.rotation.y;
        lines.rotation.x = points.rotation.x;

        icosahedron.rotation.y = elapsed * 0.08;
        icosahedron.rotation.x = elapsed * 0.05;
        icosahedronFill.rotation.copy(icosahedron.rotation);
      }

      renderer.render(scene, camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      introTl.kill();
      scrollTrigger?.kill();
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", onResize);
      nodeGeometry.dispose();
      lineGeometry.dispose();
      nodeMaterial.dispose();
      lineMaterial.dispose();
      icoGeometry.dispose();
      icoEdges.dispose();
      icoMaterial.dispose();
      icoInnerMaterial.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(ellipse_75%_65%_at_65%_35%,black_45%,transparent_90%)]"
    />
  );
}
