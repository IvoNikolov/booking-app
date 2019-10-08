import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  constructor(private authService: AuthService, private router: Router, private laoderCtrl: LoadingController) { }

  ngOnInit() {
  }

  onLogin() {
    this.authService.login();
    this.laoderCtrl.create({keyboardClose: true, message: 'Logging in...'}).then(loadingEl => {
      loadingEl.present();
      setTimeout(() => {
        this.router.navigateByUrl('/places/tabs/discover');
        loadingEl.dismiss();
      }, 2000);
    });
  }

}
