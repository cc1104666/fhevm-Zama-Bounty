import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployPrivateVoting: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("Deploying PrivateVoting contract...");
  console.log("Deployer:", deployer);
  console.log("Network:", hre.network.name);

  const deployment = await deploy("PrivateVoting", {
    from: deployer,
    args: [], // No constructor arguments
    log: true,
    waitConfirmations: hre.network.name === "hardhat" ? 1 : 5,
  });

  console.log(`PrivateVoting deployed to: ${deployment.address}`);
  console.log("PrivateVoting deployment completed successfully!");
};

deployPrivateVoting.tags = ["PrivateVoting", "intermediate", "all"];

export default deployPrivateVoting;
