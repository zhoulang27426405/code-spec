<template>
  <div id="app" class="app"><hello-world /></div>
</template>

<script>
import HelloWorld from './components/hello-world.vue'

export default {
  name: 'app',
  components:  {
    HelloWorld
  }
}
</script>

<style lang="scss" scoped>
.app /deep/ h3 {
  font-weight: 100;
}
</style>
