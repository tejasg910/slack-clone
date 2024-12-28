"use client";
import { Provider } from "jotai";
import React from "react";

interface JotaiProviderPorps {
  children: React.ReactNode;
}

export const JotaiProvider = ({ children }: JotaiProviderPorps) => {
  return <Provider>{children}</Provider>;
};
