const DB_BASE = 'http://localhost:5000';

/**
 * Convert an image URL (blob/object URL) to base64 string
 */
export async function imageUrlToBase64(imageUrl) {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result); // "data:image/...;base64,..."
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

/**
 * Save a YOLO detection result to history
 */
export async function saveYoloHistory(userId, uploadedImageUrl, result) {
    const uploadedImage = await imageUrlToBase64(uploadedImageUrl);
    const topClass = result.summary?.top_flush_class || 'Unknown';
    const topDet = result.detections?.[0];
    const confidence = topDet ? Math.round(topDet.confidence * 100) : 0;

    return saveHistory({
        userId,
        modelType: 'yolo',
        uploadedImage,
        annotatedImage: result.annotated_image,
        prediction: topClass,
        confidence,
        extraData: {
            summary: result.summary,
            totalDetections: result.detections?.length || 0,
        }
    });
}

/**
 * Save a Classification result to history
 */
export async function saveClassifyHistory(userId, uploadedImageUrl, result) {
    const uploadedImage = await imageUrlToBase64(uploadedImageUrl);

    return saveHistory({
        userId,
        modelType: 'classification',
        uploadedImage,
        annotatedImage: result.annotated_image,
        prediction: result.grade,
        confidence: result.confidence,
        extraData: {
            full_name: result.full_name,
            quality_tier: result.quality_tier,
            top3: result.top3,
        }
    });
}

async function saveHistory(payload) {
    const response = await fetch(`${DB_BASE}/api/history/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to save history');
    }
    return response.json();
}

/**
 * Fetch all history records for a user (no images, for list view)
 */
export async function fetchHistory(userId) {
    const response = await fetch(`${DB_BASE}/api/history/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch history');
    return response.json();
}

/**
 * Fetch a single full history record (includes images)
 */
export async function fetchHistoryDetail(recordId) {
    const response = await fetch(`${DB_BASE}/api/history/detail/${recordId}`);
    if (!response.ok) throw new Error('Failed to fetch detail');
    return response.json();
}

export async function deleteHistoryRecord(recordId) {
    const response = await fetch(`${DB_BASE}/api/history/${recordId}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete record');
    return response.json();
}