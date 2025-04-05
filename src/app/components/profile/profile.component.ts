import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { CommonModule} from '@angular/common';
import { CardsComponent } from "../cards/cards.component";
import { UserModel } from '../../models/auth/user.model';
import { TcMaskPipe } from "../../pipes/tcmask.pipe";
import { UserService } from '../../services/user.service';

@Component({
  selector: 'utk-profile',
  imports: [RouterLink, CommonModule, CardsComponent, TcMaskPipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  private toastrService = inject(ToastrService);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);
  
  status: string = 'active';
  selfProfile = false;
  profileImage: boolean = false;

  
  userObj!: UserModel;
    ngOnInit(): void {
      const url = this.router.url;
      const segments = url.split('/');
      if (segments.length > 2 && segments[1] === 'profiles') {
        const id = Number(segments[2]);
        this.getUserById(id);
      } else {
        this.getUser();
      }
    }
    getUser() {
      this.userService.getUserByToken().subscribe(response => {
        this.userObj = response.data;
        if (this.userObj.imageUrl !== null) {
          this.profileImage = true;
        }
        this.userObj.showFullTc = false;
        this.selfProfile = true;
      })
    }

    getUserById(id: number): void {
      this.userService.getUserById(id).subscribe(response => {
        if (response.isSuccess && response.data === null) {
          // Redirect to unauthorized page
          this.router.navigate(['/unauthorized']);
        } else {
          this.userObj = response.data;
          if (this.userObj.imageUrl !== null) {
            this.profileImage = true;
          }
          this.userObj.showFullTc = false;
        }
      })
    }
}