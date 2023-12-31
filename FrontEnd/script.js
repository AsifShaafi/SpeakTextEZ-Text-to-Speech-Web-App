document.querySelector('#uploadBox').addEventListener('click', function () {
  this.querySelector('input').click();
});

async function iconButtonClick() {
  const formData = new FormData();

  const imageContent = getImageContent();
  if (!imageContent) {
    alert('Please select an image');
    return;
  }

  formData.append('image', imageContent);

  const response = await fetch(window.__API_URL__, {
    method: 'POST',
    body: formData,
  });
  const body = await response.json();
  const audioData = new Uint8Array(body.audio.data).buffer;
  const extractedText = body.text;
  const audioBlob = new Blob([audioData], { type: 'audio/mpeg' });

  // Showing the extracted text in the UI
  document.getElementById('extracted_text').innerHTML = extractedText;
  document.getElementById('extracted_text').style.border = '1px solid #ccc';

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(audioBlob);
  });
}

let mode = 'upload';

$(document).ready(function () {
  $('#uploadBox').click(function () {
    mode = 'upload';
    $('#camerastream').css('display', 'none');
    closeVideoStream();
    $('#fileUpload').click();
  });

  $('#fileUpload').change(function () {
    $('#read_text_btn').addClass('btn btn-success');
    $('#uploaded-image-div').css('display', 'block');
    $('#fileList').empty();

    var files = $(this).prop('files');

    // Display the image in the canvas id div
    //   const canvas = document.getElementById('canvas');
    //   const ctx = canvas.getContext('2d');
    const FR = new FileReader();
    FR.addEventListener('load', (evt) => {
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
let capturedImage;

document
  .querySelector('#cameraBox')
  .addEventListener('click', async function () {
    mode = 'camera';
    removeUploadedImage();
    $('#camerastream').css('display', 'flex');

    stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    video.srcObject = stream;
  });

document.querySelector('#click-photo').addEventListener('click', async function () {
  capturedImage = await new ImageCapture(stream.getVideoTracks()[0]).takePhoto();
  const image = await createImageBitmap(capturedImage)
  canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
});

const closeVideoStream = async () => {
  stream.getTracks().forEach((track) => {
    track.stop();
  });
};

function getImageContent() {
  if (mode == 'upload') {
    return document.getElementById('fileUpload').files[0];
  }
  return capturedImage;
}

async function handleButtonClick() {
  // Show the loading modal
  // $('#loadingModal').modal('show');

  $('#read_text_btn').css('display', 'none');
  $('#loading_text').css('display', 'block');

  const audioElement = document.getElementById('audioPlayer');

  try {
    const audioDataURI = await iconButtonClick();

    if (!audioDataURI) {
      return;
    }

    audioElement.src = audioDataURI;

    audioElement.controls = true;

    audioElement.play();
  } catch (error) {
    console.error('Error: Audio not being played', error);
  } finally {
    // Hide the loading modal after the process is done
    // $('#loadingModal').modal('hide');
    $('#loading_text').css('display', 'none');
    $('#read_text_btn').css('display', 'block');
  }
}

const removeUploadedImage = () => { 
  $('#uploaded-image-div').css('display', 'none').css('background-image', '');
  $('#fileUpload').val('');
}