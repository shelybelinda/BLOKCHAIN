import React, { Component } from "react";
import ItemManager from "./contracts/ItemManager.json";
import Item from "./contracts/Item.json";
import getWeb3 from "./getWeb3";
import "./App.css";

class App extends Component {
  state = {cost: 0, itemName: "exampleItem1", loaded:false};
 componentDidMount = async () => {
 try {
 // Get network provider and web3 instance.
 this.web3 = await getWeb3();
 // Use web3 to get the user's accounts.
 this.accounts = await this.web3.eth.getAccounts();
 // Get the contract instance.
 const networkId = await this.web3.eth.net.getId();
 this.itemManager = new this.web3.eth.Contract(
  ItemContract.abi,
  ItemContract.networks[this.networkId] && ItemContract.networks[this.networkId].address,
  );
  // Set web3, accounts, and contract to the state, and then proceed with an
  // example of interacting with the contract's methods.
  this.listenToPaymentEvent();
  this.setState({ loaded:true });
  } catch (error) {
  // Catch any errors for any of the above operations.
  alert(
  `Failed to load web3, accounts, or contract. Check console for details.`,
  );
  console.error(error);
  }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.methods.set(5).send({ from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.methods.get().call();

    // Update state with the result.
    this.setState({ storageValue: response });
  };
  listenToPaymentEvent = () => {
    let self = this;
    this.itemManager.events.SupplyChainStep().on("data", async function(evt) {
    if(evt.returnValues._step == 1) {
    let item = await self.itemManager.methods.items(evt.returnValues._itemIndex).call();
    console.log(item);
    alert("Item " + item._identifier + " was paid, deliver it now!");
    };
    console.log(evt);
    });
    }
  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 42</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
      </div>
    );
  }
}

export default App;
