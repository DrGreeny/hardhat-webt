const { ethers, network } = require("hardhat")
const fs = require("fs")

const FRONT_END_ADDRESSES_FILE =
  "../nextjs-webt/constants/contractAddresses.json"
const FRONT_END_NFTMARKETPLACE_ABI_FILE =
  "../nextjs-webt/constants/nftMarketplaceAbi.json"
const FRONT_END_BASICNFT_ABI_FILE = "../nextjs-webt/constants/basicNftAbi.json"

module.exports = async function () {
  if (process.env.UPDATE_FRONTEND) {
    console.log("Updating front end")
    await updateNftMarketplaceAbi()
    await updateBasicNftAbi()
    await updateContractAddresses()
    console.log("done")
  }
}
async function updateNftMarketplaceAbi() {
  let nftMarketplace
  try {
    nftMarketplace = await ethers.getContract("NftMarketplace")
  } catch (error) {
    console.log(error)
  }
  try {
    fs.writeFileSync(
      FRONT_END_NFTMARKETPLACE_ABI_FILE,
      nftMarketplace.interface.format(ethers.utils.FormatTypes.json)
    )
  } catch (error) {
    console.log(error)
  }
}
async function updateBasicNftAbi() {
  let box
  try {
    box = await ethers.getContract("BasicNft")
  } catch (error) {
    console.log(error)
  }
  try {
    fs.writeFileSync(
      FRONT_END_BASICNFT_ABI_FILE,
      box.interface.format(ethers.utils.FormatTypes.json)
    )
  } catch (error) {
    console.log(error)
  }
}

async function updateContractAddresses() {
  const nftMarketplace = await ethers.getContract("NftMarketplace")
  console.log("Getting Smart Contract...")
  const basicNft = await ethers.getContract("BasicNft")
  console.log("basicNft_SC:", basicNft)
  const chainId = network.config.chainId.toString()
  console.log("CHainId:", chainId)
  const currentAddresses = JSON.parse(
    fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf8")
  )
  console.log("Current addresses:", currentAddresses)
  if (network.config.chainId.toString() in currentAddresses) {
    if (!currentAddresses[chainId].includes(nftMarketplace.address)) {
      currentAddresses[chainId].push(nftMarketplace.address)
      console.log("Replacing NftMarketplace address in frontend")
    }
  } else {
    currentAddresses[chainId] = [nftMarketplace.address]
    console.log("Creating NftMarketplace address in frontend")
  }

  if (network.config.chainId.toString() in currentAddresses) {
    console.log("chainId found in addresses")
    if (!currentAddresses[chainId].includes(basicNft.address)) {
      currentAddresses[chainId].push(basicNft.address)
      console.log("Replacing BasicNft address in frontend")
    }
  } else {
    currentAddresses[chainId] = [basicNft.address]
    console.log("Creating BasicNft address in frontend")
  }
  console.log(currentAddresses)
  fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(currentAddresses))
}

module.exports.tags = ["all", "frontend"]
