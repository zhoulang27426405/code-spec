<template>
  <div class="hello">
    <h3>title</h3>
    <div class="g-iconfont_question g-iconfont"></div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    // The name of the form, up to 8 characters
    msg: String
  },
  data() {
    return {}
  },
  methods: {
    // @vuese
    // Used to get the list
    getList  () {
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
