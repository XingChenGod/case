import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';

@Component({
  selector: 'app-time-picker-select',
  templateUrl: './time-picker-select.component.html',
  styleUrls: ['./time-picker-select.component.scss']
})

export class TimePickerSelectComponent implements OnInit {
  // 宽度
  @Input() width;
  // display
  @Input() display;
  // 是否需要秒位
  @Input() isNeedSecond: boolean = false;
  // 最后选择的时间
  @Input() choiceTargetTime: string;
  // 输入的结果
  @Output() targetTime = new EventEmitter();
  // 列表是否显示
  timeShow: boolean = false;
  // 时
  arrHours: any[] = [];
  // 分，秒
  arrSec: any[] = [];
  // 时
  hours: string;
  // 分
  minutes: string;
  // 秒
  second: string;

  constructor() {}

  ngOnInit(): void {
    for (let i = 0; i < 60; i ++) {
      if (i < 10) {
        this.arrHours.push('0' + i);
        this.arrSec.push('0' + i);
      } else {
        if (i <= 23) {
          this.arrHours.push(i + '');
        }
        this.arrSec.push(i + '');
      }
    }
  }

  // 点击输入时间框
  clickInput(ev) {
    ev.stopPropagation();
    ev.cancelBubble = true;
    this.timeShow = !this.timeShow;
    this.docEvent();
  }

  // 输入
  blurText(ev) {
    const value = ev.target.value;
    const reg = this.isNeedSecond ? /\d{2}:\d{2}:\d{2}/ : /\d{2}:\d{2}/;
    if (!reg.test(value)) {
      this.isNeedSecond ? this.choiceTargetTime = '00:00:00' : this.choiceTargetTime = '00:00';
    } else {
      const arr = value.split(':');
      arr[0] * 1 >= 24 ? this.hours = '23' : this.hours = arr[0];
      arr[1] * 1 >= 60 ? this.minutes = '59' : this.minutes = arr[1];
      if (this.isNeedSecond) {
        arr[2] * 1 >= 60 ? this.second = '59' : this.second = arr[2];
      }
    }
  }

  // 选择时间
  choiceTime(ev, times, type) {
    ev.cancelBubble = true;
    ev.stopPropagation();
    this.timeShow = true;
    switch (type) {
      case 1:
        this.hours = times;
        break;
      case 2:
        this.minutes = times;
        if (!this.isNeedSecond) {
          this.timeShow = false
        }
        break;
      case 3:
        this.second = times;
        this.timeShow = false;
        break;
    }
    if (this.isNeedSecond) {
      this.choiceTargetTime = `${this.hours || '00'}:${this.minutes || '00'}:${this.second || '00'}`;
    } else {
      this.choiceTargetTime = `${this.hours || '00'}:${this.minutes || '00'}`;
    }
    this.targetTime.emit(this.choiceTargetTime);
  }

  // 点击×
  clearTime(ev) {
    ev.cancelBubble = true;
    ev.stopPropagation();
    this.choiceTargetTime = '';
    this.timeShow = false;
  }

  // 给document绑定事件
  docEvent() {
    document.addEventListener('click', () => {
      this.timeShow = false;
      if (this.isNeedSecond) {
        this.choiceTargetTime = `${this.hours || '00'}:${this.minutes || '00'}:${this.second || '00'}`;
      } else {
        this.choiceTargetTime = `${this.hours || '00'}:${this.minutes || '00'}`;
      }
      this.targetTime.emit(this.choiceTargetTime);
    }, false);
  }
}
