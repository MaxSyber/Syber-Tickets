const { expect } = require('chai')
const { ethers } = require('hardhat')

const tokens = (n) => {
	return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Tickets', () => {
	let tickets, accounts, deployer
	beforeEach(async () => {
		const Tickets = await ethers.getContractFactory('Tickets')
		tickets = await Tickets.deploy('Swift', '4', tokens(20), tokens(18))
		accounts = await ethers.getSigners()
		deployer = accounts[0]
		user1 = accounts[1]
		user2 = accounts[2]
	})

	describe('Deployment' , () => {
		const name = 'Swift'
		const totalSupply = '0'
		const maxSupply = '4'
		const sellAmount = tokens(20)
		const returnAmount = tokens(18)

		it('Has correct name', async () => {
		expect(await tickets.name()).to.equal(name)
		})

		it('Has correct max supply', async () => {
			expect(await tickets.maxSupply()).to.equal(maxSupply)
		})

		it('Has correct sellAmount', async () => {
			expect(await tickets.sellAmount()).to.equal(sellAmount)
		})
		
		it('Has correct returnAmount', async () => {
			expect(await tickets.returnAmount()).to.equal(returnAmount)
		})
	})

	describe('Mint All NFTs' , () => {
		let transaction, result
		
		beforeEach(async () => {
		transaction = await tickets.connect(deployer).mintAllTokens(deployer.address)
		result = await transaction.wait()
		})

		it('Mints all NFT to deployer', async () => {
			expect(await tickets.balanceOf(deployer.address)).to.equal(4)
			expect(await tickets.ownerOf(0)).to.equal(deployer.address)
			expect(await tickets.ownerOf(1)).to.equal(deployer.address)
			expect(await tickets.ownerOf(2)).to.equal(deployer.address)
			expect(await tickets.ownerOf(3)).to.equal(deployer.address)
		})

		it('Emits a transfer events', async () => {
			const event = result.events[1]
			expect(event.event).to.equal("Transfer")
			const args = event.args
			expect(args.to).to.equal(deployer.address)
			expect(args.tokenId).to.equal(1)
		})

		it('Sets the correct tokenURI for tokenId 3', async () => {
			const checkURI = await tickets.connect(deployer).tokenURI(3)
			const expectedURI = "file://ticketMetadata/3"
			expect(checkURI).to.equal(expectedURI)
		})
	})

	describe('Sell and Return Tickets' , () => {
		let transaction, result, transaction2, result2, transaction3, result3

		beforeEach(async () => {
		amountsell = tokens(20)
		amountreturn = tokens(18)
		transaction = await tickets.connect(deployer).mintAllTokens(deployer.address)
		result = await transaction.wait()
		balanceBefore = await ethers.provider.getBalance(deployer.address)
		transaction2 = await tickets.connect(user1).buyTicket(deployer.address, 2, {value: amountsell})
		transaction22 = await tickets.connect(user2).buyTicket(deployer.address, 3, {value: amountsell})
		result2 = await transaction2.wait()
		})

		it('Sell tickets and transfers ownership', async () => {
			
			expect(await tickets.balanceOf(deployer.address)).to.equal(2)
			expect(await tickets.balanceOf(user1.address)).to.equal(1)
			expect(await tickets.balanceOf(user2.address)).to.equal(1)
			expect(await tickets.ownerOf(2)).to.equal(user1.address)
			balanceAfter = await ethers.provider.getBalance(deployer.address)
			expect(balanceAfter).to.be.greaterThan(balanceBefore)
		})

		it('Emits a sell event', async () => {
			const event = result2.events[0]
			expect(event.event).to.equal("Sell")
			const args = event.args
			expect(args.to).to.equal(deployer.address)
			expect(args.from).to.equal(user1.address)
			expect(args.tokenId).to.equal(2)
		})

		it('Ticketmaster Cancels ticket and issues refund', async () => {
			expect(await tickets.balanceOf(user1.address)).to.equal(1)
			returnbalanceBefore = await ethers.provider.getBalance(user1.address)
			transaction3 = await tickets.connect(deployer).cancelTicket(user1.address, 2, {value: amountreturn})
			result3 = await transaction3.wait()
			returnbalanceAfter = await ethers.provider.getBalance(user1.address)
			expect(await tickets.balanceOf(deployer.address)).to.equal(3)
			expect(await tickets.balanceOf(user1.address)).to.equal(0)
			expect(await tickets.ownerOf(2)).to.equal(deployer.address)
			expect(returnbalanceAfter).to.be.greaterThan(returnbalanceBefore)
		})

		it('Emits a cancel return event', async () => {
			const event = result3.events[0]
			expect(event.event).to.equal("Return")
			const args = event.args
			expect(args.to).to.equal(user1.address)
			expect(args.from).to.equal(deployer.address)
			expect(args.tokenId).to.equal(2)
		})

		it('Returns ticket and issues refund', async () => {
			expect(await tickets.balanceOf(user2.address)).to.equal(1)
			returnbalanceBefore = await ethers.provider.getBalance(user2.address)
			console.log(returnbalanceBefore)
			transaction4 = await tickets.connect(user2).returnTicket(user2.address, 3, {value: amountreturn})
			result4 = await transaction4.wait()
			returnbalanceAfter = await ethers.provider.getBalance(user1.address)
			console.log(returnbalanceAfter)
			expect(await tickets.balanceOf(deployer.address)).to.equal(3)
			expect(await tickets.balanceOf(user2.address)).to.equal(0)
			expect(await tickets.ownerOf(3)).to.equal(deployer.address)
			expect(returnbalanceAfter).to.be.greaterThan(returnbalanceBefore)
		})

		it('Emits a return event', async () => {
			const event = result4.events[0]
			expect(event.event).to.equal("Return")
			const args = event.args
			expect(args.to).to.equal(user2.address)
			expect(args.from).to.equal(user2.address)
			expect(args.tokenId).to.equal(3)
		})
	})

	describe('Failure cases' , () => {
		it('Rejects mint attempts from addresses other than the ticketMaster', async () => {
			await expect(tickets.connect(user1).mintAllTokens(user1.address)).to.be.reverted	
		})

		it('Rejects ticket purcahasing if the owner already has two tickets', async () => {
			await tickets.connect(deployer).mintAllTokens(deployer.address)
			await tickets.connect(user1).buyTicket(deployer.address, 0, {value: amountsell})
			await tickets.connect(user1).buyTicket(deployer.address, 1, {value: amountsell})
			await expect(tickets.connect(user1).buyTicket(deployer.address, 2, {value: amountsell})).to.be.reverted
		})

		it('Rejects attempts to buy tickets from ticket holders', async () => {
			await tickets.connect(deployer).mintAllTokens(deployer.address)
			await tickets.connect(user1).buyTicket(deployer.address, 0, {value: amountsell})
			await expect(tickets.connect(user2).buyTicket(user1.address, 0, {value: amountsell})).to.be.reverted
		})

		it('Rejects attempt to buy a token ID that was already sold', async () => {
			await tickets.connect(deployer).mintAllTokens(deployer.address)
			await tickets.connect(user1).buyTicket(deployer.address, 0, {value: amountsell})
			await expect(tickets.connect(user2).buyTicket(deployer.address, 0, {value: amountsell})).to.be.reverted
		})

		it('Rejects attempts to buy tickets below asking price', async () => {
			await tickets.connect(deployer).mintAllTokens(deployer.address)
			await expect(tickets.connect(user1).buyTicket(deployer.address, 0, {value: 18})).to.be.reverted
		})

		it('Reject attempts to refund ticket if the to address is not the owner of the ticket', async () => {
			await tickets.connect(deployer).mintAllTokens(deployer.address)
			await tickets.connect(user1).buyTicket(deployer.address, 0, {value: amountsell})
			await expect(tickets.connect(user2).returnTicket(user2.address, 0, {value: amountreturn})).to.be.reverted
		})

		it('Rejects attempts to return tickets below return price', async () => {
			await tickets.connect(deployer).mintAllTokens(deployer.address)
			await tickets.connect(user1).buyTicket(deployer.address, 0, {value: amountsell})
			await expect(tickets.connect(user1).returnTicket(user1.address, 0, {value: 17})).to.be.reverted
		})

		it('Reject attempts to refund ticket if the to address is not the owner of the ticket on cancel orders', async () => {
			await tickets.connect(deployer).mintAllTokens(deployer.address)
			await tickets.connect(user1).buyTicket(deployer.address, 0, {value: amountsell})
			await expect(tickets.connect(deployer).cancelTicket(user2.address, 0, {value: amountreturn})).to.be.reverted
		})

		it('Rejects attempts to return tickets below return price on cancel orders', async () => {
			await tickets.connect(deployer).mintAllTokens(deployer.address)
			await tickets.connect(user1).buyTicket(deployer.address, 0, {value: amountsell})
			await expect(tickets.connect(deployer).cancelTicket(user1.address, 0, {value: 17})).to.be.reverted
		})

		it('hello', async () => {
			const contractBalance = await ethers.provider.getBalance(tickets.address)
			console.log(contractBalance)
		})
	})
})

//Run this is the terminal after you have launched npx hardhat node within the project folder  { npx hardhat test }
