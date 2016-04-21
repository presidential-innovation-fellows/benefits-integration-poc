jQuery(function($) {
  $('#populate').click(function() {
    $('input#first-name').val('Mark');
    $('input#middle-name').val(null);
    $('input#last-name').val('White');
    $('input#date_of_birth_1').val(7);
    $('input#date_of_birth_2').val(8);
    $('input#date_of_birth_3').val(1991);
    $('input#ssn_1').val('277');
    $('input#ssn_2').val('02');
    $('input#ssn_3').val('5100');
    $('input#citizen').prop('checked', true);
    $('input#title2').prop('checked', true);
  });
});
