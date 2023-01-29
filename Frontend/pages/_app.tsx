import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider, Web3Provider, Signer, Contract } from 'zksync-web3';
import { useState } from 'react';
import { zksyncContext } from '../utils/context';
import { contractDeployedAddress, zkSyncMessagingDAppABI } from '../utils/ContractInfo';
import { BigNumber } from 'ethers';
import { ChakraProvider } from '@chakra-ui/react'

export default function App({ Component, pageProps }: AppProps) {

  const zksyncProvider: Provider = new Provider("https://zksync2-testnet.zksync.dev");
  const [accountAddress, setAccountAddress] = useState<string | null>();
  const [signerInstance, setSignerInstance] = useState<Signer | null>();
  const [contractInstance, setContractInstance] = useState<Contract | null>();
  const [firstName, setFirstName] = useState("");

  async function connectionReq() {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" })
      } catch (error) {
        console.log(error)
      }
    }
    else {
      alert("Please Install Metamask");
    }
  }

  async function getAccountsInfo() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts != null && +window.ethereum.networkVersion == 280) {
          const signer: Signer = (new Web3Provider(window.ethereum)).getSigner();
          setSignerInstance(signer);
          const contract: Contract = new Contract(contractDeployedAddress, zkSyncMessagingDAppABI, signer);
          setContractInstance(contract);
          console.log("Getting user Info")
          setFirstName(await contract.getUserName(accounts[0]))
          setAccountAddress(accounts[0]);
          console.log("Connection Successful");
        }
        else {
          alert("Please switch Metamask to zkSync! network to continue in this website");
          return;
        }
      } catch (error) {
        console.log(error)
      }
    }
    else {
      alert("Please Install Metamask");
    }
  }

  async function convertTimeStamp(time: BigNumber) {
    const timeStamp = new Date((time.toNumber()) * 1000);
    const readableTime = timeStamp.getDate() + "/" + timeStamp.getFullYear();
    // timeStamp.getHours() + "Ho" + timeStamp.getMinutes() + "/" + timeStamp.getSeconds() + "/" + 
    return readableTime;
  }

  return (
    <ChakraProvider>
      <zksyncContext.Provider value={{ accountAddress, getAccountsInfo, convertTimeStamp, firstName, zksyncProvider, signerInstance, contractInstance, connectionReq }}>
        <Component {...pageProps} />
      </zksyncContext.Provider>
    </ChakraProvider>
  )
}
