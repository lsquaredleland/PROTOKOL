import React, { useState, useEffect } from "react";
import Context from "./Context";
import { TallyIdentities } from "./types";
import { fetchAllTallyIdentities } from "./helpers";


const Provider: React.FC = ({ children }) => {
  const [addresses, setAddresses] = useState<Set<string>>(new Set())
  const [tallyIdentities, setTallyIdentities] = useState<TallyIdentities>({});

  useEffect(() => {
    async function fetchData(addresses: Set<string>) {
      const results: TallyIdentities | undefined = await fetchAllTallyIdentities(addresses)
      if (results) {
        setTallyIdentities(results)
      }
    }
    if (addresses.size > 0) {
      fetchData(addresses)
    }
  }, [addresses, setTallyIdentities])

  return (
    <Context.Provider
      value={{
        tallyIdentities,
        setAddresses,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;