document.querySelector('#uploadBox').addEventListener('click', function () {
  console.log('uploaded');
  this.querySelector('input').click();
});

async function iconButtonClick() {
  const formData = new FormData();

  formData.append('image', document.getElementById('fileUpload').files[0]);

  const response = await fetch("http://localhost:3001", {
    method: 'POST',
    body: formData
  });
  console.log(response);
}

$(document).ready(function () {
  $('#uploadBox').click(function () {
    $('#camerastream').css('display', 'none');
    closeVideoStream();
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

let video = document.querySelector('#video');
let canvas = document.querySelector('#canvas');
let stream;

document
  .querySelector('#cameraBox')
  .addEventListener('click', async function () {
    $('#uploaded-image-div').css('display', 'none');
    $('#camerastream').css('display', 'flex');

    stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    video.srcObject = stream;
  });

document.querySelector('#click-photo').addEventListener('click', function () {
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
  //   	let image_data_url = canvas.toDataURL('image/jpeg');
});

const closeVideoStream = async () => {
  stream.getTracks().forEach((track) => {
    track.stop();
  });
};
