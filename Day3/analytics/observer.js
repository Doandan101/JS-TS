class UIObserver {
  constructor(updateFn) { this.update = updateFn; }
}
class LogObserver {
  update(data) { console.log('LogObserver:', data); }
}
class ServerObserver {
  update(data) {
    // Gửi lên server (giả lập)
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).catch(() => {});
  }
}
export { UIObserver, LogObserver, ServerObserver };