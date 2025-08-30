/**
 * Performance optimization utilities
 */

// Debounce function to limit the rate of function calls
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

// Throttle function to ensure function is called at most once per interval
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(null, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Memoize function results
export function memoize<T extends (...args: any[]) => any>(
  func: T
): T {
  const cache = new Map<string, ReturnType<T>>()
  
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args)
    
    if (cache.has(key)) {
      return cache.get(key)!
    }
    
    const result = func(...args)
    cache.set(key, result)
    
    // Limit cache size to prevent memory leaks
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value
      cache.delete(firstKey)
    }
    
    return result
  }) as T
}

// Lazy load images with intersection observer
export function lazyLoadImage(
  imageUrl: string,
  callback: (url: string) => void
): IntersectionObserver | null {
  if (!('IntersectionObserver' in window)) {
    // Fallback for browsers without IntersectionObserver
    callback(imageUrl)
    return null
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback(imageUrl)
        observer.disconnect()
      }
    })
  }, {
    rootMargin: '50px'
  })
  
  return observer
}

// Optimize canvas rendering with offscreen canvas
export function createOffscreenCanvas(
  width: number,
  height: number
): HTMLCanvasElement | OffscreenCanvas {
  if ('OffscreenCanvas' in window) {
    return new OffscreenCanvas(width, height)
  }
  
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}

// Request idle callback wrapper with fallback
export function requestIdleCallbackWrapper(
  callback: () => void,
  options?: { timeout?: number }
): void {
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(callback, options)
  } else {
    // Fallback to setTimeout
    setTimeout(callback, options?.timeout || 1)
  }
}

// Image compression utility
export async function compressImage(
  dataUrl: string,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
  quality: number = 0.9
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      
      if (!ctx) {
        reject(new Error('Canvas context not available'))
        return
      }
      
      // Calculate new dimensions
      let { width, height } = img
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width *= ratio
        height *= ratio
      }
      
      canvas.width = width
      canvas.height = height
      
      // Use better image smoothing
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height)
      
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
      resolve(compressedDataUrl)
    }
    
    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }
    
    img.src = dataUrl
  })
}

// Memory management: Clean up blob URLs
export function cleanupBlobUrl(url: string): void {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}

// Performance monitoring
export class PerformanceMonitor {
  private marks: Map<string, number> = new Map()
  
  start(label: string): void {
    this.marks.set(label, performance.now())
  }
  
  end(label: string): number {
    const startTime = this.marks.get(label)
    if (!startTime) {
      console.warn(`No start mark found for label: ${label}`)
      return 0
    }
    
    const duration = performance.now() - startTime
    this.marks.delete(label)
    
    if (duration > 100) {
      console.warn(`Performance: ${label} took ${duration.toFixed(2)}ms`)
    }
    
    return duration
  }
  
  measure(label: string, callback: () => void): void {
    this.start(label)
    callback()
    this.end(label)
  }
  
  async measureAsync<T>(label: string, callback: () => Promise<T>): Promise<T> {
    this.start(label)
    const result = await callback()
    this.end(label)
    return result
  }
}