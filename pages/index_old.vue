<template>
  <v-row justify="center" align="center">

    <v-dialog
      v-model="dialog"
      width="500"
    >
      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          NFT whitelist
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
      <v-row>
       
        <v-col v-if="!isTwitterConnect" cols="6" sm="6" md="6">
          
            <v-row>
              <button class="btn mini login-btn v-btn v-btn--is-elevated v-size--default"
              :class="{ load: connectLoader }"
                @click="twitterConnect"
                @mouseenter="itsHover = true"
                @mouseleave="itsHover = false">Twitter connect</button>
          </v-row>
    
       </v-col>

       <v-col  v-else cols="6" sm="6" md="6">

         <v-row class="font-weight-thin"  >
           <a @click="gotoTwitterProfile" > @{{u_twitter.username}}</a>
            <!-- username : @{{u_twitter.username}} -->
          </v-row>
           <v-row class="font-weight-thin">
            name : {{u_twitter.name}}
          </v-row>
          <v-row class="font-weight-thin">
            userID : {{u_twitter.id }}
          </v-row>

       </v-col>
       
       <v-col v-if="!isDiscordConnect" cols="6" sm="6" md="6">
        <v-row>
          <button class="btn mini login-btn v-btn v-btn--is-elevated v-size--default"
          :class="{ load: connectLoader }"
          @click="discordConnect"
          @mouseenter="itsHover = true"
          @mouseleave="itsHover = false">Discord connect</button>
        </v-row>
        
       </v-col>

        <v-col  v-else cols="6" sm="6" md="6">
         <v-row class="font-weight-thin">
          username : @{{u_discord.username}}
          </v-row>
         <v-row class="font-weight-thin">
          userID : {{u_discord.id}}
        </v-row>
       </v-col>


      </v-row>

      <v-row>

        <v-list dense>
          <v-subheader>Tasks to whitelist your wallet : </v-subheader>
         
             <v-list-item 
                :disabled=true
                 v-model="discordLoginTask"
              >
              <v-list-item-icon>
                <v-icon v-text="walletConnect.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="'Connect your metamask wallet ' + getAccount" :class="isWalletConnected ? 'text-decoration-line-through' : '' " ></v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item 
                :disabled=true
                 v-model="discordLoginTask"
              >
              <v-list-item-icon>
                <v-icon v-text="discordLoginTask.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="discordLoginTask.task" :class="discordLoginTask.class" ></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            
             <v-list-item
                :disabled=true
                v-model="twitterLoginTask"
              >
              <v-list-item-icon >
                <v-icon v-text="twitterLoginTask.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="twitterLoginTask.task" :class="twitterLoginTask.class" ></v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item
                :disabled=false
                v-model="twitterFollowAccount"
              >
              <v-list-item-icon >
                <v-icon v-text="twitterFollowAccount.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title :class="twitterFollowAccount.class" > 
                    Follow <a @click="gotoTwitterAccount" target="_blank" >{{twitter_account_username}}</a>   account on twitter  

                 </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item
                
                v-model="twitterRetweet"
              >
              <v-list-item-icon >
                <v-icon v-text="twitterRetweet.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title :class="twitterRetweet.class"  >
                  Retweet this twitter <a @click="gotoPost" target="_blank" >POST</a>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

             <v-list-item
                :disabled=false
                v-model="discordGuild"
              >
              <v-list-item-icon >
                <v-icon v-text="discordGuild.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title  :class="discordGuild.class"  >
                  Join to <a @click="gotoDiscordServer" target="_blank" >SERVER</a> on Discord
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>


        </v-list>

      </v-row>

      <v-row>
        <v-btn
          class="ma-2"
          :disabled=!checkApplyButtonStatus()
          color="success"
          @click="dialog =  true"
         
        >
          Apply
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

const TWITTER_LOGIN =  process.env.BACKEND_URL + '/api/v1/redirect/login/twitter'
const TWITTER_INFO =   process.env.BACKEND_URL +'/api/v1/redirect/twitter'

const DISCORD_AUTH = process.env.DISCORD_AUTH;
const DISCORD_AUTH_BACKEND = process.env.BACKEND_URL + '/api/v1/redirect/authcode/discord'
const GET_GUILDS = 'https://discord.com/api/users/@me/guilds';


