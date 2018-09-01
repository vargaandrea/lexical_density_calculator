$(document).ready(function(){
  $('.delete-non_lexical_word').on('click', function(e){
    // todo: "Are you sure?"
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type:'DELETE',
      url: '/non_lexical_words/'+id,
      success: function(response){
        window.location.href='/non_lexical_words/deleted';
      },
      error: function(err){
        console.log(err);
      }
    });
  });
});
