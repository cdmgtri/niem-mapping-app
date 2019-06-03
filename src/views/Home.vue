
<template>
  <div>

    <h2>Upload a NIEM mapping spreadsheet</h2>
    <br>

    <p>See the <b><b-link :to="'/about'">About</b-link></b> page for more information about the NIEM mapping spreadsheet and to download the template and example.</p>

    <!-- File upload (.xlsx) -->
    <b-form-file id="file" accept=".xlsx" placeholder="Choose a file..." @change="loadUserFile($event)"/>

    <!-- Demo dropdown button -->
    <button type="button" id="demo" class="btn btn-sm btn-outline-secondary dropdown-toggle pull-right" data-toggle="dropdown">Demo</button>

    <div class="dropdown-menu" aria-labelledby="demo">

      <!-- Valid example button -->
      <a class="dropdown-item" @click="loadValidExample">
        <i class="fa fa-check fa-fw text-success" aria-hidden="true"></i>
        Valid spreadsheet
      </a>

      <!-- Invalid example button -->
      <a class="dropdown-item" @click="loadInvalidFormattingExample">
        <i class="fa fa-exclamation fa-fw text-danger" aria-hidden="true"></i>
        Invalid spreadsheet (formatting issues)
      </a>

      <!-- Invalid example button -->
      <!-- <a class="dropdown-item" @click="loadInvalidModelingExample">
        <i class="fa fa-exclamation fa-fw text-danger" aria-hidden="true"></i>
        Invalid spreadsheet (modeling issues)
      </a> -->

    </div>
    <br>


    <div v-if="displayResults">

      <hr>
      <div>
        <h2>Results</h2>

        <!-- Download demo and results buttons -->
        <div class="btn-group align-with-header" role="group">
          <!-- Download sample spreadsheet if demo was used -->
          <a download v-if="fileIsSample" class="btn btn-sm"
            :href="'/examples/' + fileName">
            <i class="fa fa-fw fa-download"></i> Download demo
          </a>

          <!-- Download results if tests failed -->
          <button v-if="results.length > 0" class="btn btn-sm" @click="saveResults">
            <i class="fa fa-fw fa-download"></i> Download results
          </button>
        </div>
      </div>
      <br/>


      <!-- Message: In progress -->
      <div v-if="loadStatus=='in progress'" class="alert alert-secondary">
        <h4>First pass: spreadsheet format</h4>
        <hr/>
        <p>Checking for required tabs, required columns, valid mapping codes, and required values.</p>
      </div>

      <!-- Message: First pass succeeded -->
      <div v-if="loadStatus=='pass'" class="alert alert-success">
        <h4>
          <i class="fa fa-fw fa-check-circle"></i>
          First pass: spreadsheet format
        </h4>
        <hr/>
        <p>Spreadsheet was formatted correctly.  Now running QA tests...  <em>(not yet implemented)</em></p>
      </div>

      <!-- Message: First pass failed -->
      <div v-if="loadStatus=='fail'" class="alert alert-danger">
        <h4>
          <i class="fa fa-fw fa-exclamation-circle"></i>
          First pass: spreadsheet format
        </h4>
        <hr/>
        <p>The spreadsheet did not pass the initial tests, checking for required tabs, required columns, valid mapping codes, and required values.  Please fix the errors below and upload again to look for modeling issues.</p>
      </div>

      <!-- Results table for first pass (load) errors -->
      <b-table v-if="results" striped hover :items="results"/>

    </div>

  </div>
</template>

<script>

import axios from "axios";
import { saveAs } from "file-saver";
import NIEMMapping from "niem-mapping";
import xlsx from "xlsx-populate";


export default {
  name: "Home",

  data() {
    return {

      fileName: "",
      fileIsSample: false,

      displayResults: false,

      results: [],

      /** @type {null|"in progress"|"pass"|"fail"} */
      loadStatus: null

    }
  },

  methods: {

    /**
     * @param {Buffer} buffer
     */
    validate(buffer) {

      this.displayResults = true;
      this.loadStatus = "in progress";

      let mapping = new NIEMMapping(buffer);
      this.results = mapping.loadErrors;
      this.loadStatus = this.results.length == 0 ? "pass" : "fail";

      // Call niem-mapping.qa() to check spreadsheet formatting

      // Set data = niem-mapping.load() to load the data

      // Call niem-qa to check modeling

    },

    /**
     * @param {Event} event
     */
    loadUserFile(event) {

      /** @type {File} */
      let file = event.target.files[0];

      this.fileName = file.name;
      this.fileIsSample = false;

      new Response(file).arrayBuffer()
        .then( buffer => this.validate(buffer) )
        .catch( err => console.log(err) );

    },

    loadValidExample() {
      this.loadExampleFile("iepd-requirements-example.xlsx");
    },

    loadInvalidFormattingExample() {
      this.loadExampleFile("iepd-requirements-example-invalid-formatting.xlsx");
    },

    loadInvalidModelingExample() {
      this.loadExampleFile("iepd-requirements-example-invalid-modeling.xlsx");
    },

    /**
     * Reads a text file in this project and saves it as a new file in the
     * files array.
     *
     * @param {String} fileName
     */
    loadExampleFile(fileName) {

      let filePath = "examples/" + fileName;
      this.fileName = fileName;
      this.fileIsSample = true;

      axios
        .get(filePath, { responseType: "arraybuffer" })
        .then( response => this.validate(response.data) )
        .catch( err => console.log(err) );

    },

    saveResults() {

      if (!this.results) {
        return;
      }

      // Add column names to the first row
      let csvString = Object.keys(this.results[0]).join(",") + "\n";

      // Translate the array of issues to comma-separated values separated by newlines
      csvString += this.results.map( row => Object.values(row).join(",")).join("\n");

      let blob = new Blob([csvString], {type: "text/csv;charset=utf-8"});
      saveAs(blob, this.fileName.replace(".xlsx", "-qa.csv"));
    }

}

}
</script>

<style scoped>

.custom-file {
  max-width: 500px !important;
}

/* Decrease the default text size of drop-down options */
.demo, .dropdown-item {
  font-size: 0.75rem !important;
}

.dropdown-menu hr {
  margin: 5px 0;
}

/* Change the link select color from Bootstrap primary blue */
.dropdown-item:active {
  background-color: #D1ECF1;
}

.align-with-header {
  margin-top: -50px;
  float: right;
}

</style>
