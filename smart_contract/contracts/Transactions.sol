//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Transactions{
    uint256 transactionCount;

    event Transfer(address from, address receiver, uint amount, string message, uint256 timestamp, string keyword);

    //form data taken when user inputs information for the order
    struct TransferStruct {
        address sender;
        address receiver;
        uint amount;
        string message;
        uint256 timestamp;
        string keyword;
    }

    //history of transactions based on user
    TransferStruct[] transactions;

    //adds the transactions to the blockchain, increases the number of transactions for the user, and updates the newest transactions onto their main page
    function addToBlockchain(address payable receiver, uint amount, string memory message, string memory keyword) public{
        transactionCount +=1;
        transactions.push(TransferStruct(msg.sender, receiver, amount, message, block.timestamp, keyword));

        emit Transfer(msg.sender, receiver, amount, message, block.timestamp, keyword);
    }

    //gets the transactions for user
    function getAllTransactions() public view returns(TransferStruct[] memory){
        return transactions;
    }

    //gets the transaction count for user
    function getTransactionCount() public view returns (uint256){
        return transactionCount;
    }
}
