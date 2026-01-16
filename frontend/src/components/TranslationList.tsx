import { useTranslationStore } from '../store/useTranslationStore';

export const TranslationList = () => {
  const { translations, clearTranslations } = useTranslationStore();

  if (translations.length === 0) {
    return (
      <div className="translation-list empty">
        <p>No translations yet. Start recording to see translations appear here!</p>
      </div>
    );
  }

  return (
    <div className="translation-list">
      <div className="translation-header">
        <h2>Translations</h2>
        <button onClick={clearTranslations} className="clear-button">
          Clear All
        </button>
      </div>
      <div className="translations">
        {translations.map((translation) => (
          <div key={translation.id} className="translation-item">
            <div className="original-text">
              <span className="label">Original:</span>
              <p>{translation.original}</p>
            </div>
            <div className="translated-text">
              <span className="label">Translated:</span>
              <p>{translation.translated}</p>
            </div>
            <div className="timestamp">
              {new Date(translation.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
