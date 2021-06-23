import { createContext } from "react";
import { Identities } from "./types";

interface SocialContext {
  allIdentities: Identities | undefined;
}

const Context = createContext<SocialContext>({
  allIdentities: {},
});

export default Context;