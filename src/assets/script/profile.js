const $ = document.querySelector.bind(document)
$('#selectimg').onclick = function () {
    $('#choseimg').click()
}

function onChangeImage() {

    var input = document.getElementById("choseimg");
    var fReader = new FileReader();
    fReader.readAsDataURL(input.files[0]);
    fReader.onloadend = function (event) {
        var img = document.getElementById("img_avatar");
        img.src = event.target.result;
        img.style.display = "block"
        $('.js-avatar').style.display = "none"
    }
}




