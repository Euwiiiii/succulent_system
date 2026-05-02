import React, { useState } from 'react';
import { addProduct } from '../services/api';

const CostingCalculator = () => {
    const [details, setDetails] = useState({
        name: '',
        type: 'Arrangement', 
        stockQuantity: '',
        imageUrl: ''
    });

    const [plants, setPlants] = useState([
        { id: 1, name: 'Main Succulent', cost: '' },
        { id: 2, name: 'Filler Succulent', cost: '' }
    ]);
    
    const [supplies, setSupplies] = useState({
        potCost: '',
        soilCost: '',
        laborCost: '',
        markupPercentage: '50'
    });

    const handleDetailsChange = (e) => setDetails({ ...details, [e.target.name]: e.target.value });
    const handleSupplyChange = (e) => setSupplies({ ...supplies, [e.target.name]: e.target.value });
    
    const handlePlantChange = (id, field, value) => {
        setPlants(plants.map(plant => plant.id === id ? { ...plant, [field]: value } : plant));
    };

    const addPlantRow = () => {
        const newId = plants.length ? plants[plants.length - 1].id + 1 : 1;
        setPlants([...plants, { id: newId, name: `Succulent ${newId}`, cost: '' }]);
    };

    const removePlantRow = (id) => setPlants(plants.filter(plant => plant.id !== id));

    const totalPlantsCost = plants.reduce((sum, plant) => sum + (parseFloat(plant.cost) || 0), 0);
    const pot = parseFloat(supplies.potCost) || 0;
    const soil = parseFloat(supplies.soilCost) || 0;
    const labor = parseFloat(supplies.laborCost) || 0;
    const markup = parseFloat(supplies.markupPercentage) || 0;

    const totalCost = totalPlantsCost + pot + soil + labor;
    const profitAmount = totalCost * (markup / 100);
    const recommendedPrice = totalCost + profitAmount;

    const handleSaveToInventory = async () => {
        if (!details.name || !details.stockQuantity) {
            alert("⚠️ Please provide details in the required fields.");
            return;
        }
        try {
            const payload = {
                name: details.name,
                    type: details.type,
                    stockQuantity: parseInt(details.stockQuantity),
                    imageUrl: details.imageUrl, // <-- Explicitly sending the image URL
                    
                    plants: plants,
                    potCost: supplies.potCost,
                    soilCost: supplies.soilCost,
                    laborCost: supplies.laborCost,
                    markupPercentage: supplies.markupPercentage,
                    
                    totalCost: totalCost,
                    sellingPrice: recommendedPrice
            };
            await addProduct(payload);
            alert("✅ Arrangement successfully added to inventory!");
             setDetails({ name: '', type: 'Arrangement', stockQuantity: '', imageUrl: '' });
                setPlants([{ id: 1, name: 'Main Succulent', cost: '' }, { id: 2, name: 'Filler Succulent', cost: '' }]);
                setSupplies({ potCost: '', soilCost: '', laborCost: '', markupPercentage: '50' });
            } catch (error) {
                console.error(error);
                alert("❌ Error saving to database.");
            }
    };

    return (
        <div style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
            {/* Header Section */}
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', color: '#2d6a4f', fontWeight: 'bold' }}>
                    CREATE ARRANGEMENT & COSTING 
                </h2>
                <p style={{ color: 'gray', fontSize: '1.2rem' }}>
                    Calculate pricing and add complex arrangements directly to your inventory.
                </p>
            </div>

            <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', alignItems: 'flex-start' }}>
                {/* Left Input Column */}
                <div style={{ flex: 1, maxWidth: '500px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                        <input name="name" value={details.name} onChange={handleDetailsChange} placeholder="Arrangement Name (e.g., Desert Oasis)" style={inputStyle} />
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input name="type" value={details.type} onChange={handleDetailsChange} placeholder="Arrangement" style={{ ...inputStyle, flex: 1 }} />
                            <input name="stockQuantity" type="number" value={details.stockQuantity} onChange={handleDetailsChange} placeholder="Initial Stock" style={{ ...inputStyle, flex: 1 }} />
                        </div>
                    </div>

                    {/* Plants Box */}
                    <div style={{ marginBottom: '25px', padding: '20px', backgroundColor: '#f8fffb', borderRadius: '10px', border: '1px solid #d4edda', textAlign: 'center' }}>
                        <h4 style={{ color: '#2d6a4f', marginBottom: '15px' }}>Varieties Included</h4>
                        {plants.map((plant) => (
                            <div key={plant.id} style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                <input type="text" value={plant.name} onChange={(e) => handlePlantChange(plant.id, 'name', e.target.value)} style={{ ...inputStyle, flex: 2 }} />
                                <input type="number" value={plant.cost} onChange={(e) => handlePlantChange(plant.id, 'cost', e.target.value)} placeholder="Cost (₱)" style={{ ...inputStyle, flex: 1 }} />
                                <button onClick={() => removePlantRow(plant.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
                            </div>
                        ))}
                        <button onClick={addPlantRow} style={{ padding: '8px 16px', backgroundColor: '#e9ecef', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>+ Add Plant</button>
                    </div>

                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: 'flex', gap: '2px' }}>
                            <div style={{ flex: 1, textAlign: 'center' }}>
                                <label style={smallLabel}>Pot (₱)</label>
                                <input name="potCost" type="number" placeholder="Enter Pot Cost (₱)" value={supplies.potCost} onChange={handleSupplyChange} style={{...inputStyle, width: '90%'}} />
                            </div>
                            <div style={{ flex: 1, textAlign: 'center' }}>
                                <label style={smallLabel}>Soil (₱)</label>
                                <input name="soilCost" type="number" placeholder="Enter Soil Cost (₱)" value={supplies.soilCost} onChange={handleSupplyChange} style={{...inputStyle, width: '90%'}} />
                            </div>
                        </div>
                        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <label style={smallLabel}>Labor Cost (₱)</label>
                            <input name="laborCost" type="number" placeholder="Enter Labor Cost (₱)" value={supplies.laborCost} onChange={handleSupplyChange} style={{...inputStyle, width: '95%'}} />
                        </div>
                        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <label style={smallLabel}>Profit Margin (%)</label>
                            <input name="markupPercentage" type="number" placeholder="Markup %" value={supplies.markupPercentage} onChange={handleSupplyChange} style={{...inputStyle, width: '95%'}} />
                        </div>
                          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <label style={smallLabel}>Picture URL</label>
                            <input name="imageUrl" type="text" value={details.imageUrl} onChange={handleDetailsChange} placeholder="e.g., https://image.com/plant.jpg" style={{...inputStyle, width: '95%'}} />
                        </div>
                    </div>
                </div>

                {/* Right Results Column */}
                <div style={{ width: '350px', padding: '30px', backgroundColor: '#f8fffb', border: '1px solid #d4edda', color: '#333', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ textAlign: 'center', marginBottom: '25px', fontSize: '1.5rem' }}>Pricing Breakdown</h3>
                    
                    <div style={resultRow}><span>Plants:</span><span>₱{totalPlantsCost.toFixed(2)}</span></div>
                    <div style={resultRow}><span>Supplies:</span><span>₱{(pot + soil).toFixed(2)}</span></div>
                    <div style={resultRow}><span>Labor:</span><span>₱{labor.toFixed(2)}</span></div>
                    
                    <div style={{ ...resultRow, margin: '20px 0', fontSize: '1rem', fontWeight: 'bold' }}><span>Base Cost:</span><span>₱{totalCost.toFixed(2)}</span></div>
                    <div style={resultRow}><span>Profit Margin:</span><span style={{ color: '#2d6a4f' }}>+ ₱{profitAmount.toFixed(2)}</span></div>
                    <hr style={{ opacity: 0.3, margin: '20px 0' }} />
                    <div style={{ ...resultRow, fontSize: '1.2rem', fontWeight: 'bold' }}><span>Selling Price:</span><span>₱{recommendedPrice.toFixed(2)}</span></div>
                    
                    <button onClick={handleSaveToInventory} style={saveButtonStyle}>
                        Save to Inventory
                    </button>
                </div>
            </div>
        </div>
    );
};


const inputStyle = { padding: '12px', border: '1px solid #ccc', borderRadius: '5px' };
const smallLabel = { display: 'block', fontWeight: 'bold', marginBottom: '5px', color: '#333' };
const resultRow = { display: 'flex', justifyContent: 'space-between', marginBottom: '15px' };
const saveButtonStyle = { 
    width: '100%', padding: '15px', marginTop: '30px', backgroundColor: '#2d6a4f', 
    color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.2rem', 
    fontWeight: 'bold', cursor: 'pointer', transition: '0.3s'
};

export default CostingCalculator;
