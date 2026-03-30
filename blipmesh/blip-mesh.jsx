import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/* ─── CONFIG ──────────────────────────────────────────────────── */
const MAX_NODES = 80;
const INITIAL_NODES = 6;
const _NODE_R_BASE = 0.1;
const PULSE_HEX = 0xccff00;
const PULSE_CSS = "#ccff00";
const SPAWN_INTERVAL = 800; // ms between new node spawns
const PULSE_INTERVAL = 4000; // ms between pulse events
const PULSE_COUNT_MIN = 1;
const PULSE_COUNT_MAX = 3;

const PREFIXES = [
  "nexus",
  "cipher",
  "phantom",
  "sentinel",
  "vector",
  "cortex",
  "flux",
  "arc",
  "helix",
  "node",
  "prism",
  "qubit",
  "relay",
  "synth",
  "vertex",
  "axiom",
  "delta",
  "echo",
  "forge",
  "grid",
  "halo",
  "iris",
  "jolt",
  "lumen",
  "matrix",
  "nova",
  "orbit",
  "pulse",
  "radix",
  "sigma",
  "tensor",
  "umbra",
  "vortex",
  "warp",
  "xenon",
  "zero",
  "apex",
  "bolt",
  "crypt",
  "drift",
  "ember",
  "frost",
  "glyph",
  "hydra",
  "ion",
  "jade",
  "kilo",
  "lyra",
  "morph",
  "neon",
  "oxide",
  "quasar",
  "rune",
  "shard",
  "thorn",
  "ultra",
  "vale",
  "wraith",
  "yield",
];
const SUFFIXES = [
  "core",
  "mind",
  "link",
  "net",
  "sys",
  "ops",
  "hub",
  "lab",
  "dev",
  "run",
  "gen",
  "mod",
  "sec",
  "ai",
];

function agntName() {
  const p = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
  const s = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
  return `${p}-${s}-${String(Math.floor(Math.random() * 999)).padStart(3, "0")}.agnt`;
}

/* ─── THEMES ──────────────────────────────────────────────────── */
const TH = {
  dark: {
    bg: 0x000000,
    cssBg: "#000000",
    node: 0xffffff,
    edge: 0xffffff,
    edgeOp: 0.18,
    text: "#fff",
    textDim: "rgba(255,255,255,0.35)",
    uiBg: "rgba(255,255,255,0.04)",
    uiBdr: "rgba(255,255,255,0.08)",
    togOn: "#fff",
    togOnTxt: "#000",
    togOff: "transparent",
    togOffTxt: "rgba(255,255,255,0.3)",
  },
  light: {
    bg: 0xf5f5f5,
    cssBg: "#f5f5f5",
    node: 0x111111,
    edge: 0x000000,
    edgeOp: 0.18,
    text: "#000",
    textDim: "rgba(0,0,0,0.35)",
    uiBg: "rgba(0,0,0,0.03)",
    uiBdr: "rgba(0,0,0,0.08)",
    togOn: "#000",
    togOnTxt: "#fff",
    togOff: "transparent",
    togOffTxt: "rgba(0,0,0,0.3)",
  },
};

/* ─── IRREGULAR POSITION GENERATOR ────────────────────────────── */
function irregularPos(existing, idx) {
  // First few nodes: scattered seed positions
  if (idx < INITIAL_NODES) {
    const spread = 4;
    return new THREE.Vector3(
      (Math.random() - 0.5) * spread * 2,
      (Math.random() - 0.5) * spread * 2,
      (Math.random() - 0.5) * spread * 2,
    );
  }
  // Subsequent nodes: branch off a random existing node with jitter
  const parent = existing[Math.floor(Math.random() * existing.length)];
  const dir = new THREE.Vector3(
    Math.random() - 0.5,
    Math.random() - 0.5,
    Math.random() - 0.5,
  ).normalize();
  const dist = 1.2 + Math.random() * 2.8;
  return parent.clone().add(dir.multiplyScalar(dist));
}

