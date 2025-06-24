import { ClickEvent, ScrollEvent, StayTimeEvent } from './events.js';

export class EventFactory {
  static createEvent(type, data) {
    switch(type) {
      case 'click': return new ClickEvent(data);
      case 'scroll': return new ScrollEvent(data);
      case 'staytime': return new StayTimeEvent(data);
      default: throw new Error('Unknown event type');
    }
  }
}