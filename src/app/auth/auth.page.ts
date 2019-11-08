import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  isLogin = true;

  constructor(private authService: AuthService,
              private router: Router,
              private loaderCtrl: LoadingController,
              private alertCtrl: AlertController) { }

  ngOnInit() {
  }

  authenticate(email: string, password: string) {
    this.authService.login(email, password);
    this.loaderCtrl.create({keyboardClose: true, message: 'Logging in...'}).then(loadingEl => {
      loadingEl.present();

      this.authService.signup(email, password).subscribe(resData => {
        this.isLogin = false;
        loadingEl.dismiss();
        this.router.navigateByUrl('/places/tabs/discover');
      }, errRes => {
        loadingEl.dismiss();
        const code = errRes.error.error.message;
        let message = 'Error while trying to log in!';

        if (code === 'EMAIL_EXISTS') {
          message = 'Email already exists';
        } else if (code === 'EMAIL_NOT_FOUND') {
          message = 'Email not found!';
        } else if (code === 'INVALID_PASSWORD') {
          message = 'Password is invalid!';
        } else if (code === 'USER_DISABLED') {
          message = 'User is disabled!';
        }

        this.showAlert(message);
      });
    });
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;

    this.authenticate(email, password);
  }

  private showAlert(message: string) {
    this.alertCtrl.create({header: 'Authentication failed', message, buttons: ['OK']}).then(alertEl =>
      alertEl.present()
    );
  }

}
