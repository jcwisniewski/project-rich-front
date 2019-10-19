<template>
  <div style="background-color: #ffffff; width: 100vw; height: 100vh; padding-top: 100px">
    <!-- Design default quando existe algum erro -->
    <img src="/static/img/001-happy.svg" width="170px"/>
    <p>{{message}}</p>
  </div>
</template>

<script>
    export default {
        name: "ThankYou",
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
