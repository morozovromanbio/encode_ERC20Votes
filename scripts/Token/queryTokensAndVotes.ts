import { Contract, ethers } from "ethers";
import "dotenv/config";
import * as myTokenJson from "../../artifacts/contracts/Token.sol/MyToken.json";
import { MyToken } from "../../typechain";

// This key is already public on Herong's Tutorial Examples - v1.03, by Dr. Herong Yang
// Do never expose your keys like this
const EXPOSED_KEY =
  "8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f";

async function main() {
  const wallet =
    process.env.PRIVATE_KEY_1 && process.env.PRIVATE_KEY_1.length > 0
      ? new ethers.Wallet(process.env.PRIVATE_KEY_1)
      : new ethers.Wallet(EXPOSED_KEY);

  console.log(`Using address ${wallet.address}`);

  const myTokenContractAddress: string = String(
    process.env.myTokenContractAddress
  );

  const provider = new ethers.providers.JsonRpcProvider(
    process.env.ROPSTEN_URL
  );
  const signer = wallet.connect(provider);

  console.log("Arguments: ", process.argv);

  const address = process.argv.slice(2)[0];
  console.log("address: ", address);

  const myTokenContract: MyToken = new Contract(
    myTokenContractAddress,
    myTokenJson.abi,
    signer
  ) as MyToken;

  const numberOfTokens = await ethers.utils.formatEther(
    (await myTokenContract.balanceOf(address)).toString()
  );
  console.log("Number of tokens for", address, ":", numberOfTokens);

  const numberOfVotes = await ethers.utils.formatEther(
    (await myTokenContract.getVotes(address)).toString()
  );
  console.log("Number of votes for", address, ":", numberOfVotes);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
