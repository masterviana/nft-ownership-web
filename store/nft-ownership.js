import axios from 'axios';
const NFT_QUERY =  process.env.BACKEND_URL + '/api/v1/chainquery'


export const state = () => ({
    provider: null,
    ntsList : null,
    totalOwned : null,
    totalFilter : null
  })
  
  export const mutations = {
    setProvider(state, payload) {
      state.provider = payload
    },
    setSigner(state, payload) {
      state.signer = payload
    },
    setAccount(state, payload) {
      state.account = payload
    },
    setChainId(state, payload) {
      state.chainId = payload
    },
    setWalletConnection(state, payload) {
      state.isWalletConnected = payload
    },
    setMetamaskActive(state, payload) {
      state.isMetamaskActive = payload
    },
  }

  export const actions = {
    
    async readNftOfWallet({ commit, dispatch }, input) {
      try {

        console.log('**************** store:readNftOfWallet **************** ', input );


        //console.log('endpoint : ', NFT_QUERY );

        const data = {
            wallet : input.wallet,
            options : {
                chain : input.chainName
            }
        }

        console.log('post data : ',  data);

        const res = 
            await axios.post(NFT_QUERY, data, {
            headers: {
                // Overwrite Axios's automatically set Content-Type
                'Content-Type': 'application/json'
            }
            });
        
        
    
        return res.data.data; // '{"answer":42}'


      } catch (err) {
        console.error('Error getting nft ', err);
        return {};
      }
    },
  }
  export const getters = {
    getActiveChain: (state) =>
      state.networks.find((item) => item.chainId === state.activeNetwork),
    account: (state) => state.account,
    signer: (state) => state.signer,
  }
  