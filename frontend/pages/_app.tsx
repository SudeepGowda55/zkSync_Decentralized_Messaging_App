import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider, Web3Provider, Signer, Contract } from 'zksync-web3';
import { useState } from 'react';
import { zksyncContext } from '../utils/context';
import { contractDeployedAddress, zkSyncMessagingDAppABI } from '../utils/ContractInfo';
import { BigNumber, ethers } from 'ethers';
import { ChakraProvider } from '@chakra-ui/react'

declare let window: any;

export default function App({ Component, pageProps }: AppProps) {

  const chainId = 280;

  const zksyncProvider: Provider = new Provider("https://zksync2-testnet.zksync.dev");

  const [accountAddress, setAccountAddress] = useState<string | null>(null);
  const [signerInstance, setSignerInstance] = useState<Signer | null>(null);

  const [contractInstance, setContractInstance] = useState<Contract | null>(null);

  async function connectionReq() {
    if (window.ethereum != null) {
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
    if (window.ethereum != null) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts != null) {
          const signer: Signer = (new Web3Provider(window.ethereum)).getSigner();
          setSignerInstance(signer);

          const contract: Contract = new Contract(contractDeployedAddress, zkSyncMessagingDAppABI, signer);
          setContractInstance(contract);

          console.log("Getting user Info")

          if (window.ethereum.networkVersion != chainId) {
            try {
              await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: ethers.utils.hexValue(chainId) }]
              });
              setAccountAddress(accounts[0]);
              window.location.reload();
            } catch (error) {
              console.log(error);
            }
          }
          else {
            setAccountAddress(accounts[0]);
            console.log("Connection Successful");
            window.location.reload();
          }
        }
        else {
          alert("Please Check Metamask whether its connected!!");
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

  async function getAccountsAddress() {
    if (window.ethereum != null) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts != null) {
          setAccountAddress(accounts[0]);
        }
      } catch (error) {
        console.log(error)
      }
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
      <zksyncContext.Provider value={{ connectionReq, getAccountsInfo, getAccountsAddress, accountAddress, zksyncProvider, signerInstance, contractInstance }}>
        <Component {...pageProps} />
      </zksyncContext.Provider>
    </ChakraProvider>
  )
}
