import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserModel } from '../../models/auth/user.model';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { CommonModule} from '@angular/common';

@Component({
  selector: 'utk-profile',
  imports: [RouterLink, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  private toastrService = inject(ToastrService);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);
  private router = inject(Router);
  
  userObj!: UserModel;
  
    ngOnInit(): void {
        this.getUser();
    }
    getUser() {
      this.authService.getUserByToken().subscribe(response => {
        this.userObj = response.data;
      })
    }

}
