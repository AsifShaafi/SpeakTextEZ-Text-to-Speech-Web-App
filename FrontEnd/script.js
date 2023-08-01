document.querySelector("#uploadBox").addEventListener("click", function () {
    console.log("uploaded")
    this.querySelector("input").click();
});

function iconButtonClick() {
    alert("Button clicked");
}

$(document).ready(function() {
    $('#uploadBox').click(function() {
        $('#fileUpload').click();
    });

    $('#fileUpload').change(function() {
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

let video = document.querySelector("#video");
let canvas = document.querySelector("#canvas");

document.querySelector("#cameraBox").addEventListener("click", async function () {
    $('#camerastream').css('display', 'block');
    let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
	video.srcObject = stream;
});

document.querySelector("#click-photo").addEventListener('click', function() {
   	canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
//   	let image_data_url = canvas.toDataURL('image/jpeg');
});

