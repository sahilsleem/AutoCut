import React from 'react';

export interface ShortsSegment {
  start: number;
  end: number;
  crop_x: number;
  crop_y: number;
  crop_size: number;
  zoom: number;
  crop_left_pct: number;
  crop_top_pct: number;
}

/**
 * Calculates default/initial crop framing when a video is loaded in ShortsEditor.
 * Preserves the default import logic while guaranteeing strict bounding.
 */
export function calculateShortsInitialCrop(w: number, h: number, dur: number): ShortsSegment {
  const maxCrop = Math.min(w, h);
  const cssW = (maxCrop / w) * 100;
  const cssH = (maxCrop / h) * 100;
  const initLeft = (100 - cssW) / 2;
  const initTop = Math.min((100 - cssH) / 2, 20);

  const maxCropX = Math.max(0, w - maxCrop);
  const maxCropY = Math.max(0, h - maxCrop);
  const cropX = Math.max(0, Math.min(maxCropX, Math.round((initLeft / 100) * w)));
  const cropY = Math.max(0, Math.min(maxCropY, Math.round((initTop / 100) * h)));

  return {
    start: 0,
    end: dur,
    crop_x: cropX,
    crop_y: cropY,
    crop_size: Math.round(maxCrop),
    zoom: 100,
    crop_left_pct: (cropX / w) * 100,
    crop_top_pct: (cropY / h) * 100,
  };
}

/**
 * Updates crop dimensions when zoom changes, keeping the view centered
 * on the current crop center and strictly clamping within video boundaries.
 */
export function calculateShortsZoomCrop(
  activeSeg: ShortsSegment,
  origW: number,
  origH: number,
  newZoom: number
): {
  crop_x: number;
  crop_y: number;
  crop_size: number;
  crop_left_pct: number;
  crop_top_pct: number;
  zoom: number;
} {
  const maxCrop = Math.min(origW, origH);
  const oldCropSize = activeSeg.crop_size || maxCrop;
  const newCropSize = Math.round(maxCrop * (newZoom / 100));

  // Center of the current crop in source video pixels
  const centerX = (activeSeg.crop_x || 0) + oldCropSize / 2;
  const centerY = (activeSeg.crop_y || 0) + oldCropSize / 2;

  // Reposition crop window so the same center remains in view
  let newCropX = Math.round(centerX - newCropSize / 2);
  let newCropY = Math.round(centerY - newCropSize / 2);

  // Clamp to valid range so no blank space is ever exposed
  const maxCropX = Math.max(0, origW - newCropSize);
  const maxCropY = Math.max(0, origH - newCropSize);

  newCropX = Math.max(0, Math.min(maxCropX, newCropX));
  newCropY = Math.max(0, Math.min(maxCropY, newCropY));

  return {
    crop_x: newCropX,
    crop_y: newCropY,
    crop_size: newCropSize,
    crop_left_pct: (newCropX / origW) * 100,
    crop_top_pct: (newCropY / origH) * 100,
    zoom: newZoom,
  };
}

/**
 * Calculates new crop coordinates based on drag distance on the preview container.
 * Clamps coordinates so the crop area remains 100% inside the source video.
 */
export function calculateShortsDragCrop(
  startCropX: number,
  startCropY: number,
  cropSize: number,
  dx: number,
  dy: number,
  boxWidth: number,
  boxHeight: number,
  origW: number,
  origH: number
): {
  crop_x: number;
  crop_y: number;
  crop_left_pct: number;
  crop_top_pct: number;
} {
  const safeBoxW = boxWidth > 0 ? boxWidth : 1;
  const safeBoxH = boxHeight > 0 ? boxHeight : 1;

  // Dragging video right (dx > 0) moves the visible frame left in footage (crop_x decreases)
  // Dragging video down (dy > 0) moves the visible frame up in footage (crop_y decreases)
  const deltaCropX = -dx * (cropSize / safeBoxW);
  const deltaCropY = -dy * (cropSize / safeBoxH);

  const maxCropX = Math.max(0, origW - cropSize);
  const maxCropY = Math.max(0, origH - cropSize);

  const newCropX = Math.max(0, Math.min(maxCropX, Math.round(startCropX + deltaCropX)));
  const newCropY = Math.max(0, Math.min(maxCropY, Math.round(startCropY + deltaCropY)));

  return {
    crop_x: newCropX,
    crop_y: newCropY,
    crop_left_pct: (newCropX / origW) * 100,
    crop_top_pct: (newCropY / origH) * 100,
  };
}

/**
 * Returns CSS properties for styling the source video element inside the square preview box.
 */
export function getShortsVideoStyle(
  origW: number,
  origH: number,
  crop_size: number,
  crop_x: number,
  crop_y: number
): React.CSSProperties {
  const size = crop_size || 1080;
  return {
    width: `${(origW / size) * 100}%`,
    height: `${(origH / size) * 100}%`,
    left: `${-(crop_x || 0) / size * 100}%`,
    top: `${-(crop_y || 0) / size * 100}%`,
  };
}
