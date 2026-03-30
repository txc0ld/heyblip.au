"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "./ThemeProvider";

/* ─── CONFIG ─────────────────────────────────────────────── */
const MAX_NODES = 60;
const INITIAL_NODES = 6;
const SPAWN_INTERVAL = 900;
const PULSE_INTERVAL = 3500;
const PULSE_COUNT_MIN = 1;
const PULSE_COUNT_MAX = 3;
const PULSE_HEX = 0xccff00;

/* ─── THEMES ─────────────────────────────────────────────── */
const TH = {
  dark: {
    bg: 0x000000,
    node: 0xffffff,
    edge: 0xffffff,
    edgeOp: 0.12,
  },
  light: {
    bg: 0xffffff,
    node: 0x111111,
    edge: 0x000000,
    edgeOp: 0.1,
  },
};

/* ─── HELPERS ────────────────────────────────────────────── */
function irregularPos(existing: THREE.Vector3[], idx: number) {
  if (idx < INITIAL_NODES) {
    const spread = 4;
    return new THREE.Vector3(
      (Math.random() - 0.5) * spread * 2,
      (Math.random() - 0.5) * spread * 2,
      (Math.random() - 0.5) * spread * 2
    );
  }
  const parent = existing[Math.floor(Math.random() * existing.length)];
  const dir = new THREE.Vector3(
    Math.random() - 0.5,
    Math.random() - 0.5,
    Math.random() - 0.5
  ).normalize();
  const dist = 1.2 + Math.random() * 2.8;
  return parent.clone().add(dir.multiplyScalar(dist));
}

