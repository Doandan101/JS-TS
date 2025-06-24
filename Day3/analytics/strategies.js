class BasicAnalytics {
  analyze(events) {
    return { clicks: events.filter(e => e.type === 'click').length };
  }
}
class TimeBasedAnalytics {
  analyze(events) {
    const stayEvents = events.filter(e => e.type === 'staytime');
    const totalTime = stayEvents.reduce((sum, e) => sum + (e.data.duration || 0), 0);
    return { totalStayTime: totalTime, stayEvents: stayEvents.length };
  }
}
class AIEnhancedAnalytics {
  analyze(events) {
    // Giả lập AI: đếm click, scroll, staytime, phát hiện bất thường
    const clicks = events.filter(e => e.type === 'click').length;
    const scrolls = events.filter(e => e.type === 'scroll').length;
    const stayEvents = events.filter(e => e.type === 'staytime');
    const anomalies = events.filter(e => e.data && e.data.anomaly);
    return {
      clicks, scrolls,
      totalStayTime: stayEvents.reduce((sum, e) => sum + (e.data.duration || 0), 0),
      anomalies: anomalies.length
    };
  }
}
export { BasicAnalytics, TimeBasedAnalytics, AIEnhancedAnalytics };