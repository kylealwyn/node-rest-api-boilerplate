(function () {
  $('#loginForm').submit(function (event) {
    event.preventDefault();
    var form = $(this);

    $.post('api/auth/login', form.serialize())
      .then(function (res) {
        console.log(res);
        window.location.href = '/'
      })
      .fail(function (err) {
        console.log(err)
      });
  });
}());
