import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { NgModule } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBottomSheetModule, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatStepperModule } from '@angular/material/stepper';
import { ModuleWithProviders } from '@angular/core';

@NgModule({
  imports: [
    MatToolbarModule, MatButtonModule, MatCardModule, MatInputModule, MatDialogModule, MatTableModule,
    MatMenuModule, MatIconModule, MatProgressSpinnerModule, MatFormFieldModule,
    MatTabsModule, MatSidenavModule, MatNativeDateModule, MatListModule, MatTooltipModule, MatGridListModule,
    MatCheckboxModule, MatSelectModule, MatOptionModule, MatRadioModule, MatStepperModule, MatExpansionModule,
    MatChipsModule, MatSnackBarModule, MatPaginatorModule, MatSlideToggleModule, MatButtonToggleModule,
    MatSliderModule, MatBottomSheetModule, MatAutocompleteModule, MatSortModule, MatProgressBarModule,
    MatDividerModule, MatDatepickerModule
  ],
  exports: [
    MatToolbarModule, MatButtonModule, MatCardModule, MatInputModule, MatDialogModule, MatTableModule,
    MatMenuModule, MatIconModule, MatProgressSpinnerModule, MatFormFieldModule, MatTabsModule,
    MatSidenavModule, MatNativeDateModule, MatListModule, MatTooltipModule, MatGridListModule, MatStepperModule,
    MatCheckboxModule, MatSelectModule, MatOptionModule, MatRadioModule, MatChipsModule, MatSnackBarModule,
    MatPaginatorModule, MatExpansionModule, MatSlideToggleModule, MatButtonToggleModule, MatSliderModule,
    MatBottomSheetModule, MatAutocompleteModule, MatSortModule, MatProgressBarModule,
    MatDividerModule, MatDatepickerModule
  ],

  providers: [
    { provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false } },
    { provide: MatBottomSheetRef, useValue: {} },
    { provide: MAT_BOTTOM_SHEET_DATA, useValue: {} }
  ]
})
export class MaterialModule {
  static forRoot(): ModuleWithProviders<MaterialModule> {
    return {
      ngModule: MaterialModule
    };
  }
}
