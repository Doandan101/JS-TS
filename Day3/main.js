import { AnalyticsService } from './analytics/AnalyticsService.js';
import { BasicAnalytics, TimeBasedAnalytics, AIEnhancedAnalytics } from './analytics/strategies.js';
import { UIObserver, LogObserver, ServerObserver } from './analytics/observer.js';
import { AnalyticsProxy } from './analytics/proxy.js';
import { withLogging, withTiming } from './analytics/decorators.js';

const user = { isLoggedIn: false };
const service = AnalyticsService.getInstance();
let proxy = new AnalyticsProxy(service, user);

const resultEl = document.getElementById('result');
const logsEl = document.getElementById('logs');
const strategySelect = document.getElementById('strategySelect');
const clickBtn = document.getElementById('clickBtn');
const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');
const scrollArea = document.getElementById('scrollArea');

let stayStart = Date.now();
let worker = new Worker('analysisWorker.js');
let currentStrategy = 'basic';

// Observer cập nhật UI
const uiObserver = new UIObserver(data => {
  resultEl.textContent = JSON.stringify(data, null, 2);
  logsEl.textContent += `[${new Date().toLocaleTimeString()}] Kết quả mới: ${JSON.stringify(data)}\n`;
});
service.subscribe(uiObserver);
service.subscribe(new LogObserver());
service.subscribe(new ServerObserver());

// Đăng nhập/đăng xuất
loginBtn.onclick = () => {
  user.isLoggedIn = true;
  loginBtn.style.display = 'none';
  logoutBtn.style.display = '';
};
logoutBtn.onclick = () => {
  user.isLoggedIn = false;
  loginBtn.style.display = '';
  logoutBtn.style.display = 'none';
};

// Chọn chiến lược
strategySelect.onchange = (e) => {
  currentStrategy = e.target.value;
  let strategy;
  if (currentStrategy === 'basic') strategy = new BasicAnalytics();
  else if (currentStrategy === 'time') strategy = new TimeBasedAnalytics();
  else strategy = new AIEnhancedAnalytics();
  service.setStrategy(strategy);
};

// Decorator: logging + timing
service.analyze = withLogging(withTiming(service.analyze.bind(service)));

// Ghi nhận sự kiện click
clickBtn.onclick = () => {
  service.addEvent('click', { time: Date.now() });
  analyzeWithWorker();
};
// Ghi nhận sự kiện scroll
scrollArea.onscroll = () => {
  service.addEvent('scroll', { time: Date.now(), position: scrollArea.scrollTop });
  analyzeWithWorker();
};
// Ghi nhận thời gian ở trang (staytime)
window.onbeforeunload = () => {
  const duration = Date.now() - stayStart;
  service.addEvent('staytime', { duration });
  analyzeWithWorker();
};

// Phân tích bằng Web Worker
function analyzeWithWorker() {
  if (!user.isLoggedIn) {
    alert('Bạn cần đăng nhập để phân tích!');
    return;
  }
  worker.postMessage({
    events: service.events,
    strategy: currentStrategy
  });
}
worker.onmessage = (e) => {
  service.notifyObservers(e.data);
};

// Gửi kết quả lên server mỗi 10s (Bonus)
setInterval(() => {
  if (user.isLoggedIn) {
    analyzeWithWorker();
  }
}, 10000);

// Khởi tạo chiến lược mặc định
service.setStrategy(new BasicAnalytics());