require("@nomiclabs/hardhat-ethers");
// require('dotenv').config(".env");
require('dotenv').config({ path: `${__dirname}/.env` });
require("@nomiclabs/hardhat-etherscan");

// console.log('process.env.PRIVATE_KEY', process.env.PRIVATE_KEY);

module.exports = {
  solidity: '0.8.9',
  defaultNetwork: "testnet",
  networks: {
    hardhat: {
    },
    kovan: {
      // url: "https://eth-kovan.alchemyapi.io/v2/" + process.env.ALCHEMY_API_KEY,
      url: process.env.ALCHEMY_API_KEY,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 10000000000,
      timeOut: 10000000000
    },
    testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      chainId: 97,
      accounts: [process.env.PRIVATE_KEY],
    },
    // testnet: {
    //   url: "https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
    //   chainId: 4,
    //   accounts: [process.env.PRIVATE_KEY],
    // },
  },
  etherscan: {
    apiKey: {
      bscTestnet: "I9WYATPEV5DNYHBSH8U9RCFWQ1VYP19P1S"
    }
  }
  // api_keys: {
  //   bscscan : "I9WYATPEV5DNYHBSH8U9RCFWQ1VYP19P1S"
  // }
};
