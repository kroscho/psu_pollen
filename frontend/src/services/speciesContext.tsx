import React, { useState, createContext, useEffect } from "react";
import { getAllSpecies } from "./api";
import { Specie } from "../types/types";

// Create Context Object
export const SpeciesContext = createContext([] as any);

// Create a provider for components to consume and subscribe to changes
export const SpeciesContextProvider = (props: any) => {
  const [results, setResult] = useState<any>([]);
  useEffect(() => {
    async function getData() {
      const results = (await getAllSpecies()) as Array<Specie>;
      setResult(results);
    }
    getData();
  }, []);

  return (
    <SpeciesContext.Provider value={[results, setResult]}>
      {props.children}
    </SpeciesContext.Provider>
  );
};
