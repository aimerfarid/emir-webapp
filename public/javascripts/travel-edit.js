// find post edit form
let postEditFormTravel = document.getElementById('postEditFormTravel');
// add submit listener to post edit form
postEditFormTravel.addEventListener('submit', function(event) {
  // find length of uploaded images
  let imageUploads = document.getElementById('imageUpload').files.length;
  // find total number of existing images
  let existingImages = document.querySelectorAll('.imageDeleteCheckbox').length;
  // find total number of potential deletions
  let imgDeletions = document.querySelectorAll('.imageDeleteCheckbox:checked').length;
  // figure out if the form can be submitted or not
  let newTotal = existingImages - imgDeletions + imageUploads;
  if (newTotal > 10) {
    event.preventDefault();
    let removalAmt = newTotal - 10;
    alert(`You need to remove at least ${removalAmt} (more) image${removalAmt === 1 ? '' : 's'}!`);
  }
});
