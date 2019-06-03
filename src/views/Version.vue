
<template>
  <div>
    <h2>Version 0.1</h2>
    <p>2019-06-07</p>

    <div class="alert alert-info">
      <h3>Initial release</h3>
      <hr>
      <p><b>Major Features:</b></p>
      <ul>
        <li>Upload a mapping spreadsheet</li>
        <li>Automated QA</li>
        <ul>
          <li>Check spreadsheet for required tabs and columns</li>
          <li>Check Type tab</li>
          <ul>
            <li>Check for valid mapping codes</li>
            <li>Checks for add operations</li>
            <ul>
              <li>Target namespace prefix checks</li>
              <ul>
                <li>Missing namespace prefix</li>
              </ul>
              <li>Target name checks</li>
              <ul>
                <li>Missing name</li>
                <li>Type name does not end with representation term 'Type'</li>
                <li>Simple type with name that does not end with 'SimpleType'</li>
                <li>Complex type with name that ends with 'SimpleType'</li>
                <li>Simple type with name that ends with 'CodeSimpleType' but does not declare enumerations in the 'Code/Facets' tab</li>
                <li>Type with name that ends with 'CodeType' that does not have a base type with a name that ends with 'CodeSimpleType'</li>
                <li>Duplicate type names in spreadsheet</li>
                <li>Warning for use of term 'Type' outside of final representation term for type name</li>
              </ul>
              <li>Target definition checks</li>
              <ul>
                <li>Missing definition</li>
                <li>Definition does not begin with "A data type "</li>
              </ul>
              <li>Target style checks</li>
              <ul>
                <li>Simple or CSC type without a base type</li>
                <li>Simple type without a XML schema base type</li>
              </ul>
            </ul>
          </ul>
          <li>Check Code/Facet tab</li>
          <ul>
            <li>Check for valid mapping codes</li>
            <li>Checks for add operations</li>
            <ul>
              <li>Target type checks</li>
              <ul>
                <li>Missing name</li>
                <li>Type name is not defined in the Type tab</li>
              </ul>
              <li>Target value checks</li>
              <ul>
                <li>Missing value</li>
              </ul>
              <li>Target definition checks</li>
              <ul>
                <li>Missing definition</li>
              </ul>
              <li>Target kind checks</li>
              <ul>
                <li>Invalid facet kind</li>
              </ul>
            </ul>
          </ul>
        </ul>
        <li>View results table</li>
        <li>Download results spreadsheet</li>
      </ul>
    </div>

  </div>
</template>

<script>
export default {
  name: "Version"

}
</script>

