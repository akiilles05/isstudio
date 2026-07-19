"use client";

import { useEffect, useRef } from "react";

type Node = {
  x: number;
  y: number;
  label: string;
  active: number;
};

const PIPELINE = ["Ügyfél", "Weboldal", "Automatizáció", "CRM", "Számlázás"];

export default function NodeGraphCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (isMobile) return;

    const styles = getComputedStyle(document.documentElement);
    const amber = styles.getPropertyValue("--color-amber").trim() || "#e8963c";
    const teal = styles.getPropertyValue("--color-teal").trim() || "#3e7c74";
    const slate = styles.getPropertyValue("--color-slate").trim() || "#8da0b5";

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      layout();
    }

    const nodes: Node[] = PIPELINE.map((label) => ({ x: 0, y: 0, label, active: 0 }));

    function layout() {
      const marginX = width * 0.1;
      const usable = width - marginX * 2;
      nodes.forEach((n, i) => {
        n.x = marginX + (usable * i) / (nodes.length - 1);
        n.y = height / 2 + Math.sin(i * 1.3) * height * 0.12;
      });
    }

    const pointer = { x: -9999, y: -9999 };
    function onPointerMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    }
    function onPointerLeave() {
      pointer.x = -9999;
      pointer.y = -9999;
    }

    let frameId = 0;
    let t = 0;
    let signalT = 0;

    function draw() {
      ctx!.clearRect(0, 0, width, height);

      // connecting line with traveling signal pulse
      ctx!.beginPath();
      ctx!.moveTo(nodes[0].x, nodes[0].y);
      for (let i = 1; i < nodes.length; i++) {
        const prev = nodes[i - 1];
        const cur = nodes[i];
        const midX = (prev.x + cur.x) / 2;
        ctx!.quadraticCurveTo(midX, prev.y, cur.x, cur.y);
      }
      ctx!.strokeStyle = slate;
      ctx!.globalAlpha = 0.35;
      ctx!.lineWidth = 1.5;
      ctx!.stroke();
      ctx!.globalAlpha = 1;

      // traveling signal dot
      if (!reduceMotion) {
        signalT += 0.006;
        if (signalT > 1) signalT = 0;
        const segCount = nodes.length - 1;
        const segF = signalT * segCount;
        const segI = Math.min(Math.floor(segF), segCount - 1);
        const localT = segF - segI;
        const a = nodes[segI];
        const b = nodes[segI + 1];
        const sx = a.x + (b.x - a.x) * localT;
        const sy = a.y + (b.y - a.y) * localT;
        ctx!.beginPath();
        ctx!.arc(sx, sy, 4, 0, Math.PI * 2);
        ctx!.fillStyle = amber;
        ctx!.shadowColor = amber;
        ctx!.shadowBlur = 12;
        ctx!.fill();
        ctx!.shadowBlur = 0;
      }

      // nodes
      nodes.forEach((n) => {
        const dx = pointer.x - n.x;
        const dy = pointer.y - n.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const proximity = Math.max(0, 1 - dist / 140);
        n.active += (proximity - n.active) * 0.15;

        const baseR = 6;
        const r = baseR + n.active * 5 + (reduceMotion ? 0 : Math.sin(t * 0.05 + n.x) * 0.6);

        ctx!.beginPath();
        ctx!.arc(n.x, n.y, r + n.active * 10, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(62, 124, 116, ${0.08 + n.active * 0.18})`;
        ctx!.fill();

        ctx!.beginPath();
        ctx!.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx!.fillStyle = n.active > 0.15 ? amber : teal;
        ctx!.fill();

        ctx!.font = "500 11px var(--font-body, sans-serif)";
        ctx!.fillStyle = slate;
        ctx!.textAlign = "center";
        ctx!.globalAlpha = 0.75 + n.active * 0.25;
        ctx!.fillText(n.label, n.x, n.y + r + 18);
        ctx!.globalAlpha = 1;
      });

      t += 1;
      frameId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerleave", onPointerLeave);
    draw();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none hidden md:block [mask-image:linear-gradient(to_right,transparent_0%,black_22%,black_100%),radial-gradient(ellipse_75%_65%_at_65%_35%,black_45%,transparent_92%)] [mask-composite:intersect] [-webkit-mask-composite:source-in]"
    >
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
