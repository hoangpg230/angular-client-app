
var modalAuth = document.querySelector('.modal-auth')
var loginForm = document.querySelector('.login-form')
var registerForm = document.querySelector('.register-form')

var inputPasswords = document.querySelectorAll('input[type="password"]')
var eyeIcons = document.querySelectorAll('.icon-eye')

// show icon when key down
inputPasswords.forEach((element) => {

    element.onkeyup = function () {
        if (this.value == "") {
            this.parentElement.querySelector('.icon-eye').classList.add('d-none')
        } else {
            this.parentElement.querySelector('.icon-eye').classList.remove('d-none')
        }
    }

})


// Show hide password
eyeIcons.forEach((element) => {
    element.onclick = function () {
        if (this.classList.contains('fa-eye')) {
            this.parentElement.querySelector('.icon-eye').classList.remove('d-none')
            this.classList.remove('fa-eye')
            this.classList.add('fa-eye-slash')
            this.parentElement.querySelector('input').type = "text"
        } else {
            this.parentElement.querySelector('.icon-eye').classList.remove('d-none')
            this.classList.add('fa-eye')
            this.classList.remove('fa-eye-slash')
            this.parentElement.querySelector('input').type = "password"
        }
    }
})

function showLogin() {
    loginForm.classList.remove('d-none')

    modalAuth.classList.remove('d-none')
    registerForm.classList.add('d-none')
}

function showRegister() {
    registerForm.classList.remove('d-none')

    modalAuth.classList.remove('d-none')
    loginForm.classList.add('d-none')
}

function closeModal() {
    // delete text and message
    var authFormInputs = document.querySelectorAll('.auth-form__input')
    authFormInputs.forEach((e) => {
        e.value = "";
        if (e.parentElement.nextElementSibling && e.parentElement.nextElementSibling.classList.contains('auth-form__message-error')) {
            e.parentElement.nextElementSibling.textContent = ""
        }
        e.onblur = function () {
            console.log(e.parentElement.nextElementSibling)
        }
    })
    //close modal
    modalAuth.classList.add('d-none')
}
