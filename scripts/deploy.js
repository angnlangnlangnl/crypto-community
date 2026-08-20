const hre = require("hardhat");

async function main() {
  console.log("开始部署合约到", hre.network.name, "网络...");
  
  const ChatToken = await hre.ethers.getContractFactory("ChatToken");
  const chatToken = await ChatToken.deploy();
  await chatToken.deployed();
  console.log("ChatToken 已部署到:", chatToken.address);
  
  const DecentralizedChat = await hre.ethers.getContractFactory("DecentralizedChat");
  const chat = await DecentralizedChat.deploy(chatToken.address);
  await chat.deployed();
  console.log("DecentralizedChat 已部署到:", chat.address);
  
  const deploymentInfo = {
    network: hre.network.name,
    tokenAddress: chatToken.address,
    chatAddress: chat.address,
    timestamp: new Date().toISOString()
  };
  
  const fs = require("fs");
  fs.writeFileSync("deployment-info.json", JSON.stringify(deploymentInfo, null, 2));
  
  console.log("\n=== 部署完成 ===");
  console.log("网络:", hre.network.name);
  console.log("代币合约:", chatToken.address);
  console.log("聊天合约:", chat.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
