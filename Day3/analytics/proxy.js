class AnalyticsProxy {
  constructor(realAnalytics, user) {
    this.realAnalytics = realAnalytics;
    this.user = user;
  }
  analyze() {
    if (!this.user.isLoggedIn) {
      alert('Bạn cần đăng nhập để phân tích!');
      return null;
    }
    return this.realAnalytics.analyze();
  }
}
export { AnalyticsProxy };