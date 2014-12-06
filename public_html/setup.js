
$(document).ready(function ()
{
    var whiteList=localStorage.getItem("whiteList");
    if (whiteList!==undefined && whiteList!==null) {
        $('#whitelist').val(whiteList);
    }
});

$('#whitelist').change(function() {
    localStorage.setItem("whiteList",$(this).val());
});