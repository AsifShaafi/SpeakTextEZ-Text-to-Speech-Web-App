document.querySelector('#uploadBox').addEventListener('click', function () {
  console.log('uploaded');
  this.querySelector('input').click();
});

document.querySelector('#cameraBox').addEventListener('click', function () {
  // Implement camera access here
  alert('Camera access to be implemented');
});

function iconButtonClick() {
  alert('Button clicked');
}

$(document).ready(function () {
  $('#uploadBox').click(function () {
    $('#fileUpload').click();
  });

  $('#fileUpload').change(function () {
    $('#uploaded-image-div').css('display', 'block');
    $('#fileList').empty();

    var files = $(this).prop('files');

    // Display the image in the canvas id div
    //   const canvas = document.getElementById('canvas');
    //   const ctx = canvas.getContext('2d');
    const FR = new FileReader();
    FR.addEventListener('load', (evt) => {
      console.log(evt.target.result);
      console.log('url(' + FR.result + ')');

      const img = new Image();
      img.addEventListener('load', () => {
        // ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        $('#selected-image-display').css(
          'background-image',
          'url(' + FR.result + ')'
        );
      });
      img.src = evt.target.result;
    });

    for (var i = 0; i < files.length; i++) {
      FR.readAsDataURL(files[0]);
      // ctx.drawImage(files[i], 10, 10);
      $('#fileList').append('<li>' + files[i].name + '</li>');
    }

    $('#uploadModal').modal('show');
  });

  var dropZone = $('#uploadBox');
  dropZone.on('dragover', function (e) {
    e.preventDefault();
    e.stopPropagation();
    dropZone.addClass('dragging');
  });
  dropZone.on('dragleave', function (e) {
    dropZone.removeClass('dragging');
  });
  dropZone.on('drop', function (e) {
    e.preventDefault();
    dropZone.removeClass('dragging');
    var files = e.originalEvent.dataTransfer.files;
    var fileInput = $('#fileUpload');
    fileInput.prop('files', files);
    fileInput.trigger('change');
  });
});
