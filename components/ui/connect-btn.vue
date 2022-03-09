<template>
   <button
    class="btn mini login-btn v-btn v-btn--is-elevated v-size--default"
    :class="{ load: connectLoader }"
    @click="walletBtnHandler"
    @mouseenter="itsHover = true"
    @mouseleave="itsHover = false"
  >
    <ui-btn-loader v-if="connectLoader" />
    <template v-else-if="itsHover"> dashboard </template>
    <template v-else>
      {{ getAccount }}
    </template>
  </button>
</template>

<script>
import { mapState } from 'vuex'

export default {
  components: {},
  data() {
    return {
      itsHover: false,
      connectLoader: false,
      btnText: 'Connect',
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
  methods: {
    async walletBtnHandler() {
      if (this.isWalletConnected) {
        this.$router.push({ name: 'index' })
        return false
      }
      if (!window.ethereum) return false
      this.connectLoader = true
      try {
        await this.$store.dispatch('connector/connectAccount', window.ethereum)
      } catch (e) {
        console.log('e:', e)
      }
      this.connectLoader = false
    },
  },
}
</script>

<style lang="scss" scoped>
.login-btn {
  width: 176px;
  font-size: 16px;
}
</style>
