const { sumTokens2 } = require('../helper/unwrapLPs')

const factories = {
  avax: '0x8e42f2F4101563bF679975178e880FD87d3eFd4e',
  arbitrum: '0x8e42f2F4101563bF679975178e880FD87d3eFd4e',
  bsc: '0x8e42f2F4101563bF679975178e880FD87d3eFd4e',
}
async function tvl(_, _b, _cb, { api, }) {
  const pools = await api.fetchList({
    target: factories[api.chain],
    itemAbi: 'function getLBPairAtIndex(uint256) view returns (address)',
    lengthAbi: 'uint256:getNumberOfLBPairs',
  })
  const tokenA = await api.multiCall({
    abi: 'address:getTokenX',
    calls: pools,
  })
  const tokenB = await api.multiCall({
    abi: 'address:getTokenY',
    calls: pools,
  })
  const toa = []
  tokenA.map((_, i) => {
    toa.push([tokenA[i], pools[i]])
    toa.push([tokenB[i], pools[i]])
  })
  return sumTokens2({ api, tokensAndOwners: toa, })
}

module.exports = {
  methodology: 'We count the token balances in in different liquidity book contracts',
}

Object.keys(factories).forEach(chain => {
  module.exports[chain] = { tvl }
})