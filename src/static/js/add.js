$('body').on('keydown', 'input, select', function(e) {
    var self = $(this),
        form = self.parents('form:eq(0)'),
        focusable,
        next;

    if (e.keyCode == 13) {
        focusable = form.find('input,a,select,button,textarea').filter(':visible');
        next = focusable.eq(focusable.index(this)+1);
        if (next.length) {
            next.focus();
        } else {
            form.submit();
        }
        return false;
    }
});

let incorrectInputs = 1;

$('#add-dud').on('click', function(e){
  incorrectInputs++;
  e.preventDefault();
  console.log('Hello there');
  if (incorrectInputs < 7) {
    // console.log($('#add-dud'));
    // console.log($('.dud-input').get(incorrectInputs));
    $('#dud-input-' + incorrectInputs).css('display', 'block');
  }
  if (incorrectInputs === 6) {
    $('#add-dud').css('display', 'none');
  }
});
