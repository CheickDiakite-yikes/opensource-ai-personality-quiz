
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return
    }
    
    // Initial check
    const checkMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Check immediately
    checkMobile()
    
    // Then set up listener for resize events
    window.addEventListener("resize", checkMobile)
    
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // If we haven't determined yet, default to false,
  // but in most cases this will be updated very quickly
  return isMobile === undefined ? false : isMobile
}

// Hook to get specific breakpoints
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState({
    isMobile: false,   // < 640px
    isTablet: false,   // >= 640px and < 1024px
    isDesktop: false,  // >= 1024px
  })

  React.useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return
    }
    
    const checkBreakpoint = () => {
      const width = window.innerWidth
      setBreakpoint({
        isMobile: width < 640,
        isTablet: width >= 640 && width < 1024,
        isDesktop: width >= 1024,
      })
    }
    
    // Check immediately
    checkBreakpoint()
    
    // Then set up listener for resize events
    window.addEventListener("resize", checkBreakpoint)
    
    return () => window.removeEventListener("resize", checkBreakpoint)
  }, [])

  return breakpoint
}
