"use client";
import { createContext, useContext } from "react";
import { State, Workout } from "@/lib/model";
export type Page =
  | "dashboard"
  | "workout"
  | "analytics"
  | "records"
  | "body"
  | "programs"
  | "settings";
export type GymContextValue = {
  data: State;
  saving: boolean;
  commit: (next: State, message?: string) => Promise<boolean>;
  notify: (message: string) => void;
  navigate: (page: Page, exerciseId?: string) => void;
  openWorkout: (workout?: Workout, copy?: boolean) => void;
  remove: (title: string, text: string, action: () => Promise<boolean>) => void;
  selectedExercise: string;
  setSelectedExercise: (id: string) => void;
};
export const GymContext = createContext<GymContextValue | null>(null);
export function useGym() {
  const context = useContext(GymContext);
  if (!context) throw new Error("GYM context missing");
  return context;
}
