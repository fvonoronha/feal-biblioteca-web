"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
    children: ReactNode;
    delay?: number;
    direction?: "up" | "left" | "right" | "none";
    w?: string;
}

const OFFSET_IN_PX = 28;

const directionOffsets: Record<NonNullable<Props["direction"]>, { x: number; y: number }> = {
    up: { x: 0, y: OFFSET_IN_PX },
    left: { x: -OFFSET_IN_PX, y: 0 },
    right: { x: OFFSET_IN_PX, y: 0 },
    none: { x: 0, y: 0 }
};

/**
 * Revela o conteúdo com um fade + leve deslocamento assim que ele entra na viewport (uma vez
 * só, `viewport={{ once: true }}`) - usado nas seções da página /sobre pra dar aquela sensação
 * de página "viva" ao rolar, sem exigir que cada seção implemente sua própria lógica de
 * IntersectionObserver.
 */
export default function FadeInSection({ children, delay = 0, direction = "up", w }: Props) {
    const offset = directionOffsets[direction];

    return (
        <motion.div
            initial={{ opacity: 0, x: offset.x, y: offset.y }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
            style={{ width: w }}
        >
            {children}
        </motion.div>
    );
}
