
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

      <!-- Demo spreadsheet dropdown items -->
      <a
        v-for="demo in demos" v-bind:key="demo.id"
        class="dropdown-item" @click="loadExampleFile(demo.fileName)">

        <i class="fa fa-fw" :class="demo.classes" aria-hidden="true"></i>
        {{ demo.text }}

      </a>

    </div>
    <br>


    <div v-if="statusPanel.stage > 0">

      <hr>
      <div>
        <h2>Status</h2>

        <!-- Download demo and download results buttons -->
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


      <!-- Status panel -->
      <div :class="['alert', statusAlertClass]">
        <h4 class="mb-0">

          <!-- Status icon -->
          <i class="fa fa-fw" :class="statusIconClass"></i>

          <!-- Status header -->
          {{ statusPanel.stage }} of 2: {{ statusPanel.label }}

          <!-- Toggle collapse button -->
          <button
            class="btn btn-sm pull-right pt-0 pb-0"
            data-toggle="collapse" data-target="#statusExpanded"
            @click="statusPanel.expand=!statusPanel.expand">
            <i v-if="statusPanel.expand" class="fa fa-fw fa-minus"></i>
            <i v-else class="fa fa-fw fa-plus"></i>
          </button>
        </h4>

        <div class="collapse show" id="statusExpanded">
          <hr/>
          <p>{{ statusPanel.description }}</p>
          <strong>
            <p>{{ statusPanel.error }}</p>
          </strong>
        </div>
      </div>


      <!-- Results table for issues -->
      <b-table small v-if="results" striped hover :items="results" :fields="fields">

        <!-- Display the status / issue severity icon -->
        <template slot="status" slot-scope="data">
          <i :class="getIssueSeverityIconClasses(data.item.severity)"></i>
        </template>

        <!-- Template for row expand button -->
        <template slot="more..." slot-scope="row">

          <!-- Toggle the plus / minus icon based on if the row is open -->
          <b-button variant="outline-secondary" size="sm" @click="row.toggleDetails">
            <i v-if="row.detailsShowing" class="fa fa-fw fa-caret-up"></i>
            <i v-else class="fa fa-fw fa-caret-down"></i>
          </b-button>

        </template>

        <!-- Template for expanded row content -->
        <template slot="row-details" slot-scope="row">

          <b-card>
            <h4>{{ getSpreadsheetLocation(row.item) }}</h4>

            <p>Label: {{ row.item.label }}</p>
            <p>NDR: {{ row.item.NDR }}</p>
            <p>Component: {{ row.item.component }}</p>
            <p>Field: {{ row.item.field }}</p>
            <p>Applicability: {{ row.item.applicability }}</p>
            <p>Severity: {{ row.item.severity }}</p>
            <p>Problem value: {{ row.item.problemValue }}</p>
          </b-card>

        </template>

      </b-table>

    </div>

  </div>
</template>

<script>

import axios from "axios";
import NIEMMapping from "niem-mapping";
import xlsx from "xlsx-populate";
import { saveAs } from "file-saver";
import demos from "../assets/js/demos.json";

