const { dexExport } = require('../helper/chain/sui')
const { mergeExports } = require('../helper/utils')

module.exports = mergeExports([
  dexExport({
    account: '0x3f2d9f724f4a1ce5e71676448dc452be9a6243dac9c5b975a588c8c867066e92',
    poolStr: '::swap::Pool',
    token0Reserve: i => i.fields.reserve_x,
    token1Reserve: i => i.fields.reserve_y,
  }),
  dexExport({
    account: '0x5a7eca40df453efe6bb1feae99e5b8fc072d1252cbd1979eb187d625dc9b47c9',
    poolStr: 'stable_swap::Stable_Pool',
    token0Reserve: i => i.fields.token_x,
    token1Reserve: i => i.fields.token_y,
    isAMM: false,
  })
])
