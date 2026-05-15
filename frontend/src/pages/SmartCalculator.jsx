import React, { useState, useEffect } from 'react';
import { addProduct, getSupplies } from '../services/api';
import { calculateFinalPrices, formatCurrency } from '../utils/calculator';

const SmartCalculator = () => {
    const [productType, setProductType] = useState('Single Plant'); // 'Single Plant' or 'Arrangement'
    
    const [details, setDetails] = useState({
        name: '',
        stockQuantity: '',
        imageUrl: '',
        costPrice: '', // for single plant base cost
        sellingPrice: '' // for single plant base selling price
    });

    const [plants, setPlants] = useState([
        { id: 1, name: 'Main Succulent', cost: '' },
    ]);
    
    const [suppliesData, setSuppliesData] = useState([]); // from API
    
    const [selectedSupplies, setSelectedSupplies] = useState([]); // { supply: obj, gramsUsed: '' }
    const [selectedPot, setSelectedPot] = useState(null); // pot object
    const [laborCost, setLaborCost] = useState('');
    const [markupPercentage, setMarkupPercentage] = useState('50');

    const [liveTotalCost, setLiveTotalCost] = useState(0);
    const [liveSellingPrice, setLiveSellingPrice] = useState(0);

    useEffect(() => {
        fetchSupplies();
    }, []);

    const fetchSupplies = async () => {
        try {
            const { data } = await getSupplies();
            setSuppliesData(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching supplies", error);
        }
    };

    // Recalculate on any change
    useEffect(() => {
        const prices = calculateFinalPrices({
            type: productType,
            costPrice: details.costPrice,
            sellingPrice: details.sellingPrice,
            plants: productType === 'Arrangement' ? plants : [],
            pot: productType === 'Arrangement' ? selectedPot : null,
            supplies: productType === 'Arrangement' ? selectedSupplies : [],
            laborCost: productType === 'Arrangement' ? laborCost : 0,
            markupPercentage: productType === 'Arrangement' ? markupPercentage : 0
        });
        setLiveTotalCost(prices.totalCost);
        setLiveSellingPrice(prices.sellingPrice);
    }, [productType, details, plants, selectedPot, selectedSupplies, laborCost, markupPercentage]);

    const handleDetailsChange = (e) => setDetails({ ...details, [e.target.name]: e.target.value });
    
    const handlePlantChange = (id, field, value) => {
        setPlants(plants.map(plant => plant.id === id ? { ...plant, [field]: value } : plant));
    };

    const addPlantRow = () => {
        const newId = plants.length ? Math.max(...plants.map(p => p.id)) + 1 : 1;
        setPlants([...plants, { id: newId, name: `Succulent ${newId}`, cost: '' }]);
    };

    const removePlantRow = (id) => setPlants(plants.filter(plant => plant.id !== id));

    const addSupplyRow = () => {
        setSelectedSupplies([...selectedSupplies, { supply: null, gramsUsed: '' }]);
    };

    const handleSupplySelection = (index, supplyId) => {
        const supply = suppliesData.find(s => s._id === supplyId);
        const newSupplies = [...selectedSupplies];
        newSupplies[index].supply = supply;
        setSelectedSupplies(newSupplies);
    };

    const handleSupplyGrams = (index, grams) => {
        const newSupplies = [...selectedSupplies];
        newSupplies[index].gramsUsed = grams;
        setSelectedSupplies(newSupplies);
    };

    const removeSupplyRow = (index) => {
        setSelectedSupplies(selectedSupplies.filter((_, i) => i !== index));
    };

    const handleSaveToInventory = async () => {
        if (!details.name || !details.stockQuantity) {
            alert("⚠️ Please provide details in the required fields (Name and Stock).");
            return;
        }

        try {
            const payload = {
                name: details.name,
                type: productType,
                stockQuantity: parseInt(details.stockQuantity) || 0,
                imageUrl: details.imageUrl,
                costPrice: Number(details.costPrice) || 0,
                sellingPrice: Number(details.sellingPrice) || 0,
                
                // Only send these if Arrangement
                plants: productType === 'Arrangement' ? plants.map(p => ({ name: p.name, cost: Number(p.cost)||0 })) : [],
                pot: productType === 'Arrangement' && selectedPot ? selectedPot._id : null,
                supplies: productType === 'Arrangement' ? selectedSupplies.map(s => ({ supply: s.supply?._id, gramsUsed: Number(s.gramsUsed)||0 })) : [],
                laborCost: productType === 'Arrangement' ? Number(laborCost) || 0 : 0,
                markupPercentage: productType === 'Arrangement' ? Number(markupPercentage) || 0 : 0,
            };
            
            await addProduct(payload);
            alert("✅ Product successfully added to inventory!");
            
            // Reset
            setDetails({ name: '', stockQuantity: '', imageUrl: '', costPrice: '', sellingPrice: '' });
            setPlants([{ id: 1, name: 'Main Succulent', cost: '' }]);
            setSelectedSupplies([]);
            setSelectedPot(null);
            setLaborCost('');
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || "Error saving to database.";
            alert(`❌ ${msg}`);
        }
    };

    return (
        <div className="calculator-container" style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto', backgroundColor: 'var(--beige)', minHeight: '100vh' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2 className="panel-header">Smart Calculator</h2>
                <p style={{ color: 'gray', fontSize: '1.2rem' }}>Add a single plant or calculate a complex arrangement.</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
                <div style={{ display: 'flex', gap: '20px', backgroundColor: 'white', padding: '10px 20px', borderRadius: '30px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                    <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', color: productType === 'Single Plant' ? 'var(--moss-green)' : 'gray', fontWeight: productType === 'Single Plant' ? 'bold' : 'normal' }}>
                        <input type="radio" value="Single Plant" checked={productType === 'Single Plant'} onChange={(e) => setProductType(e.target.value)} />
                        Single Plant
                    </label>
                    <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem', color: productType === 'Arrangement' ? 'var(--moss-green)' : 'gray', fontWeight: productType === 'Arrangement' ? 'bold' : 'normal' }}>
                        <input type="radio" value="Arrangement" checked={productType === 'Arrangement'} onChange={(e) => setProductType(e.target.value)} />
                        Arrangement
                    </label>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                {/* Left Input Column */}
                <div style={{ flex: 1, minWidth: '350px', maxWidth: '500px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px', backgroundColor: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                        <h4 style={{ color: 'var(--dark-green)', margin: '0 0 10px 0' }}>Basic Details</h4>
                        <input name="name" value={details.name} onChange={handleDetailsChange} placeholder={`${productType} Name`} style={inputStyle} required />
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input name="stockQuantity" type="number" value={details.stockQuantity} onChange={handleDetailsChange} placeholder="Initial Stock" style={{ ...inputStyle, flex: 1 }} required />
                        </div>
                        <input name="imageUrl" type="text" value={details.imageUrl} onChange={handleDetailsChange} placeholder="Image URL (e.g., https://...)" style={inputStyle} />
                        
                        {productType === 'Single Plant' && (
                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <input name="costPrice" type="number" value={details.costPrice} onChange={handleDetailsChange} placeholder="Cost Price (₱)" style={{ ...inputStyle, flex: 1 }} />
                                <input name="sellingPrice" type="number" value={details.sellingPrice} onChange={handleDetailsChange} placeholder="Selling Price (₱)" style={{ ...inputStyle, flex: 1 }} />
                            </div>
                        )}
                    </div>

                    {productType === 'Arrangement' && (
                        <>
                            {/* Plants Box */}
                            <div style={{ marginBottom: '20px', padding: '25px', backgroundColor: 'white', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                                <h4 style={{ color: 'var(--dark-green)', margin: '0 0 15px 0' }}>Plants Included</h4>
                                {plants.map((plant) => (
                                    <div key={plant.id} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        <input type="text" value={plant.name} onChange={(e) => handlePlantChange(plant.id, 'name', e.target.value)} style={{ ...inputStyle, flex: 2 }} placeholder="Plant Name" />
                                        <input type="number" value={plant.cost} onChange={(e) => handlePlantChange(plant.id, 'cost', e.target.value)} placeholder="Cost (₱)" style={{ ...inputStyle, flex: 1 }} />
                                        <button onClick={() => removePlantRow(plant.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
                                    </div>
                                ))}
                                <button onClick={addPlantRow} style={addBtnStyle}>+ Add Plant</button>
                            </div>

                            {/* Supplies Box */}
                            <div style={{ marginBottom: '20px', padding: '25px', backgroundColor: 'white', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                                <h4 style={{ color: 'var(--dark-green)', margin: '0 0 15px 0' }}>Supplies & Labor</h4>
                                
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        <label style={{...smallLabel, minWidth: '60px', margin: 0}}>Pot</label>
                                        <select 
                                            value={selectedPot?._id || ''} 
                                            onChange={(e) => setSelectedPot(suppliesData.find(s => s._id === e.target.value) || null)}
                                            style={inputStyle}
                                        >
                                            <option value="">Select Pot...</option>
                                            {suppliesData.filter(s => s.type === 'Pot').map(s => (
                                                <option key={s._id} value={s._id}>{s.name} ({formatCurrency(s.unitCost)})</option>
                                            ))}
                                        </select>
                                    </div>

                                    {selectedSupplies.map((item, index) => (
                                        <div key={index} style={{ display: 'flex', gap: '10px' }}>
                                            <select 
                                                value={item.supply?._id || ''} 
                                                onChange={(e) => handleSupplySelection(index, e.target.value)}
                                                style={{ ...inputStyle, flex: 2 }}
                                            >
                                                <option value="">Select Supply...</option>
                                                {suppliesData.filter(s => s.type !== 'Pot').map(s => (
                                                    <option key={s._id} value={s._id}>{s.name} ({formatCurrency(s.unitCost)}/unit)</option>
                                                ))}
                                            </select>
                                            <input type="number" value={item.gramsUsed} onChange={(e) => handleSupplyGrams(index, e.target.value)} placeholder="Qty/Grams" style={{ ...inputStyle, flex: 1 }} />
                                            <button onClick={() => removeSupplyRow(index)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
                                        </div>
                                    ))}
                                    <button onClick={addSupplyRow} style={addBtnStyle}>+ Add Supply (Soil, Fertilizer)</button>
                                </div>

                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '15px' }}>
                                    <div style={{ flex: '1 1 45%' }}>
                                        <label style={smallLabel}>Labor Cost (₱)</label>
                                        <input type="number" value={laborCost} onChange={(e) => setLaborCost(e.target.value)} style={inputStyle} />
                                    </div>
                                    <div style={{ flex: '1 1 45%' }}>
                                        <label style={smallLabel}>Profit Margin (%)</label>
                                        <input type="number" value={markupPercentage} onChange={(e) => setMarkupPercentage(e.target.value)} style={inputStyle} />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Right Results Column */}
                <div style={{ width: '350px', padding: '30px', backgroundColor: 'white', border: '2px solid var(--dark-green)', color: '#333', borderRadius: '15px', boxShadow: '0 8px 25px rgba(10, 51, 35, 0.2)', position: 'sticky', top: '20px' }}>
                    <h3 style={{ textAlign: 'center', marginBottom: '25px', fontSize: '1.5rem', color: 'var(--dark-green)' }}>Preview</h3>
                    
                    <div style={{ ...resultRow, fontSize: '1.1rem', color: '#555' }}>
                        <span>Total Cost:</span>
                        <strong>{formatCurrency(liveTotalCost)}</strong>
                    </div>
                    
                    <hr style={{ opacity: 0.2, margin: '20px 0', borderColor: 'var(--dark-green)' }} />
                    
                    <div style={{ ...resultRow, fontSize: '1.4rem', fontWeight: 'bold', color: 'var(--dark-green)' }}>
                        <span>Selling Price:</span>
                        <span>{formatCurrency(liveSellingPrice, true)}</span>
                    </div>
                    
                    <button onClick={handleSaveToInventory} style={saveButtonStyle}>
                        Save to Inventory
                    </button>
                </div>
            </div>
        </div>
    );
};

const inputStyle = { padding: '12px', border: '1px solid var(--moss-green)', color: 'var(--dark-green)', borderRadius: '8px', fontSize: '1rem', width: '100%', boxSizing: 'border-box' };
const smallLabel = { display: 'block', fontWeight: 'bold', marginBottom: '5px', color: 'var(--dark-green)', fontSize: '0.9rem' };
const resultRow = { display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' };
const addBtnStyle = { padding: '8px 16px', backgroundColor: 'var(--beige)', color: 'var(--dark-green)', border: '1px solid var(--dark-green)', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: 'fit-content' };
const saveButtonStyle = { 
    width: '100%', padding: '16px', marginTop: '30px', backgroundColor: 'var(--midnight-green)', 
    color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.2rem', 
    fontWeight: 'bold', cursor: 'pointer', transition: '0.3s', boxShadow: '0 4px 10px rgba(16, 86, 102, 0.3)'
};

export default SmartCalculator;
