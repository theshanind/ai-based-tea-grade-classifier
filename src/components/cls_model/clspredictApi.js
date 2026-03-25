const API_BASE = 'http://localhost:8000';

/**
 * Send an image file to the classification endpoint.
 * Returns the full response object from /predict/classify
 */
export async function classifyImage(file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/predict/classify`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || `Server error: ${response.status}`);
    }

    return response.json();
}