document.querySelector("#uploadBox").addEventListener("click", function () {
    console.log("uploaded")
    this.querySelector("input").click();
});

document.querySelector("#cameraBox").addEventListener("click", function () {
    // Implement camera access here
    alert("Camera access to be implemented");
});

function iconButtonClick() {
    alert("Button clicked");
}

$(document).ready(function() {
    $('#uploadBox').click(function() {
        $('#fileUpload').click();
    });

    $('#fileUpload').change(function() {
        $('#uploaded-image-div').css('display', 'block');
        $('#fileList').empty();
    
        var files = $(this).prop('files');
    
        for (var i = 0; i < files.length; i++) {
            $('#fileList').append('<li>' + files[i].name + '</li>');
        }
    
        $('#uploadModal').modal('show');
    });

     var dropZone = $('#uploadBox');
     dropZone.on('dragover', function(e) {
         e.preventDefault();
         e.stopPropagation();
         dropZone.addClass('dragging');
     });
     dropZone.on('dragleave', function(e) {
         dropZone.removeClass('dragging');
     });
     dropZone.on('drop', function(e) {
         e.preventDefault();
         dropZone.removeClass('dragging');
         var files = e.originalEvent.dataTransfer.files;
         var fileInput = $('#fileUpload');
         fileInput.prop('files', files);
         fileInput.trigger('change');
     });
});
