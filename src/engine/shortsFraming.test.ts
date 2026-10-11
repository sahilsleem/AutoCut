import { describe, it, expect } from 'vitest';
import {
  calculateShortsInitialCrop,
  calculateShortsZoomCrop,
  calculateShortsDragCrop,
  getShortsVideoStyle,
} from './shortsFraming';

describe('Shorts Vertical Video Framing, Zoom & Crop Suite', () => {
  describe('1. Initial / Default Automatic Framing', () => {
    it('initializes vertical 9:16 footage (1080x1920) to square crop positioned 20% down from top', () => {
      const initial = calculateShortsInitialCrop(1080, 1920, 30);

      expect(initial.crop_size).toBe(1080);
      expect(initial.crop_x).toBe(0);
      // initTop is 20% -> 0.20 * 1920 = 384
      expect(initial.crop_y).toBe(384);
      expect(initial.zoom).toBe(100);
      expect(initial.crop_left_pct).toBe(0);
      expect(initial.crop_top_pct).toBe(20);

      // Verify no blank area: crop fits strictly within 1920 height
      expect(initial.crop_y + initial.crop_size).toBeLessThanOrEqual(1920);
    });

    it('initializes horizontal 16:9 footage (1920x1080) centered horizontally', () => {
      const initial = calculateShortsInitialCrop(1920, 1080, 30);

      expect(initial.crop_size).toBe(1080);
      // Center crop: (1920 - 1080) / 2 = 420
      expect(initial.crop_x).toBe(420);
      expect(initial.crop_y).toBe(0);
      expect(initial.zoom).toBe(100);

      expect(initial.crop_x + initial.crop_size).toBeLessThanOrEqual(1920);
    });

    it('initializes square 1:1 footage (1080x1080) with full frame at 0,0', () => {
      const initial = calculateShortsInitialCrop(1080, 1080, 15);

      expect(initial.crop_size).toBe(1080);
      expect(initial.crop_x).toBe(0);
      expect(initial.crop_y).toBe(0);
      expect(initial.zoom).toBe(100);
    });
  });

  describe('2. Zoom Control & Center Preservation', () => {
    it('zooms in on vertical video and centers view around the current crop center', () => {
      const initial = calculateShortsInitialCrop(1080, 1920, 30);
      // initial: crop_size=1080, crop_x=0, crop_y=384. Center Y = 384 + 540 = 924

      // Zoom to 80%: new crop_size = 1080 * 0.8 = 864
      const zoomed = calculateShortsZoomCrop(initial, 1080, 1920, 80);

      expect(zoomed.crop_size).toBe(864);
      expect(zoomed.zoom).toBe(80);
      // Center Y was 924. New crop_y = 924 - 864/2 = 492
      expect(zoomed.crop_y).toBe(492);
      expect(zoomed.crop_x).toBe(108); // (1080 - 864) / 2 = 108
      expect(zoomed.crop_y + zoomed.crop_size).toBeLessThanOrEqual(1920);
      expect(zoomed.crop_x + zoomed.crop_size).toBeLessThanOrEqual(1080);
    });

    it('clamps zoom when current crop is near top boundary so crop_y never goes below 0', () => {
      const seg = {
        start: 0,
        end: 10,
        crop_x: 0,
        crop_y: 10, // Very near top
        crop_size: 1080,
        zoom: 100,
        crop_left_pct: 0,
        crop_top_pct: 0.5,
      };

      // Zooming out or in should never make crop_y < 0
      const zoomed = calculateShortsZoomCrop(seg, 1080, 1920, 90);
      expect(zoomed.crop_y).toBeGreaterThanOrEqual(0);
      expect(zoomed.crop_x).toBeGreaterThanOrEqual(0);
    });

    it('clamps zoom when current crop is near bottom boundary so crop_y + crop_size never exceeds height', () => {
      const seg = {
        start: 0,
        end: 10,
        crop_x: 0,
        crop_y: 840, // At bottom (840 + 1080 = 1920)
        crop_size: 1080,
        zoom: 100,
        crop_left_pct: 0,
        crop_top_pct: 43.75,
      };

      const zoomed = calculateShortsZoomCrop(seg, 1080, 1920, 60); // crop_size = 648
      expect(zoomed.crop_y + zoomed.crop_size).toBeLessThanOrEqual(1920);
      expect(zoomed.crop_x + zoomed.crop_size).toBeLessThanOrEqual(1080);
    });
  });

  describe('3. Dragging & Direct Manipulation Positioning', () => {
    it('moves video upward when user drags pointer upward (positive deltaCropY)', () => {
      const startCropY = 384;
      const cropSize = 1080;
      const boxH = 500;
      // Dragging pointer up by 50px (dy = -50): reveals lower content of video (crop_y increases)
      const result = calculateShortsDragCrop(0, startCropY, cropSize, 0, -50, 500, boxH, 1080, 1920);

      // delta = -(-50) * (1080 / 500) = 50 * 2.16 = 108
      expect(result.crop_y).toBe(384 + 108);
      expect(result.crop_y).toBeLessThanOrEqual(1920 - 1080); // <= 840
    });

    it('moves video downward when user drags pointer downward (negative deltaCropY)', () => {
      const startCropY = 384;
      const cropSize = 1080;
      const boxH = 500;
      // Dragging pointer down by 100px (dy = +100): reveals higher content of video (crop_y decreases)
      const result = calculateShortsDragCrop(0, startCropY, cropSize, 0, 100, 500, boxH, 1080, 1920);

      // delta = -(100) * (1080 / 500) = -216
      expect(result.crop_y).toBe(384 - 216);
      expect(result.crop_y).toBeGreaterThanOrEqual(0);
    });

    it('strictly clamps vertical dragging at the top boundary (crop_y = 0)', () => {
      const result = calculateShortsDragCrop(0, 50, 1080, 0, 500, 500, 500, 1080, 1920);
      expect(result.crop_y).toBe(0);
    });

    it('strictly clamps vertical dragging at the bottom boundary (crop_y = 1920 - crop_size)', () => {
      const result = calculateShortsDragCrop(0, 800, 1080, 0, -500, 500, 500, 1080, 1920);
      expect(result.crop_y).toBe(1920 - 1080); // 840
    });

    it('supports horizontal repositioning when zoomed in or on landscape footage', () => {
      // Zoomed in vertical video (cropSize = 800 on 1080 width)
      const result = calculateShortsDragCrop(100, 300, 800, 50, 0, 400, 400, 1080, 1920);
      // Dragged right (dx = 50) -> delta = -50 * (800 / 400) = -100
      expect(result.crop_x).toBe(0); // 100 - 100 = 0

      // Dragged left (dx = -100) -> delta = 100 * (800 / 400) = 200
      const result2 = calculateShortsDragCrop(100, 300, 800, -100, 0, 400, 400, 1080, 1920);
      // maxCropX = 1080 - 800 = 280
      expect(result2.crop_x).toBe(280); // min(280, 300) = 280
    });
  });

  describe('4. Preview Style & FFmpeg Export Consistency', () => {
    it('computes video element translation exactly proportional to FFmpeg crop parameters', () => {
      const origW = 1080;
      const origH = 1920;
      const cropSize = 756; // e.g. zoom = 70%
      const cropX = 150;
      const cropY = 500;

      const style = getShortsVideoStyle(origW, origH, cropSize, cropX, cropY);

      expect(style.width).toBe(`${(1080 / 756) * 100}%`);
      expect(style.height).toBe(`${(1920 / 756) * 100}%`);
      expect(style.left).toBe(`${-(150 / 756) * 100}%`);
      expect(style.top).toBe(`${-(500 / 756) * 100}%`);

      // Verify that at container (0, 0), the visible source pixel is (cropX, cropY):
      // scale = 1 / cropSize.
      // position = -cropX / cropSize.
      // Container top-left (x=0) corresponds to source pixel: (0 - (-cropX / cropSize)) / (1 / cropSize) = cropX.
      // Container bottom-right (x=1) corresponds to source pixel: (1 - (-cropX / cropSize)) / (1 / cropSize) = cropSize + cropX.
      expect(cropX + cropSize).toBeLessThanOrEqual(origW);
      expect(cropY + cropSize).toBeLessThanOrEqual(origH);
    });
  });
});
