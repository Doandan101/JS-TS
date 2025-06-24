class ClickEvent {
  constructor(data) { this.type = 'click'; this.data = data; }
}
class ScrollEvent {
  constructor(data) { this.type = 'scroll'; this.data = data; }
}
class StayTimeEvent {
  constructor(data) { this.type = 'staytime'; this.data = data; }
}
export { ClickEvent, ScrollEvent, StayTimeEvent };