export default {
  name: "Home",

  data() {
    return {

      fileName: "",
      fileIsSample: false,

      /**
       * Example spreadsheets for demo purposes
       * @type {{id: number, text: string, classes: string, fileName: string}[]}
      */
      demos: demos,

      /**
       * Results status panel values
       */
      statusPanel: {

        stage: 0,
        label: "",
        description: "",
        error: "",
        expand: true,

        /** @type {null|"in progress"|"pass"|"fail"} */
        status: ""
      },

      results: [],

      /** Fields from the results object to use as columns in the results display */
      fields: [ "status", "test", "tab", "row", "col", "description", "more..." ],

    }
  },

  computed: {

    /**
     * Returns the font-awesome icon for the status panel
     */
    statusIconClass() {

      if (this.statusPanel.status == "in progress") {
        return "fa-circle-o-notch fa-spin";
      }
      if (this.statusPanel.status == "pass") {
        return "fa-check-circle";
      }
      if (this.statusPanel.status == "fail") {
        return "fa-exclamation-circle";
      }
      return "fa-question-circle";

    },

    /**
     * Returns the Bootstrap alert class for the status panel
     */
    statusAlertClass() {

      if (this.statusPanel.status == "pass") {
        return "alert-success";
      }
      if (this.statusPanel.status == "fail" || this.statusPanel.status == "error") {
        return "alert-danger";
      }
      if (this.statusPanel.status == "warning") {
        return "alert-warning";
      }
      return "alert-secondary";

    }

  },

  methods: {

    /**
     * @param {Buffer} buffer
     */
    validate(buffer) {

      // Reset the results
      this.results = [];

      // Set the status panel for stage 1
      this.statusPanel.stage = 1;
      this.statusPanel.label = "Spreadsheet format checks";
      this.statusPanel.description = "Checking the spreadsheet for required tabs, columns, and field values, plus checks for valid mapping codes and formatting";
      this.statusPanel.status = "in progress";

      // Run tests
      let mapping = new NIEMMapping(buffer);
      this.results = this.formatResults(mapping.failedTests);

      // Update the status panel for structural issues
      if (! mapping.validFormat) {
        this.statusPanel.status = "fail";
        this.statusPanel.error = "Please make sure the spreadsheet has all required tabs and columns before proceeding with additional QA checks."
        return;
      }

      // Update the status panel for other spreadsheet formatting issues
      if (this.results.length > 0) {
        this.statusPanel.status = "fail";
        this.statusPanel.error = "Please make sure the spreadsheet is formatted correctly before proceeding with additional QA checks."
        return;
      }

      // Update the status panel for stage 2 checks
      this.statusPanel.stage = 2;
      this.statusPanel.label = "Modeling QA";
      this.statusPanel.description = "Checking the spreadsheet for valid modeling."

      // Make this accessible in the callback
      let self = this;

      // Call niem-mapping.qa() to check for modeling issues
      mapping
        .loadData()
        .then( () => {
          self.results = self.formatResults(mapping.failedTests);

          // Pass
          if (self.results.length == 0) {
            self.statusPanel.status = "pass";
            self.statusPanel.description = "All currently implemented formatting and QA checks passed!";
          }
          else {
            self.statusPanel.status = "fail";
            self.statusPanel.error = "Please review the spreadsheet based on the issues listed below.";
          }
        })
        .catch( err => {
            self.statusPanel.status = null;
            self.statusPanel.error = "Unexpected error encountered: " + err.message;
        });

    },

    /**
     * @param {Event} event
     */
    loadUserFile(event) {

      this.statusPanel.stage = 0;

      /** @type {File} */
      let file = event.target.files[0];

      this.fileName = file.name;
      this.fileIsSample = false;

      new Response(file).arrayBuffer()
        .then( buffer => this.validate(buffer) )
        .catch( err => console.log(err) );

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

      this.statusPanel.stage = 0;

      axios
        .get(filePath, { responseType: "arraybuffer" })
        .then( response => this.validate(response.data) )
        .catch( err => console.log(err) );

    },

    /**
     * Returns a string describing where an issue is located.
     *
     * @example "Tab: Property | Row: 1 | Col: Mapping Code"
     */
    getSpreadsheetLocation(formattedIssue) {
      return `Tab: ${formattedIssue.tab} | Row: ${formattedIssue.row} | Col: ${formattedIssue.col}`;
    },

    getIssueSeverityIconClasses(severity) {

      let icon = "";

      if (severity == "error") {
        icon = "fa-exclamation-circle text-danger";
      }
      else if (severity == "warning") {
        icon = "fa-bell text-warning"
      }
      else if (severity == "info") {
        icon = "fa-info-circle";
      }
      return "fa fa-fw " + icon;
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
            test: test.id,
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
