import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployHelloFHEVM: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  console.log("Deploying HelloFHEVM contract...");
  console.log("Deployer:", deployer);
  console.log("Network:", hre.network.name);

  const deployment = await deploy("HelloFHEVM", {
    from: deployer,
    args: [], // No constructor arguments
    log: true,
    waitConfirmations: hre.network.name === "hardhat" ? 1 : 5,
  });

  console.log(`HelloFHEVM deployed to: ${deployment.address}`);
  console.log("HelloFHEVM deployment completed successfully!");
};

deployHelloFHEVM.tags = ["HelloFHEVM", "beginner", "all"];

export default deployHelloFHEVM;
