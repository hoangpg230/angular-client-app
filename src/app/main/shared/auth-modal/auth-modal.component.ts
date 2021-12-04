import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { DataService } from 'src/app/core/services/data.service';

declare const Validator: any
@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css']
})
export class AuthModalComponent implements OnInit {

  constructor(
    private router: Router,
    private dataService: DataService,
    private authService: AuthenticationService
  ) { }
  emails: any
  register() {
    const _this = this
    Validator({
      form: '#register-form',
      formGroupSelector: '.form-group',
      errorSelector: '.form-message',
      rules: [
        Validator.isEmail('#re_email'),
        Validator.isExist('#re_email', _this.emails, 'Email đã được sử dụng.Hãy thử email khác.'),
        Validator.minLength('#re_password', 6),
        Validator.isConfirmed('#password_confirmation', function () {
          let password = document.querySelector('#register-form #re_password') as any
          return password.value;
        }, 'Mật khẩu nhập lại không chính xác')
      ],
      onSubmit: function (data: any) {
        data = {
          ...data,
          name: "",
          avatar: "",
          address: "",
          phoneNumber: ""
        }
        _this.dataService.POST('api/user/insert', data).subscribe(
          (res: any) => {
            let {email, password} = res
            _this.authService.Login(email, password).subscribe(
              (res: any)=>{
                _this.closeModal()
                _this.router.routeReuseStrategy.shouldReuseRoute = function () {
                  return false;
                }
                _this.router.onSameUrlNavigation = 'reload';
                _this.router.navigate([_this.router.url]);
              }
            )
          }
        )
      }
    });
  }

  logIn() {
    const _this = this
    Validator({
      form: '#logIn-form',
      formGroupSelector: '.form-group',
      errorSelector: '.form-message',
      rules: [
        Validator.isEmail('#email'),
        Validator.minLength('#password', 6),

      ],
      onSubmit: function (data: any) {
        const {email, password} = data;
        _this.authService.Login(email, password).subscribe((res: any)=>{
          _this.closeModal();
          _this.router.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
          }
          _this.router.onSameUrlNavigation = 'reload';
          _this.router.navigate([_this.router.url]);
        })
      }
    });
  }

  closeModal() {
    let modalAuth = document.querySelector('.modal-auth') as any
    // delete text and message
    let authFormInputs = document.querySelectorAll('.auth-form__input')
    authFormInputs.forEach((e: any) => {
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

  ngOnInit(): void {
    this.dataService.GET('api/user/getAll').subscribe((res: any)=>{
      this.emails = res.map((val: any)=>{
        return val.email
      })
      this.register()
      this.logIn()
    })
    
   
  }

}
