<template>
  <div><h1>SWSG</h1></div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'SWSG',
  mounted () {
    axios
      .get('http://127.0.0.1:4242/info/group_list')
      .then((resp) => {
        alert(resp.data)
      })
      .catch((error) => {
        console.log(error)
      })
  }
}
</script>
