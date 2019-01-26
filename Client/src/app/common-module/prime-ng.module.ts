import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { CardModule } from 'primeng/card';
import { GrowlModule } from 'primeng/growl';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CodeHighlighterModule } from 'primeng/codehighlighter';
import { AccordionModule } from 'primeng/accordion';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressBarModule } from 'primeng/progressbar';
import { ChartModule } from 'primeng/chart';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { MenuModule } from 'primeng/menu';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenubarModule } from 'primeng/menubar';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MultiSelectModule } from 'primeng/multiselect';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    ChartModule,
    MenubarModule,
    TableModule,
    ButtonModule,
    FieldsetModule,
    CardModule,
    GrowlModule,
    AutoCompleteModule,
    CodeHighlighterModule,
    AccordionModule,
    DropdownModule,
    CheckboxModule,
    InputTextModule,
    TooltipModule,
    ProgressBarModule,
    ChartModule,
    TieredMenuModule,
    MenuModule,
    MegaMenuModule,
    PanelModule,
    ToastModule,
    ProgressSpinnerModule,
    MultiSelectModule
  ],
  declarations: []
})
export class PrimeNgModule { }
