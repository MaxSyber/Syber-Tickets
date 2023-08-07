const config = require('../src/config.json')

const wait = (seconds) => {
  const milliseconds = seconds * 1000
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

async function main() {
  const accounts = await ethers.getSigners()
  const { chainId } = await ethers.provider.getNetwork()
  console.log({chainId})

  const tickets = await ethers.getContractAt('Tickets', config[chainId].tickets.address)
    console.log(`Tickets fetched: ${tickets.address}\n`)

  const ticketMaster = accounts[0]

  let transaction

  transaction = await tickets.connect(ticketMaster).mintAllTokens(ticketMaster.address,
  {gasPrice: ethers.utils.parseUnits("50", "gwei")})
  await transaction.wait()
  console.log(`Minted to deployer ${ticketMaster.address}\n`)

  transaction= await tickets.connect(ticketMaster).adminDeposit({ 
    value :ethers.utils.parseEther("0.5"),
    gasPrice: ethers.utils.parseUnits("50", "gwei")
  })
  await transaction.wait()
  console.log(`Tokens deposited to contract 0.5 \n`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

  //code to run seedscript to localhost [npx hardhat run --network mumbai scripts/mainsale.js]
  