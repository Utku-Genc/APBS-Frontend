import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IlanBasvuruService } from '../../services/ilan-basvuru.service';
import { ApplyDto } from '../../models/ilan-basvuru/apply-dto.model';
import { ApplyFileDto } from '../../models/ilan-basvuru/apply-file-dto.model';
import { CommonModule } from '@angular/common';
import { KriterAlanService } from '../../services/kriter-alan.service';
import { ToastService } from '../../services/toast.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ilan-basvuru',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './ilan-basvuru.component.html',
  styleUrls: ['./ilan-basvuru.component.css']
})
export class IlanBasvuruComponent implements OnInit {
  private ilanBasvuruService = inject(IlanBasvuruService);
  private alanKriterService = inject(KriterAlanService);
  private toastService = inject(ToastService);
  private toastrService = inject(ToastrService);

  basvuruForm: FormGroup;
  ilanId: number;
  loading = false;
  submitted = false;
  errorMessage: string = '';
  successMessage: string = '';
  alreadyApplied = false;
  kriterler: any[] = [];
  selectedFiles: any[] = [];
  selectedFileNames: string[] = [];

  kriterSummary: {id: number, ad: string, minAdet: number, secilenAdet: number}[] = [];
  
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.basvuruForm = this.fb.group({
      aciklama: [''],
      files: this.fb.array([])
    });
    
    this.ilanId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    if (!this.ilanId) {
      this.errorMessage = 'İlan ID bulunamadı!';
      return;
    }
    
