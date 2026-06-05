import { network } from "hardhat";
import fs from "node:fs";
import path from "node:path";

async function main() {
  const { ethers } = await network.create("localhost");
  const [deployer] = await ethers.getSigners();

  console.log("Deploying VNmedID_Core with account:", deployer.address);

  const contract = await ethers.deployContract("VNmedID_Core", [], deployer);
  await contract.waitForDeployment();

  const contractAddress = await contract.getAddress();
  const deploymentTx = contract.deploymentTransaction();

  console.log("VNmedID_Core deployed to:", contractAddress);
  console.log("Deployment tx:", deploymentTx?.hash ?? "N/A");

  const factory = await ethers.getContractFactory("VNmedID_Core");

  const backendArtifact = {
    contractName: "VNmedID_Core",
    address: contractAddress,
    abi: JSON.parse(factory.interface.formatJson()),
    network: "localhost",
    chainId: (await ethers.provider.getNetwork()).chainId.toString(),
    deployedAt: new Date().toISOString(),
    deploymentTx: deploymentTx?.hash ?? null,
  };

  const outDir = path.resolve(process.cwd(), "bin", "contract");
  const outFile = path.join(outDir, "VNmedID_Core.json");

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(backendArtifact, null, 2), "utf8");

  console.log("Backend artifact written to:", outFile);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});