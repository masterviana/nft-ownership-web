<template>
  <v-app dark>
   
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
     
      
      <v-toolbar-title v-text="title" />
      <v-spacer />

    
     <ui-connect-btn />
    
     
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    
    <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Dashboard',
          to: '/'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'NFT Ownership'
    }
  }
}
</script>
