const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('../ethereum/build/CampaignFactory.json');

const provider = new HDWalletProvider(
  'crunch length prize smoke current mule spoil easy vast false orient notable',
  'https://kovan.infura.io/v3/df8ba30e457e4a2fa5b8a76d77ed3819'
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log(accounts[0])
  const result = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: '1000000' });

  console.log(result.options.address);
}

deploy().then(() => process.exit(0));
