function toPrecisionTrimmed(number, precision) {
  const result = number.toPrecision(precision);
  const useScientific = result.includes('e');
  return useScientific ? result : result / 1;
}

export { toPrecisionTrimmed as default };
