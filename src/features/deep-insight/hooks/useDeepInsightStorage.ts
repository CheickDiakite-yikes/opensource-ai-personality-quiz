
import { useState, useEffect } from "react";
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

  // Get saved responses - try database first, fallback to localStorage
  const getResponses = async (): Promise<DeepInsightResponses> => {
    try {
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
          return formattedResponses;
        }
        
        console.log("No saved responses found in database.");
        return {};
      }
      
      // Fallback to localStorage for non-authenticated users
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (!savedData) {
        console.log("No saved responses found in localStorage.");
        return {};
      }
      
      const parsedData = JSON.parse(savedData);
      console.log(`Retrieved ${Object.keys(parsedData).length} responses from localStorage.`);
      return parsedData;
    } catch (error) {
      console.error("Error retrieving responses:", error);
      return {};
    } finally {
      setIsLoading(false);
    }
  };

  // Save responses to database or localStorage
  const saveResponses = async (responses: DeepInsightResponses): Promise<void> => {
    try {
      const responseCount = Object.keys(responses).length;
      console.log(`Saving ${responseCount} responses...`);
      
      if (responseCount === 0) {
        console.warn("Attempted to save empty responses object.");
        return;
      }
      
      // If user is authenticated, save to database
      if (user) {
        console.log("Saving responses to database for user:", user.id);
        
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
        
        console.log("Responses saved successfully to database.");
        return;
      }
      
      // Fallback to localStorage for non-authenticated users
      localStorage.setItem(STORAGE_KEY, JSON.stringify(responses));
      console.log("Responses saved successfully to localStorage.");
    } catch (error) {
      console.error("Error saving responses:", error);
      toast.error("Failed to save your progress. Please try again.");
      throw new Error("Failed to save your progress. Please try again.");
    }
  };

  // Clear saved progress
  const clearSavedProgress = async (): Promise<void> => {
    try {
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
        
        console.log("Cleared saved progress from database.");
        return;
      }
      
      // Fallback to localStorage for non-authenticated users
      localStorage.removeItem(STORAGE_KEY);
      console.log("Cleared saved progress from localStorage.");
    } catch (error) {
      console.error("Error clearing saved progress:", error);
      toast.error("Failed to clear your progress. Please try again.");
    }
  };

  return {
    getResponses,
    saveResponses,
    clearSavedProgress,
    isLoading
  };
};
