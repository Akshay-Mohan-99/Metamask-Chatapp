import { useState } from 'react';
import './App.scss';
import Chat from './chat/Chat';
import Signin from './Signin';
import Web3 from "web3";



function App() {

  const[user,setUser] = useState(null);
  
  const onLogin = async (provider) =>{
    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts()
    if(accounts.length === 0){
      console.log("Please connect to metamask!");
    }else if(accounts[0] !== user){
      setUser(accounts[0]);
      
    }
    

  }

  return (
    <>
      {user? <Chat setUser={setUser} user={user}/>: <Signin setUser={onLogin}/>} 
    </>
    
  );
}

export default App;
