"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

/**
 * CustomCursor - Seguidor de cursor de alta precisão
 * 
 * Regras de Design Legal-Tech (Manual v1.1):
 * - Discreto, elegante, sem efeitos circenses ou neon exagerado
 * - Ponto central de mira e anel sutil com amortecimento elástico (spring physics: damping 28, stiffness 320)
 * - Expande sutilmente em elementos clicáveis (botões, links, inputs)
 * - Desativa automaticamente em dispositivos touch/móveis (pointer: coarse)
 * - pointer-events: none garantido para não interceptar cliques
 */
export const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // Física de mola suave com Framer Motion
  const springConfig = { damping: 28, stiffness: 320, mass: 0.5 };
  const cursorX = useSpring(-100, springConfig);
  const cursorY = useSpring(-100, springConfig);

  useEffect(() => {
    // Não renderiza em dispositivos touch
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      if (!isVisible) setIsVisible(true);

      // Detecta se o elemento sob o mouse é clicável
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = Boolean(
          target.closest("button") ||
          target.closest("a") ||
          target.closest("input") ||
          target.closest("select") ||
          target.closest("textarea") ||
          target.closest("[role='button']") ||
          window.getComputedStyle(target).cursor === "pointer"
        );
        setIsPointer(isClickable);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden transition-opacity duration-300">
      {/* Anel Externo Suave com Spring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-[var(--brand)] pointer-events-none"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isClicking ? 36 : isPointer ? 44 : 28,
          height: isClicking ? 36 : isPointer ? 44 : 28,
          backgroundColor: isPointer ? "rgba(39, 64, 240, 0.08)" : "transparent",
          borderColor: isPointer ? "var(--brand)" : "rgba(39, 64, 240, 0.45)",
          scale: isClicking ? 0.9 : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      />

      {/* Ponto Central de Precisão */}
      <motion.div
        className="fixed top-0 left-0 rounded-full bg-[var(--brand)] pointer-events-none shadow-xs"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isClicking ? 6 : isPointer ? 8 : 5,
          height: isClicking ? 6 : isPointer ? 8 : 5,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ duration: 0.15 }}
      />
    </div>
  );
};
