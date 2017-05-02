# Datasets

As part of this survey we identified several datasets useful for experimentation. We have aggregated the data below in [in JSON format](/data/datasets.json) as well.

<h2>Image Datasets</h2>
<div class="row">
<div id="imageDataSets" class="col-md-6">
</div>
</div>

<h2>Text Datasets</h2>
<div class="row">
<div id="textDataSets" class="col-md-6">
</div>
</div>
<script>
    function fillDataSet(dataSets, divID, type) {
              var imageSetsDiv = $(divID); //eg "#imageDataSets"
              var finalHTML = "";
              for (i in dataSets) {
                var dset = dataSets[i];
                if (dset.type == type) { //eg 'image' or 'text' or 'audio' or 'video' or 'mixed'
                  var cardHTML = "<div class='card card-block card-border'>";
                  cardHTML += "<h4 class='card-title'>"+dset.name+"</h4>";
                  cardHTML += "<h6 class='card-subtitle text-muted'>"+dset.organization+"</h6>";
                  cardHTML += "<p class='card-text'>"+dset.description+"</p>";
                  cardHTML += "<a href='"+dset.url+"' class='card-link'>"+dset.url+"</a>";
                  cardHTML += "</div>";
                  finalHTML += cardHTML;
                }
              }
              imageSetsDiv.html(finalHTML);
    }
    $(document).ready(function() {
      var datasets = $.ajax({
          dataType: "json",
          url: "/data/datasets.json"
      })
      .done(function(data) {
        var dataSets = data.dataSets;
        fillDataSet(dataSets, "#imageDataSets", "image");
        fillDataSet(dataSets, "#textDataSets", "text");
        // var imageSetsDiv = $("#imageDataSets");
        // var finalHTML = "";
        // for (i in dataSets) {
        //   var dset = dataSets[i];
        //
        //   var cardHTML = "<div class='card card-block card-border'>";
        //   cardHTML += "<h4 class='card-title'>"+dset.name+"</h4>";
        //   cardHTML += "<h6 class='card-subtitle text-muted'>"+dset.organization+"</h6>";
        //
        //   cardHTML += "<p class='card-text'>"+dset.description+"</p>";
        //   cardHTML += "<a href='#' class='card-link'>"+dset.url+"</a>";
        //   cardHTML += "</div>";
        //   finalHTML += cardHTML;
        // }
        //
        // imageSetsDiv.html(finalHTML);
      })
      .fail(function(err) {
        console.log( "ERROR: --- \n" +JSON.stringify(err));
      });
    });
    </script>



</div>
