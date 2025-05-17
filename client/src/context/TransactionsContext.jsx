import React, { useEffect, useState, useSyncExternalStore } from 'react';
import { ethers } from 'ethers';

import { contractABI, contractAddress } from '../utils/constants';

export const TransactionsContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = async () => {
    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);
    return transactionsContract;
}

export const TransactionsProvider = ({children}) => {
    //setting user in welcome.jsx using metamask
    const [currentAccount, setCurrentAccount] = useState('');
    //useState for form data in Welcome.jsx
    const [formData, setFormData] = useState({addressTo: '', amount: '', keyword: '', message: ''});
    const[isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));
    const [transactions, setTransactions] = useState([]);
    
    const handleChange = (e, name) =>{
        setFormData((prevState) => ({...prevState, [name]: e.target.value}));
    }

    const getAllTransactions = async () =>{
        try{
            if (!ethereum) return alert("Please install metamask");

            const transactionsContract = await getEthereumContract();
            const availableTransactions = await transactionsContract.getAllTransactions();

            const structuredTransactions = availableTransactions.map((transaction) =>({
                addressTo: transaction.receiver,
                addressFrom: transaction.sender,
                timestamp: new Date(Number(transaction.timestamp) * 1000).toLocaleString(),
                message: transaction.message,
                keyword: transaction.keyword,
                amount: Number(transaction.amount) / (10**18) //convert wei amount to decimal
            }));
            setTransactions(structuredTransactions);
            console.log(structuredTransactions);
        } catch(error){
            console.log(error);
        }
    }

    //Function to check if a wallet is connected to app
    const checkIfWalletIsConnected = async () => {

       try{
            if (!ethereum) return alert("Please install metamask");

            const accounts = await ethereum.request({method: 'eth_accounts'});

            if(accounts.length){
                setCurrentAccount(accounts[0]);

                getAllTransactions();
            } else {
                console.log('No accounts found');
            }
       } catch (error){
            console.log(error);
            throw new Error("No ethereum object");
       }

    }

    const checkIfTransactionsExist = async () =>{
        try{
            const transactionsContract = await getEthereumContract();
            const transactionCount = await transactionsContract.getTransactionCount();

            window.localStorage.setItem("transactionCount", transactionCount);
        } catch (error){
            console.log(error);
            throw new Error("No ethereum object");
        }
    }

    //function that actually connects wallet to app
    const connectWallet = async () => {
        try {
            if(!ethereum) return alert("Please install metamask");
            
            const accounts = await ethereum.request({method: 'eth_requestAccounts'});
            
            setCurrentAccount(accounts[0]);
        } catch (error){
            console.log(error);
            throw new Error("No ethereum object");
        }
    }
    
    const sendTransaction = async () => {
        try{
            if(!ethereum) return alert("Please install metamask");

            //get form data from Welcome component
            const{ addressTo, amount, keyword, message} = formData;

            const transactionsContract = await getEthereumContract();
            //converts decimal amount to wei
            const parsedAmount = ethers.parseEther(amount);
            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208', ////21000
                    value: parsedAmount._hex, ///0.00001 to wei to hex
                }],
            });
            const transactionHash = await transactionsContract.addToBlockchain(addressTo, parsedAmount, message, keyword);
            console.log("setisloading to true");
            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();
            console.log("setisloading true");
            setIsLoading(false);
            console.log(`Success - ${transactionHash.hash}`);
            
            const transactionCount = await transactionsContract.getTransactionCount();
            setTransactionCount(transactionCount);
            window.location.reload();

        } catch (error){
            console.log(error);
            throw new Error("No ethereum object");
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected();
        checkIfTransactionsExist();
    }, []);

    return (
        <TransactionsContext.Provider value={{connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction, transactions, isLoading}}>
            {children}
        </TransactionsContext.Provider>
    )
}

