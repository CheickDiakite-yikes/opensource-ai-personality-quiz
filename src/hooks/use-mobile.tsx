
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // Initial check - only run on client side
    if (typeof window === 'undefined') return false;
    return window.innerWidth < MOBILE_BREAKPOINT;
  })

  React.useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return
    }
    
    // Update on mount to ensure accuracy
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    
    // Improved event listener with proper cleanup
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    window.addEventListener('resize', onChange)
    
    // Cleanup function
    return () => window.removeEventListener('resize', onChange)
  }, [])

  return isMobile
}

// New hook to get viewport dimensions for more precise responsive controls
export function useViewport() {
  const [viewport, setViewport] = React.useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
    isMobile: typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false,
  })

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth < MOBILE_BREAKPOINT,
      })
    }
    
    // Set on mount and add listener
    handleResize();
    window.addEventListener('resize', handleResize)
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return viewport
}
