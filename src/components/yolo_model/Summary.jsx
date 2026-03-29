import "./Summary.css";

export default function Summary({ summary }) {
    return (
        <div className="summary">
            <div className="summary__header">Summary</div>
            <div className="summary__grid">

                <div className="summary__card">
                    <div className="summary__card-label">Pluckable shoots</div>
                    <div className="summary__card-value summary__card-value--green">
                        {summary.pluckable_count}
                    </div>
                </div>

                <div className="summary__card">
                    <div className="summary__card-label">Skip (banjhi)</div>
                    <div className="summary__card-value summary__card-value--amber">
                        {summary.skip_count}
                    </div>
                </div>

                <div className="summary__card">
                    <div className="summary__card-label">Top flush grade</div>
                    <div className="summary__card-value summary__card-value--white">
                        {summary.top_flush_class || "—"}
                    </div>
                </div>

                <div className="summary__card">
                    <div className="summary__card-label">Total shoots</div>
                    <div className="summary__card-value summary__card-value--white">
                        {summary.total_shoots}
                    </div>
                </div>
                {summary.producible_grades && summary.producible_grades.length > 0 && (
                    <div className="summary__grades">
                        <div className="summary__grades-label">Producible tea grades</div>
                        <div className="summary__grades-list">
                            {summary.producible_grades.map((grade, i) => (
                                <span key={i} className="summary__grade-badge">
                                    {grade}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

            </div>
            <div className="summary__recommendation">
                {summary.recommendation}
            </div>
        </div>
    );
}