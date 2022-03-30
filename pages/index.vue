<template>
  <Tutorial />
</template>

<script>

export default {
  name: 'IndexPage',
  components: {
  },
  data: () => ({
  }),
  created () {
  },
  methods: {
    getFistOption () {
      this.$axios.get('https://apigen-server.herokuapp.com/api/621f2588d8d85b8d78eb3e64')
        .then((res) => {
          console.log(res)
        })
    },
    getSecondOption () {
      this.$axios.get('https://apigen-server.herokuapp.com/api/62419aa64139ba24abb709e8')
        .then((res) => {
          console.log(res)
        })
    }
  }
}
</script>
