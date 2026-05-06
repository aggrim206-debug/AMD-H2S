/**
 * Claude API wrapper
 * Talks to our local Express proxy which calls the Anthropic API
 */

export async function getClaudeAnalysis(product) {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ product }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Failed to analyze with Claude');
    }

    return await response.json();
  } catch (error) {
    console.error('Claude API Error:', error);
    throw error;
  }
}
