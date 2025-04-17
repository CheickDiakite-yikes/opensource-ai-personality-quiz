
import { useState, useEffect } from "react";
import { DeepInsightResponses } from "../types";

const STORAGE_KEY = 'deep-insight-responses';

export const useDeepInsightStorage = () => {
  // Function to get saved responses from localStorage
  const getResponses = (): DeepInsightResponses => {
    try {
      const savedResponses = localStorage.getItem(STORAGE_KEY);
      return savedResponses ? JSON.parse(savedResponses) : {};
    } catch (err) {
      console.error("Error retrieving responses from localStorage:", err);
      return {};
    }
  };

  // Function to save responses to localStorage
  const saveResponses = (responses: DeepInsightResponses) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(responses));
    } catch (err) {
      console.error("Error saving responses to localStorage:", err);
    }
  };

  // Function to clear saved progress
  const clearSavedProgress = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.error("Error clearing saved progress:", err);
    }
  };

  return { getResponses, saveResponses, clearSavedProgress };
};
