import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgxDrpOptions, PresetItem, Range } from 'ngx-mat-daterange-picker';


@Component({
  selector: 'app-com-date-filter',
  templateUrl: './com-date-filter.component.html',
  styleUrls: ['./com-date-filter.component.css']
})
export class ComDateFilterComponent implements OnInit {

  @Output() RangeSelected = new EventEmitter<Range>();

  // datapicker
  range: Range = {fromDate: new Date(), toDate: new Date()};
  options: NgxDrpOptions;
  presets: Array<PresetItem> = [];


  constructor() { }

  ngOnInit() {
    this.configDataPicker();
  }

  private configDataPicker() {
    const today = new Date();
    const currMonthStart = new Date();
    const currMonthEnd = new Date();
    // const fromMin = new Date(today.getFullYear(), today.getMonth() - 2, 1);
    // const fromMax = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    // const toMin = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    // const toMax = new Date(today.getFullYear(), today.getMonth() + 2, 0);

    this.setupPresets();
    this.options = {
      presets: this.presets,
      format: 'mediumDate',
      // range: {fromDate: today, toDate: today},
      range: {fromDate: currMonthStart, toDate: currMonthEnd}, // inicia en el mes actual
      applyLabel: 'APLICAR',
      startDatePrefix: 'DESDE',
      endDatePrefix: 'HASTA',
      placeholder: 'PERIODO',
      locale: 'es-ES',
      calendarOverlayConfig: {
        shouldCloseOnBackdropClick: false,
        // hasBackDrop: false
      },
      cancelLabel: 'CANCELAR',
      // excludeWeekends: true,
      // fromMinMax: {fromDate: fromMin, toDate: fromMax},
      // toMinMax: {fromDate: toMin, toDate: toMax}
    };

  }

   // helper function to create initial presets
   private setupPresets() {

      let today = new Date();
      const backDate = (numOfDays: any) => {
        const _today = new Date();
        return new Date(_today.setDate(today.getDate() - numOfDays));
      };

      today = new Date();
      const yesterday = backDate(1);
      const minus7 = backDate(7);
      // const minus30 = backDate(30);
      const currMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const currMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

      this.presets =  [
        {presetLabel: 'Hoy', range: { fromDate: today, toDate: today }},
        {presetLabel: 'Ayer', range: { fromDate: yesterday, toDate: today }},
        {presetLabel: 'Ultima Semana', range: { fromDate: minus7, toDate: today }},
        {presetLabel: 'Mes Actual', range: { fromDate: currMonthStart, toDate: currMonthEnd }},
        {presetLabel: 'Mes Anterior', range: { fromDate: lastMonthStart, toDate: lastMonthEnd }}
      ];
  }

  updateRange(range: Range) {
    this.range = range;
    // console.log(this.range);
    this.RangeSelected.emit(range);
  }

}
