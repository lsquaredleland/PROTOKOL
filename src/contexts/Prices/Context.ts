import { createContext } from "react";
import { ProtocolPrices } from "./types";

interface PricesContext {
  currentPrices: ProtocolPrices;
}

const Context = createContext<PricesContext>({
  currentPrices: { "id": 0.0 }
});

export default Context;
