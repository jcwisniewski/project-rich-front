<template>
  <div style="background-color: #ffffff; width: 100vw; height: 100vh; padding-top: 100px">
      <img src="/static/img/sad.svg" width="140px"/>
      <p>{{message}}</p>
  </div>
</template>

<script>

export default {

  data() {
    return {
      message: null
    }
  },

  mounted() {
    this.message = this.$route.query['exit-message']
  }

}
</script>

<style scoped>

</style>
