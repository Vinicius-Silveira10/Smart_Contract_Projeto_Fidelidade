// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Governance is Ownable {
    IERC20 public governanceToken;

    struct Proposal {
        uint256 id;
        string description;
        uint256 voteCountYes;
        uint256 voteCountNo;
        bool executed;
        mapping(address => bool) voters;
    }

    mapping(uint256 => Proposal) public proposals;
    uint256 public nextProposalId;

    event ProposalCreated(uint256 indexed proposalId, string description);
    event Voted(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);

    constructor(address _token) Ownable(msg.sender) {
        governanceToken = IERC20(_token);
    }

    function createProposal(string memory description) public onlyOwner {
        uint256 proposalId = nextProposalId++;
        Proposal storage p = proposals[proposalId];
        p.id = proposalId;
        p.description = description;
        p.executed = false;

        emit ProposalCreated(proposalId, description);
    }

    function vote(uint256 proposalId, bool support) public {
        Proposal storage p = proposals[proposalId];
        require(!p.voters[msg.sender], "Already voted");
        require(!p.executed, "Proposal already executed");
        
        uint256 weight = governanceToken.balanceOf(msg.sender);
        require(weight > 0, "No governance tokens");

        p.voters[msg.sender] = true;

        if (support) {
            p.voteCountYes += weight;
        } else {
            p.voteCountNo += weight;
        }

        emit Voted(proposalId, msg.sender, support, weight);
    }

    function executeProposal(uint256 proposalId) public onlyOwner {
        Proposal storage p = proposals[proposalId];
        require(!p.executed, "Already executed");
        p.executed = true;
        // In a complex DAO, this would execute a specific logic/function.
        // Here we just mark it as executed.
    }
}
