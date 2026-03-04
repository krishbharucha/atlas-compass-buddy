import { useState, useEffect, useRef } from "react";

export function useTypewriter(text: string, speed = 80, startImmediately = true) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(startImmediately);
  const words = text.split(" ");
  const idx = useRef(0);

  useEffect(() => {
    if (!started) return;
    idx.current = 0;
    setDisplayed("");
    setDone(false);
    const iv = setInterval(() => {
      idx.current++;
      setDisplayed(words.slice(0, idx.current).join(" "));
      if (idx.current >= words.length) {
        setDone(true);
        clearInterval(iv);
      }
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed, started]);

  return { displayed, done, start: () => setStarted(true) };
}

export function useStaggeredReveal(items: string[], delayMs = 300) {
  const [revealed, setRevealed] = useState<number[]>([]);
  const [allDone, setAllDone] = useState(false);

  const start = () => {
    setRevealed([]);
    setAllDone(false);
    items.forEach((_, i) => {
      setTimeout(() => {
        setRevealed(prev => [...prev, i]);
        if (i === items.length - 1) {
          setTimeout(() => setAllDone(true), 400);
        }
      }, delayMs * (i + 1));
    });
  };

  return { revealed, allDone, start };
}
