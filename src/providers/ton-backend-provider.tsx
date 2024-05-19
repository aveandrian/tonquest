"use client";

import { type ReactNode } from "react";
import { useBackendAuth } from "@/lib/use-backend-auth";

export function TonBackendProvider(props: { children: ReactNode }) {
  useBackendAuth();
  return props.children;
}