const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID
const TWITTER_ACCOUNT_ID = process.env.TWITTER_ACCOUNT_ID
const TWITTER_POST_ID = process.env.TWITTER_POST_ID || '1499189957717463043'
const TWITTER_ACCOUNT =process.env.TWITTER_ACCOUNT


export default {
  components: {},
  data() {
    return {
      itsHover: false,
      dialog: false,
      connectLoader: false,
      twitter_account_username: TWITTER_ACCOUNT,
      discord_server_id : DISCORD_GUILD_ID,
      redirect_url : '',
      btnText: 'Connect',
      
      u_twitter_acodes : '',
      u_twitter : '',
      isTwitterConnect : false,

      discord_auth : '',
      u_discord: '',
      isDiscordConnect : false,
      info : '',
      walletConnect: 
      {
          type : 'WALLET_CONNECT',
          task : 'Connect your metamask wallet' ,
          complete : this.isWalletConnected,
          icon  : 'mdi-check-circle-outline' ,
          class : '' 
      },
      discordLoginTask: 
      {
          type : 'DISCORD_LOGIN',
          task : 'Connect with Discord account',
          complete : false,
          icon  : 'mdi-discord' ,
          class : '' 
      },
      twitterLoginTask : 
      {
          type : 'TWITTER_LOGIN',
          task : 'Connect with twitter account',
          complete : false,
          icon :  'mdi-twitter',
          class : '' 
      },
      twitterFollowAccount :  
      {
          type : 'TWITTER_FOLLOW_ACCOUNT',
          task : 'Follow ' +TWITTER_ACCOUNT+ ' account on twitter',
          complete : false,
          icon : 'mdi-check-circle-outline',
          class : '' 
      },
      twitterRetweet : {
          type : 'TWITTER_RETWEET',
          task : 'Retweet $POST post on twitter ',
          complete : false,
          icon : 'mdi-check-circle-outline',
          class : '' 
      },
      discordGuild :  {
          type : 'DISCORD_ON_GUILD',
          task : 'Belong to $CHANNEL on Discord',
          complete : false,
          icon : 'mdi-check-circle-outline',
          class : '' 
      }

    }
  },
  computed: {
    ...mapState('connector', ['isWalletConnected', 'account']),
    getAccount() {
      return this.account
        ? this.$options.filters.truncate(this.account, 9)
        : this.btnText
    },
    
   
  },
  mounted (){

    console.log('Mounted method .... ', window.location.search)

    let urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams.has('oauth_token')); // true
    console.log(urlParams.has('oauth_verifier')); // true

    // load twitter user
    let _u_twitter = nuxtStorage.localStorage.getData('twitter_user')
    console.log('u_twitter : ', _u_twitter );
    if(_u_twitter)
    {
      this.u_twitter = _u_twitter.user;
      this.u_twitter_acodes =  _u_twitter.authCodes;

      this.isTwitterConnect = true;
      this.twitterLoginTask.complete = true;
      this.twitterLoginTask.class = 'text-decoration-line-through';
      
      this.checkUserRetweet(this.u_twitter_acodes.accessToken, this.u_twitter.id)
      this.checkIfFollowTwitterAccount(this.u_twitter_acodes.accessToken, this.u_twitter.id );
    }

    // load discord user and auth
     let _u_discord = nuxtStorage.localStorage.getData('discord_user')
     let _discord_auth = nuxtStorage.localStorage.getData('discord_auth')
     console.log('Discord user : ', _u_discord );
     if( _u_discord && _discord_auth)
     {
        this.discord_auth = _discord_auth;
        this.u_discord = _u_discord;
        this.isDiscordConnect = true;
        this.discordLoginTask.class = 'text-decoration-line-through';
        this.discordLoginTask.complete = true;
        this.verifyGuildOnDiscord()
     }
   
    // twitter callback oauth 
    let preAuth = nuxtStorage.localStorage.getData('twitter_preAuth')
    console.log('pre Auth tokens ', preAuth);
    if(urlParams.has('state') && urlParams.has('code') && preAuth )
    {
      let state = urlParams.get('state');
      let code = urlParams.get('code');
      console.log('oauth_state: ',  state); 
      console.log('oauth_code: ',  code);
      
      console.log('twitter_preAuth : ', preAuth );
      this.getTwitterUsername(state,  code, preAuth.codeVerifier );
    }
    // discord callback get code then this to grab auth paramteres
    // get auth token DISCOD only have code callback
    else if(urlParams.has('code'))
    {
      console.log('Callback from discord')
      this.getDiscordAuth(urlParams.get('code') );
    }


  },
  created() {
    // console.log('Window obj ', window )
   
  },
  methods: 
  {
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
   
    checkApplyButtonStatus() {
      let checkStatus = this.discordLoginTask.complete && 
              this.twitterLoginTask.complete && 
                this.twitterFollowAccount.complete && 
                this.twitterRetweet.complete &&  
                  this.discordGuild.complete &&
                  this.isWalletConnected;
      console.log('Apply status : ', checkStatus )
      // console.log(' login twiiter : ', this.twitterLoginTask );
      // console.log(' twitterFollowAccount : ', this.twitterFollowAccount );
      // console.log(' twitterRetweet : ', this.twitterRetweet );
      // console.log(' discordLoginTask : ', this.discordLoginTask );
      //  console.log(' discordGuild : ', this.discordGuild );
      return checkStatus
    },
    verifyGuildOnDiscord()
    {
      console.log('****** verifyGuildOnDiscord **********');
        let self = this;

        if(nuxtStorage.localStorage.getData('discord_auth'))
        {
          let auth = nuxtStorage.localStorage.getData('discord_auth')
          const headers =  {
            'Authorization' : auth.token_type+' '+ auth.access_token,
          }

          console.log('Authorization ', headers)
          axios
            .get(GET_GUILDS, { 'headers': headers } )
            .then(function (response) {
              console.log('Response frmo guild ', response.data )
              let guild = response.data.filter((item,i ) => {
                  return item.id === DISCORD_GUILD_ID;
              })

              if(guild && guild.length > 0 ){
                console.log('User is a member of that guild ')
                self.u_discord.guild = guild;
                self.discordGuild.complete = true;
                self.discordGuild.class = 'text-decoration-line-through';
                return true;
              }
              else{
                 console.log('User is NOT a member of that guild ')
                return false;
              }

            })
            .catch(function (error) {
              return false;
          });

        
        }
        else{
          return false;
        }
    },

    async checkUserRetweet(accessToken, userId )
    {
    
      console.log('************ checkUserRetweet ************');
      if(!accessToken || !userId )
      {
        console.log('No accessToken or userId');
        return ;
      }

      let self = this;
      let headers = {
        'Content-Type' : 'application/json',
      }
      const BACKEND_URL = process.env.BACKEND_URL + '/api/v1/social/twitter/retweet'
      axios
        .post(BACKEND_URL, 
        { 
          accesstoken : accessToken, 
          userid : userId 
        },
        { headers : headers})
        .then(response => {
          console.log('checkUserRetweet: ', response.data )
          if(response.data)
          {
            if(response.data.data.retweetUser && response.data.data.retweetUser.length > 0)
            {
                console.log('Retweet user -> IS RETWEET' );
                self.twitterRetweet.class = 'text-decoration-line-through';
                self.twitterRetweet.complete = true;
            }
            else{
                self.twitterRetweet.class = '';
                self.twitterRetweet.complete = false;
            }
          }
        })
        .catch(error => {
          console.log('error FOLLOW TWITTER ACCOUNT: ' , error)
          this.errored = true
        })
        .finally(() => console.log('finally'))

    },
    async checkIfFollowTwitterAccount(accessToken, userId)
    {

      console.log('************ checkIfFollowTwitterAccount ************');
      if(!accessToken || !userId )
      {
        console.log('No accessToken or userId');
        return ;
      }

      let self = this;
      let headers = {
        'Content-Type' : 'application/json',
      }
      const BACKEND_URL = process.env.BACKEND_URL + '/api/v1/social/twitter/follow'
      axios
        .post(BACKEND_URL, 
        { 
          accesstoken : accessToken, 
          userid : userId 
        },
        { headers : headers})
        .then(response => {
          console.log('FOLLOW TWITTER ACCOUNT: ', response.data )
          if(response.data)
          {
            if(response.data.data.followAccount && response.data.data.followAccount.length > 0)
            {
                console.log('Retweet user -> IS FOLLOW' );
                self.twitterFollowAccount.class = 'text-decoration-line-through';
                self.twitterFollowAccount.complete = true;
            }
            else{
              self.twitterFollowAccount.class = '';
              self.twitterFollowAccount.complete = false;
            }
          }
        })
        .catch(error => {
          console.log('error FOLLOW TWITTER ACCOUNT: ' , error)
          this.errored = true
        })
        .finally(() => console.log('finally'))

    },
    
    async getTwitterUsername (state, code, codeVerifier )
    {
       console.log('|***** Get twitter username *****  ' )
       
       let self = this;

       axios.post(TWITTER_INFO, {
        state: state,
        code: code,
        codeVerifier: codeVerifier
      })
      .then(function (response) {
        console.log('response from twitter login: ', response.data);
        

        self.u_twitter = {
          username : response.data.username,
          name : response.data.name,
          id : response.data.id,
        }

        self.u_twitter_acodes = {
          accessToken : response.data.accessToken,
          refreshToken : response.data.refreshToken,
        }

        nuxtStorage.localStorage.setData('twitter_user', { user : self.u_twitter , authCodes:  self.u_twitter_acodes} );

        self.isTwitterConnect = true;
        self.twitterLoginTask.class = 'text-decoration-line-through';
        self.twitterLoginTask = true;
        window.location.href = '/';

      })
      .catch(function (error) {
        console.log(error);
      });
      
    },
    async twitterConnect() {
              
      const headers =  {
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods' : 'GET,POST,DELETE',
        'Access-Control-Allow-Headers' : 'Origin, X-Requested With, Content-Type, Accept'
      }
      let self = this;
      // console.log('Twitter connect ', axios)
      axios
        .get(TWITTER_LOGIN, { 'headers': headers } )
        .then(response => {
          console.log('get from axios ', response.data )
          if(response.data && response.data.redirect)
          {
            
             self.twitter_preAuth = response.data;
             nuxtStorage.localStorage.setData('twitter_preAuth', response.data );

             console.log('get data ',  nuxtStorage.localStorage.getData('twitter_preAuth'))

             window.location = response.data.redirect;

              // window.open(response.data.redirect, '_blank');
              // win
            //  this.redirect_url = response.data.redirect;
            //  this.dialog=true;
          }
        })
        .catch(error => {
          console.log('error twitter login: ' , error)
          this.errored = true
        })
        .finally(() => this.loading = false)

    },
    async discordConnect() {

      console.log('Dicord connect ..... ')
      window.location = DISCORD_AUTH;
    },
    async getDiscordAuth(code) 
    {
       console.log('***********  getDiscordAuth **************** ', code);

       let self = this;
        
        axios.post(DISCORD_AUTH_BACKEND, {
          code: code
        })
        .then(function (response) {
          console.log('response from discord auth ', response.data );
          nuxtStorage.localStorage.setData('discord_auth', response.data );
          self.getDiscordUserInfo(response.data)
        })
        .catch(function (error) {
          console.log('error: ', error);
        });
    
    },
    async getDiscordUserInfo(auth)
    {
      console.log('***********  getDiscordUserInfo **************** ', auth );
      let self = this;
      const GET_USER_DISCORD = 'https://discord.com/api/users/@me'
      const headers =  {
        'Authorization' : auth.token_type+' '+ auth.access_token,
      }

      axios
        .get(GET_USER_DISCORD, { 'headers': headers } )
        .then(function (response) {
          console.log('response from discord user ', response.data );
          nuxtStorage.localStorage.setData('discord_user', response.data );
          self.u_discord = response.data;
          self.discordLoginTask.complete = true;
          self.discordLoginTask.class = 'text-decoration-line-through';
          self.isDiscordConnect = true;
          window.location.href = '/';
        })
        .catch(function (error) {
          console.log('error: ', error);
      });

    },
    async getDiscordAvatar()
    {
          // 'https://cdn.discordapp.com/avatars/{user_id}/{user_avatar}.png'
    }

  },

}//export body
</script>

