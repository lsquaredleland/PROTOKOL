import { createContext } from "react";
import { TallyIdentities } from "./types";

interface SocialContext {
  tallyIdentities: TallyIdentities;
  setAddresses: (addresses: Set<string>) => void;
}

const Context = createContext<SocialContext>({
  tallyIdentities: {},
  setAddresses: (addresses: Set<string>) => {},
});

export default Context;