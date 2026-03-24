import "./DetectionList.css";

const CLASS_COLORS = {
    "1B-1L"  : "#78ffd6",
    "1B-1L-F": "#5dcaa5",
    "1B-2L"  : "#a78bfa",
    "1B-2L-F": "#7c6fcd",
    "1B-3L"  : "#60a5fa",
    "banjhi" : "#fbbf24",
    "other"  : "#9ca3af",
};

export default function DetectionList({ detections }) {
    if (!detections || detections.length === 0) {
        return (
            <div className="detection-list">
                <div className="detection-list__header">Detections</div>
                <div className="detection-list__empty">No shoots detected</div>
            </div>
        );
    }

    return (
        <div className="detection-list">
            <div className="detection-list__header">
                Detections ({detections.length})
            </div>
            {detections.map((det, index) => (
                <DetectionItem key={index} detection={det} />
            ))}
        </div>
    );
}

function DetectionItem({ detection }) {
    const color   = CLASS_COLORS[detection.class] || "#9ca3af";
    const confPct = Math.round(detection.confidence * 100);
    const confClass = `detection-item__conf--${detection.confidence_level}`;

    return (
        <div className="detection-item">
            <div
                className="detection-item__dot"
                style={{ backgroundColor: color }}
            />
            <div className="detection-item__info">
                <div className="detection-item__class">{detection.class}</div>
                <div className="detection-item__desc">{detection.description}</div>
                <span className={
                    `detection-item__badge ${
                        detection.pluckable
                            ? "detection-item__badge--pluck"
                            : "detection-item__badge--skip"
                    }`
                }>
                    {detection.pluckable ? "pluckable" : "skip"}
                </span>
            </div>
            <div className="detection-item__right">
                <div className={`detection-item__conf ${confClass}`}>
                    {confPct}%
                </div>
                <div className="detection-item__bar-bg">
                    <div
                        className="detection-item__bar-fill"
                        style={{
                            width: `${confPct}%`,
                            backgroundColor: color,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}