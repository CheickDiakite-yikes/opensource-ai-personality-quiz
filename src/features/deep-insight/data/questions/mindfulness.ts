
import { DeepInsightQuestion } from "../../types";

export const mindfulnessQuestions: DeepInsightQuestion[] = [
  // SELF-AWARENESS - Questions 91-100
  {
    id: "q91",
    question: "How accurately do you believe you understand your own strengths and limitations?",
    category: "mindfulness",
    options: [
      { id: "q91-a", text: "Very accurately - I have deep self-knowledge", value: 1 },
      { id: "q91-b", text: "Fairly accurately, though I'm still discovering aspects", value: 2 },
      { id: "q91-c", text: "I'm more aware of some areas than others", value: 3 },
      { id: "q91-d", text: "I sometimes surprise myself with unknown capacities", value: 4 },
    ],
  },
  {
    id: "q92",
    question: "How often do you deliberately reflect on your thoughts, feelings, and behaviors?",
    category: "mindfulness",
    options: [
      { id: "q92-a", text: "Very frequently - it's a regular practice", value: 1 },
      { id: "q92-b", text: "Often, especially when facing challenges", value: 2 },
      { id: "q92-c", text: "Sometimes, when prompted by circumstances", value: 3 },
      { id: "q92-d", text: "Occasionally, but I'm more action-oriented", value: 4 },
    ],
  },
  {
    id: "q93",
    question: "When you receive feedback that contradicts your self-perception:",
    category: "mindfulness",
    options: [
      { id: "q93-a", text: "I'm very curious and explore it deeply", value: 1 },
      { id: "q93-b", text: "I consider it thoughtfully but trust my self-knowledge", value: 2 },
      { id: "q93-c", text: "I may feel defensive initially but reflect later", value: 3 },
      { id: "q93-d", text: "I evaluate it against other feedback I've received", value: 4 },
    ],
  },
  {
    id: "q94",
    question: "How aware are you of how your behavior affects others?",
    category: "mindfulness",
    options: [
      { id: "q94-a", text: "Highly aware and attentive to others' responses", value: 1 },
      { id: "q94-b", text: "Generally aware, though sometimes surprised", value: 2 },
      { id: "q94-c", text: "More aware in some contexts than others", value: 3 },
      { id: "q94-d", text: "I focus more on intentions than impacts", value: 4 },
    ],
  },
  {
    id: "q95",
    question: "How well do you understand the patterns in your emotional responses?",
    category: "mindfulness",
    options: [
      { id: "q95-a", text: "Very well - I recognize clear patterns and triggers", value: 1 },
      { id: "q95-b", text: "Fairly well, though some emotions still surprise me", value: 2 },
      { id: "q95-c", text: "I understand some patterns better than others", value: 3 },
      { id: "q95-d", text: "I'm still working on identifying these patterns", value: 4 },
    ],
  },
  {
    id: "q96",
    question: "How conscious are you of the values that guide your important decisions?",
    category: "mindfulness",
    options: [
      { id: "q96-a", text: "Very conscious - I explicitly consider my values", value: 1 },
      { id: "q96-b", text: "Mostly aware, though sometimes in retrospect", value: 2 },
      { id: "q96-c", text: "I have a general sense but don't always articulate them", value: 3 },
      { id: "q96-d", text: "I act more on practical considerations than abstract values", value: 4 },
    ],
  },
  {
    id: "q97",
    question: "To what extent do you notice your mind wandering during everyday activities?",
    category: "mindfulness",
    options: [
      { id: "q97-a", text: "I'm very present and rarely find my mind wandering", value: 1 },
      { id: "q97-b", text: "I notice quickly when my mind wanders and refocus", value: 2 },
      { id: "q97-c", text: "I'm more present for some activities than others", value: 3 },
      { id: "q97-d", text: "My mind often explores tangents and connections", value: 4 },
    ],
  },
  {
    id: "q98",
    question: "How well do you recognize when your stress levels are increasing?",
    category: "mindfulness",
    options: [
      { id: "q98-a", text: "Very quickly through physical and mental signals", value: 1 },
      { id: "q98-b", text: "Fairly well, though sometimes after it's significant", value: 2 },
      { id: "q98-c", text: "I recognize clear signs but might miss subtler ones", value: 3 },
      { id: "q98-d", text: "Others sometimes notice before I do", value: 4 },
    ],
  },
  {
    id: "q99",
    question: "How would you describe your awareness of your own biases and assumptions?",
    category: "mindfulness",
    options: [
      { id: "q99-a", text: "Highly aware and actively working to recognize them", value: 1 },
      { id: "q99-b", text: "Generally aware but still discovering blind spots", value: 2 },
      { id: "q99-c", text: "Aware of major biases but probably miss subtler ones", value: 3 },
      { id: "q99-d", text: "I try to be objective and not influenced by bias", value: 4 },
    ],
  },
  {
    id: "q100",
    question: "When making important life choices, how connected are you to your authentic self?",
    category: "mindfulness",
    options: [
      { id: "q100-a", text: "Deeply connected to my core values and true self", value: 1 },
      { id: "q100-b", text: "Generally aligned though sometimes influenced by external factors", value: 2 },
      { id: "q100-c", text: "Still discovering what authenticity means for me", value: 3 },
      { id: "q100-d", text: "I focus more on practical considerations than authenticity", value: 4 },
    ],
  }
];
