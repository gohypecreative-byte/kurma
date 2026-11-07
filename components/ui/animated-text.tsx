"use client";

import React, { ElementType, ReactNode } from "react";
import { motion, useReducedMotion, type Transition } from "motion/react";
import { cn } from "@/lib/utils";

interface AnimatedTextProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  delay?: number;
  duration?: number;
  yOffset?: number;
  once?: boolean;
}

const LUXURY_EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Standard smooth reveal for blocks of text, paragraphs, and subtitles.
 * Fades in gently and drifts upward into position as it enters viewport.
 */
export function AnimatedText({
  children,
  className,
  as: Component = "div",
  delay = 0,
  duration = 0.85,
  yOffset = 22,
  once = true,
}: AnimatedTextProps) {
  const shouldReduceMotion = useReducedMotion();
  const MotionTag = motion.create(Component as keyof React.JSX.IntrinsicElements);

  if (shouldReduceMotion) {
    return <Component className={className}>{children}</Component>;
  }

  return (
    <MotionTag
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-50px" }}
      transition={{
        duration,
        delay,
        ease: LUXURY_EASE,
      }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

interface AnimatedWordsProps {
  text: string;
  className?: string;
  as?: ElementType;
  delay?: number;
  stagger?: number;
  once?: boolean;
}

/**
 * Splits plain text string into words and staggers their upward reveal.
 * Exceptional for editorial headings and luxury typography.
 */
export function AnimatedWords({
  text,
  className,
  as: Component = "h2",
  delay = 0,
  stagger = 0.045,
  once = true,
}: AnimatedWordsProps) {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(" ");
  const MotionTag = motion.create(Component as keyof React.JSX.IntrinsicElements);

  if (shouldReduceMotion) {
    return <Component className={className}>{text}</Component>;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: LUXURY_EASE,
      },
    },
  };

  return (
    <MotionTag
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-40px" }}
      className={cn("inline-flex flex-wrap gap-x-[0.28em] gap-y-1", className)}
    >
      {words.map((word, i) => (
        <motion.span key={i} variants={wordVariants} className="inline-block">
          {word}
        </motion.span>
      ))}
    </MotionTag>
  );
}

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
}

/**
 * Container that sequentially staggers its child `<StaggerItem>` elements.
 */
export function StaggerContainer({
  children,
  className,
  delay = 0,
  stagger = 0.12,
  once = true,
}: StaggerContainerProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-40px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: stagger,
            delayChildren: delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  yOffset?: number;
}

export function StaggerItem({
  children,
  className,
  yOffset = 20,
}: StaggerItemProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: yOffset },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.75,
            ease: LUXURY_EASE,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

