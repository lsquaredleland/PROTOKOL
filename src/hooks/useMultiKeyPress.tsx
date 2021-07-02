import { useState, useEffect } from 'react'
import { isEqual } from 'lodash';
import { useCallback } from 'react';


// Alternatively could use https://www.npmjs.com/package/react-keyboard-event-handler
export default function useMultiKeyPress(keys: string[]): boolean {
  const [keysPressed, setKeyPressed] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState<boolean>(false)
  
  const downHandler = useCallback(({ key } : { key: string }) => {
    setKeyPressed(keysPressed.add(key));
    setReady(isEqual(new Set(keys), keysPressed));
    // ^weird have to have `setReady` here instead of an useEffect()...
  }, [keys, keysPressed])

  const upHandler = useCallback(({ key } : { key: string }) => {
    keysPressed.delete(key);
    setKeyPressed(keysPressed);
    setReady(isEqual(new Set(keys), keysPressed))
  }, [keys, keysPressed]);

  useEffect(() => {
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [downHandler, upHandler]); // Empty array ensures that effect is only run on mount and unmount

  return ready;
}