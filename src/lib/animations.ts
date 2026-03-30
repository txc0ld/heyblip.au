// Blip animation constants — matches iOS app spring config
// iOS: stiffness: 300, damping: 24, stagger: 50ms
// CSS equivalent: cubic-bezier(0.16, 1, 0.3, 1)

export const ease = [0.16, 1, 0.3, 1] as const;

export const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5, ease },
};

export const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export const staggerSlow = {
  animate: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease },
};

export const slideInLeft = {
  initial: { opacity: 0, x: -40 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease },
};

export const slideInRight = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease },
};
