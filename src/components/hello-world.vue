<template>
  <div class="hello">
    <h3>title</h3>
    <div class="g-iconfont_question g-iconfont">{{ msg }}</div>
    <demo />
    <!-- Form header -->
    <slot name="header">
      <!-- `<th>title</th>` -->
      <th>title</th>
    </slot>
  </div>
</template>

<script>
import demo from './child/demo'
export default {
  name: 'HelloWorld',
  components: {
    demo
  },
  props: {
    // The name of the form, up to 8 characters
    msg: {
      type: String,
      required: true,
      default: 'HelloWorld'
    }
  },
  data() {
    return {}
  },
  methods: {
    /**
     * @vuese
     * Used to manually clear the form
     * @arg The argument is a boolean value representing xxx
     */
    getList(params) {
      let obj = { test: 1 }
      let a = ''
      a = obj.test === 1 ? 1 : 0
      console.log(a)
      // let loadingList = []
      // const PAGE_NUMBER = 10
      // let isLoading = false
      // let TargetState = {
      //   READING: 1,
      //   READED: 2,
      //   APPLIED: 3,
      //   READY: 4
      // }
    },
    clear() {
      // Fire when the form is cleared
      this.$emit('onclear', true)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  font-weight: 700;
}
</style>
