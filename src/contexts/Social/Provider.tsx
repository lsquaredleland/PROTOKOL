import React, { useState, useEffect } from "react";
import Context from "./Context";
import { Identities } from "./types";
import { fetchAllIdentities } from "./helpers";


const Provider: React.FC = ({ children }) => {
  const [allIdentities, setAllIdentities] = useState<Identities | undefined>()

  useEffect(() => {
    async function fetchData() {
      const results: Identities | undefined = await fetchAllIdentities()
      if (results) {
        setAllIdentities(results)
      }
    }
    if (!allIdentities) {
      fetchData()
    }
  }, [allIdentities, setAllIdentities])

  return (
    <Context.Provider
      value={{
        allIdentities
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;