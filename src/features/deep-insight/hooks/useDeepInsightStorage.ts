
import { useState, useEffect, useRef, useCallback } from "react";
import { DeepInsightResponses } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Storage key for Deep Insight assessment responses (for fallback local storage)
const STORAGE_KEY = 'deep_insight_responses';

/**
 * Hook for managing storage operations related to Deep Insight assessment responses.
 * Primarily uses Supabase database with localStorage as fallback for non-authenticated users.
 */
export const useDeepInsightStorage = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const cachedResponsesRef = useRef<DeepInsightResponses | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // Get saved responses with caching to prevent repeated fetches
  const getResponses = useCallback(async (): Promise<DeepInsightResponses> => {
    try {
      // Return cached responses if available to prevent redundant fetching
      if (cachedResponsesRef.current) {
        console.log("Using cached responses to improve performance");
        return { ...cachedResponsesRef.current }; // Return a new object to prevent mutation
      }
      
      setIsLoading(true);
      
      // If user is authenticated, get responses from database
      if (user) {
        console.log("Getting responses from database for user:", user.id);
        
        const { data, error } = await supabase
          .from("deep_insight_responses")
          .select("question_id, response")
          .eq("user_id", user.id);
        
        if (error) {
          console.error("Error fetching responses from database:", error);
          throw error;
        }
        
        if (data && data.length > 0) {
          // Convert from array of objects to object with question_id as key
          const formattedResponses = data.reduce((acc, item) => {
            acc[item.question_id] = item.response;
            return acc;
          }, {} as DeepInsightResponses);
          
          console.log(`Retrieved ${Object.keys(formattedResponses).length} responses from database.`);
          
          // Double check that we have the expected number of responses
          const responseCount = Object.keys(formattedResponses).length;
          if (responseCount > 0 && responseCount < 100) {
            console.warn(`Retrieved incomplete responses: ${responseCount}/100`);
          } else if (responseCount === 100) {
            console.log("Retrieved complete set of responses");
          }
          
          // Cache the responses for future use
          cachedResponsesRef.current = { ...formattedResponses };
          return formattedResponses;
        }
        
        console.log("No saved responses found in database.");
        cachedResponsesRef.current = {};
        return {};
      }
      
      // Fallback to localStorage for non-authenticated users
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (!savedData) {
        console.log("No saved responses found in localStorage.");
        cachedResponsesRef.current = {};
        return {};
      }
      
      try {
        const parsedData = JSON.parse(savedData);
        console.log(`Retrieved ${Object.keys(parsedData).length} responses from localStorage.`);
        cachedResponsesRef.current = { ...parsedData };
        return parsedData;
      } catch (parseError) {
        console.error("Error parsing saved responses:", parseError);
        localStorage.removeItem(STORAGE_KEY); // Clear corrupted data
        cachedResponsesRef.current = {};
        return {};
      }
    } catch (error) {
      console.error("Error retrieving responses:", error);
      return {};
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Save responses to database or localStorage
  const saveResponses = useCallback(async (responses: DeepInsightResponses): Promise<void> => {
    try {
      const responseCount = Object.keys(responses).length;
      
      if (responseCount === 0) {
        console.warn("Attempted to save empty responses object.");
        return;
      }
      
      // Throttle saves - don't save more frequently than every 2 seconds
      const now = new Date();
      if (lastSaved && now.getTime() - lastSaved.getTime() < 2000) {
        console.log("Throttling save operation - too frequent");
        return;
      }
      
      // Update the cache with the latest responses
      cachedResponsesRef.current = { ...responses };
      setLastSaved(now);
      
      // If user is authenticated, save to database
      if (user) {
        console.log(`Saving ${responseCount} responses to database...`);
        
        // Convert responses object to array of objects for upsert
        const responsesToUpsert = Object.entries(responses).map(([question_id, response]) => ({
          user_id: user.id,
          question_id,
          response,
          updated_at: new Date().toISOString()
        }));
        
        // Use upsert to handle both insert and update cases
        const { error } = await supabase
          .from("deep_insight_responses")
          .upsert(responsesToUpsert, { 
            onConflict: 'user_id,question_id',
            ignoreDuplicates: false 
          });
        
        if (error) {
          console.error("Error saving responses to database:", error);
          throw new Error("Failed to save your progress to database. Please try again.");
        }
        
        return;
      }
      
      // Fallback to localStorage for non-authenticated users
      localStorage.setItem(STORAGE_KEY, JSON.stringify(responses));
    } catch (error) {
      console.error("Error saving responses:", error);
      toast.error("Failed to save your progress. Please try again.");
      throw new Error("Failed to save your progress. Please try again.");
    }
  }, [user, lastSaved]);

  // Clear saved progress and cache
  const clearSavedProgress = useCallback(async (): Promise<void> => {
    try {
      // Clear the cache
      cachedResponsesRef.current = null;
      
      // If user is authenticated, delete from database
      if (user) {
        console.log("Clearing saved progress from database for user:", user.id);
        
        const { error } = await supabase
          .from("deep_insight_responses")
          .delete()
          .eq("user_id", user.id);
        
        if (error) {
          console.error("Error clearing saved progress from database:", error);
          throw error;
        }
        
        return;
      }
      
      // Fallback to localStorage for non-authenticated users
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing saved progress:", error);
      toast.error("Failed to clear your progress. Please try again.");
    }
  }, [user]);

  return {
    getResponses,
    saveResponses,
    clearSavedProgress,
    isLoading
  };
};
