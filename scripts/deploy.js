// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Tier1 = await hre.ethers.getContractFactory("Tier1");
  const tier1 = await Tier1.deploy();
  await tier1.deployed();
  console.log("Tier1 deployed to:", tier1.address);

//   const Tier2 = await hre.ethers.getContractFactory("Tier2");
//   const tier2 = await Tier1.deploy();
//   await tier2.deployed();
//   console.log("Tier2 deployed to:", tier2.address);

//   const Tier3 = await hre.ethers.getContractFactory("Tier3");
//   const tier3 = await Tier1.deploy();
//   await tier3.deployed();
//   console.log("Tier3 deployed to:", tier3.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
