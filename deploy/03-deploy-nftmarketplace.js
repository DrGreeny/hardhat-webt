const { network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")

module.exports = async function ({ getNamedAccounts, deployments }) {
  //Check GAS price
  const NftMarketplace = await ethers.getContractFactory("NftMarketplace")

  const gasPrice = await NftMarketplace.signer.getGasPrice()
  console.log(`Current gas price: ${gasPrice}`)

  const estimatedGas = await NftMarketplace.signer.estimateGas(
    NftMarketplace.getDeployTransaction()
  )
  console.log(`Estimated gas: ${estimatedGas}`)

  const deploymentPrice = gasPrice.mul(estimatedGas)
  const deployerBalance = await NftMarketplace.signer.getBalance()
  console.log(`Deployer balance:  ${ethers.utils.formatEther(deployerBalance)}`)
  console.log(`Deployment price:  ${ethers.utils.formatEther(deploymentPrice)}`)
  if (deployerBalance.lt(deploymentPrice)) {
    throw new Error(
      `Insufficient funds. Top up your account balance by ${ethers.utils.formatEther(
        deploymentPrice.sub(deployerBalance)
      )}`
    )
  }

  //Start deployment
  console.log("Start")
  const { deploy, log } = deployments
  const { deployer } = await getNamedAccounts()
  console.log(`2. Schritt:${deployer}`)
  const args = []
  const nftMarketplace = await deploy("NftMarketplace", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  })
  console.log("3.Schritt")
  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    log("Verifying....")
    await verify(nftMarketplace.address, args)
  }

  log("----------------------------------------")
}

module.exports.tags = ["all", "nftmarketplace"]
