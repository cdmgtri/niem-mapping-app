
<!-- Navy NIEM-USA flag bar -->

<template>
  <div class="container-fluid usa">
    <div class="niem-tag-line">NATIONAL INFORMATION EXCHANGE MODEL</div>
    <div class="official">
      <img alt="US flag" src="../assets/images/us-flag.png">
      <!-- <span>An official website of the United States Government</span> -->
    </div>
  </div>
</template>

<script>
export default {
  name: "USABar"
}
</script>

<style scoped>

.usa {
  background-color: #01445D;
  height: auto;
  overflow: hidden;
  font-size: 11px;
  line-height: 20px;
  color: white;
  text-align: center;
  padding: 1px 0;
  display: inline-flex;
  justify-content: center;
}

.usa img {
  margin: 0 15px;
  height: 13px;
  vertical-align: text-top;
}

.niem-tag-line {
  margin-left: auto;
}

.official {
  margin-right: auto;
}

</style>
