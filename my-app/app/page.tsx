"use client";
import { useEffect } from "react";
import { init } from "./lib/sort";

export default function Home() {
  useEffect(() => {
    init();
  }, []);

  return (
      <div className="p-10">
        <h1 className="text-2xl font-bold mb-4">Ordinamenti</h1>
        <div id="array"></div>
      </div>
  );
}
