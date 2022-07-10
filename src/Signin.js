import { useState } from "react";
import './App.scss'


const Signin = ({setUser}) =>{

  const [isConnecting, setIsConnecting] = useState(false);

  const detectProvider = () => {
    let provider;
    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3) {
      provider = window.web3.currentProvider;
    } else {
      window.alert("No Ethereum browser detected! Check out MetaMask");
    }
    return provider;
  };

  const onLoginHandler = async () => {
    const provider = detectProvider();
    if (provider) {
      if (provider !== window.ethereum) {
        console.error(
          "Not window.ethereum provider. Do you have multiple wallet installed ?"
        );
      }
      setIsConnecting(true);
      console.log(isConnecting);
      await provider.request({
        method: "eth_requestAccounts",
      });
      setIsConnecting(false);
    }
    setUser(provider);
  };
  
  return(
    <div className="App">
      <button className="loginButton" onClick={onLoginHandler}>Login</button>
    </div>
  )
}

export default Signin;