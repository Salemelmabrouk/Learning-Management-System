// src/app/emitter/emitter.ts
import { EventEmitter } from '@angular/core';

export class Emitters {
  static authEmitter = new EventEmitter<boolean>();
}
