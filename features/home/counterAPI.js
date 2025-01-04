export function fetchCount(amount = 1) {
  return new Promise(async (resolve) => {
    const response = await fetch('http://192.168.1.4:8080')
    const data = await response.json()
    resolve({ data })
  }
  );
}
