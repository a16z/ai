# Books, Papers, and Research

### Bibliography

You can also download the [source bibTeX file](/reference-material/a16z-ai-survey.bib).

<script src="/js/bib-list-min.js"></script>
<link rel="stylesheet" href="/stylesheets/bib-publication-list.css" type="text/css" />

<!-- we hide the bibtext data to avoid flash of unstyled content -->
<style>
  #bibtex { display: none; }
</style>

<!-- without javascript the bibtex data becomes visible -->
<noscript><style>#bibtex { display: block; }</style></noscript>

<table id="pubTable" class="display" style="margin: 10px;"></table>
<pre id="bibtex">

</pre>

<script>
$( document ).ready(function() {
    $.get('/reference-material/a16z-ai-survey.bib', function(data) {

        $("#bibtex").text(data);
        bibtexify("#bibtex", "pubTable", {});
    }, 'text');
});
</script>
