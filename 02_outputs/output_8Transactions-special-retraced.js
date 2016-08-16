//------------------- RETRACED SPECIAL TRANSACTIONS ---------------
// these are the special transactions with all data correctly extracted through script /03_outputAnalysis/B_retracingSpecialTransactions.js
// this is an intermediary step before we can merge these transactions and balances into the simpleOwners and Owners Full outputs

var txs_special_full = [
    {
        "address": "0xf451d8d132e522545dc264b23b97168f4d14cf48",
        "ebWei": "1831684157272727273",
        "hash": "0xc9c09c19c4f269c153add6f6477622b8c8e6ce38a43f830f243b7d97597cab3d",
        "inputDataHex": "0x4d485f616138623437613461303833623633636637646638313365376465373363303320",
        "inputDataString": "MH_aa8b47a4a083b63cf7df813e7de73c03 ",
        "txType": "direct"
    },
    {
        "address": "0x988e1dadc88b422276d62b23310241d476ba91ee",
        "ebWei": "4500000000000000000",
        "hash": "0x817b452fd16a7f60a52ef8f2b68b0e869641bf39f7875fab14440b3c17a1d459",
        "inputDataHex": "0x6d6f6f6e",
        "inputDataString": "moon",
        "txType": "direct"
    },
    {
        "address": "0x416bdadc20ae5238ea7b1373fb783e893d51048e",
        "ebWei": "4693695652173913044",
        "hash": "0xeea3be70ab2204693fb0bc30a37ab09aa47f790bd61f058efd7c2be4fa64a66b",
        "inputDataHex": "0x64616f20",
        "inputDataString": "dao ",
        "txType": "direct"
    },
    {
        "address": "0x83c3c47f66620fb941efdfa53314264c38f9cd47",
        "ebWei": "216666666666666667",
        "hash": "0x68844b6e6912afe998d522a8f7e85333c99405a9ab28618ad673f7a5857ce345",
        "inputDataHex": "0x000e00000000",
        "inputDataString": "\u0000\u000e\u0000\u0000\u0000\u0000",
        "txType": "direct"
    },
    {
        "address": "0xb8238f54a0a08b0f93a7776eb2b18008d43bce68",
        "ebWei": "833333333333333334",
        "hash": "0xdf3ba8f1316e5b7f0b6d6b9378ed89c342a70bb5bd4421e9c223fed47e1a6327",
        "inputDataHex": "0xdeadbeaf",
        "inputDataString": "Þ­¾¯",
        "txType": "direct"
    },
    {
        "address": "0xe1d3f1e384884a9c3df2a2f09266f890d085061e",
        "ebWei": "10000000000000000000",
        "hash": "0x4febd1013d8ebd1ca226fe38d8251543264c1632404cd6eb8ecfa2cd2d26f2c1",
        "inputDataHex": "0x64616f",
        "inputDataString": "dao",
        "txType": "direct"
    },
    {
        "address": "0x2910543af39aba0cd09dbb2d50200b3e800a63d2",
        "ebWei": "2500000000000000",
        "hash": "0xc407a2f6c9798b411010d72d86a25e7e425766a0337bb4056ba9a64c06877335",
        "inputDataHex": "0xbb9bc244d798123fde783fcc1c72d3bb8c189413",
        "inputDataString": "»ÂD×\u0012?Þx?Ì\u001crÓ»\u0018\u0013",
        "txType": "direct"
    },
    {
        "address": "0x5aaf36bcfb0f425e061cc7f802a7e08215835f5a",
        "ebWei": "200000000000000000",
        "hash": "0x721201e06a86d2149777d4128211e423e3d60bee238c67a7702860f73b281e04",
        "inputDataHex": "0x617368706478",
        "inputDataString": "ashpdx",
        "txType": "direct"
    },
    {
        "address": "0xc7d97325ead515784cb841ca337025f8d8846305",
        "ebWei": "200000000000000000",
        "hash": "0xa62b24a2b4dae9b8e6d0837ee7ac2bb9aae11473b2af4a26283fe8d9f4abb039",
        "inputDataHex": "0x88ce6c494453a17ec54ee8162fdf3989334fb2f0108df77fabc9b0046f00a244",
        "inputDataString": "ÎlIDS¡~ÅNè\u0016/ß93O²ð\u0010÷«É°\u0004o\u0000¢D",
        "txType": "direct"
    },
    {
        "address": "0xba38d80a865204ca47f4ddd7ca787d6a141bac21",
        "ebWei": "1800000000000000000",
        "hash": "0xfcd775fbd61c11bae27f054af5d5c160c6e7a61c2f0782aba5779c2799826f6a",
        "inputDataHex": "0x39",
        "inputDataString": "9",
        "txType": "direct"
    },
    {
        "address": "0x77f9e7a13477e321dc3f7e8a444cbf9cc4579040",
        "ebWei": "300000000000000000",
        "hash": "0x81c2a284cfdc4c7dfb77cb0ca8181eb3e65200243ac06d2654817d52a490b904",
        "inputDataHex": "0x4578706572696d656e74616c2062757920696e746f205468652044414f",
        "inputDataString": "Experimental buy into The DAO",
        "txType": "direct"
    },
    {
        "address": "0x3348435028bf37e837b3727195d9cebb1932b4af",
        "ebWei": "518518518518518453",
        "hash": "0x842ee5915df32094092795148cc1dcc50e4e36a69a3a93432243be800babd3d9",
        "inputDataHex": "0x0000000000000000000000000000000000000000",
        "inputDataString": "\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
        "txType": "direct"
    },
    {
        "address": "0xab9fbaae52184e07826b04c0c53d2e660e4df7a6",
        "ebWei": "1855828627482170704",
        "hash": "0xadd0897b67b2cdc722dbbe4cec625facf67c9632b4455fc89a05cab68eb88dae",
        "inputDataHex": "0x496e766573746d656e7420696e2044414f",
        "inputDataString": "Investment in DAO",
        "txType": "direct"
    },
    {
        "address": "0xcfb032c11dc955683144e7d80a79a5d1508d3e88",
        "ebWei": "1296296296296296297",
        "hash": "0x999de8e98efe5e9d718f10bc400cf9cf5d3ccc901d814b90a126f40385ca9dba",
        "inputDataHex": "0x343434",
        "inputDataString": "444",
        "txType": "direct"
    },
    {
        "address": "0x0fe279b81d6e61b966fdb2e17441b6826b4f03c6",
        "ebWei": "5185185185185185186",
        "hash": "0xdf44edca74fdf558c42926fc1b14019a45d9051dbd98809a046f65961bf2fb86",
        "inputDataHex": "0x676f20646f61",
        "inputDataString": "go doa",
        "txType": "direct"
    },
    {
        "address": "0x4fd4220553b0610d5b8973f4f80c29ec7fa8e336",
        "ebWei": "518518518518518519",
        "hash": "0xe4d6d966ab44950ab817658d5dca3488667d4bbc5e2ceed877447df8e171a25f",
        "inputDataHex": "0x7761796e65",
        "inputDataString": "wayne",
        "txType": "direct"
    },
    {
        "address": "0x3348435028bf37e837b3727195d9cebb1932b4af",
        "ebWei": "1826643259259259260",
        "hash": "0xeb43965e5b46f6379518d734cd55990f2c0a7aafc83cea40465e535493007d1d",
        "inputDataHex": "0x0000000000000000000000000000000000000000",
        "inputDataString": "\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
        "txType": "direct"
    },
    {
        "address": "0xc6de8e40a9636c9ea9f778aac9ff10e9ae36e853",
        "ebWei": "285714285714285715",
        "hash": "0x6267180b6596799ed249a42708f1ac53280d52c7a34c5b7631bfeb1e36f5112e",
        "inputDataHex": "0x746573742064616f",
        "inputDataString": "test dao",
        "txType": "direct"
    },
    {
        "address": "0x094440bd44bda861f31ed90a4f8e3470e6a00b6b",
        "ebWei": "2285714285714285715",
        "hash": "0x9a0fa4fe28a4dea537e49563663f020d70778346b69f50e9944fa95a665555bd",
        "inputDataHex": "0xbb9bc244d798123fde783fcc1c72d3bb8c189413",
        "inputDataString": "»ÂD×\u0012?Þx?Ì\u001crÓ»\u0018\u0013",
        "txType": "direct"
    },
    {
        "address": "0xbb14de435f9831ab5b1e7cb87df12b1b01d32465",
        "ebWei": "775862068965517242",
        "hash": "0x922682a0f920f57d393179068118fcb11babcd105c2fb5616b10912a3b65896a",
        "inputDataHex": "0xbb14de435f9831ab5b1e7cb87df12b1b01d32465",
        "inputDataString": "»\u0014ÞC_1«[\u001e|¸}ñ+\u001b\u0001Ó$e",
        "txType": "direct"
    },
    {
        "address": "0xb6a5f536b5df6b7af288497dc1c7dd213dd573e3",
        "ebWei": "620689655172413794",
        "hash": "0x7544d60c17e92f434484a58fdeffffb93b43f4d1cedec76d8828079726a43dc9",
        "inputDataHex": "0xb6a5f536b5df6b7af288497dc1c7dd213dd573e3",
        "inputDataString": "¶¥õ6µßkzòI}ÁÇÝ!=Õsã",
        "txType": "direct"
    },
    {
        "address": "0x6ec8094f6025d6919240092a871789b3555fc473",
        "ebWei": "6943146032244694",
        "hash": "0x160b2c00b0f867b38d0a0017039cd516b436ca120191e5be72d8c233eeace6af",
        "inputDataHex": "0x32352f30352f32303136",
        "inputDataString": "25/05/2016",
        "txType": "direct"
    },
    {
        "address": "0x3db1611e4716eecc59b12e473cf61b16603a4f54",
        "ebWei": "59666666666666666667",
        "hash": "0x8f39ef0b458e2716406cd65a1035ea4952dfa4b3879917c8aead4a31b256eca8",
        "inputDataHex": "0xbb9bc244d798123fde783fcc1c72d3bb8c189413",
        "inputDataString": "»ÂD×\u0012?Þx?Ì\u001crÓ»\u0018\u0013",
        "txType": "direct"
    },
    {
        "address": "0x3348435028bf37e837b3727195d9cebb1932b4af",
        "ebWei": "466887006666666667",
        "hash": "0xa50d5f5733d5d6c90f6c97ecf1b00aa592672559e1ebfdcd77f7b7007c5d00b3",
        "inputDataHex": "0x0000000000000000000000000000000000000000",
        "inputDataString": "\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000",
        "txType": "direct"
    },
    {
        "address": "0x7c0dd3e731817b786abeeed3223af18ae428bb71",
        "ebWei": "3333333333333334",
        "hash": "0xf571f14efde594a22fd9d59c8d7de5534bd21445abefd14a414cfb16b3f4119f",
        "inputDataHex": "0x462659203242544320383545544820352c36363644414f",
        "inputDataString": "F\u0026Y 2BTC 85ETH 5,666DAO",
        "txType": "direct"
    },
    {
        "address": "0x6d272fc98f898eaf0dab74d3b4e14923de2d9068",
        "ebWei": "28330000000000000000",
        "hash": "0xa64c2d6cf25589ebb2888ba0171761433c983a9cc96742b49530e03438597696",
        "inputDataHex": "0x462659203242544320383545544820352c36363644414f",
        "inputDataString": "F\u0026Y 2BTC 85ETH 5,666DAO",
        "txType": "direct"
    },
    {
        "address": "0x14dbd3aa690f8984e381f6082a3b0eb133e97f1f",
        "ebWei": "6331666666666666667",
        "hash": "0xe808b6295c608c1a8fa372e859ebd7bf86d863f120106826ca7731c2e807f752",
        "inputDataHex": "0x44414f",
        "inputDataString": "DAO",
        "txType": "direct"
    },
    {
        "address": "0x725af55f525cd269418787584a4aad98ad713335",
        "ebWei": "1668333333333333334",
        "hash": "0x8b207a476664ca6ae19a94de83199b642f7cd92b6fe89e2e6e9637b02002f939",
        "inputDataHex": "0x44414f",
        "inputDataString": "DAO",
        "txType": "direct"
    },
    {
        "address": "0x337942d058bc853cfae64b55faf7f5af8aa14b90",
        "ebWei": "11528336663333333334",
        "hash": "0x52c1d5a7e35ba6239cac0040931f2a27ada4cc3873572c4a3c7faef6ea6bad68",
        "inputDataHex": "0x44414f",
        "inputDataString": "DAO",
        "txType": "direct"
    },
    {
        "address": "0xd35eef4b27829acde30d772af7160bf682a20b54",
        "ebWei": "466666666666666667",
        "hash": "0xe9607b6f809fb1c09b6069789f9c10f4f7803ed893b91df01503baa5ad833647",
        "inputDataHex": "0xd35eef4b27829acde30d772af7160bf682a20b54",
        "inputDataString": "Ó^ïK'Íã\rw*÷\u0016\u000bö¢\u000bT",
        "txType": "direct"
    },
    {
        "address": "0xf709a5dd9e3519be7efb1256d70a713810e665c5",
        "ebWei": "1000000000000000000",
        "hash": "0xb4e0c1d9a89cf9315dc2c1c1bdef900f8f8667adad14e60cdcd286087cdd8ac9",
        "inputDataHex": "0x457468657220666f722044414f20746f6b656e73",
        "inputDataString": "Ether for DAO tokens",
        "txType": "direct"
    },
    {
        "address": "0xfdf85012c8ce931b465c2ad62b7316bbc4726d7d",
        "ebWei": "3320000000000000000",
        "hash": "0x6de730c58ad14732a78f1bae945b56c38e3f0df0fae6af3397209a395da2ca50",
        "inputDataHex": "0x656972616e73696d6973",
        "inputDataString": "eiransimis",
        "txType": "direct"
    },
    {
        "address": "0xa31347d1e275fea692dc340ac6e804fdccc6244d",
        "ebWei": "666666666666666667",
        "hash": "0x4959509c13809c2ef26ce3424ae096befea436f1dbba7c7c5698def140a784a5",
        "inputDataHex": "0x322065746820746f2064616f",
        "inputDataString": "2 eth to dao",
        "txType": "direct"
    },
    {
        "address": "0x671cdc229ab5eb32b20dcb5843964a6be041913a",
        "ebWei": "805046290000000000",
        "hash": "0x22bb39d4ffcadc112eb51e383988a239517e643ee7b426a7888281e1ed2a8fb3",
        "inputDataHex": "0xbb9bc244d798123fde783fcc1c72d3bb8c189413",
        "inputDataString": "»ÂD×\u0012?Þx?Ì\u001crÓ»\u0018\u0013",
        "txType": "direct"
    },
    {
        "address": "0xa32a50ad7f89c3b859d2d897b1ddec74b98087f1",
        "ebWei": "9833333333333333334",
        "hash": "0xdd0dcc83b9694c7e76a2172b23730501ba9e13df1df1655afde7c03aa0f9b164",
        "inputDataHex": "0xdb",
        "inputDataString": "Û",
        "txType": "direct"
    },
    {
        "address": "0x1c985b4bd3d62ae081976060531c967baba7eea4",
        "ebWei": "25000000000000000000",
        "hash": "0xc6f032de449356802778a5e807c20a90efa5ce4b887aec77b34b6811cb12b91d",
        "inputDataHex": "0x1c985b4bd3d62ae081976060531c967baba7eea4",
        "inputDataString": "\u001c[KÓÖ*à``S\u001c{«§î¤",
        "txType": "direct"
    },
    {
        "address": "0xb21eb2fe0a1238bc5edc8187c5d5c16f906a94bd",
        "ebWei": "666666666666666667",
        "hash": "0xfe4a91f9fa7cd2b2343d90eda2f832643ddd8c152389e8869ccbf311c52a4129",
        "inputDataHex": "0x44616f20436f6e7472616374",
        "inputDataString": "Dao Contract",
        "txType": "direct"
    },
    {
        "address": "0xc41e66aae07316211752bcc5e78b1584dfcfc1c4",
        "ebWei": "103000000000000000000",
        "hash": "0xfab29708f09dedb0eee628757435fdabbf372c0a9389cae3a8cca4060eea9439",
        "inputDataHex": "0xc41e66aae07316211752bcc5e78b1584dfcfc1c4",
        "inputDataString": "Ä\u001efªàs\u0016!\u0017R¼Åç\u0015ßÏÁÄ",
        "txType": "direct"
    },
    {
        "address": "0xf709a5dd9e3519be7efb1256d70a713810e665c5",
        "ebWei": "1000000000000000000",
        "hash": "0x07a13263b6011c3fbc9431c21059b4ae5c67a44e6db649a0629b88b567c102f8",
        "inputDataHex": "0x457468657220666f722044414f20746f6b656e7320283229",
        "inputDataString": "Ether for DAO tokens (2)",
        "txType": "direct"
    }
]