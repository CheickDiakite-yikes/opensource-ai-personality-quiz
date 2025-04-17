
import { useState, useEffect } from "react";
import { DeepInsightResponses } from "../types";

// Storage key for Deep Insight assessment responses
const STORAGE_KEY = 'deep_insight_responses';

/**
 * Hook for managing storage operations related to Deep Insight assessment responses.
 */
export const useDeepInsightStorage = () => {
  // Get saved responses from localStorage
  const getResponses = (): DeepInsightResponses => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (!savedData) {
        console.log("No saved responses found in localStorage.");
        return {};
      }
      
      const parsedData = JSON.parse(savedData);
      console.log(`Retrieved ${Object.keys(parsedData).length} responses from localStorage.`);
      return parsedData;
    } catch (error) {
      console.error("Error retrieving responses from localStorage:", error);
      return {};
    }
  };

  // Save responses to localStorage
  const saveResponses = (responses: DeepInsightResponses): void => {
    try {
      const responseCount = Object.keys(responses).length;
      console.log(`Saving ${responseCount} responses to localStorage.`);
      
      if (responseCount === 0) {
        console.warn("Attempted to save empty responses object. This may indicate an issue.");
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(responses));
      console.log("Responses saved successfully.");
    } catch (error) {
      console.error("Error saving responses to localStorage:", error);
      throw new Error("Failed to save your progress. Please try again.");
    }
  };

  // Clear saved progress
  const clearSavedProgress = (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      console.log("Cleared saved progress from localStorage.");
    } catch (error) {
      console.error("Error clearing saved progress:", error);
    }
  };

  return {
    getResponses,
    saveResponses,
    clearSavedProgress
  };
};
