
<template>
  <div>

    <h2>NIEM Mapping Template</h2>

    <p>Spreadsheets are often used with NIEM for a variety of purposes.  There is enough overlap in some of the primary use cases for a standard template, which allows for the development of automated QA, data import, and translation into other formats.</p>

    <p>
      <a download href="/niem-mapping-template.xlsx" class="btn btn-sm btn-info">
        <i class="fa fa-download"></i> Download NIEM mapping template
      </a>
    </p>
    <br>

    <h2>Example use cases</h2>

    <p>The table below shows some standard use cases for the NIEM mapping template spreadsheet, plus an overview of how the spreadsheet should be filled in.</p>

    <table class="table">
      <thead>
        <tr>
          <th class="th_useCase">Example use case</th>
          <th class="th_source">Source columns</th>
          <th class="th_mapping">Mapping columns</th>
          <th class="th_target">Target columns</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><b>Map a standard to NIEM</b></td>
          <td>Standard fields</td>
          <td>Mapping info<br><em>map, no match</em></td>
          <td>NIEM release components</td>
        </tr>
        <tr>
          <td><b>Map local exchange requirements for an IEPD</b></td>
          <td>Local requirements</td>
          <td>Mapping info<br><em>map, no match, add</em></td>
          <td>NIEM components and extensions</td>
        </tr>
        <tr>
          <td><b>Change request spreadsheet</b></td>
          <td>Source info or n/a</td>
          <td>Change operations<br><em>add, edit, delete</em></td>
          <td>New or modified NIEM components</td>
        </tr>
        <tr>
          <td><b>Document NIEM sources</b></td>
          <td>Source info</td>
          <td>Mapping info<br><em>map</em></td>
          <td>NIEM components</td>
        </tr>
        <tr>
          <td><b>Foreign language translations</b></td>
          <td>Translated names and definitions</td>
          <td>Mapping info<br><em>map</em></td>
          <td>NIEM components</td>
        </tr>
        <tr>
          <td><b>NIEM release documentation</b></td>
          <td>n/a</td>
          <td>Mapping info<br><em>documentation</em></td>
          <td>NIEM components</td>
        </tr>
        <tr>
          <td><b>NIEM change log</b></td>
          <td>Old NIEM release</td>
          <td>Mapping info<br><em>add, edit, delete, no change</em></td>
          <td>New NIEM release</td>
        </tr>
      </tbody>
    </table>
    <br>


    <h2>IEPD requirements example</h2>

    <p>Download the IEPD requirements example spreadsheet below for a demonstration of how this template may be used.  This spreadsheet uses components from <a href="https://schema.org" target="_blank">schema.org</a> as sample exchange data requirements.</p>

    <p>
      <a download href="/examples/iepd-requirements-example.xlsx" class="btn btn-sm btn-info">
        <i class="fa fa-download"></i> Download "IEPD requirements mapping" example
      </a>
    </p>

    <p>In this case, source columns (blue column headers) represent the requirements from schema.org and target columns (red column headers) represent the mappings to NIEM components and newly-created NIEM extensions modeled for this sample IEPD.</p>

    <table class="table table-hover">
      <thead>
        <tr>
          <th class="th_useCase">Example mapping</th>
          <th class="th_source">Source columns <br>(exchange requirements)</th>
          <th class="th_mapping">Mapping columns <br>(code, optional notes)</th>
          <th class="th_target">Target columns <br>(NIEM + IEPD extensions)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Requirement does not exist in NIEM; must be added as a NIEM IEPD extension</td>
          <td>actor</td>
          <td>add</td>
          <td>ext:MovieActor</td>
        </tr>
        <tr>
          <td>Requirement maps to NIEM; will be included with NIEM subset in IEPD</td>
          <td>givenName</td>
          <td>map</td>
          <td>nc:PersonGivenName</td>
        </tr>
      </tbody>
    </table>
    <br>


    <h2>Current status</h2>

    <!-- Font awesome checkbox icon class name: fa-check-square-o -->

    <div class="alert alert-info">
      <ul class="ul_checkList">
        <li><i class="fa fa-fw fa-square-o"></i> Run QA - <em>In progress</em></li>
        <ul class="ul_checkList">
          <li> -- <i class="fa fa-fw fa-square-o"></i> Spreadsheet checks: required tabs, columns, fields, formats</li>
          <li> -- <i class="fa fa-fw fa-square-o"></i> Content checks: valid values</li>
        </ul>
        <li><i class="fa fa-fw fa-square-o"></i> Generate SSGT wantlist</li>
        <li><i class="fa fa-fw fa-square-o"></i> Generate NIEM extension schemas</li>
      </ul>
    </div>
    <br>

  </div>
</template>

<script>

export default {
  name: "About",
}
</script>

<style scoped>

.th_useCase {
  background: darkgray;
  width: 25%;
}

.th_source {
  background: rgb(79, 129, 189);
  width: 25%;
}

.th_mapping {
  background: rgb(255, 235, 156);
  color: rgb(156, 101, 0);
  width: 25%;
}

.th_target {
  background: rgb(192, 80, 77);
  width: 25%;
}

.ul_checkList {
  list-style-type: none;
  padding: 0;
  margin: 0;
}
</style>
