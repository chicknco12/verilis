// Shared mutable store to bridge DOM scroll/mouse -> R3F useFrame without React re-renders.
export const scrollStore = {
  progress: 0, // eased actual value used by the 3D scene
  target: 0,   // set by scroll listener
  mouseX: 0,
  mouseY: 0,
};
