export interface PopoverPosition {
  top: number;
  left: number;
}

export function computePopoverPosition(
  anchor: DOMRect,
  popoverSize: { w: number; h: number }
): PopoverPosition {
  let top = anchor.bottom + 12;
  let left = anchor.left + anchor.width / 2 - popoverSize.w / 2;

  // Clamp horizontal
  left = Math.max(16, Math.min(left, window.innerWidth - popoverSize.w - 16));

  // Flip above if not enough space below
  if (top + popoverSize.h > window.innerHeight - 16) {
    top = anchor.top - popoverSize.h - 12;
  }

  // Ensure not off top of screen
  top = Math.max(8, top);

  return { top, left };
}

export function computeActionButtonPosition(
  anchor: DOMRect
): { x: number; y: number } {
  const x = anchor.left + anchor.width / 2;
  const y = anchor.top - 44;

  return {
    x: Math.max(60, Math.min(x, window.innerWidth - 60)),
    y: Math.max(8, y),
  };
}
