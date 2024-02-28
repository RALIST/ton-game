export function applyOperation(valueA: number, valueB: number, operation: string) {
  switch (operation) {
    case "subtract": {
      return valueA - valueB
    }
    case "add": {
      return valueA + valueB
    }
    default: { return valueA }
  }
}
