<template>
  <v-row justify="center" align="center">

    <v-dialog
      v-model="dialog"
      width="500"
    >
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          NFT Ownership
        </v-card-title>
          <v-divider></v-divider>

          <h3>Thanks for your participation</h3>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-col cols="12" sm="8" md="6">
       <v-row> <br></v-row>

        <v-list three-line>
        <template v-for="(item) in items">
          <v-subheader
            v-if="item.header"
            :key="item.header"
            v-text="item.header"
          ></v-subheader>

          <v-divider
            v-else-if="item.divider"
            :key="item.id"
            :inset="item.inset"
          ></v-divider>

          <v-list-item
            v-else
            :key="item.id"
          >
            <v-list-item-avatar>
              <v-img :src="item.avatar"></v-img>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title v-html="item.title"></v-list-item-title>
              <v-list-item-subtitle v-html="item.subtitle"></v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>

      <v-row>
        <v-btn
          class="ma-2"
          :disabled=!checkWallet
          color="success"
          @click="verifyNft()"
         
        >
          {{ checkWallet ?  checkAlreadyVerified ? 'Submit username' : 'Verify NFT' : 'Connect wallet first' }}
          <template v-slot:loader>
            <span>Loading...</span>
          </template>
        </v-btn>

      </v-row>
      
    </v-col>
  </v-row>
 
</template>

<script>

import { mapState } from 'vuex'
import axios from 'axios';
import nuxtStorage from 'nuxt-storage';

console.log('BACKEND URL ', process.env.BACKEND_URL );

const NFT_QUERY =  process.env.BACKEND_URL + '/api/v1/chainquery';

export default {
  components: {},
  data() {
    return {
        chainInfo : [
        {
          chainId : '0x1',
          name : 'eth'
        },
        {
          chainId : '0xfa',
          name : 'fantom'
        },
        {
           chainId: '0xa86a',
           name: 'avalanche'
        },
        {
           chainId: '0xa86a',
           name: 'avalanche'
        },
        {
          chainId: '0x89',
          name: 'polygon'
        },
        {
          chainId : '0x13881',
          name : 'mumbai'
        }
      ],
      itsHover: false,
      dialog: false,
      totalNft : 0,
      info : '',
      defaultImage : 'https://raw.githubusercontent.com/masterviana/nft-marketplace-metadata-api/main/static/images/4.jpg',
      items: [],
      _items: [
      { header: "NFT's owned by wallet" },
      {
        avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
        title: 'Brunch this weekend?',
        id : 1,
        subtitle: `<span class="text--primary">Ali Connors</span> &mdash; I'll be in your neighborhood doing errands this weekend. Do you want to hang out?`,
      },
      { divider: true, inset: true },
      {
        id : 2,
        avatar: 'https://cdn.vuetifyjs.com/images/lists/2.jpg',
        title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>',
        subtitle: `<span class="text--primary">to Alex, Scott, Jennifer</span> &mdash; Wish I could come, but I'm out of town this weekend.`,
      },
      { divider: true, inset: true },
      {
        id : 3,
        avatar: 'https://cdn.vuetifyjs.com/images/lists/3.jpg',
        title: 'Oui oui',
        subtitle: '<span class="text--primary">Sandra Adams</span> &mdash; Do you have Paris recommendations? Have you ever been?',
      },
      { divider: true, inset: true },
      {
        id : 4,
        avatar: 'https://cdn.vuetifyjs.com/images/lists/4.jpg',
        title: 'Birthday gift',
        subtitle: '<span class="text--primary">Trevor Hansen</span> &mdash; Have any ideas about what we should get Heidi for her birthday?',
      },
      { divider: true, inset: true },
      {
        id : 5,
        avatar: 'https://cdn.vuetifyjs.com/images/lists/5.jpg',
        title: 'Recipe to try',
        subtitle: "<a href='https://www.google.com' target='_blank'> link </a>"
      },
    ],
    

    }
  },
  computed: {
    ...mapState('connector', ['isWalletConnected', 'account']),
    getAccount() {
      return this.account
        ? this.$options.filters.truncate(this.account, 9)
        : this.btnText
    },
    checkWallet(){
      return this.account && this.account.length > 0 ? true : false
    },
    checkAlreadyVerified(){
      return this.items && this.items.length > 0 ? true : false;
    }
    
   
  },
  mounted (){

    console.log('Mounted method .... ', window.location.search)

    let urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams.has('oauth_token')); // true
    console.log(urlParams.has('oauth_verifier')); // true

  },
  created() {
    // console.log('Window obj ', window )
   
  },
  methods: 
  {
   async verifyNft () 
    {
      console.log('******* verify nfts ************' );
      let wallet = this.account; //'0x3Ca48686212Af897019a8E89140e64E8F2cC2f30'

      const chainId = await this.$store.dispatch(
        'connector/fetchChainId',
        window.ethereum
      )

      console.log("chainId: ",  chainId )
      console.log('Wallet to search : ', wallet );
      const chainName = this.chainInfo.filter((element)=>
      {
        return element.chainId === chainId;
      });
      console.log('Chain name ', chainName[0].name );

      let result = await this.$store.dispatch('nft-ownership/readNftOfWallet',{ wallet : wallet, chainName : chainName[0].name  }  );
      
      console.log('result : ', result );
      this.totalNft = result.totalFilter;

      if(result && result.nfts ){
        this.processNftList(result.nfts);
      }


    },

    processNftList(nfts){

      const REPLACE_LINK = "<a href='$LINK' target='_blank'> $LINK </a>";
      let nftData = [ { header: "NFT's owned by wallet" } ]
      
      if(nfts && nfts.length > 0 )
      {
        let id = 1;
        for (let index = 0; index < nfts.length; index++) {
          const element = nfts[index];
          const newItem = {
            id : id++,
            collectionName : element.name || 'NO NAME COLLECTION',
            tokenId : element.token_id || -1,
            tokenQyt : element.amount || -1,
            contractAddress : element.token_address || 'NO ADDR'
          }
          newItem.title = 'Collection: ' + newItem.collectionName + ' [Id: '+ newItem.tokenId + '] [Quantity: '+   newItem.tokenQyt+']';
          let link = REPLACE_LINK.replace("$LINK", element.token_uri ).replace("$LINK", element.token_uri )
          newItem.subtitle = link;

          // console.log('metadata ' ,  element);
          if(element.metadata)
          {
            const meta = JSON.parse(element.metadata)
            console.log('meta img : ', meta.image )
            if(meta.image){
              newItem.avatar = meta.image
            }
          }
          else {
            newItem.avatar = this.defaultImage;
          }

          nftData.push(newItem)
          nftData.push({ divider: true, inset: true, id : id++ })
          
        }
        this.items = nftData;
      }
    },
    gotoDiscordServer(){
      const link = 'https://discord.com/channels/' + this.discord_server_id;
      window.open(link, '_blank');

    },
    gotoTwitterAccount(){
      const link = "https://twitter.com/" +  this.twitter_account_username ;
      window.open(link, '_blank');
    },
    gotoPost()
    {
      console.log('goto POST')
      const link = "https://twitter.com/" +  TWITTER_ACCOUNT + '/status/' +  TWITTER_POST_ID ;
      window.open(link, '_blank');
    },
    gotoTwitterProfile()
    {
      console.log('click in twitter profile ',  );
      const link = "https://twitter.com/" + this.u_twitter.username;
      window.open(link, '_blank');
    },

  },

}//export body
</script>

