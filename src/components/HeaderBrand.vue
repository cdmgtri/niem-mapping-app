
<template>
  <div class="navbar-brand-group">
    <!-- Logo -->
    <router-link class="navbar-brand" to="/">
      <img src="../assets/images/logo.png" alt="NIEM" />
    </router-link>

    <!-- Tool name -->
    <div id="site-name">
      <router-link to="/" class="active">Mapping App</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "HeaderBrand"
}
</script>

<style scoped>

#site-name {
  display: inline-block;
  vertical-align: middle;
  font-size: 1.8em;
  font-weight: 900;
  padding: 16px 0px;
  position: relative
}

.navbar-brand {
  padding-left: 0;
}

</style>