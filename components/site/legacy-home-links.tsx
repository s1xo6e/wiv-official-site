"use client";

import { useEffect } from "react";

export function LegacyHomeLinks() {
  useEffect(() => {
    const destinations: Record<string, string> = { "#solutions": "/solutions", "#cases": "/cases", "#about": "/about", "#contact": "/contact" };
    function migrateHash() {
      const target = destinations[window.location.hash];
      if (target) window.location.replace(target);
    }
    migrateHash();
    window.addEventListener("hashchange", migrateHash);
    return () => window.removeEventListener("hashchange", migrateHash);
  }, []);
  return null;
}
