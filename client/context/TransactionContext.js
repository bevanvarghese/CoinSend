import React, { useState, useEffect } from 'react'
import { contractABI, contractAddress } from '../lib/constants'
import { ethers } from 'ethers'

export const TransactionContext = React.createContext()

let eth

if (typeof window !== 'undefined') {
  eth = window.ethereum
}

const getEthereumContract = () => {
  // call the Web3 provider
  const provider = new ethers.providers.Web3Provider(eth)
  // signer is you as the dev signing the contract
  const signer = provider.getSigner()
  // get this specific contract -> the parameters are in constants.js (imported)
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  )
  return transactionContract
}

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    addressTo: '',
    amount: '',
  })

  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }))
  }

  // check if wallet is connected - run everytime we refresh
  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  const connectWallet = async (metamask = eth) => {
    try {
      if (!metamask) return alert('Please install metamask')
      const accounts = await metamask.request({ method: 'eth_requestAccounts' }) //popup to check Metamask
      setCurrentAccount(accounts[0])
    } catch (error) {
      console.error(error)
      throw new Error('No ethereum object.')
    }
  }

  const checkIfWalletIsConnected = async (metamask = eth) => {
    try {
      if (!metamask) return alert('Please install metamask')
      const accounts = await metamask.request({ method: 'eth_accounts' })
      if (accounts.length) {
        setCurrentAccount(accounts[0])
        console.log('Wallet is already connected.')
      }
    } catch (error) {
      console.error(error)
      throw new Error('No ethereum object.')
    }
  }

  const sendTransaction = async (
    metamask = eth,
    connectedAccount = currentAccount
  ) => {
    try {
      if (!metamask) return alert('Please install metamask')

      const { addressTo, amount } = formData
      const transactionContract = getEthereumContract()
      const parsedAmount = ethers.utils.parseEther(amount)

      await metamask.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: connectedAccount,
            to: addressTo,
            gas: '0x7EF40', // 520000 Gwei
            value: parsedAmount._hex,
          },
        ],
      })

      const transactionHash = await transactionContract.publishTransaction(
        addressTo,
        parsedAmount,
        `Transferring ETH ${parsedAmount} to ${addressTo}`,
        'TRANSFER'
      )

      setIsLoading(true)

      await transactionHash.wait()

      // await saveTransaction(
      //   transactionHash.hash,
      //   amount,
      //   connectedAccount,
      //   addressTo
      // )

      setIsLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <TransactionContext.Provider
      value={{
        currentAccount,
        connectWallet,
        sendTransaction,
        handleChange,
        formData,
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}
