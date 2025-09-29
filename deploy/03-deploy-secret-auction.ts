import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deploySecretAuction: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("Deploying SecretAuction contract...");
  console.log("Deployer:", deployer);
  console.log("Network:", hre.network.name);

  const deployment = await deploy("SecretAuction", {
    from: deployer,
    args: [], // No constructor arguments
    log: true,
    waitConfirmations: hre.network.name === "hardhat" ? 1 : 5,
  });

  console.log(`SecretAuction deployed to: ${deployment.address}`);
  console.log("SecretAuction deployment completed successfully!");
};

deploySecretAuction.tags = ["SecretAuction", "advanced", "all"];

export default deploySecretAuction;
