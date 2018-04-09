// Importujemy klasę web3
const Web3 = require('web3')

run()

async function run () {
  await makeTransaction()
  // Tworzymy nową instancję i podajemy adres nodea
  const web3 = new Web3('http://localhost:8545')
  // Pobieramy block
  const startBlock = await web3.eth.getBlock('latest');

  let startNumber = startBlock.number - 1;

  const blocks = [];

  for (step = 0; step < 5; step++) {
    let newBlock = await web3.eth.getBlock(startNumber);
    blocks.push(newBlock);
    startNumber -= 1;
  }

  blocks.forEach((block) => {
    console.log('=================')
    let { number, hash, transactions, timestamp } = block
      console.log(`
    Block number: ${number}
    Block hash: ${hash}
    Block date: ${new Date(timestamp * 1000)}
    Number of transactions: ${transactions.length}
    `)
  });

  console.log('=================')

  let { number, hash, transactions, timestamp } = startBlock
    console.log(`
    Block number: ${number}
    Block hash: ${hash}
    Block date: ${new Date(timestamp * 1000)}
    Number of transactions: ${transactions.length}
    `)

  console.log('====== transactions ')

  const transaction = startBlock.transactions;

  transactions.forEach(async (transHash) => {
    let trans = await web3.eth.getTransaction(transHash);
    let { from, to, value, gas, gasPrice } = trans;
    console.log(`
    Trans from: ${from}
    Trans to: ${to}
    Trans value: ${value}
    Trans gas: ${gas}
    Trans gas price: ${gasPrice}
    `)
  });
}

async function makeTransaction () {
  const web3 = new Web3('http://localhost:8545')

  // 3/ Wykorzystujemy listę kont, żeby wybrać nadawcę i odbiorcę
  const accounts = await web3.eth.getAccounts();
  const from = accounts[1];
  const to = accounts[0];
  // Przesyłamy dodatkowo jakąś wartość w ETH
  const value = 50000;

  try {
    // 4/ wysylamy transakcje podająć tylko te pola, na których nam zależy.
    // Reszta (gas,gasPrice,nonce) zostanie dobrana automatycznie.
    const txHash = await web3.eth.sendTransaction({
      from, to, value
    })

    // W przypadku zaakceptowania transakcji przez użytkownika dostajemy jej hash.
    console.log(`Transaction sent with hash: ${txHash}`)
  } catch (e) {
    // Obsługujemy potencjalny błąd (lub odrzucenie przez użytkownika)
    console.error(`Could not send transaction: ${e}`)
  }
}