/* ─── COMPONENT ───────────────────────────────────────────────── */
export default function AgntNetwork() {
  const mountEl = useRef(null);
  const sceneRef = useRef(null);
  const [theme, setTheme] = useState("dark");
  const themeRef = useRef("dark");
  const [hover, setHover] = useState(null);
  const [stats, setStats] = useState({ n: 0, e: 0, a: 0 });

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const el = mountEl.current;
    if (!el) return;

    let w = el.clientWidth,
      h = el.clientHeight;

    /* ── renderer ── */
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(TH[themeRef.current].bg);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(42, w / h, 0.1, 300);
    cam.position.set(0, 0, 28);

    /* ── live graph state ── */
    const graph = {
      nodes: [], // { id, name, size, pos: Vector3, pulse, decay, mesh, birthTime }
      edges: [], // { a, b, line }
      positions: [], // Vector3[] for branching
      nextId: 0,
    };

    /* shared geo pool — 4 sizes */
    const geoSizes = [0.07, 0.11, 0.16, 0.23];
    const geos = geoSizes.map((r) => new THREE.SphereGeometry(r, 10, 7));
    const nodeMeshes = [];

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
      mesh.userData = { idx: graph.nodes.length };
      mesh.scale.set(0.01, 0.01, 0.01);
      scene.add(mesh);

      const node = {
        id,
        name: agntName(),
        sizeIdx,
        pos: pos.clone(),
        pulse: 0,
        decay: 0.96,
        mesh,
        birthTime: Date.now(),
        fadeIn: 0,
      };
      graph.nodes.push(node);
      graph.positions.push(pos.clone());
      nodeMeshes.push(mesh);
      return node;
    }

    /* shared edge cylinder geo — unit height, will be scaled per edge */
    const edgeCylGeo = new THREE.CylinderGeometry(1, 1, 1, 4, 1);

    function addEdge(aIdx, bIdx) {
      const a = graph.nodes[aIdx];
      const b = graph.nodes[bIdx];
      if (!a || !b) return;
      const tm = TH[themeRef.current];

      const dir = new THREE.Vector3().subVectors(b.pos, a.pos);
      const len = dir.length();
      const mid = new THREE.Vector3()
        .addVectors(a.pos, b.pos)
        .multiplyScalar(0.5);
      const thickness = 0.012 + Math.random() * 0.008;

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
      graph.edges.push({
        a: aIdx,
        b: bIdx,
        line: mesh,
        mat,
        geo: null,
        birthTime: Date.now(),
        fadeIn: 0,
      });
    }

    function connectNewNode(newIdx) {
      if (graph.nodes.length <= 1) return;
      // connect to 1-3 nearest existing nodes
      const newPos = graph.nodes[newIdx].pos;
      const scored = graph.nodes
        .map((n, i) => ({
          i,
          d: i === newIdx ? Infinity : newPos.distanceTo(n.pos),
        }))
        .sort((a, b) => a.d - b.d);
      const count = 1 + Math.floor(Math.random() * 2.5);
      for (let c = 0; c < Math.min(count, scored.length); c++) {
        if (scored[c].d < Infinity) addEdge(newIdx, scored[c].i);
      }
      // occasionally add a cross-link between two random existing nodes
      if (Math.random() < 0.25 && graph.nodes.length > 4) {
        const rA = Math.floor(Math.random() * graph.nodes.length);
        const rB = Math.floor(Math.random() * graph.nodes.length);
        if (rA !== rB) addEdge(rA, rB);
      }
    }

    /* ── seed initial nodes ── */
    for (let i = 0; i < INITIAL_NODES; i++) {
      addNode();
    }
    // connect seeds
    for (let i = 1; i < INITIAL_NODES; i++) {
      connectNewNode(i);
    }

    /* ── glow sprites ── */
    const glowC = document.createElement("canvas");
    glowC.width = 64;
    glowC.height = 64;
    const gc = glowC.getContext("2d");
    const grd = gc.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, "rgba(204,255,0,0.5)");
    grd.addColorStop(0.35, "rgba(204,255,0,0.12)");
    grd.addColorStop(1, "rgba(204,255,0,0)");
    gc.fillStyle = grd;
    gc.fillRect(0, 0, 64, 64);
    const glowTex = new THREE.CanvasTexture(glowC);

    const GLOW_POOL = 8;
    const glows = [];
    for (let i = 0; i < GLOW_POOL; i++) {
      const sm = new THREE.SpriteMaterial({
        map: glowTex,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const s = new THREE.Sprite(sm);
      s.scale.set(1.6, 1.6, 1);
      s.visible = false;
      scene.add(s);
      glows.push(s);
    }

    /* ── spawn + pulse timers ── */
    let lastSpawn = Date.now();
    let lastPulse = Date.now();

    /* ── orbit controls ── */
    const orb = { th: 0, ph: Math.PI / 2, drag: false, lx: 0, ly: 0 };
    const onMD = (e) => {
      orb.drag = true;
      orb.lx = e.clientX;
      orb.ly = e.clientY;
    };
    const onMU = () => {
      orb.drag = false;
    };
    const onMM = (e) => {
      if (!orb.drag) return;
      orb.th -= (e.clientX - orb.lx) * 0.005;
      orb.ph = Math.max(
        0.3,
        Math.min(Math.PI - 0.3, orb.ph - (e.clientY - orb.ly) * 0.005),
      );
      orb.lx = e.clientX;
      orb.ly = e.clientY;
    };
    const onWH = (e) => {
      e.preventDefault();
      cam.position.multiplyScalar(e.deltaY > 0 ? 1.06 : 0.94);
    };
    el.addEventListener("mousedown", onMD);
    window.addEventListener("mouseup", onMU);
    window.addEventListener("mousemove", onMM);
    el.addEventListener("wheel", onWH, { passive: false });

    const onTS = (e) => {
      if (e.touches.length === 1) {
        orb.drag = true;
        orb.lx = e.touches[0].clientX;
        orb.ly = e.touches[0].clientY;
      }
    };
    const onTE = () => {
      orb.drag = false;
    };
    const onTMv = (e) => {
      if (!orb.drag || e.touches.length !== 1) return;
      orb.th -= (e.touches[0].clientX - orb.lx) * 0.005;
      orb.ph = Math.max(
        0.3,
        Math.min(
          Math.PI - 0.3,
          orb.ph - (e.touches[0].clientY - orb.ly) * 0.005,
        ),
      );
      orb.lx = e.touches[0].clientX;
      orb.ly = e.touches[0].clientY;
    };
    el.addEventListener("touchstart", onTS, { passive: true });
    el.addEventListener("touchend", onTE);
    el.addEventListener("touchmove", onTMv, { passive: true });

    /* ── raycaster ── */
    const ray = new THREE.Raycaster();
    const mouse = new THREE.Vector2(9999, 9999);
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    });

    /* ── resize ── */
    const onResize = () => {
      w = el.clientWidth;
      h = el.clientHeight;
      renderer.setSize(w, h);
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    sceneRef.current = { renderer, graph };

    /* ── RENDER LOOP ── */
    let raf;
    let fc = 0;
    const pulseCol = new THREE.Color(PULSE_HEX);

    const loop = () => {
      raf = requestAnimationFrame(loop);
      fc++;
      const now = Date.now();
      const tm = TH[themeRef.current];

      /* camera orbit */
      if (!orb.drag) orb.th += 0.0003;
      const dist = cam.position.length();
      cam.position.set(
        dist * Math.sin(orb.ph) * Math.cos(orb.th),
        dist * Math.cos(orb.ph),
        dist * Math.sin(orb.ph) * Math.sin(orb.th),
      );
      cam.lookAt(0, 0, 0);

      /* spawn new nodes */
      if (now - lastSpawn > SPAWN_INTERVAL && graph.nodes.length < MAX_NODES) {
        const n = addNode();
        if (n) connectNewNode(graph.nodes.length - 1);
        lastSpawn = now;
      }

      /* slow pulse: 1-3 nodes every ~4s */
      if (now - lastPulse > PULSE_INTERVAL && graph.nodes.length > 2) {
        const count =
          PULSE_COUNT_MIN +
          Math.floor(Math.random() * (PULSE_COUNT_MAX - PULSE_COUNT_MIN + 1));
        for (let i = 0; i < count; i++) {
          const idx = Math.floor(Math.random() * graph.nodes.length);
          graph.nodes[idx].pulse = 1;
        }
        lastPulse = now;
      }

      /* update nodes */
      const baseC = new THREE.Color(tm.node);
      let activeN = 0;
      let gi = 0;

      for (let i = 0; i < graph.nodes.length; i++) {
        const n = graph.nodes[i];
        const m = n.mesh;

        // fade in
        if (n.fadeIn < 1) {
          n.fadeIn = Math.min(1, n.fadeIn + 0.025);
          const s = n.fadeIn;
          m.scale.set(s, s, s);
          m.material.opacity = n.fadeIn;
        }

        if (n.pulse > 0.008) {
          n.pulse *= n.decay;
          activeN++;
          const c = baseC.clone().lerp(pulseCol, n.pulse);
          m.material.color.copy(c);
          const sc = n.fadeIn * (1 + n.pulse * 2.5);
          m.scale.set(sc, sc, sc);

          if (gi < GLOW_POOL && n.pulse > 0.2) {
            glows[gi].position.copy(m.position);
            glows[gi].material.opacity = n.pulse * 0.55;
            glows[gi].visible = true;
            gi++;
          }
        } else {
          n.pulse = 0;
          m.material.color.copy(baseC);
          if (n.fadeIn >= 1) m.scale.set(1, 1, 1);
        }
      }
      for (let i = gi; i < GLOW_POOL; i++) glows[i].visible = false;

      /* fade in edges */
      for (let i = 0; i < graph.edges.length; i++) {
        const e = graph.edges[i];
        if (e.fadeIn < 1) {
          e.fadeIn = Math.min(1, e.fadeIn + 0.02);
          e.mat.opacity = e.fadeIn * tm.edgeOp;
        }
      }

      /* raycast every 5 frames */
      if (fc % 5 === 0 && nodeMeshes.length > 0) {
        ray.setFromCamera(mouse, cam);
        const hits = ray.intersectObjects(nodeMeshes, false);
        if (hits.length > 0) {
          const idx = hits[0].object.userData.idx;
          if (idx < graph.nodes.length) setHover(graph.nodes[idx]);
        } else {
          setHover(null);
        }
      }

      /* stats every 30 frames */
      if (fc % 30 === 0) {
        setStats({ n: graph.nodes.length, e: graph.edges.length, a: activeN });
      }

      renderer.render(scene, cam);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mousedown", onMD);
      window.removeEventListener("mouseup", onMU);
      window.removeEventListener("mousemove", onMM);
      el.removeEventListener("wheel", onWH);
      el.removeEventListener("touchstart", onTS);
      el.removeEventListener("touchend", onTE);
      el.removeEventListener("touchmove", onTMv);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      geos.forEach((g) => g.dispose());
      graph.nodes.forEach((n) => n.mesh.material.dispose());
      graph.edges.forEach((e) => {
        e.mat.dispose();
      });
      edgeCylGeo.dispose();
      glows.forEach((s) => s.material.dispose());
      glowTex.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  /* ── apply theme live ── */
  useEffect(() => {
    const s = sceneRef.current;
    if (!s) return;
    const tm = TH[theme];
    s.renderer.setClearColor(tm.bg);
    const bc = new THREE.Color(tm.node);
    const ec = new THREE.Color(tm.edge);
    s.graph.nodes.forEach((n) => {
      if (n.pulse <= 0) n.mesh.material.color.copy(bc);
    });
    s.graph.edges.forEach((e) => {
      e.mat.color.copy(ec);
    });
  }, [theme]);

  const tm = TH[theme];

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        background: tm.cssBg,
        overflow: "hidden",
        cursor: "grab",
        fontFamily:
          "'SF Mono', 'Fira Code', 'JetBrains Mono', Menlo, monospace",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      <div ref={mountEl} style={{ position: "absolute", inset: 0 }} />

      {/* ── TOP LEFT: Identity ── */}
      <div style={{ position: "absolute", top: 24, left: 24, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: PULSE_CSS,
              boxShadow: "0 0 10px rgba(204,255,0,0.5)",
              animation: "dot-pulse 2.5s ease-in-out infinite",
            }}
          />
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.14em",
              color: tm.text,
              textTransform: "uppercase",
            }}
          >
            .agnt protocol
          </span>
        </div>
        <div
          style={{
            fontSize: 9,
            letterSpacing: "0.1em",
            color: tm.textDim,
            marginTop: 4,
            paddingLeft: 17,
            textTransform: "uppercase",
          }}
        >
          agent network topology · live
        </div>
      </div>

      {/* ── TOP RIGHT: Theme toggle ── */}
      <div
        style={{
          position: "absolute",
          top: 24,
          right: 24,
          zIndex: 10,
          display: "flex",
          gap: 1,
          padding: 2,
          borderRadius: 6,
          background: tm.uiBg,
          border: `1px solid ${tm.uiBdr}`,
        }}
      >
        {["dark", "light"].map((m) => (
          <button
            key={m}
            onClick={() => setTheme(m)}
            style={{
              padding: "5px 12px",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontFamily: "inherit",
              cursor: "pointer",
              border: "none",
              borderRadius: 4,
              background: theme === m ? tm.togOn : tm.togOff,
              color: theme === m ? tm.togOnTxt : tm.togOffTxt,
              transition: "all 0.2s",
            }}
          >
            {m}
          </button>
        ))}
      </div>

      {/* ── BOTTOM LEFT: Stats ── */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: 24,
          zIndex: 10,
          display: "flex",
          gap: 22,
        }}
      >
        {[
          { k: "nodes", v: stats.n },
          { k: "edges", v: stats.e },
          { k: "active", v: stats.a, glow: stats.a > 0 },
        ].map((s) => (
          <div
            key={s.k}
            style={{ display: "flex", flexDirection: "column", gap: 1 }}
          >
            <span
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: s.glow ? PULSE_CSS : tm.text,
                fontVariantNumeric: "tabular-nums",
                transition: "color 0.3s",
              }}
            >
              {s.v}
            </span>
            <span
              style={{
                fontSize: 8,
                letterSpacing: "0.14em",
                color: tm.textDim,
                textTransform: "uppercase",
              }}
            >
              {s.k}
            </span>
          </div>
        ))}
      </div>

      {/* ── BOTTOM RIGHT: Phase ── */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          right: 24,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: 7,
        }}
      >
        <div
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: stats.a > 0 ? PULSE_CSS : tm.textDim,
            transition: "background 0.3s",
          }}
        />
        <span
          style={{
            fontSize: 8,
            letterSpacing: "0.12em",
            color: tm.textDim,
            textTransform: "uppercase",
          }}
        >
          {stats.n < MAX_NODES ? "growing" : stats.a > 0 ? "pulse" : "idle"}
        </span>
      </div>

      {/* ── HOVER TOOLTIP ── */}
      {hover && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -140%)",
            zIndex: 20,
            pointerEvents: "none",
            padding: "8px 14px",
            borderRadius: 5,
            background: tm.uiBg,
            border: `1px solid ${tm.uiBdr}`,
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: PULSE_CSS,
              letterSpacing: "0.03em",
            }}
          >
            {hover.name}
          </div>
          <div
            style={{
              fontSize: 8,
              color: tm.textDim,
              letterSpacing: "0.08em",
              marginTop: 2,
            }}
          >
            id:{String(hover.id).padStart(4, "0")} · registered
          </div>
        </div>
      )}

      <style>{`
        @keyframes dot-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.65); }
        }
      `}</style>
    </div>
  );
}
