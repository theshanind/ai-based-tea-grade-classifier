import "./ModelResult.css";
import DetectionList from "./DetectionList";
import Summary from "./Summary";

export default function ModelResult({ result, loading, error, onReset }) {

    if (loading) {
        return (
            <div className="model-result">
                <div className="model-result__loader">
                    <div className="model-result__spinner" />
                    <div className="model-result__loader-text">
                        Detecting flush types...
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="model-result">
                <div className="model-result__error">
                    <span>{error}</span>
                    <button className="model-result__error-retry" onClick={onReset}>
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    if (!result) return null;

    return (
        <div className="model-result">

            <div className="model-result__top">

                {/* Annotated image */}
                <div className="model-result__image-card">
                    <div className="model-result__card-header">
                        Detection result
                    </div>
                    <img
                        src={result.annotated_image}
                        alt="Annotated tea"
                        className="model-result__img"
                    />
                    <div className="model-result__img-footer">
                        {result.filename} · {result.inference_ms}ms
                    </div>
                </div>

                {/* Detection list */}
                <DetectionList detections={result.detections} />

            </div>

            {/* Summary */}
            <Summary summary={result.summary} />

            <div className="model-result__reset">
                <button className="model-result__reset-btn" onClick={onReset}>
                    Upload new image
                </button>
            </div>

        </div>
    );
}