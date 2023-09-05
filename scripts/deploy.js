const hre = require("hardhat");
async function main() {
    // ethers is avaialble in the global scope
    const [deployer] = await hre.ethers.getSigners();
    console.log(
      "Deploying the contracts with the account:",
      await deployer.getAddress()
    );

    const CardToken = await hre.ethers.getContractFactory("CardToken");
    const cardToken = await CardToken.deploy();
    await cardToken.deployed();
    console.log("CardToken address:", cardToken.address);

}

  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });


