
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

      <!-- Invalid formatting example button -->
      <a class="dropdown-item" @click="loadInvalidFormattingExample">
        <i class="fa fa-exclamation fa-fw text-danger" aria-hidden="true"></i>
        Invalid spreadsheet (formatting issues)
      </a>

      <!-- Invalid modeling example button -->
      <a class="dropdown-item" @click="loadInvalidModelingExample">
        <i class="fa fa-exclamation fa-fw text-danger" aria-hidden="true"></i>
        Invalid spreadsheet (modeling issues)
      </a>

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


      <!-- First pass message -->
      <div :class="['alert', getStatusAlertClass(loadStatus)]">
        <h4 class="mb-0">
          <!-- Status icon -->
          <i v-if="loadStatus=='pass'" class="fa fa-fw fa-check-circle"></i>
          <i v-else-if="loadStatus=='fail'" class="fa fa-fw fa-exclamation-circle"></i>
          <i v-else class="fa fa-fw fa-circle-o-notch fa-spin"></i>

          1 of 2: Spreadsheet format tests

          <!-- Toggle collapse button -->
          <button
            class="btn btn-sm pull-right pt-0 pb-0"
            data-toggle="collapse" data-target="#firstPassDescription"
            @click="showFirstPassDescription=!showFirstPassDescription">
            <i v-if="showFirstPassDescription" class="fa fa-fw fa-minus"></i>
            <i v-else class="fa fa-fw fa-plus"></i>
          </button>
        </h4>

        <div class="collapse show" id="firstPassDescription">
          <hr/>
          <p>Basic checks for required tabs, columns, and fields, plus checks for valid mapping codes and field formats.</p>

          <!-- Status-based message -->
          <strong>
            <p v-if="loadStatus=='pass'">
              Now running modeling tests...  <em>(Not yet implemented)</em>
            </p>
            <p v-else-if="loadStatus=='fail'">
              Please correct the errors below and reload to continue with the modeling tests.
            </p>
            <p v-else>
              Running formatting tests...
            </p>
          </strong>
        </div>
      </div>


      <!-- Results table for first pass (load) errors -->
      <b-table small v-if="results" striped hover :items="results" :fields="fields"/>

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

      /** Fields from the results object to use as columns in the results display */
      fields: [ "id", "tab", "row", "col", "description" ],

      /** @type {null|"in progress"|"pass"|"fail"} */
      loadStatus: null,

      showFirstPassDescription: true

    }
  },

  methods: {

    /**
     * Gets the Bootstrap alert class for the current loadStatus
     */
    getStatusAlertClass(status) {
      if (status == "pass") {
        return "alert-success";
      }
      if (status == "fail") {
        return "alert-danger";
      }
      return "alert-secondary";
    },

    /**
     * @param {Buffer} buffer
     */
    validate(buffer) {

      this.results = [];
      this.displayResults = true;
      this.loadStatus = "in progress";

      let mapping = new NIEMMapping(buffer);
      this.results = this.formatResults(mapping.failedTests);
      this.loadStatus = mapping.validFormat && this.results.length == 0 ? "pass" : "fail";

      // Call niem-mapping.qa() to check spreadsheet formatting


      // Set data = niem-mapping.load() to load the data

      // Call niem-qa to check modeling

    },

    /**
     * @param {Event} event
     */
    loadUserFile(event) {

      this.results = [];
      this.displayResults = true;
      this.loadStatus = "in progress";

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

      this.results = [];
      this.displayResults = true;
      this.loadStatus = "in progress";

      axios
        .get(filePath, { responseType: "arraybuffer" })
        .then( response => this.validate(response.data) )
        .catch( err => console.log(err) );

    },

    /**
     * @todo Move formatResults to the niem-qa project as flattenedResults
     * @param {Object[]} results
     */
    formatResults(results) {

      let issues = [];

      results.forEach( test => {
        test.issues.forEach( issue => {
          issues.push({
            tab: issue.location,
            row: issue.line,
            col: issue.position,
            label: issue.label,
            id: test.id,
            description: test.description,
            NDR: test.ndr,
            component: test.component,
            field: test.field,
            applicability: test.applicability,
            severity: test.severity,
            problemValue: issue.problemValue
          });
        });
      });

      return issues;

    },

    saveResults() {

      if (!this.results) {
        return;
      }

      // Convert array of objects to array of arrays
      let rows = this.results.map( result => Object.values(result) );

      axios
        .get("templates/issue-template.xlsx", { responseType: "arraybuffer"} )
        .then( response => {
          xlsx
            .fromDataAsync(response.data)
            .then( workbook => {
              // Copy converted results to spreadsheet
              workbook.sheet(0).cell("A2").value(rows);

              // Download results spreadsheet
              workbook.outputAsync("blob")
                .then( blob => {
                  saveAs(blob, this.fileName.replace(".xlsx", "-qa.xlsx"));
                });
            });
        })
        .catch( err => console.log(err) );




      // // Add column names to the first row
      // let csvString = Object.keys(this.results[0]).join(",") + "\n";

      // // Translate the array of issues to comma-separated values separated by newlines
      // csvString += this.results.map( row => Object.values(row).join(",")).join("\n");

      // let blob = new Blob([csvString], {type: "text/csv;charset=utf-8"});
      // saveAs(blob, this.fileName.replace(".xlsx", "-qa.csv"));
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
