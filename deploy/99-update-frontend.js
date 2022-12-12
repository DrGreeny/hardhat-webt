const { ethers, network } = require("hardhat")
const fs = require("fs")

const FRONT_END_ADDRESSES_FILE =
  "../nextjs-webt/constants/contractAddresses.json"
const FRONT_END_BOX_ABI_FILE = "../nextjs-webt/constants/boxAbi.json"
const FRONT_END_BASICNFT_ABI_FILE = "../nextjs-webt/constants/basicNftAbi.json"

module.exports = async function () {
  if (process.env.UPDATE_FRONTEND) {
    console.log("Updating front end")
    //updateBoxAbi()
    await updateBasicNftAbi()
    await updateContractAddresses()
    console.log("done")
  }
}
async function updateBoxAbi() {
  console.log("geht hier was ?")
  let box
  try {
    box = await ethers.getContract("Box")
  } catch (error) {
    console.log(error)
  }
  try {
    fs.writeFileSync(
      FRONT_END_BOX_ABI_FILE,
      box.interface.format(ethers.utils.FormatTypes.json)
    )
  } catch (error) {
    console.log(error)
  }
}
async function updateBasicNftAbi() {
  console.log("geht hier was ?")
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
  //const box = await ethers.getContract("Box")
  console.log("Getting Smart Contract...")
  const basicNft = await ethers.getContract("BasicNft")
  console.log("basicNft_SC:", basicNft)
  const chainId = network.config.chainId.toString()
  console.log("CHainId:", chainId)
  const currentAddresses = JSON.parse(
    fs.readFileSync(FRONT_END_ADDRESSES_FILE, "utf8")
  )
  console.log("Current addresses:", currentAddresses)
  /*   if (network.config.chainId.toString() in currentAddresses) {
    if (!currentAddresses[chainId].includes(box.address)) {
      currentAddresses[chainId].push(box.address)
      console.log("Replacing box address in frontend")
    }
  } else {
    currentAddresses[chainId] = [box.address]
    console.log("Creating Box address in frontend")
  } */

  if (network.config.chainId.toString() in currentAddresses) {
    console.log("chainId found in addresses")
    if (!currentAddresses[chainId].includes(basicNft.address)) {
      currentAddresses[chainId].push(basicNft.address)
      console.log("Replacing basicNft address in frontend")
    }
  } else {
    currentAddresses[chainId] = [basicNft.address]
    console.log("Creating basicNft address in frontend")
  }
  console.log(currentAddresses)
  fs.writeFileSync(FRONT_END_ADDRESSES_FILE, JSON.stringify(currentAddresses))
}

module.exports.tags = ["all", "frontend"]
