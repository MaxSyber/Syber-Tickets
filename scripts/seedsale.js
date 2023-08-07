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

  const ticketMaster = accounts [0]
  const buyer1 = accounts [1]
  const buyer2 = accounts [2]
  const buyer3 = accounts [3]
  const buyTicketPrice = ethers.utils.parseEther("20")
  const returnTicketPrice = ethers.utils.parseEther('18')

  let transaction

  transaction = await tickets.connect(ticketMaster).mintAllTokens(ticketMaster.address)
  await transaction.wait()
  console.log(`Minted to deployer ${ticketMaster.address}\n`)

  transaction= await tickets.connect(buyer1).buyTicket(ticketMaster.address, 0, { value: buyTicketPrice })
  await transaction.wait()
  console.log(`Ticket Bought and transferd to ${buyer1.address}\n`)

  transaction= await tickets.connect(buyer1).buyTicket(ticketMaster.address, 1, { value: buyTicketPrice })
  await transaction.wait()
  console.log(`Ticket Bought and transferd to ${buyer1.address}\n`)

  transaction= await tickets.connect(buyer2).buyTicket(ticketMaster.address, 2, { value: buyTicketPrice })
  await transaction.wait()
  console.log(`Ticket Bought and transferd to ${buyer2.address}\n`)

  transaction= await tickets.connect(buyer3).buyTicket(ticketMaster.address, 3, { value: buyTicketPrice })
  await transaction.wait()
  console.log(`Ticket Bought and transferd to ${buyer3.address}\n`)

  transaction= await tickets.connect(buyer3).buyTicket(ticketMaster.address, 4, { value: buyTicketPrice })
  await transaction.wait()
  console.log(`Ticket Bought and transferd to ${buyer3.address}\n`)

  transaction= await tickets.connect(ticketMaster).adminDeposit({ value :ethers.utils.parseEther('200')})
  await transaction.wait()
  console.log(`Tokens deposited to contract 200 \n`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
  //code to run seedscript to localhost [npx hardhat run --network localhost scripts/seedsale.js]
  