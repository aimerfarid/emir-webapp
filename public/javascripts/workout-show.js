// Toggle edit comment form
$('.toggle-edit-form').on('click', function() {
  // toggle the edit button text on click
  $(this).text() === 'Edit' ? $(this).text('Cancel') : $(this).text('Edit');
  // toggle visibility of the edit comment form
  $(this).siblings('.edit-comment-form').toggle();
});

// Add click listener for clearing of rating from edit/new form
$('.clear-rating').click(function() {
  $(this).siblings('.input-no-rate').click();
});
