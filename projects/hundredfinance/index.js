const {compoundExports, compoundExportsWithAsyncTransform} = require('../helper/compound')
const sdk = require("@defillama/sdk");
const BigNumber = require("bignumber.js");
const comptroller = "0x0f390559f258eb8591c8e31cf0905e97cf36ace2"

const usdcEth = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
const usdcFantom = "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75"
const usdcArbitrum = "0xff970a61a04b1ca14834a43f5de4533ebddb5cc8"

const daiEth = "0x6b175474e89094c44da98b954eedeac495271d0f"
const daiFantom = "0x8d11ec38a3eb5e956b052f67da8bdc9bef8abf3e"

const usdtEth = "0xdac17f958d2ee523a2206206994597c13d831ec7"
const usdtArbitrum = "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9"

const usdcFantomBAMM = "0xEDC7905a491fF335685e2F2F1552541705138A3D"
const daiFantomBAMM = "0x6d62d6Af9b82CDfA3A7d16601DDbCF8970634d22"
const usdcArbitrumBAMM = "0x04208f296039f482810B550ae0d68c3E1A5EB719"
const usdtArbitrumBAMM = "0x24099000AE45558Ce4D049ad46DDaaf71429b168"


const bamms = {
    "fantom" : [
        {"bamm" : usdcFantomBAMM, "underlying" : usdcFantom, "underlyingEth" : usdcEth },
        { "bamm" : daiFantomBAMM, "underlying" : daiFantom, "underlyingEth" : daiEth }
    ],
    "arbitrum" : [
        {"bamm" : usdcArbitrumBAMM, "underlying" : usdcArbitrum, "underlyingEth" : usdcEth },
        { "bamm" : usdtArbitrumBAMM, "underlying" : usdtArbitrum, "underlyingEth" : usdtEth }
    ]
} 

async function bammTvlFunc(chain, retTvl, unixTimestamp, ethBlock, chainBlocks) {
    const block = chainBlocks[chain]

    const balances = await retTvl(unixTimestamp, ethBlock, chainBlocks)

    for(let bamm of bamms[chain]) {
        const bammBalance = (
            await sdk.api.erc20.balanceOf({
              target: bamm["underlying"],
              owner: bamm["bamm"],
              block: block,
              chain: chain,
            })
          ).output;
        
        const ethToken = bamm["underlyingEth"]
        sdk.util.sumSingleBalance(balances, ethToken, bammBalance)
    }

    return balances
}

function tvlWithBamm() {
    const chain = arguments[1]
    const retVal = compoundExportsWithAsyncTransform(...arguments)
    return {tvl: async(...args)=> bammTvlFunc(chain, retVal.tvl, ...args), borrowed: retVal.borrowed}
}

module.exports={
    hallmarks: [
        [1647302400, "Reentrancy attack"],
        [1681541920, "Protocol hacked (oc Optimism)"],

    ],
    ethereum:compoundExports(comptroller, "ethereum", "0xfCD8570AD81e6c77b8D252bEbEBA62ed980BD64D", "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"),
    arbitrum:tvlWithBamm(comptroller, "arbitrum", "0x8e15a22853A0A60a0FBB0d875055A8E66cff0235", "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"),
    fantom:tvlWithBamm(comptroller, "fantom", "0xfCD8570AD81e6c77b8D252bEbEBA62ed980BD64D", "0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83"),
    harmony:compoundExportsWithAsyncTransform(comptroller, "harmony", "0xbb93C7F378B9b531216f9aD7b5748be189A55807", "0xcf664087a5bb0237a0bad6742852ec6c8d69a27a"),
    moonriver:compoundExportsWithAsyncTransform("0x7d166777bd19a916c2edf5f1fc1ec138b37e7391", "moonriver", "0xd6fcBCcfC375c2C61d7eE2952B329DcEbA2D4e10", "0x98878b06940ae243284ca214f92bb71a2b032b8a"),
    xdai:compoundExportsWithAsyncTransform("0x6bb6ebCf3aC808E26545d59EA60F27A202cE8586", "xdai", "0x6eDCB931168C9F7C20144f201537c0243b19dCA4", "0xe91d153e0b41518a2ce8dd3d7944fa863463a97d"),
    polygon:compoundExportsWithAsyncTransform("0xedba32185baf7fef9a26ca567bc4a6cbe426e499", "polygon", "0xEbd7f3349AbA8bB15b897e03D6c1a4Ba95B55e31", "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"),
    optimism:compoundExportsWithAsyncTransform("0x5a5755E1916F547D04eF43176d4cbe0de4503d5d", "optimism", "0x1A61A72F5Cf5e857f15ee502210b81f8B3a66263", "0x4200000000000000000000000000000000000006"),
}
