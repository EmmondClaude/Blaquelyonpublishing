"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * The reactive hero object — a spinning vinyl record (the brief's sanctioned hero
 * subject for the product-as-hero register). One coherent world: every colour here
 * is the `ej-*` ramp from tailwind.config.ts, so the 3D and the CSS are one family.
 *
 * Motion hierarchy (skill): the record is the lead and the ONE moving thing — a
 * slow idle spin with a travelling specular highlight across the grooves — plus a
 * weighted cursor-follow tilt so the page feels aware of the visitor. Frame-rate-
 * independent easing (`1 - pow(c, dt)`), zero allocations in useFrame, DPR capped.
 *
 * This module is loaded ONLY client-side via next/dynamic (ReactiveHero) — three
 * touches `window` and crashes SSR otherwise.
 */

// — The ramp, mirrored from tailwind.config.ts so the shader samples the brand —
const EJ = {
  noir: "#0A0708",
  oxblood: "#2A0C13",
  gold: "#C9A24B",
  goldBright: "#E3C16F",
  rose: "#FF4D7E",
  warm: "#FFF4E2",
};

/** Procedural vinyl grooves as a roughness map — concentric rings whose varying
 *  gloss makes the specular highlight rake across the surface as the record spins.
 *  Built once on a 2D canvas (client only). */
function useGrooveRoughnessMap() {
  return useMemo(() => {
    const size = 1024;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const c = size / 2;

    // Base gloss (mid roughness)
    ctx.fillStyle = "#787878";
    ctx.fillRect(0, 0, size, size);

    // Concentric grooves from the label edge to the rim
    const labelR = size * 0.17;
    const rimR = size * 0.5;
    for (let r = labelR; r < rimR; r += 2.2) {
      const v = 96 + Math.sin(r * 0.6) * 34; // alternating gloss
      ctx.strokeStyle = `rgb(${v | 0},${v | 0},${v | 0})`;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.arc(c, c, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Smooth glossy label area in the centre
    const grad = ctx.createRadialGradient(c, c, 0, c, c, labelR);
    grad.addColorStop(0, "#3a3a3a");
    grad.addColorStop(1, "#5a5a5a");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(c, c, labelR, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 8;
    tex.colorSpace = THREE.NoColorSpace;
    return tex;
  }, []);
}

/** Vinyl-black standard material with a fresnel rim injected — the rim rides the
 *  gold→rose ramp at grazing angles so the silhouette glows in the brand colours. */
function useVinylMaterial(roughnessMap: THREE.Texture) {
  return useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(EJ.noir),
      roughnessMap,
      roughness: 1, // multiplied by the map
      metalness: 0.42,
    });

    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uRimA = { value: new THREE.Color(EJ.goldBright) };
      shader.uniforms.uRimB = { value: new THREE.Color(EJ.rose) };
      shader.uniforms.uRimPower = { value: 2.7 };
      shader.uniforms.uRimStrength = { value: 0.85 };

      shader.fragmentShader = shader.fragmentShader
        .replace(
          "#include <common>",
          `#include <common>
           uniform vec3 uRimA;
           uniform vec3 uRimB;
           uniform float uRimPower;
           uniform float uRimStrength;`,
        )
        .replace(
          "#include <emissivemap_fragment>",
          `#include <emissivemap_fragment>
           vec3 ejEye = normalize( vViewPosition );
           float ejFres = pow( 1.0 - clamp( dot( normalize( normal ), ejEye ), 0.0, 1.0 ), uRimPower );
           totalEmissiveRadiance += mix( uRimA, uRimB, ejFres ) * ejFres * uRimStrength;`,
        );
    };
    mat.customProgramCacheKey = () => "ej-vinyl-fresnel";
    return mat;
  }, [roughnessMap]);
}

function VinylRecord() {
  const tilt = useRef<THREE.Group>(null!);
  const spin = useRef<THREE.Group>(null!);
  const pointer = useRef({ x: 0, y: 0 });

  const roughnessMap = useGrooveRoughnessMap();
  const vinylMaterial = useVinylMaterial(roughnessMap);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;

    // The record spins — the one continuous moving element.
    if (spin.current) spin.current.rotation.y += delta * 0.32;

    // Idle drift layered under the pointer so it's never dead-still, then ease
    // toward the cursor target with weighted, frame-rate-independent inertia.
    if (tilt.current) {
      const idleX = Math.sin(t * 0.3) * 0.06;
      const idleY = Math.cos(t * 0.24) * 0.05;
      const k = 1 - Math.pow(0.0016, delta);
      const targetX = pointer.current.y * 0.32 + idleX + 0.18; // slight forward lean
      const targetY = pointer.current.x * 0.4 + idleY;
      tilt.current.rotation.x += (targetX - tilt.current.rotation.x) * k;
      tilt.current.rotation.y += (targetY - tilt.current.rotation.y) * k;
    }
  });

  return (
    <group ref={tilt}>
      {/* rotation.x lays the disc to face the camera; spin.y is the record turn */}
      <group ref={spin} rotation={[Math.PI / 2, 0, 0]}>
        {/* The disc */}
        <mesh material={vinylMaterial} castShadow>
          <cylinderGeometry args={[2.5, 2.5, 0.08, 180, 1]} />
        </mesh>

        {/* Gold centre label — the Cartier signal, glowing under the rose light */}
        <mesh position={[0, 0.001, 0]}>
          <cylinderGeometry args={[0.86, 0.86, 0.092, 80]} />
          <meshStandardMaterial
            color={EJ.gold}
            emissive={EJ.gold}
            emissiveIntensity={0.12}
            metalness={0.7}
            roughness={0.34}
          />
        </mesh>

        {/* Inner label ring detail */}
        <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.83, 0.86, 80]} />
          <meshBasicMaterial color={EJ.oxblood} side={THREE.DoubleSide} />
        </mesh>

        {/* Spindle hole */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.12, 24]} />
          <meshStandardMaterial color={EJ.noir} roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.35} color={EJ.oxblood} />
      {/* Key — a single warm raking light (studio, not stage) */}
      <directionalLight position={[-3, 4, 5]} intensity={2.3} color={EJ.warm} />
      {/* The one rose-neon accent — a rim glint from the lower right */}
      <pointLight
        position={[3.6, -1.6, 2.6]}
        intensity={22}
        distance={16}
        decay={2}
        color={EJ.rose}
      />
      {/* Gold fill so the grooves and label catch metal */}
      <pointLight
        position={[2, 3, 3]}
        intensity={10}
        distance={18}
        decay={2}
        color={EJ.goldBright}
      />
    </>
  );
}

export default function VinylCanvas({
  onContextLost,
}: {
  onContextLost?: () => void;
}) {
  // Pause the render loop when the hero is off-screen or the tab is hidden.
  const [active, setActive] = useState(true);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.05 },
    );
    io.observe(el);
    const onVis = () => setActive(!document.hidden && !!el.offsetParent);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <Canvas
        aria-hidden
        frameloop={active ? "always" : "never"}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 6.6], fov: 32 }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.domElement.addEventListener(
            "webglcontextlost",
            (e) => {
              e.preventDefault();
              onContextLost?.();
            },
            { passive: false },
          );
        }}
      >
        <Lighting />
        <VinylRecord />
      </Canvas>
    </div>
  );
}
