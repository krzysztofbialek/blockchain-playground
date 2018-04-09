// Importujemy isomorphic-fetch
const fetch = require('isomorphic-fetch')

run()

async function run () {
  // Wywołujemy asynchroniczny request do naszego nodea
  const res = await fetch('http://localhost:8545/', {
    // Metoda POST
    method: 'post',
    // 3/ Ustawiamy content-type
    headers: {
      'Content-Type': 'application/json'
    },
    // 6/ I wysyłamy zserializowany request o najnowszy blok
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_getBlockByNumber',
      params: ['latest', false]
    })
  })

  // Parsujemy odpowiedź jako JSON
  const json = await res.json()

  console.log(json.result)

  const { number, hash, transactions, timestamp } = json.result

  // Parsujemy hex z timestampem (uwaga na overflow!)
  const time = parseInt(timestamp.substr(2), 16)

  // 6/ Wypisujemy kilka szczegółow bloku
  console.log(`
Block number: ${number}
Block hash: ${hash}
Block date: ${new Date(time * 1000)}
Number of transactions: ${transactions.length}
`)
}

