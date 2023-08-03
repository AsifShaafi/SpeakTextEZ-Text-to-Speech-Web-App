document.querySelector('#uploadBox').addEventListener('click', function () {
  console.log('uploaded');
  this.querySelector('input').click();
});


async function iconButtonClick() {
  const formData = new FormData();

  const imageContent = getImageContent();
  formData.append('image', imageContent);

  const response = await fetch("http://localhost:3001", {
    method: 'POST',
    body: formData
  });
  const body = await response.json();
  const audioData = new Uint8Array(body.audio.data).buffer;
  const extractedText = body.text; // TODO: Display this text on the screen
  const audioBlob = new Blob([audioData], { type: 'audio/mpeg' });

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
    mode = 'camera';
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

function dataURItoBlob(dataURL) {
  var blobBin = atob(dataURL.split(',')[1]);
  var array = [];
  for (var i = 0; i < blobBin.length; i++) {
    array.push(blobBin.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type: 'image/png' });
}

function getImageContent() {
  if (mode == 'upload') {
    return document.getElementById('fileUpload').files[0]
  }
  return dataURItoBlob(canvas.toDataURL('image/png'));
}

async function handleButtonClick() {
  const audioElement = document.getElementById('audioPlayer');

  try {
    const audioDataURI = await iconButtonClick();

    audioElement.src = audioDataURI;

    audioElement.controls = true;

    audioElement.play();

  } catch (error) {
    console.error('Error: Audio not being played', error);
  }
}
