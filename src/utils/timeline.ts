export const adjustTime = (text: string[], adjust: number): string[] => {

  const adjustedText = text.map((line) => {
    const replaced = line.replace(/^(\s*)(\d+(?:\.\d)?)(\s.*)$/, (_, p1, p2, p3) => {
      const time = Number(p2);
      const adjustedTime = time + adjust;
      return p1 + adjustedTime.toFixed(1) + p3;
    });
    return replaced;
  });
  return adjustedText;
};
