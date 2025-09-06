import React, { useState, useEffect } from 'react';
import './ProductWizard.css';

interface ProductData {
  // Identification
  title: string;
  brand: string;
  mpn: string;
  ean: string;
  sku: string;
  
  // Physical
  weight_kg: number;
  length_cm: number;
  width_cm: number;
  height_cm: number;
  
  // Pricing
  cost_price: number;
  price_regular: number;
  price_ebay: number;
  price_amazon: number;
  
  // Descriptions
  description_short: string;
  bullet_points: string[];
  search_terms: string[];
  
  // Categories
  category_ebay: string;
  category_amazon: string;
  
  // Compliance
  hs_code: string;
  country_of_origin: string;
  
  // AI Analysis
  ai_suggestions?: any;
  image_id?: string;
}

interface StepProps {
  data: ProductData;
  updateData: (updates: Partial<ProductData>) => void;
  onNext: () => void;
  onPrev: () => void;
  onSave: () => void;
}

const STEPS = [
  { id: 1, name: 'KI-Analyse', icon: '🤖' },
  { id: 2, name: 'Basis-Daten', icon: '📝' },
  { id: 3, name: 'Versand', icon: '📦' },
  { id: 4, name: 'Preise', icon: '💰' },
  { id: 5, name: 'Beschreibungen', icon: '📄' },
  { id: 6, name: 'Review & Export', icon: '✅' }
];

