jQuery(function($) {
  // Hub connectivity check
  try {
    apigClientFactory.newClient().fdhsClientServiceMethodGet({
      service: 'HubConnectivityService',
      method: 'HubConnectivityCheck',
      firstName: null,
      middleName: null,
      lastName: null,
      dob: null,
      ssn: null
    }).then(function(result) {
      if (result.data.errorType) {
        reflectNoConnection(result);
      }
    }).catch(function(err) {
      reflectNoConnection(err);
    });
  } catch (err) {
    reflectNoConnection(err);
  }

  // populate dummy data
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

  // handle form submit
  $('form').submit(function(e) {
    e.preventDefault();
    reflectVerificationStart();

    apigClientFactory.newClient().fdhsClientServiceMethodGet({
      service: 'VerifySSACompositeService',
      method: 'VerifySSA',
      firstName: $('input#first-name').val(),
      middleName: $('input#middle-name').val(),
      lastName: $('input#last-name').val(),
      dob: ($('input#date_of_birth_3').val() +
            '-' + ('0' + $('input#date_of_birth_1').val()).slice (-2) +
            '-' + ('0' + $('input#date_of_birth_2').val()).slice (-2)),
      ssn: ($('input#ssn_1').val() +
            $('input#ssn_2').val() +
            $('input#ssn_3').val())
    }).then(function(result) {
      reflectVerificationStop();
      evaluateResult(result);
    }).catch(function(err) {
      console.error(err);
      alert('ERROR: ' + err);
    });
  });

});

function reflectNoConnection(err) {
  $('#error').show();
  $('input:submit').prop('disabled', true);
  console.error(err);
}

function reflectVerificationStart() {
  resetVerification();
  $('body').addClass('busy');
  $('input:submit').prop('disabled', true);
}

function reflectVerificationStop() {
  $('body').removeClass('busy');
  $('input:submit').prop('disabled', false);
}

function resetVerification() {
  $('.verification').removeClass('success');
  $('.verification').removeClass('error');
  $('.verification').removeClass('warning');
  $('.verification').removeClass('info');
}

function reflectVerified(parentSelector, className) {
  var $selector = $('.verification', parentSelector);

  if (className) {
    $selector.addClass(className);
  } else {
    $selector.removeClass('success');
    $selector.removeClass('error');
    $selector.removeClass('warning');
    $selector.removeClass('info');
  }
}

function evaluateResult(result) {
  var response = result.data && result.data.SSACompositeIndividualResponse;

  if (response.ResponseMetadata &&
      response.ResponseMetadata.ResponseCode === 'HS000000') {
    reflectVerified('#ssn-container', 'success');

    // citizenship
    if ($('#citizen').is(':checked') &&
        response.SSAResponse.PersonUSCitizenIndicator === 'true') {
      reflectVerified('#citizen-container', 'success');
    } else {
      reflectVerified('#citizen-container', 'warning');
    }

    // title 2 (note: not an accurate check of response data)
    if ($('#title2').is(':checked') &&
        response.SSAResponse.SSATitleIIMonthlyIncome) {
      reflectVerified('#title2-container', 'success');
    } else {
      reflectVerified('#title2-container', 'warning');
    }

    // these don't get verified
    /*
    reflectVerified('#employed-container', 'info');
    reflectVerified('#married-container', 'info');
    */
  } else {
    reflectVerified('#ssn-container', 'error');
  }
}
