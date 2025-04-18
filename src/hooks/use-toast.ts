
import { useToast as useToastOriginal, toast as toastOriginal } from "@radix-ui/react-toast";

// Re-export the hooks for consistent usage
export const useToast = useToastOriginal;
export const toast = toastOriginal;