/* ─── COMPONENT ──────────────────────────────────────────── */
export default function MeshBackground() {
  const mountEl = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    graph: {
      nodes: Array<{
        pos: THREE.Vector3;
        pulse: number;
        decay: number;
        mesh: THREE.Mesh;
        fadeIn: number;
      }>;
      edges: Array<{
        mat: THREE.MeshBasicMaterial;
        fadeIn: number;
      }>;
      positions: THREE.Vector3[];
      nextId: number;
    };
  } | null>(null);
  const { resolved } = useTheme();
  const themeRef = useRef(resolved);

  useEffect(() => {
    themeRef.current = resolved;
  }, [resolved]);

  useEffect(() => {
    const el = mountEl.current;
    if (!el) return;

    let w = el.clientWidth;
    let h = el.clientHeight;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(TH[themeRef.current].bg, 0); // transparent
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(42, w / h, 0.1, 300);
    cam.position.set(0, 0, 28);

    const graph = {
      nodes: [] as Array<{
        pos: THREE.Vector3;
        pulse: number;
        decay: number;
        mesh: THREE.Mesh;
        fadeIn: number;
      }>,
      edges: [] as Array<{
        a: number;
        b: number;
        line: THREE.Mesh;
        mat: THREE.MeshBasicMaterial;
        fadeIn: number;
      }>,
      positions: [] as THREE.Vector3[],
      nextId: 0,
    };

    const geoSizes = [0.06, 0.09, 0.13, 0.18];
    const geos = geoSizes.map((r) => new THREE.SphereGeometry(r, 8, 6));
    const edgeCylGeo = new THREE.CylinderGeometry(1, 1, 1, 4, 1);

    function addNode() {
      if (graph.nodes.length >= MAX_NODES) return null;
      const id = graph.nextId++;
      const pos = irregularPos(graph.positions, id);
      const sizeIdx = Math.floor(Math.random() * geos.length);
      const tm = TH[themeRef.current];
      const mat = new THREE.MeshBasicMaterial({
        color: tm.node,
        transparent: true,
        opacity: 0,
      });
      const mesh = new THREE.Mesh(geos[sizeIdx], mat);
      mesh.position.copy(pos);
      mesh.scale.set(0.01, 0.01, 0.01);
      scene.add(mesh);

      const node = {
        pos: pos.clone(),
        pulse: 0,
        decay: 0.96,
        mesh,
        fadeIn: 0,
      };
      graph.nodes.push(node);
      graph.positions.push(pos.clone());
      return node;
    }

    function addEdge(aIdx: number, bIdx: number) {
      const a = graph.nodes[aIdx];
      const b = graph.nodes[bIdx];
      if (!a || !b) return;
      const tm = TH[themeRef.current];
      const dir = new THREE.Vector3().subVectors(b.pos, a.pos);
      const len = dir.length();
      const mid = new THREE.Vector3().addVectors(a.pos, b.pos).multiplyScalar(0.5);
      const thickness = 0.01 + Math.random() * 0.006;

      const mat = new THREE.MeshBasicMaterial({
        color: tm.edge,
        transparent: true,
        opacity: 0,
      });
      const mesh = new THREE.Mesh(edgeCylGeo, mat);
      mesh.position.copy(mid);
      mesh.scale.set(thickness, len, thickness);
      mesh.lookAt(b.pos);
      mesh.rotateX(Math.PI / 2);
      scene.add(mesh);
      graph.edges.push({ a: aIdx, b: bIdx, line: mesh, mat, fadeIn: 0 });
    }

    function connectNewNode(newIdx: number) {
      if (graph.nodes.length <= 1) return;
      const newPos = graph.nodes[newIdx].pos;
      const scored = graph.nodes
        .map((n, i) => ({ i, d: i === newIdx ? Infinity : newPos.distanceTo(n.pos) }))
        .sort((a, b) => a.d - b.d);
      const count = 1 + Math.floor(Math.random() * 2.5);
      for (let c = 0; c < Math.min(count, scored.length); c++) {
        if (scored[c].d < Infinity) addEdge(newIdx, scored[c].i);
      }
      if (Math.random() < 0.2 && graph.nodes.length > 4) {
        const rA = Math.floor(Math.random() * graph.nodes.length);
        const rB = Math.floor(Math.random() * graph.nodes.length);
        if (rA !== rB) addEdge(rA, rB);
      }
    }

    // Seed
    for (let i = 0; i < INITIAL_NODES; i++) addNode();
    for (let i = 1; i < INITIAL_NODES; i++) connectNewNode(i);

    // Glow sprites
    const glowC = document.createElement("canvas");
    glowC.width = 64;
    glowC.height = 64;
    const gc = glowC.getContext("2d")!;
    const grd = gc.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, "rgba(204,255,0,0.45)");
    grd.addColorStop(0.35, "rgba(204,255,0,0.1)");
    grd.addColorStop(1, "rgba(204,255,0,0)");
    gc.fillStyle = grd;
    gc.fillRect(0, 0, 64, 64);
    const glowTex = new THREE.CanvasTexture(glowC);

    const GLOW_POOL = 6;
    const glows: THREE.Sprite[] = [];
    for (let i = 0; i < GLOW_POOL; i++) {
      const sm = new THREE.SpriteMaterial({
        map: glowTex,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const s = new THREE.Sprite(sm);
      s.scale.set(1.4, 1.4, 1);
      s.visible = false;
      scene.add(s);
      glows.push(s);
    }

    // Slow auto-orbit
    const orb = { th: 0, ph: Math.PI / 2 };
    let lastSpawn = Date.now();
    let lastPulse = Date.now();

    sceneRef.current = { renderer, graph };

    const onResize = () => {
      w = el.clientWidth;
      h = el.clientHeight;
      renderer.setSize(w, h);
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    let raf: number;
    const pulseCol = new THREE.Color(PULSE_HEX);

    const loop = () => {
      raf = requestAnimationFrame(loop);
      const now = Date.now();
      const tm = TH[themeRef.current];

      // Gentle auto-orbit
      orb.th += 0.0004;
      const dist = cam.position.length();
      cam.position.set(
        dist * Math.sin(orb.ph) * Math.cos(orb.th),
        dist * Math.cos(orb.ph),
        dist * Math.sin(orb.ph) * Math.sin(orb.th)
      );
      cam.lookAt(0, 0, 0);

      // Spawn
      if (now - lastSpawn > SPAWN_INTERVAL && graph.nodes.length < MAX_NODES) {
        const n = addNode();
        if (n) connectNewNode(graph.nodes.length - 1);
        lastSpawn = now;
      }

      // Pulse
      if (now - lastPulse > PULSE_INTERVAL && graph.nodes.length > 2) {
        const count = PULSE_COUNT_MIN + Math.floor(Math.random() * (PULSE_COUNT_MAX - PULSE_COUNT_MIN + 1));
        for (let i = 0; i < count; i++) {
          const idx = Math.floor(Math.random() * graph.nodes.length);
          graph.nodes[idx].pulse = 1;
        }
        lastPulse = now;
      }

      // Update nodes
      const baseC = new THREE.Color(tm.node);
      let gi = 0;

      for (const n of graph.nodes) {
        const m = n.mesh;
        if (n.fadeIn < 1) {
          n.fadeIn = Math.min(1, n.fadeIn + 0.02);
          const s = n.fadeIn;
          m.scale.set(s, s, s);
          (m.material as THREE.MeshBasicMaterial).opacity = n.fadeIn * 0.85;
        }

        if (n.pulse > 0.008) {
          n.pulse *= n.decay;
          const c = baseC.clone().lerp(pulseCol, n.pulse);
          (m.material as THREE.MeshBasicMaterial).color.copy(c);
          const sc = n.fadeIn * (1 + n.pulse * 2);
          m.scale.set(sc, sc, sc);

          if (gi < GLOW_POOL && n.pulse > 0.2) {
            glows[gi].position.copy(m.position);
            glows[gi].material.opacity = n.pulse * 0.4;
            glows[gi].visible = true;
            gi++;
          }
        } else {
          n.pulse = 0;
          (m.material as THREE.MeshBasicMaterial).color.copy(baseC);
          if (n.fadeIn >= 1) {
            m.scale.set(1, 1, 1);
            (m.material as THREE.MeshBasicMaterial).opacity = 0.85;
          }
        }
      }
      for (let i = gi; i < GLOW_POOL; i++) glows[i].visible = false;

      // Fade in edges
      for (const e of graph.edges) {
        if (e.fadeIn < 1) {
          e.fadeIn = Math.min(1, e.fadeIn + 0.015);
          e.mat.opacity = e.fadeIn * tm.edgeOp;
        }
      }

      renderer.render(scene, cam);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      geos.forEach((g) => g.dispose());
      graph.nodes.forEach((n) => (n.mesh.material as THREE.Material).dispose());
      graph.edges.forEach((e) => e.mat.dispose());
      edgeCylGeo.dispose();
      glows.forEach((s) => s.material.dispose());
      glowTex.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  // Apply theme changes live
  useEffect(() => {
    const s = sceneRef.current;
    if (!s) return;
    const tm = TH[resolved];
    s.renderer.setClearColor(tm.bg, 0);
    const bc = new THREE.Color(tm.node);
    const ec = new THREE.Color(tm.edge);
    s.graph.nodes.forEach((n) => {
      if (n.pulse <= 0) (n.mesh.material as THREE.MeshBasicMaterial).color.copy(bc);
    });
    s.graph.edges.forEach((e) => {
      e.mat.color.copy(ec);
    });
  }, [resolved]);

  return (
    <div
      ref={mountEl}
      className="absolute inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.5 }}
      aria-hidden="true"
    />
  );
}
