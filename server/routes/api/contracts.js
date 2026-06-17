const express = require('express');
const router = express.Router();
const eth = require('ethers');

const CONTRACT_ADDRESS = "0xdac17f958d2ee523a2206206994597c13d831ec7";
const ABI = [
  "function name() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address who) view returns (uint256)",
];

const serializeBigInt = (number) => {
  return JSON.stringify({ number }, (key, value) => 
    typeof value === "bigint" ? value.toString() : value
  );
};

router.get('/', async (req, res) => {
  console.log('Request made.');

  try {
    const provider = new eth.EtherscanProvider('homestead', process.env.ETHERSCAN_API_KEY);
    const contract = new eth.Contract(
      CONTRACT_ADDRESS,
      ABI,
      provider
    );

    console.log(contract);

    const name = await contract.name();
    const totalSupply = await contract.totalSupply();
    const balanceOf = await contract.balanceOf(CONTRACT_ADDRESS);

    const data = {
      name,
      totalSupply: serializeBigInt(totalSupply),
      balanceOf: serializeBigInt(balanceOf)
    }

    res.json({ success: true, data });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
