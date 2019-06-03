
<template>
  <div :id="toggleID" class="collapse navbar-collapse menu-links">
    <b-nav class="navbar-nav ml-auto">

      <b-nav-item :to="'/'" exact>Home</b-nav-item>
      <b-nav-item :to="'/about'">About</b-nav-item>
      <b-nav-item :to="'/version'">Version</b-nav-item>

      <!-- <b-nav-item-dropdown text="Help">
      </b-nav-item-dropdown> -->
    </b-nav>
  </div>
</template>

<script>
  export default {
    name: "HeaderLinks",
    props: [
      "toggleID"
    ]
  }
</script>