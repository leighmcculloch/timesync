/*
 *= require _analytics
 *= require _jquery-2.1.1.min
 *= require _moment
 */

 TIME_FORMAT = 'YYYY MMM Do, hh:mm:ss a Z';
 THRESHOLD_MINUTES = 15;

if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
  $('.device').html('phone');
} else if(/iPad/i.test(navigator.userAgent)) {
  $('.device').html('iPad');
}

function update_times() {
  client_time = moment();
  client_time_utc = moment().utc();

  $('.time').html(client_time.format(TIME_FORMAT));
  $('.time-utc').html(client_time_utc.format(TIME_FORMAT));

  $.ajax({
    type: 'GET',
    url: '/time.js',
    cache: false,
    success: function(data, textStatus, request) {
      server_time_utc_string = request.getResponseHeader('Date');
      server_time_utc = moment(server_time_utc_string + ' Z', 'ddd, DD MMM YYYY HH:mm:ss Z').utc();
      $('.actual-time-utc').html(server_time_utc.format(TIME_FORMAT));
      $('.actual-time').html(server_time_utc.zone(client_time.zone()).format(TIME_FORMAT));

      difference = Math.abs(server_time_utc.diff(client_time_utc, 'minutes'));
      if (difference < THRESHOLD_MINUTES) {
        $('.section-message-unhappy').hide();
        $('.section-message-happy').show();
      } else {
        $('.section-message-happy').hide();
        $('.section-message-unhappy').show();
        $('.message-minutes').html(moment.duration(difference, "minutes").humanize())
      }
    }
  });
}

update_times();
setInterval(update_times, 1000);