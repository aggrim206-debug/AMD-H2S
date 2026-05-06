/**
 * Fetch health alerts from our backend proxy
 */
export async function getHealthAlerts() {
  try {
    const res = await fetch('/api/news');
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to fetch news');
    }
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch health alerts:', error);
    throw error;
  }
}