    this.loadKriterler();
      this.checkIfAlreadyApplied();
        this.addFileGroup();
  }
  
  loadKriterler(): void {
    this.loading = true;
    this.alanKriterService.getByIlanId(this.ilanId).subscribe({
      next: (result) => {
        this.loading = false;
        if (result.isSuccess) {
          this.kriterler = result.data;
          this.kriterSummary = this.kriterler.map(k => ({
            id: k.kriterId,
            ad: k.kriter.ad,
            minAdet: k.minAdet,
            secilenAdet: 0
          }));
        }else {
          this.toastrService.error('Kriter yükleme başarısız:', result.message);
        }
      },
      error: (err) => {
        if (err.error?.ValidationErrors) {
          const errorMessages = err.error.ValidationErrors.map(
            (error: { ErrorMessage: string }) => error.ErrorMessage
          );
          errorMessages.forEach((message: string | undefined) => {
            this.toastrService.error(message);
          });
        } else {
          this.toastrService.error(err.error.message, 'Kriter yükleme başarısız!');
        }
      },
    });
  }
  
  checkIfAlreadyApplied(): void {
    this.loading = true;
    this.ilanBasvuruService.isAppliedBefore(this.ilanId).subscribe({
      next: (result) => {
        this.loading = false;
        if (result.data) {
          this.alreadyApplied = true;
          this.errorMessage = result.message;
          this.basvuruForm.disable();
        }else {
          this.toastrService.error('Başvuru kontrol başarısız:', result.message);
        }
      },
      error: (err) => {
        if (err.error?.ValidationErrors) {
          const errorMessages = err.error.ValidationErrors.map(
            (error: { ErrorMessage: string }) => error.ErrorMessage
          );
          errorMessages.forEach((message: string | undefined) => {
            this.toastrService.error(message);
          });
        } else {
          this.toastrService.error(err.error.message, 'Başvuru kontrol başarısız!');
        }
      },
    });
  }

  get filesArray(): FormArray {
    return this.basvuruForm.get('files') as FormArray;
  }

  addFileGroup(): void {
    const fileGroup = this.fb.group({
      file: [null, Validators.required],
      kriterIds: [[], Validators.required]
    });
    
    this.filesArray.push(fileGroup);
  }

  removeFileGroup(index: number): void {
    const kriterIds = this.filesArray.at(index).get('kriterIds')?.value || [];
    this.updateKriterSummary(kriterIds, false);
    
    this.filesArray.removeAt(index);
    
    this.selectedFiles.splice(index, 1);
    this.selectedFileNames.splice(index, 1);
  }

  onFileChange(event: any, index: number): void {
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      this.filesArray.at(index).get('file')?.setValue(file);
      this.selectedFileNames[index] = file.name;
      this.selectedFiles[index] = true;
    }
  }
  
  onKriterChange(index: number, event: any): void {
    const selectedKriterIds = Array.isArray(event.target.value) 
      ? event.target.value 
      : [event.target.value];
    
    const formGroup = this.filesArray.at(index);
    const previousKriterIds = formGroup.get('kriterIds')?.value || [];
    
    this.updateKriterSummary(previousKriterIds, false);
    
    this.updateKriterSummary(selectedKriterIds, true);
    
    formGroup.get('kriterIds')?.setValue(selectedKriterIds);
  }
  
  updateKriterSummary(kriterIds: number[], isAdd: boolean): void {
    if (!Array.isArray(kriterIds)) {
      kriterIds = [kriterIds];
    }
    
    kriterIds.forEach(id => {
      const numericId = Number(id);
      const kriterItem = this.kriterSummary.find(k => k.id === numericId);
      if (kriterItem) {
        if (isAdd) {
          kriterItem.secilenAdet++;
        } else {
          kriterItem.secilenAdet = Math.max(0, kriterItem.secilenAdet - 1);
        }
      }
    });
  }
  
  isAllRequirementsMet(): boolean {
    return this.kriterSummary.every(k => k.secilenAdet >= k.minAdet);
  }
  
  getMissingRequirements(): string {
    const missing = this.kriterSummary
      .filter(k => k.secilenAdet < k.minAdet)
      .map(k => `${k.ad} (${k.secilenAdet}/${k.minAdet})`);
    
    return missing.join(', ');
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.basvuruForm.invalid) {
      this.showErrorAlert('Lütfen tüm zorunlu alanları doldurun.');
      return;
    }
    
    if (!this.isAllRequirementsMet()) {
      const message = `Aşağıdaki kriter gereksinimleri karşılanmıyor: ${this.getMissingRequirements()}`;
      this.showErrorAlert(message);
      return;
    }
    
    this.loading = true;
    
    const applyDto: ApplyDto = {
      ilanId: this.ilanId,
      basvuruTarihi: new Date(),
      aciklama: this.basvuruForm.get('aciklama')?.value,
      files: this.prepareFileData()
    };
    
    this.ilanBasvuruService.apply(applyDto).subscribe({
      next: (result) => {
        this.loading = false;
        if (result.isSuccess) {
          this.successMessage = result.message;
          this.resetForm();
          
          Swal.fire({
            title: 'Başarılı!',
            text: 'Başvurunuz başarıyla alındı, anasayfaya yönlendiriliyorsunuz.',
            icon: 'success',
            timer: 5000,
            timerProgressBar: true
          }).then(() => {
            this.router.navigate(['/']);
          });
        } else {
          this.toastrService.error('Başvuru alınamadı!', result.message);
        }
      },
      error: (err) => {
        if (err.error?.ValidationErrors) {
          const errorMessages = err.error.ValidationErrors.map(
            (error: { ErrorMessage: string }) => error.ErrorMessage
          );
          errorMessages.forEach((message: string | undefined) => {
            this.toastrService.error(message);
          });
        } else {
          this.toastrService.error(err.error.message, 'Başvuru alınamadı!');
        }
      },
    });
  }

  private prepareFileData(): ApplyFileDto[] {
    const filesValue = this.filesArray.value;
    const fileData: ApplyFileDto[] = [];
    
    filesValue.forEach((item: any) => {
      if (item.file && item.kriterIds.length > 0) {
        fileData.push({
          file: item.file,
          kriterIds: item.kriterIds
        });
      }
    });
    
    return fileData;
  }

  private resetForm(): void {
    this.submitted = false;
    this.basvuruForm.reset();
    
    this.filesArray.clear();
    this.addFileGroup();
    
    this.kriterSummary.forEach(k => k.secilenAdet = 0);
    this.selectedFiles = [];
    this.selectedFileNames = [];
  }
  
  private showErrorAlert(message: string): void {
    Swal.fire({
      title: 'Hata!',
      text: message,
      icon: 'error',
      confirmButtonText: 'Tamam'
    });
  }
  
  toggleKriter(fileIndex: number, kriterId: number): void {
    const formGroup = this.filesArray.at(fileIndex);
    const currentSelection = formGroup.get('kriterIds')?.value || [];
    let newSelection: number[];
    
    if (currentSelection.includes(kriterId)) {
      newSelection = currentSelection.filter((id: number) => id !== kriterId);
      this.updateKriterSummary([kriterId], false);
    } else {
      newSelection = [...currentSelection, kriterId];
      this.updateKriterSummary([kriterId], true);
    }
    
    formGroup.get('kriterIds')?.setValue(newSelection);
  }
  
  isKriterSelected(fileIndex: number, kriterId: number): boolean {
    const formGroup = this.filesArray.at(fileIndex);
    const selection = formGroup.get('kriterIds')?.value || [];
    return selection.includes(kriterId);
  }
  
  calculateWidth(secilenAdet: number, minAdet: number): number {
    if (minAdet <= 0) return 100; 
    return Math.min(100, (secilenAdet / minAdet) * 100);
  }
}