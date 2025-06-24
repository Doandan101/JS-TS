onmessage = function(e) {
  // e.data: { events, strategy }
  const { events, strategy } = e.data;
  let result = {};
  if (strategy === 'basic') {
    result = { clicks: events.filter(ev => ev.type === 'click').length };
  } else if (strategy === 'time') {
    const stayEvents = events.filter(ev => ev.type === 'staytime');
    result = { totalStayTime: stayEvents.reduce((s, ev) => s + (ev.data.duration || 0), 0) };
  } else if (strategy === 'ai') {
    result = {
      clicks: events.filter(ev => ev.type === 'click').length,
      scrolls: events.filter(ev => ev.type === 'scroll').length,
      anomalies: events.filter(ev => ev.data && ev.data.anomaly).length
    };
  }
  postMessage(result);
}