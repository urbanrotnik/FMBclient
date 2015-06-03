



  <ul id="listv" data-role="listview" data-autodividers="true"  data-filter="true" data-inset="true">
    {{#entries}} 
    <li><a href="#" onClick="alert('{{name}}')">{{title}}</a></li>
    {{/entries}}
  </ul>
