async function main() {
  console.log(`Preparing Deployment...\n`)
  //Fetch contract to deploy
  const Tickets = await ethers.getContractFactory('Tickets')
  //Fetch Accounts
  const accounts = await ethers.getSigners()
  //Delploy Contract
  const tickets = await Tickets.deploy('Max Fosh', 10, ethers.utils.parseEther('0.05'), ethers.utils.parseEther('0.04'))
  await tickets.deployed()
  console.log(`Contract Deployed to: ${tickets.address}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

  //Code to run script to localhost [npx hardhat run --network localhost scripts/deploy.js]
  //Code to run script to mumbai [npx hardhat run --network mumbai scripts/deploy.js]
  