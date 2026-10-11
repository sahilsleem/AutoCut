/**
 * In-memory cache for video thumbnails to avoid redundant extraction
 */
const thumbnailCache = new Map<string, string>();

/**
 * Captures a crisp preview picture/thumbnail from a video URL using an offscreen video & canvas.
 * Handles Android WebView nuances by ensuring muted, playsInline, crossOrigin, and seeked frame extraction.
 */
export async function captureVideoThumbnail(videoUrl: string, seekTime = 0.1): Promise<string> {
  if (!videoUrl) return '';

  if (thumbnailCache.has(videoUrl)) {
    return thumbnailCache.get(videoUrl)!;
  }

  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = 'anonymous';

    let isResolved = false;

    const cleanUp = () => {
      video.removeAttribute('src');
      video.load();
    };

    const done = (dataUrl: string) => {
      if (isResolved) return;
      isResolved = true;
      clearTimeout(timer);
      cleanUp();
      if (dataUrl) {
        thumbnailCache.set(videoUrl, dataUrl);
      }
      resolve(dataUrl);
    };

    // Timeout safety: if video fails to decode or load in 4 seconds
    const timer = setTimeout(() => {
      done('');
    }, 4000);

    const seekToFrame = () => {
      try {
        const targetTime = video.duration && video.duration > 0.3 ? Math.min(seekTime, 0.3) : 0.01;
        video.currentTime = targetTime;
      } catch {
        // Fallback
      }
    };

    video.onloadedmetadata = seekToFrame;
    video.onloadeddata = () => {
      if (video.currentTime === 0) {
        seekToFrame();
      }
    };

    video.onseeked = () => {
      try {
        const width = video.videoWidth || 320;
        const height = video.videoHeight || 180;
        const canvas = document.createElement('canvas');
        canvas.width = Math.min(width, 320);
        canvas.height = Math.round((canvas.width / width) * height) || 180;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          done(dataUrl);
          return;
        }
      } catch (err) {
        console.warn('Thumbnail drawImage failed:', err);
      }
      done('');
    };

    video.onerror = () => {
      done('');
    };

    video.src = videoUrl;
  });
}
