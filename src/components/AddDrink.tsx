import React, { useState } from 'react';
import { MIXERS } from '../constants';
import { Drink } from '../types';
import { v4 as uuidv4 } from 'uuid';

type Lang = 'en' | 'fr';

interface AddDrinkProps {
  onAdd: (drink: Drink) => void;
  onClose: () => void;
  language?: Lang;
}

export const AddDrink: React.FC<AddDrinkProps> = ({ onAdd, onClose, language = 'en' }) => {
  // Simple internal datasets to avoid depending on external constants for this patch
  const dataBeers = [
    { id: 'beer-1', name: 'Lager', abv: 5.0, icon: '🍺', color: '#FCD34D', type: 'beer' as const },
    { id: 'beer-2', name: 'IPA', abv: 6.2, icon: '🍺', color: '#F59E0B', type: 'beer' as const }
  ];
  const dataWines = [
    { id: 'wine-1', name: 'Red Wine', abv: 13.5, icon: '🍷', color: '#7f1d1d', type: 'wine' as const },
    { id: 'wine-2', name: 'White Wine', abv: 12.0, icon: '🍷', color: '#f5f5dc', type: 'wine' as const }
  ];
  const dataSpirits = [
    { id: 'spirit-1', name: 'Vodka', abv: 40, icon: '🥃', color: '#e5f2ff', type: 'spirit' as const },
    { id: 'spirit-2', name: 'Whisky', abv: 40, icon: '🥃', color: '#d2a679', type: 'spirit' as const }
  ];
  const dataCocktails = [
    { id: 'cock-1', name: 'Mojito', abv: 11, icon: '🍹', color: '#1e90ff', type: 'cocktail' as const }
  ];

  type DrinkType = 'beer' | 'wine' | 'cocktail' | 'spirit' | 'other';
  type Step = 'type' | 'brand' | 'glass' | 'pour' | 'timestamp';

  // Local state
  const [step, setStep] = useState<Step>('type');
  const [drinkType, setDrinkType] = useState<DrinkType | null>(null);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [selectedGlassId, setSelectedGlassId] = useState<string>('');
  const [selectedMixer, setSelectedMixer] = useState<any | null>(null);
  const [mixerVolume, setMixerVolume] = useState<number>(0);
  const [alcoholVolume, setAlcoholVolume] = useState<number>(0);
  const [isChug, setIsChug] = useState(false);
  const [customTimestamp, setCustomTimestamp] = useState<number | null>(null);

  const t = {
    chooseType: language === 'fr' ? 'Type de Boisson' : 'Choose Type',
    brand: language === 'fr' ? 'Marque' : 'Brand',
    glass: language === 'fr' ? 'Verre' : 'Glass',
    pour: language === 'fr' ? 'Ajuster la dose' : 'Adjust Dose',
    now: language === 'fr' ? 'Maintenant' : 'Now',
    beer: language === 'fr' ? 'Bière' : 'Beer',
    wine: language === 'fr' ? 'Vin' : 'Wine',
    cocktail: language === 'fr' ? 'Cocktail' : 'Cocktail',
    spirit: language === 'fr' ? 'Spiritueux' : 'Spirit',
    logDrink: language === 'fr' ? 'Ajouter' : 'Log Drink'
  };

  const handleTypeSelect = (type: DrinkType) => {
    setDrinkType(type);
    setStep('brand');
  };

  const handleBrandSelect = (item: any) => {
    setSelectedItem(item);
    // Move to glass or pour depending on type
    if (drinkType === 'beer' || drinkType === 'spirit' ) {
      setStep('pour');
      // default volumes
      setAlcoholVolume(item.abv ? 125 : 0);
    } else if (drinkType === 'cocktail') {
      // For cocktails, go to pour to allow mixer selection
      setStep('pour');
    } else {
      setStep('glass');
      setSelectedGlassId('pint');
    }
  };

  const handleGlassSelect = (id: string) => {
    setSelectedGlassId(id);
    setStep('pour');
    setAlcoholVolume(125);
  };

  const finalizeDrink = (volumeOverride?: number) => {
    if (!selectedItem) return;
    // Base volume and name/abv
    let baseVol = volumeOverride !== undefined ? volumeOverride : alcoholVolume;
    if (baseVol <= 0) return;
    let finalAbv = selectedItem.abv;
    let finalName = (language === 'fr' && selectedItem.name_fr) ? selectedItem.name_fr : selectedItem.name;
    let icon = selectedItem.icon || '🍷';
    let type: DrinkType = drinkType || selectedItem.type || 'beer';

    // Cocktail path with mixer
    if (drinkType === 'cocktail' && selectedMixer) {
      finalName = `${finalName} & ${selectedMixer.name}`;
      const mixerAbv = (selectedMixer as any).abv ?? 0;
      const totalVol = baseVol + mixerVolume;
      const abvFromBase = baseVol * (finalAbv / 100);
      const abvFromMixer = mixerVolume * (mixerAbv / 100);
      finalAbv = totalVol > 0 ? ((abvFromBase + abvFromMixer) / totalVol) * 100 : finalAbv;
      baseVol = totalVol;
    }

    // Non-cocktail adjustments
    if (drinkType === 'wine') {
      icon = '🍷';
      type = 'wine';
    }

    onAdd({
      id: uuidv4(),
      name: finalName,
      volumeMl: Math.round(baseVol),
      abv: parseFloat(finalAbv.toFixed(1)),
      timestamp: customTimestamp || Date.now(),
      icon,
      type,
      isChug: isChug
    });
    // Reset mixers for next entry when closing
    setSelectedMixer(null);
    setMixerVolume(0);
    onClose();
  };

  // Simple UI, minimal but fully functional
  return (
    <div className="p-4 text-white/90 h-full overflow-y-auto">
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => handleTypeSelect('beer')} className="p-4 rounded-xl border border-white/20 hover:bg-white/10">
          🍺 {t.beer}
        </button>
        <button onClick={() => handleTypeSelect('wine')} className="p-4 rounded-xl border border-white/20 hover:bg-white/10">
          🍷 {t.wine}
        </button>
        <button onClick={() => handleTypeSelect('cocktail')} className="p-4 rounded-xl border border-white/20 hover:bg-white/10">
          🍹 {t.cocktail}
        </button>
        <button onClick={() => handleTypeSelect('spirit')} className="p-4 rounded-xl border border-white/20 hover:bg-white/10">
          🥃 {t.spirit}
        </button>
      </div>

      {step === 'brand' && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          {(drinkType === 'beer' ? dataBeers : drinkType === 'wine' ? dataWines : dataSpirits).map((it) => (
            <button key={it.id} onClick={() => handleBrandSelect(it)} className="p-3 rounded-md border border-white/20 hover:bg-white/10">
              <span className="text-lg">{it.icon} </span> <span>{it.name}</span> <span className="text-sm text-white/60">- {it.abv}%</span>
            </button>
          ))}
          {dataCocktails.map((it) => (
            <button key={it.id} onClick={() => handleBrandSelect(it)} className="p-3 rounded-md border border-white/20 hover:bg-white/10">
              <span className="text-lg">{it.icon} </span> <span>{it.name}</span> <span className="text-sm text-white/60">- {it.abv}%</span>
            </button>
          ))}
        </div>
        
        {drinkType === 'cocktail' && (
          <div className="col-span-2 mt-2 p-3 border border-white/20 rounded bg-white/5">
            <div className="text-sm font-semibold mb-2">Mixers</div>
            <div className="flex flex-wrap gap-2">
              {MIXERS.map((m: any) => (
                <button key={m.name} onClick={() => setSelectedMixer(m)} className={`px-2 py-1 rounded ${selectedMixer?.name === m.name ? 'bg-blue-600 text-white' : 'bg-white/10'}`}>
                  {m.name}
                </button>
              ))}
            </div>
          </div>
        )}
      )}

      {step === 'glass' && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          {[
            { id: 'pint', name: 'Pint', abv: selectedItem?.abv ?? 5.0 },
            { id: 'wine_std', name: 'Glass', abv: selectedItem?.abv ?? 12.0 }
          ].map((g) => (
            <button key={g.id} onClick={() => handleGlassSelect(g.id)} className="p-3 rounded-md border border-white/20 hover:bg-white/10">
              {g.name} - {g.abv}%
            </button>
          ))}
        </div>
      )}

      {step === 'pour' && (
        <div className="mt-4 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span>Volume</span>
            <input type="number" className="bg-black/20 border border-white/10 rounded px-3 py-2 w-24" value={alcoholVolume} onChange={(e) => setAlcoholVolume(Number(e.target.value))} />
            <span>ml</span>
          </div>
          {drinkType === 'cocktail' && selectedMixer && (
            <div className="flex items-center gap-2">
              <span>Mixer</span>
              <span className="font-semibold">{selectedMixer.name}</span>
              <span className="text-sm text-white/60">({(selectedMixer as any).abv ?? 0} % ABV)</span>
              <button onClick={() => setSelectedMixer(null)} className="ml-auto text-xs bg-white/10 px-2 py-1 rounded">Change</button>
            </div>
          )}
          {drinkType === 'cocktail' && !selectedMixer && (
            <div className="text-sm text-white/60">Select a mixer to dilute the cocktail.</div>
          )}
          {drinkType === 'cocktail' && selectedMixer && (
            <div className="flex items-center gap-2">
              <span>Mixer volume</span>
              <input type="number" className="bg-black/20 border border-white/10 rounded px-3 py-2 w-24" value={mixerVolume} onChange={(e) => setMixerVolume(Number(e.target.value))} />
              <span>ml</span>
            </div>
          )}
          <button onClick={() => finalizeDrink()} className="w-full py-3 rounded bg-gradient-to-r from-blue-600 to-indigo-600 text-white">Confirm</button>
          <label className="flex items-center gap-2"><input type="checkbox" checked={isChug} onChange={(e)=> setIsChug(e.target.checked)} /> Chug</label>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-4">
        <button onClick={() => onClose()} className="py-2 border border-white/20 rounded">Cancel</button>
        <button onClick={() => finalizeDrink()} className="py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded">{t.logDrink}</button>
      </div>
    </div>
  );
};
