import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineOrderGameComponent } from './timeline-order-game.component';

@NgModule({
  imports: [CommonModule, TimelineOrderGameComponent],
  exports: [TimelineOrderGameComponent],
})
export class TimelineOrderGameModule {}