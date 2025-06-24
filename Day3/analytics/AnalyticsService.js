import { EventFactory } from './EventFactory.js';

class AnalyticsService {
  static instance = null;
  constructor() {
    if (AnalyticsService.instance) return AnalyticsService.instance;
    this.strategy = null;
    this.observers = [];
    this.events = [];
    AnalyticsService.instance = this;
  }
  static getInstance() {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }
  setStrategy(strategy) { this.strategy = strategy; }
  addEvent(type, data) {
    const event = EventFactory.createEvent(type, data);
    this.events.push(event);
    return event;
  }
  analyze() {
    if (!this.strategy) throw new Error('No strategy set');
    const result = this.strategy.analyze(this.events);
    this.notifyObservers(result);
    return result;
  }
  // Observer pattern
  subscribe(observer) { this.observers.push(observer); }
  unsubscribe(observer) { this.observers = this.observers.filter(o => o !== observer); }
  notifyObservers(data) { this.observers.forEach(o => o.update(data)); }
  clearEvents() { this.events = []; }
}
export { AnalyticsService };