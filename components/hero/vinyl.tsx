"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Shared vinyl record — ONE object, rendered two ways. The reactive hero (pointer +
 * idle drift) and the pinned scroll beat (scroll-driven camera + reveal) both mount
 * the SAME geometry, material, and lighting from `VinylMesh` / `Lighting`. Coherence
 * is the premium signal: it's the same record, shown from a new angle in each scene.
 *
 * Every colour is the `ej-*` ramp from tailwind.config.ts so the 3D and the CSS are
 * one family. Client-only — three touches `window`.
 */

export const EJ = {
  noir: "#0A0708",
  oxblood: "#2A0C13",
  gold: "#C9A24B",
  goldBright: "#E3C16F",
  rose: "#FF4D7E",
  warm: "#FFF4E2",
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Procedural vinyl grooves as a roughness map — concentric rings whose varying
 *  gloss makes the specular highlight rake across the surface as the record spins. */
function useGrooveRoughnessMap() {
  return useMemo(() => {
    const size = 1024;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const c = size / 2;

    ctx.fillStyle = "#787878";
    ctx.fillRect(0, 0, size, size);

    const labelR = size * 0.17;
    const rimR = size * 0.5;
    for (let r = labelR; r < rimR; r += 2.2) {
      const v = 96 + Math.sin(r * 0.6) * 34;
      ctx.strokeStyle = `rgb(${v | 0},${v | 0},${v | 0})`;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.arc(c, c, r, 0, Math.PI * 2);
      ctx.stroke();
    }

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
      roughness: 1,
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

/** The record geometry. `tiltRef` orients the whole disc; `spinRef` turns it in its
 *  own plane (the record spin). Controllers attach the useFrame that writes them. */
export function VinylMesh({
  tiltRef,
  spinRef,
}: {
  tiltRef: React.RefObject<THREE.Group>;
  spinRef: React.RefObject<THREE.Group>;
}) {
  const roughnessMap = useGrooveRoughnessMap();
  const vinylMaterial = useVinylMaterial(roughnessMap);

  return (
    <group ref={tiltRef}>
      <group ref={spinRef} rotation={[Math.PI / 2, 0, 0]}>
        <mesh material={vinylMaterial}>
          <cylinderGeometry args={[2.5, 2.5, 0.08, 180, 1]} />
        </mesh>

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

        <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.83, 0.86, 80]} />
          <meshBasicMaterial color={EJ.oxblood} side={THREE.DoubleSide} />
        </mesh>

        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.12, 24]} />
          <meshStandardMaterial color={EJ.noir} roughness={0.6} />
        </mesh>
      </group>
    </group>
  );
}

/** The studio rig — one warm raking key, a rose-neon rim accent, a gold fill.
 *  `roseRef` is exposed so the scroll beat can ramp the rose intensity on reveal. */
export function Lighting({
  roseRef,
}: {
  roseRef?: React.RefObject<THREE.PointLight>;
}) {
  return (
    <>
      <ambientLight intensity={0.35} color={EJ.oxblood} />
      <directionalLight position={[-3, 4, 5]} intensity={2.3} color={EJ.warm} />
      <pointLight
        ref={roseRef}
        position={[3.6, -1.6, 2.6]}
        intensity={22}
        distance={16}
        decay={2}
        color={EJ.rose}
      />
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

/** Hero controller — cursor-follow tilt with weighted inertia + idle drift. */
export function ReactiveVinyl() {
  const tilt = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

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
    if (spin.current) spin.current.rotation.y += delta * 0.32;
    if (tilt.current) {
      const idleX = Math.sin(t * 0.3) * 0.06;
      const idleY = Math.cos(t * 0.24) * 0.05;
      const k = 1 - Math.pow(0.0016, delta);
      const targetX = pointer.current.y * 0.32 + idleX + 0.18;
      const targetY = pointer.current.x * 0.4 + idleY;
      tilt.current.rotation.x += (targetX - tilt.current.rotation.x) * k;
      tilt.current.rotation.y += (targetY - tilt.current.rotation.y) * k;
    }
  });

  return <VinylMesh tiltRef={tilt} spinRef={spin} />;
}

export type ScrollProgress = { progress: number };

/** Scroll-beat controller — reads a neutral progress ref (written by GSAP
 *  ScrollTrigger) and is the SOLE writer of the record transform + camera + rose
 *  light, lerping toward the scroll-derived targets so the scrub feels weighted. */
export function ScrollVinyl({
  progressRef,
  roseRef,
}: {
  progressRef: React.MutableRefObject<ScrollProgress>;
  roseRef: React.RefObject<THREE.PointLight>;
}) {
  const tilt = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const smoothed = useRef(0);
  const { camera } = useThree();

  useFrame((_, delta) => {
    // Ease the raw scroll progress so the beat decelerates into each chapter.
    const target = progressRef.current.progress;
    const k = 1 - Math.pow(0.0009, delta);
    smoothed.current += (target - smoothed.current) * k;
    const p = smoothed.current;
    const e = easeOut(Math.min(1, p));

    if (spin.current) spin.current.rotation.y += delta * 0.34;

    if (tilt.current) {
      // Chapter 1→4: from edge-on silhouette to a settled three-quarter hero pose.
      tilt.current.rotation.x = lerp(Math.PI * 0.46, 0.16, e);
      tilt.current.rotation.y = Math.sin(p * Math.PI) * 0.22;
    }

    // Camera flies in as the journey progresses (scroll-as-camera).
    camera.position.z = lerp(9.2, 3.6, e);
    camera.position.y = lerp(1.4, 0, e);
    camera.lookAt(0, 0, 0);

    // The rose-neon accent ramps up — the record "lights up" on the reveal.
    if (roseRef.current) roseRef.current.intensity = lerp(3, 28, e);
  });

  return <VinylMesh tiltRef={tilt} spinRef={spin} />;
}