export const ProductWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [productData, setProductData] = useState<ProductData>({
    title: '',
    brand: '',
    mpn: '',
    ean: '',
    sku: '',
    weight_kg: 0,
    length_cm: 0,
    width_cm: 0,
    height_cm: 0,
    cost_price: 0,
    price_regular: 0,
    price_ebay: 0,
    price_amazon: 0,
    description_short: '',
    bullet_points: ['', '', '', '', ''],
    search_terms: [],
    category_ebay: '',
    category_amazon: '',
    hs_code: '',
    country_of_origin: 'DE'
  });

  const updateProductData = (updates: Partial<ProductData>) => {
    setProductData(prev => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSave = async () => {
    // Save current progress to backend
    console.log('Saving product data:', productData);
    // TODO: API call to save
  };

  const renderStep = () => {
    const props: StepProps = {
      data: productData,
      updateData: updateProductData,
      onNext: handleNext,
      onPrev: handlePrev,
      onSave: handleSave
    };

    switch (currentStep) {
      case 1:
        return <Step1AIAnalysis {...props} />;
      case 2:
        return <Step2BasicData {...props} />;
      case 3:
        return <Step3Shipping {...props} />;
      case 4:
        return <Step4Pricing {...props} />;
      case 5:
        return <Step5Descriptions {...props} />;
      case 6:
        return <Step6Review {...props} />;
      default:
        return null;
    }
  };

  return (
    <div className="wizard-container">
      <div className="wizard-header">
        <h1 className="wizard-title">
          <span className="gradient-text">Produkt erstellen</span>
        </h1>
        <div className="wizard-steps">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className={`wizard-step ${currentStep === step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
              onClick={() => setCurrentStep(step.id)}
            >
              <div className="step-icon">{step.icon}</div>
              <div className="step-name">{step.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="wizard-content">
        {renderStep()}
      </div>
    </div>
  );
};

// Step 1: AI Analysis (reuse existing upload component logic)
const Step1AIAnalysis: React.FC<StepProps> = ({ data, updateData, onNext, onSave }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalysis = async (analysisResult: any) => {
    // Update product data with AI suggestions
    updateData({
      title: analysisResult.marketplace_suggestions?.title || '',
      brand: analysisResult.brand || '',
      mpn: analysisResult.mpn || '',
      ean: analysisResult.ean || '',
      category_ebay: analysisResult.marketplace_suggestions?.category_ebay_id || '',
      category_amazon: analysisResult.marketplace_suggestions?.category_amazon || '',
      ai_suggestions: analysisResult
    });
  };

  return (
    <div className="step-container">
      <h2>Schritt 1: KI-Produkterkennung</h2>
      <div className="upload-section">
        {/* Reuse upload component here */}
        <div className="upload-area-placeholder">
          <div className="upload-icon">📸</div>
          <h3>Bild hochladen für KI-Analyse</h3>
          <p>Die KI erkennt Produkt, Marke, Artikelnummer und schlägt Kategorien vor</p>
        </div>
      </div>

      {data.ai_suggestions && (
        <div className="ai-results">
          <h3>KI-Erkennungsergebnisse:</h3>
          <div className="result-grid">
            <div className="result-item">
              <span className="result-label">Marke:</span>
              <span className="result-value">{data.brand}</span>
            </div>
            <div className="result-item">
              <span className="result-label">MPN:</span>
              <span className="result-value">{data.mpn}</span>
            </div>
            <div className="result-item">
              <span className="result-label">EAN:</span>
              <span className="result-value">{data.ean}</span>
            </div>
          </div>
        </div>
      )}

      <div className="step-actions">
        <button className="btn-primary" onClick={onNext}>
          Weiter zu Basis-Daten
        </button>
      </div>
    </div>
  );
};

// Step 2: Basic Data
const Step2BasicData: React.FC<StepProps> = ({ data, updateData, onNext, onPrev, onSave }) => {
  return (
    <div className="step-container">
      <h2>Schritt 2: Basis-Daten</h2>
      <div className="form-grid">
        <div className="form-group">
          <label>Produkttitel *</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => updateData({ title: e.target.value })}
            placeholder="Max. 80 Zeichen für eBay"
            maxLength={80}
          />
          <span className="char-count">{data.title.length}/80</span>
        </div>

        <div className="form-group">
          <label>Marke *</label>
          <input
            type="text"
            value={data.brand}
            onChange={(e) => updateData({ brand: e.target.value })}
            placeholder="Hersteller/Marke"
          />
        </div>

        <div className="form-group">
          <label>Artikelnummer (MPN)</label>
          <input
            type="text"
            value={data.mpn}
            onChange={(e) => updateData({ mpn: e.target.value })}
            placeholder="Herstellernummer"
          />
        </div>

        <div className="form-group">
          <label>EAN/Barcode</label>
          <input
            type="text"
            value={data.ean}
            onChange={(e) => updateData({ ean: e.target.value })}
            placeholder="13-stellige EAN"
            maxLength={13}
          />
        </div>

        <div className="form-group">
          <label>SKU (Interne Nummer)</label>
          <input
            type="text"
            value={data.sku}
            onChange={(e) => updateData({ sku: e.target.value })}
            placeholder="Ihre Artikelnummer"
          />
        </div>

        <div className="form-group">
          <label>Ursprungsland</label>
          <select
            value={data.country_of_origin}
            onChange={(e) => updateData({ country_of_origin: e.target.value })}
          >
            <option value="DE">Deutschland</option>
            <option value="CN">China</option>
            <option value="US">USA</option>
            <option value="IT">Italien</option>
            <option value="FR">Frankreich</option>
          </select>
        </div>
      </div>

      <div className="step-actions">
        <button className="btn-ghost" onClick={onPrev}>Zurück</button>
        <button className="btn-secondary" onClick={onSave}>Speichern</button>
        <button className="btn-primary" onClick={onNext}>Weiter</button>
      </div>
    </div>
  );
};

// Step 3: Shipping Data
const Step3Shipping: React.FC<StepProps> = ({ data, updateData, onNext, onPrev, onSave }) => {
  return (
    <div className="step-container">
      <h2>Schritt 3: Versand-Daten</h2>
      <div className="form-grid">
        <div className="form-group">
          <label>Gewicht (kg)</label>
          <input
            type="number"
            step="0.001"
            value={data.weight_kg}
            onChange={(e) => updateData({ weight_kg: parseFloat(e.target.value) })}
            placeholder="0.000"
          />
        </div>

        <div className="form-group">
          <label>Länge (cm)</label>
          <input
            type="number"
            step="0.01"
            value={data.length_cm}
            onChange={(e) => updateData({ length_cm: parseFloat(e.target.value) })}
            placeholder="0.00"
          />
        </div>

        <div className="form-group">
          <label>Breite (cm)</label>
          <input
            type="number"
            step="0.01"
            value={data.width_cm}
            onChange={(e) => updateData({ width_cm: parseFloat(e.target.value) })}
            placeholder="0.00"
          />
        </div>

        <div className="form-group">
          <label>Höhe (cm)</label>
          <input
            type="number"
            step="0.01"
            value={data.height_cm}
            onChange={(e) => updateData({ height_cm: parseFloat(e.target.value) })}
            placeholder="0.00"
          />
        </div>

        <div className="form-group">
          <label>HS-Code (Zoll)</label>
          <input
            type="text"
            value={data.hs_code}
            onChange={(e) => updateData({ hs_code: e.target.value })}
            placeholder="z.B. 7318159000"
          />
        </div>
      </div>

      <div className="shipping-calculator">
        <h3>Versandkosten-Kalkulation</h3>
        <div className="calc-result">
          <span>DHL Paket: ~4.99€</span>
          <span>Hermes: ~4.29€</span>
        </div>
      </div>

      <div className="step-actions">
        <button className="btn-ghost" onClick={onPrev}>Zurück</button>
        <button className="btn-secondary" onClick={onSave}>Speichern</button>
        <button className="btn-primary" onClick={onNext}>Weiter</button>
      </div>
    </div>
  );
};

// Step 4: Multi-Channel Pricing
const Step4Pricing: React.FC<StepProps> = ({ data, updateData, onNext, onPrev, onSave }) => {
  const calculateMargin = (sellPrice: number, costPrice: number) => {
    if (!sellPrice || !costPrice) return 0;
    return ((sellPrice - costPrice) / sellPrice * 100).toFixed(1);
  };

  return (
    <div className="step-container">
      <h2>Schritt 4: Multi-Channel Preise</h2>
      <div className="pricing-grid">
        <div className="price-card">
          <h3>Einkauf</h3>
          <div className="form-group">
            <label>Einkaufspreis</label>
            <input
              type="number"
              step="0.01"
              value={data.cost_price}
              onChange={(e) => updateData({ cost_price: parseFloat(e.target.value) })}
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="price-card">
          <h3>Regulär</h3>
          <div className="form-group">
            <label>Verkaufspreis</label>
            <input
              type="number"
              step="0.01"
              value={data.price_regular}
              onChange={(e) => updateData({ price_regular: parseFloat(e.target.value) })}
              placeholder="0.00"
            />
            <span className="margin">Marge: {calculateMargin(data.price_regular, data.cost_price)}%</span>
          </div>
        </div>

        <div className="price-card">
          <h3>eBay</h3>
          <div className="form-group">
            <label>eBay Preis</label>
            <input
              type="number"
              step="0.01"
              value={data.price_ebay}
              onChange={(e) => updateData({ price_ebay: parseFloat(e.target.value) })}
              placeholder="0.00"
            />
            <span className="margin">Marge: {calculateMargin(data.price_ebay, data.cost_price)}%</span>
            <span className="fees">Gebühren: ~10%</span>
          </div>
        </div>

        <div className="price-card">
          <h3>Amazon</h3>
          <div className="form-group">
            <label>Amazon Preis</label>
            <input
              type="number"
              step="0.01"
              value={data.price_amazon}
              onChange={(e) => updateData({ price_amazon: parseFloat(e.target.value) })}
              placeholder="0.00"
            />
            <span className="margin">Marge: {calculateMargin(data.price_amazon, data.cost_price)}%</span>
            <span className="fees">Gebühren: ~15%</span>
          </div>
        </div>
      </div>

      <div className="step-actions">
        <button className="btn-ghost" onClick={onPrev}>Zurück</button>
        <button className="btn-secondary" onClick={onSave}>Speichern</button>
        <button className="btn-primary" onClick={onNext}>Weiter</button>
      </div>
    </div>
  );
};

// Step 5: Descriptions
const Step5Descriptions: React.FC<StepProps> = ({ data, updateData, onNext, onPrev, onSave }) => {
  const handleBulletChange = (index: number, value: string) => {
    const newBullets = [...data.bullet_points];
    newBullets[index] = value;
    updateData({ bullet_points: newBullets });
  };

  return (
    <div className="step-container">
      <h2>Schritt 5: Beschreibungen & SEO</h2>
      
      <div className="form-group">
        <label>Kurzbeschreibung</label>
        <textarea
          value={data.description_short}
          onChange={(e) => updateData({ description_short: e.target.value })}
          placeholder="Kurze Produktbeschreibung (max. 500 Zeichen)"
          maxLength={500}
          rows={3}
        />
        <span className="char-count">{data.description_short.length}/500</span>
      </div>

      <div className="bullets-section">
        <h3>Bullet Points (für Amazon/eBay)</h3>
        {data.bullet_points.map((bullet, index) => (
          <div key={index} className="form-group">
            <label>Punkt {index + 1}</label>
            <textarea
              value={bullet}
              onChange={(e) => handleBulletChange(index, e.target.value)}
              placeholder={`Bullet Point ${index + 1} (max. 500 Zeichen)`}
              maxLength={500}
              rows={2}
            />
            <span className="char-count">{bullet.length}/500</span>
          </div>
        ))}
      </div>

      <div className="form-group">
        <label>Suchbegriffe (kommagetrennt)</label>
        <input
          type="text"
          value={data.search_terms.join(', ')}
          onChange={(e) => updateData({ search_terms: e.target.value.split(',').map(t => t.trim()) })}
          placeholder="werkzeug, schrauben, befestigung, ..."
        />
      </div>

      <div className="step-actions">
        <button className="btn-ghost" onClick={onPrev}>Zurück</button>
        <button className="btn-secondary" onClick={onSave}>Speichern</button>
        <button className="btn-primary" onClick={onNext}>Review</button>
      </div>
    </div>
  );
};

// Step 6: Review & Export
const Step6Review: React.FC<StepProps> = ({ data, onPrev, onSave }) => {
  const [validationResults, setValidationResults] = useState<any>(null);

  const validateForMarketplace = async (marketplace: string) => {
    // TODO: API call to validate
    console.log(`Validating for ${marketplace}`);
  };

  const exportForMarketplace = async (marketplace: string) => {
    // TODO: API call to export
    console.log(`Exporting for ${marketplace}`);
  };

  return (
    <div className="step-container">
      <h2>Schritt 6: Review & Export</h2>
      
      <div className="review-section">
        <h3>Produktübersicht</h3>
        <div className="review-grid">
          <div className="review-item">
            <span className="label">Titel:</span>
            <span className="value">{data.title}</span>
          </div>
          <div className="review-item">
            <span className="label">Marke:</span>
            <span className="value">{data.brand}</span>
          </div>
          <div className="review-item">
            <span className="label">EAN:</span>
            <span className="value">{data.ean || 'Nicht angegeben'}</span>
          </div>
          <div className="review-item">
            <span className="label">Preis Regular:</span>
            <span className="value">€{data.price_regular.toFixed(2)}</span>
          </div>
          <div className="review-item">
            <span className="label">Preis eBay:</span>
            <span className="value">€{data.price_ebay.toFixed(2)}</span>
          </div>
          <div className="review-item">
            <span className="label">Preis Amazon:</span>
            <span className="value">€{data.price_amazon.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="export-section">
        <h3>Export-Optionen</h3>
        <div className="export-cards">
          <div className="export-card">
            <div className="export-icon">🛒</div>
            <h4>eBay</h4>
            <button 
              className="btn-secondary"
              onClick={() => validateForMarketplace('ebay')}
            >
              Validieren
            </button>
            <button 
              className="btn-primary"
              onClick={() => exportForMarketplace('ebay')}
            >
              CSV Export
            </button>
          </div>

          <div className="export-card">
            <div className="export-icon">📦</div>
            <h4>Amazon</h4>
            <button 
              className="btn-secondary"
              onClick={() => validateForMarketplace('amazon')}
            >
              Validieren
            </button>
            <button 
              className="btn-primary"
              onClick={() => exportForMarketplace('amazon')}
            >
              Flat File Export
            </button>
          </div>
        </div>
      </div>

      <div className="step-actions">
        <button className="btn-ghost" onClick={onPrev}>Zurück</button>
        <button className="btn-success" onClick={onSave}>
          Produkt speichern & Fertig
        </button>
      </div>
    </div>
  );
};