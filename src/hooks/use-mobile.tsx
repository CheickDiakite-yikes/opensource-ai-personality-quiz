
import * as React from "react"

const MOBILE_BREAKPOINT = 768 // Standard tablet/mobile breakpoint

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
  const [isHydrated, setIsHydrated] = React.useState(false)

  React.useEffect(() => {
    // Mark component as hydrated after initial render
    setIsHydrated(true)
    
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return
    }
    
    // Initial check
    const checkMobile = () => {
      const mobileCheck = window.innerWidth < MOBILE_BREAKPOINT
      setIsMobile(mobileCheck)
    }
    
    // Perform initial check
    checkMobile()
    
    // Add event listener with debouncing
    let resizeTimer: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(checkMobile, 100)
    }
    
    window.addEventListener("resize", handleResize)
    
    // Cleanup
    return () => {
      clearTimeout(resizeTimer)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // During SSR or initial client render before hydration, 
  // use a reasonable default based on viewport meta tags
  if (!isHydrated) {
    return false
  }

  return isMobile === undefined ? false : isMobile
}

// Additional hook to get more detailed viewport information
export function useViewport() {
  const [viewport, setViewport] = React.useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
    isMobile: false,
    isTablet: false,
    isDesktop: true
  })
  
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    
    const handleResize = () => {
      const width = window.innerWidth
      setViewport({
        width,
        height: window.innerHeight,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024
      })
    }
    
    // Initial check
    handleResize()
    
    // Add event listener with debouncing
    let resizeTimer: NodeJS.Timeout
    const debouncedResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(handleResize, 100)
    }
    
    window.addEventListener("resize", debouncedResize)
    
    return () => {
      clearTimeout(resizeTimer)
      window.removeEventListener("resize", debouncedResize)
    }
  }, [])
  
  return viewport
}
