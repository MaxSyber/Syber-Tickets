//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

//Contract name to create soulbound NFTs
contract Tickets {
	using Strings for uint256;

	string public name;
	uint256 public totalSupply;
	uint256 public maxSupply;
	address public ticketMaster;
	string private baseURI;
	uint256 public sellAmount;
	uint256 public returnAmount;

	mapping(uint256 => bool) private _exists;
	mapping(uint256 => string) private _tokenURIs;
	mapping(address => uint256) private balance;
	mapping(uint256 => address) private owner;


	event Log(string message);
	event Transfer(
		address indexed from,
		address indexed to,
		uint256 indexed tokenId
		);

	event Sell(
		address indexed to,
		address indexed from,
		uint256 tokenId,
		uint256 amount
		);

	event Return(
		address indexed to,
		address indexed from,
		uint256 tokenId,
		uint256 amount
		);

//Ran at start and contract owner passes in their perameters
	constructor(
		string memory _name,
		uint256 _maxSupply,
		uint256 _sellAmount,
		uint256 _returnAmount
		) {
		name = _name;
		maxSupply= _maxSupply;
		returnAmount = _returnAmount;
		sellAmount = _sellAmount;
		ticketMaster = msg.sender;  //need to refactor in my .env file for private address
		baseURI = "file://ticketMetadata/";
		}
	
	modifier onlyTicketMaster {
		require(msg.sender == ticketMaster, "Only the ticket Master can call this function");
		_;
	}
	//require that mint address is no a  address
	function _mint(address to, uint256 tokenId) internal virtual {
		require(to != address(0), "ERC: mint to the zero address");
		require(!_exists[tokenId], "Token already exists");
		
		balance[to]++;
		owner[tokenId] = to;
		_exists[tokenId] = true;

		emit Transfer(address(0), to, tokenId);
	}
	function mint(address to, uint256 tokenId, string memory _tokenURI) public onlyTicketMaster virtual {
		require(to != address(0), "ERC: mint to the zero address");
		require(totalSupply < maxSupply, "All Tickets Minted");

		_mint(to, tokenId);
		_setTokenURI(tokenId, _tokenURI);
		totalSupply++;
	}

	function mintAllTokens(address to) public onlyTicketMaster{
		for(uint256 i = 0; i < maxSupply; i++) {
			mint(to , i , i.toString());
		}
	}

	function tokenURI(uint256 tokenId) public view returns (string memory) {
		require(_exists[tokenId], "URI querry for nonexistent token");
		
		string memory _tokenURI = _tokenURIs[tokenId];

		if (bytes(_tokenURI).length > 0) {
			return string(abi.encodePacked(baseURI, _tokenURI));
		} else {
			return string(abi.encodePacked(baseURI, tokenId));
		}
	}

	function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
		if (bytes(_tokenURI).length > 0) {
			_tokenURIs[tokenId] = _tokenURI;
		} else {
			_tokenURIs[tokenId] = string(abi.encodePacked(tokenId));
		}
	}
	
	function balanceOf(address owner) external virtual view returns (uint256) {
		return balance[owner];
	}

	function ownerOf(uint256 tokenId) external virtual view returns (address) {
		return owner[tokenId];
	}

	function buyTicket(address to, uint256 tokenId) payable public {
		require(balance[msg.sender] < 2, "Each address can only own a maximum of two tickets");
		require(to != address(0), "Transfer to a zero address");
		require(ticketMaster == owner[tokenId], "This ticket is already sold");
		require(to == ticketMaster, 'Only ticketMaster can sell tickets');
		require(msg.value == sellAmount, 'Input Price does not match ticket price');
		
		owner[tokenId] = msg.sender;
		balance[to]--;
		balance[msg.sender]++;

		(bool success, ) = to.call{value: msg.value}("");
		require(success, "Transfer failed");

		emit Sell(to, msg.sender, tokenId, msg.value);
	}

	function returnTicket(address to, uint256 tokenId) public payable {
		require(to == owner[tokenId], "Return value not being sent to ticket holder");
		require(msg.sender == owner[tokenId], "You are not the ticket holder");
		
		owner[tokenId] = ticketMaster;
		balance[to]--;
		balance[ticketMaster]++;

		address payable toPayable = payable(to);
		withdraw(toPayable);		

		emit Return(to, msg.sender, tokenId, returnAmount);
	}

	function withdraw(address payable to) private {
		require(to != address(0), "Transfer to a zero address");
		(bool success, ) = to.call{value: returnAmount}("");
		require(success, "Transfer failed"); 
	}

	function cancelTicket(address to, uint256 tokenId) payable onlyTicketMaster public {
		require(to == owner[tokenId], "You are not the ticket holder");
		require(msg.value == returnAmount, 'Input Price does not match return value');
		
		owner[tokenId] = ticketMaster;
		balance[to]--;
		balance[msg.sender]++;

		(bool success, ) = to.call{value: msg.value}("");
		require(success, "Transfer failed");

		emit Return(to, msg.sender, tokenId, msg.value);
	}

	function adminDeposit() onlyTicketMaster external payable {
		require(msg.value > 0, "Amount must be greater than 0");
	}

	function adminWithdraw(uint256 amount) onlyTicketMaster external {
		require(address(this).balance >= amount);
		(bool success, ) = msg.sender.call{value: amount}("");
		require(success, "Admin Withdraw failed");
	}

	function getContractBalance() external view onlyTicketMaster returns (uint256) {
        return address(this).balance;
    }
}
