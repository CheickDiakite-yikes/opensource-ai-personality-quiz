
import * as React from "react"

// Define breakpoints according to common device sizes
export const BREAKPOINTS = {
  MOBILE: 640,      // Small smartphones
  TABLET: 768,      // Tablets and large smartphones
  DESKTOP: 1024,    // Small desktops and landscape tablets
  LARGE_DESKTOP: 1280  // Large desktops
}

/**
 * Hook that detects if the current viewport is mobile size
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | null>(null)

  React.useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return
    }
    
    // Initial check
    const checkMobile = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.TABLET)
    }
    
    // Check immediately
    checkMobile()
    
    // Then set up listener for resize events with debounce for performance
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    
    const handleResize = () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      
      timeoutId = setTimeout(() => {
        checkMobile()
      }, 100)
    }
    
    window.addEventListener("resize", handleResize)
    
    return () => {
      window.removeEventListener("resize", handleResize)
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [])

  // During SSR or initial render, return false to prevent layout shift
  // Use null to differentiate between "not yet determined" and "definitely not mobile"
  return isMobile === null ? false : isMobile
}

/**
 * Hook to get specific breakpoints with better typing
 */
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState({
    isMobile: false,        // < 640px (phone)
    isTablet: false,        // >= 640px and < 1024px (tablet)
    isDesktop: false,       // >= 1024px and < 1280px (small desktop)
    isLargeDesktop: false,  // >= 1280px (large desktop)
  })

  React.useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return
    }
    
    const checkBreakpoint = () => {
      const width = window.innerWidth
      setBreakpoint({
        isMobile: width < BREAKPOINTS.MOBILE,
        isTablet: width >= BREAKPOINTS.MOBILE && width < BREAKPOINTS.DESKTOP,
        isDesktop: width >= BREAKPOINTS.DESKTOP && width < BREAKPOINTS.LARGE_DESKTOP,
        isLargeDesktop: width >= BREAKPOINTS.LARGE_DESKTOP,
      })
    }
    
    // Check immediately
    checkBreakpoint()
    
    // Then set up listener for resize events with debounce for performance
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    
    const handleResize = () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      
      timeoutId = setTimeout(() => {
        checkBreakpoint()
      }, 100)
    }
    
    window.addEventListener("resize", handleResize)
    
    return () => {
      window.removeEventListener("resize", handleResize)
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [])

  return breakpoint
}

/**
 * Hook to get viewport dimensions and orientation
 */
export function useViewport() {
  const [viewport, setViewport] = React.useState({
    width: 0,
    height: 0,
    isPortrait: true,
  })

  React.useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return
    }
    
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
        isPortrait: window.innerHeight > window.innerWidth,
      })
    }
    
    // Initial check
    updateViewport()
    
    // Set up listener for resize events
    window.addEventListener('resize', updateViewport)
    
    // Detect orientation change for mobile devices
    window.addEventListener('orientationchange', updateViewport)
    
    return () => {
      window.removeEventListener('resize', updateViewport)
      window.removeEventListener('orientationchange', updateViewport)
    }
  }, [])

  return viewport
}
