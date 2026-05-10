import React, { useState, useEffect } from 'react';
import { getProducts, deleteProduct, updateProduct, getSupplies, quickSellProduct, createRequest } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { calculateFinalPrices, formatCurrency } from '../utils/calculator';
import ContactRequestModal from '../components/ContactRequestModal';

const Products = ({ searchTerm = '' }) => {
    const [products, setProducts] = useState([]);
    const [suppliesData, setSuppliesData] = useState([]);
    
    const [editingProduct, setEditingProduct] = useState(null);
    const [editTotalCost, setEditTotalCost] = useState(0);
    const [editSellingPrice, setEditSellingPrice] = useState(0);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [contactProduct, setContactProduct] = useState('');

    const { user } = React.useContext(AuthContext);

    const filteredProducts = products.filter(p => {
        const lowerSearch = searchTerm.toLowerCase();
        return p.name.toLowerCase().includes(lowerSearch) || (p.type && p.type.toLowerCase().includes(lowerSearch));
    }).sort((a, b) => {
        if (a.stockQuantity > 0 && b.stockQuantity <= 0) return -1;
        if (a.stockQuantity <= 0 && b.stockQuantity > 0) return 1;
        return 0;
    });

    const handleRequest = async (product) => {
        setContactProduct(product.name);
        setIsContactModalOpen(true);
    };

    useEffect(() => {
        fetchProducts();
        fetchSupplies();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await getProducts();
            if (response.data && Array.isArray(response.data)) {
                setProducts(response.data);
            } else {
                setProducts([]); 
            }
        } catch (error) {
            console.error("Error fetching products", error);
            setProducts([]);
        }
    };

    const fetchSupplies = async () => {
        try {
            const { data } = await getSupplies();
            setSuppliesData(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching supplies", error);
        }
    };

    const handleDelete = async (id, name) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete "${name}"?`);
        if (!confirmDelete) return;

        try {
            await deleteProduct(id);
            setProducts(products.filter(product => product._id !== id)); 
            alert(`🗑️ "${name}" has been deleted.`);
        } catch (error) {
            console.error("Error deleting product", error);
            alert("Failed to delete product.");
        }
    };

    const handleEditChange = (e) => {
        setEditingProduct({ ...editingProduct, [e.target.name]: e.target.value });
    };

    const handleQuickSell = async (id, name, currentStock) => {
        if (currentStock <= 0) return;
        try {
            await quickSellProduct(id);
            // Show toast/alert
            alert(`✅ Sold 1 unit of "${name}"!`);
            // Update local state to reflect stock deduction immediately without full refetch
            setProducts(products.map(p => p._id === id ? { ...p, stockQuantity: p.stockQuantity - 1 } : p));
        } catch (error) {
            console.error("Error quick selling", error);
            const msg = error.response?.data?.message || "Failed to process sale.";
            alert(`❌ ${msg}`);
        }
    };

    // Plant Handlers
    const handleEditPlantChange = (index, field, value) => {
        const updatedPlants = [...(editingProduct.plants || [])];
        updatedPlants[index] = { ...updatedPlants[index], [field]: value };
        setEditingProduct({ ...editingProduct, plants: updatedPlants });
    };

    const removeEditPlantRow = (index) => {
        const updatedPlants = editingProduct.plants.filter((_, i) => i !== index);
        setEditingProduct({ ...editingProduct, plants: updatedPlants });
    };

    const addEditPlantRow = () => {
        const updatedPlants = [...(editingProduct.plants || []), { name: 'New Plant', cost: 0 }];
        setEditingProduct({ ...editingProduct, plants: updatedPlants });
    };

    // Supplies Handlers
    const addEditSupplyRow = () => {
        const updatedSupplies = [...(editingProduct.supplies || []), { supply: null, gramsUsed: '' }];
        setEditingProduct({ ...editingProduct, supplies: updatedSupplies });
    };

    const handleEditSupplySelection = (index, supplyId) => {
        const supply = suppliesData.find(s => s._id === supplyId);
        const newSupplies = [...(editingProduct.supplies || [])];
        newSupplies[index].supply = supply;
        setEditingProduct({ ...editingProduct, supplies: newSupplies });
    };

    const handleEditSupplyGrams = (index, grams) => {
        const newSupplies = [...(editingProduct.supplies || [])];
        newSupplies[index].gramsUsed = grams;
        setEditingProduct({ ...editingProduct, supplies: newSupplies });
    };

    const removeEditSupplyRow = (index) => {
        const newSupplies = editingProduct.supplies.filter((_, i) => i !== index);
        setEditingProduct({ ...editingProduct, supplies: newSupplies });
    };

    // Live Calculation
    useEffect(() => {
        if (editingProduct) {
            const prices = calculateFinalPrices({
                ...editingProduct,
                // Make sure to parse numeric inputs correctly if they are empty strings
                costPrice: Number(editingProduct.costPrice) || Number(editingProduct.totalCost) || 0,
                sellingPrice: Number(editingProduct.sellingPrice) || 0,
                laborCost: Number(editingProduct.laborCost) || 0,
                markupPercentage: Number(editingProduct.markupPercentage) || 0
            });
            setEditTotalCost(prices.totalCost);
            setEditSellingPrice(prices.sellingPrice);
        }
    }, [editingProduct]);


    const handleSaveEdit = async () => {
        try {
            // Clean up populated supply objects to just IDs before sending
            const payload = {
                ...editingProduct,
                pot: editingProduct.pot?._id || editingProduct.pot,
                supplies: (editingProduct.supplies || []).map(s => ({
                    supply: s.supply?._id || s.supply,
                    gramsUsed: s.gramsUsed
                }))
            };
            await updateProduct(editingProduct._id, payload);
            alert(`✅ "${editingProduct.name}" updated successfully!`);
            setEditingProduct(null); 
            fetchProducts(); 
        } catch (error) {
            console.error("Error updating", error);
            const msg = error.response?.data?.message || "Failed to update product.";
            alert(`❌ ${msg}`);
        }
    };

    return (
        <div style={{ padding: '20px'}}>
            <h2 style={{ padding: '20px 0', fontSize: '2rem', color: '#0A3323', fontWeight: 'bold', margin: 0, textAlign: 'left' }}>Our Collection</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                {filteredProducts.length === 0 ? <p>No succulents match your search.</p> : null}
                
                {filteredProducts.map((product) => (
                    <div key={product._id} style={{ border: '1px solid #839958', padding: '15px', width: '100%', boxSizing: 'border-box', borderRadius: '12px', backgroundColor: '#F7F4D5', position: 'relative', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                        
                        {user?.role === 'Admin' && (
                            <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '8px' }} > 
                                <button 
                                    onClick={() => setEditingProduct({
                                            ...product,
                                            plants: product.plants || [],
                                            supplies: product.supplies || [],
                                            pot: product.pot || null,
                                            potCost: product.potCost || 0,
                                            laborCost: product.laborCost || 0,
                                            markupPercentage: product.markupPercentage || 0
                                        })}
                                    style={iconBtnStyle}
                                >
                                    <img src="/svg/edit.svg" style={{ width: '18px', height: '18px' }} />
                                </button>
                                <button onClick={() => handleDelete(product._id, product.name)} style={{...iconBtnStyle, background: '#ff4d4f'}}>
                                    <img src="/svg/delete.svg" style={{ width: '18px', height: '18px' }} />
                                </button>
                            </div>
                        )}
                        
                        <h3 style={{ margin: '0 0 5px 0', color: '#0A3323', textAlign: 'left' }}>{product.name}</h3>
                        <p style={{ fontStyle: 'italic', color: 'gray', marginTop: '0', fontSize: '0.9em' }}>{product.type}</p>
                        
                        {product.imageUrl && <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '5px' }} />}
                        
                        {product.type === 'Arrangement' && product.plants && product.plants.length > 0 && (
                            <div style={{ margin: '15px 0', padding: '10px', backgroundColor: 'rgba(131, 153, 88, 0.15)', borderRadius: '5px', fontSize: '0.85em', textAlign: 'left', color: '#0A3323', border: '1px solid rgba(131, 153, 88, 0.3)' }}>
                                <strong>Varieties:</strong>
                                <ul style={{ margin: '5px 0', paddingLeft: '20px', listStyleType: 'none', left: '10px', textAlign: 'left' }}>
                                    {product.plants.map(plant => (
                                        <li key={plant._id}>{plant.name}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        <div style={{ marginTop: '10px', borderTop: '1px solid #eee', paddingTop: '10px', marginBottom: '15px' }}>
                            {user?.role === 'Admin' && (
                                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                                    <strong>Cost Price:</strong> {formatCurrency(product.totalCost)}
                                </p>
                            )}
                            <p style={{ margin: '5px 0', color: '#105666', fontSize: '1.3rem', fontWeight: 'bold' }}>
                                {formatCurrency(product.sellingPrice, true)}
                            </p>
                        </div>
                        
                        {product.stockQuantity <= 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '10px' }}>
                                {user?.role === 'Admin' ? (
                                    <button 
                                        onClick={() => handleQuickSell(product._id, product.name, product.stockQuantity)}
                                        disabled={true}
                                        style={{
                                            ...quickSellBtnStyle,
                                            opacity: 0.5,
                                            cursor: 'not-allowed',
                                            width: '100%'
                                        }}
                                        title="Quick Sell 1 Unit"
                                    >
                                        <span style={{ fontSize: '1.2rem', marginRight: '5px' }}>🛒</span> Sell 1
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => handleRequest(product)}
                                        style={{
                                            ...quickSellBtnStyle,
                                            background: '#D3968C',
                                            color: '#F7F4D5',
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px'
                                        }}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                        Request
                                    </button>
                                )}
                                <div style={{ color: '#C1121F', fontWeight: 'bold', fontSize: '1.2rem', textAlign: 'center', letterSpacing: '1px', width: '100%' }}>
                                    OUT OF STOCK
                                </div>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '10px' }}>
                                {user?.role === 'Admin' ? (
                                    <button 
                                        onClick={() => handleQuickSell(product._id, product.name, product.stockQuantity)}
                                        style={{
                                            ...quickSellBtnStyle,
                                            cursor: 'pointer',
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px'
                                        }}
                                        title="Quick Sell 1 Unit"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                                        Sell 1
                                    </button>
                                ) : (
                                    <button 
                                        className="primary-btn"
                                        style={{ 
                                            ...quickSellBtnStyle, 
                                            background: '#105666', 
                                            color: '#F7F4D5', 
                                            fontWeight: 'bold', 
                                            width: '100%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px'
                                        }}
                                        onClick={() => alert("Add to Cart functionality coming soon!")}
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                                        Add to Cart
                                    </button>
                                )}
                                <p style={{ margin: 0, color: 'green', fontWeight: 'bold', textAlign: 'center' }}>
                                    Stock: {product.stockQuantity} 
                                    {product.stockQuantity < 2 && " Low!"}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {editingProduct && (
                <div style={overlayStyle}>
                    <div style={modalStyle}>
                        <h3 style={{ marginTop: 0, color: '#0A3323', textAlign: 'center' }}> Advanced Edit</h3>
                        
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ flex: 2 }}>
                                <label style={labelStyle}>Name</label>
                                <input name="name" value={editingProduct?.name || ''} onChange={handleEditChange} style={inputStyle} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>Type</label>
                                <select name="type" value={editingProduct?.type || 'Single Plant'} onChange={handleEditChange} style={inputStyle}>
                                    <option value="Single Plant">Single Plant</option>
                                    <option value="Arrangement">Arrangement</option>
                                </select>
                            </div>
                        </div>

                        {/* Cost Price for single plant edits directly */}
                        {editingProduct?.type === 'Single Plant' && (
                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>Base Cost (₱)</label>
                                    <input name="costPrice" type="number" value={editingProduct?.costPrice || editingProduct?.totalCost || ''} onChange={handleEditChange} style={inputStyle} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>Base Selling (₱)</label>
                                    <input name="sellingPrice" type="number" value={editingProduct?.sellingPrice || ''} onChange={handleEditChange} style={inputStyle} />
                                </div>
                            </div>
                        )}

                        {/* Plants List inside Modal */}
                        {editingProduct?.type === 'Arrangement' && (
                            <>
                                <div style={{ padding: '10px', backgroundColor: 'white', border: '1px solid #0A3323', borderRadius: '5px', marginTop: '10px', maxHeight: '150px', overflowY: 'auto' }}>
                                    <label style={{...labelStyle, color: '#0A3323'}}>Plants & Costs</label>
                                    {(editingProduct?.plants || []).map((plant, index) => (
                                        <div key={index} style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                                            <input value={plant?.name || ''} onChange={(e) => handleEditPlantChange(index, 'name', e.target.value)} style={{...inputStyle, flex: 2}} />
                                            <input type="number" value={plant?.cost || ''} onChange={(e) => handleEditPlantChange(index, 'cost', e.target.value)} style={{...inputStyle, flex: 1}} placeholder="₱" />
                                            <button onClick={() => removeEditPlantRow(index)} style={deleteBtnStyle}>X</button>
                                        </div>
                                    ))}
                                    <button onClick={addEditPlantRow} style={addBtnStyle}>+ Add Plant</button>
                                </div>

                                {/* Supplies inside Modal */}
                                <div style={{ padding: '10px', backgroundColor: 'white', border: '1px solid #0A3323', borderRadius: '5px', marginTop: '10px', maxHeight: '150px', overflowY: 'auto' }}>
                                    <label style={{...labelStyle, color: '#0A3323'}}>Supplies</label>
                                    {(editingProduct?.supplies || []).map((item, index) => (
                                        <div key={index} style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                                            <select 
                                                value={item.supply?._id || item.supply || ''} 
                                                onChange={(e) => handleEditSupplySelection(index, e.target.value)}
                                                style={{...inputStyle, flex: 2}}
                                            >
                                                <option value="">Select...</option>
                                                {suppliesData.filter(s => s.type !== 'Pot').map(s => (
                                                    <option key={s._id} value={s._id}>{s.name}</option>
                                                ))}
                                            </select>
                                            <input type="number" value={item.gramsUsed || ''} onChange={(e) => handleEditSupplyGrams(index, e.target.value)} style={{...inputStyle, flex: 1}} placeholder="g" />
                                            <button onClick={() => removeEditSupplyRow(index)} style={deleteBtnStyle}>X</button>
                                        </div>
                                    ))}
                                    <button onClick={addEditSupplyRow} style={addBtnStyle}>+ Add Supply</button>
                                </div>

                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                    <div style={{ flex: 1 }}>
                                        <label style={labelStyle}>Pot</label>
                                        <select 
                                            name="pot" 
                                            value={editingProduct?.pot?._id || editingProduct?.pot || ''} 
                                            onChange={(e) => {
                                                const selectedPot = suppliesData.find(s => s._id === e.target.value) || null;
                                                setEditingProduct({ ...editingProduct, pot: selectedPot });
                                            }} 
                                            style={inputStyle}
                                        >
                                            <option value="">Select Pot...</option>
                                            {suppliesData.filter(s => s.type === 'Pot').map(s => (
                                                <option key={s._id} value={s._id}>{s.name} ({formatCurrency(s.unitCost)})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={labelStyle}>Labor (₱)</label>
                                        <input name="laborCost" type="number" placeholder="Labor Cost" value={editingProduct?.laborCost || ''} onChange={handleEditChange} style={inputStyle} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <label style={labelStyle}>Margin (%)</label>
                                        <input name="markupPercentage" type="number" placeholder="Margin" value={editingProduct?.markupPercentage || ''} onChange={handleEditChange} style={inputStyle} />
                                    </div>
                                </div>
                            </>
                        )}
                        
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>Stock</label>
                                <input name="stockQuantity" type="number" value={editingProduct?.stockQuantity || ''} onChange={handleEditChange} style={inputStyle} />
                            </div>
                            <div style={{ flex: 2 }}>
                                <label style={labelStyle}>Image URL</label>
                                <input name="imageUrl" value={editingProduct?.imageUrl || ''} onChange={handleEditChange} style={inputStyle} />
                            </div>
                        </div>

                        {/* Live Recalculation Display */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px', backgroundColor: 'white', border: '1px solid #0A3323', padding: '10px', borderRadius: '5px' }}>
                            {/* Per Unit Breakdown */}
                            <div style={{ textAlign: 'center', gridColumn: '1 / -1' }}>
                                <h4 style={{ margin: '0 0 5px 0', color: '#0A3323', fontSize: '0.9rem' }}>Per Unit Breakdown</h4>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <span style={{ fontSize: '0.85em', color: '#555' }}>Unit Cost</span><br/>
                                <strong>{formatCurrency(editTotalCost)}</strong>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <span style={{ fontSize: '0.85em', color: '#0A3323' }}>Unit Selling Price</span><br/>
                                <strong style={{ color: '#0A3323' }}>{formatCurrency(editSellingPrice, true)}</strong>
                            </div>

                            {/* Overall Inventory Value */}
                            <div style={{ textAlign: 'center', gridColumn: '1 / -1', marginTop: '10px', borderTop: '1px dashed #0A3323', paddingTop: '10px' }}>
                                <h4 style={{ margin: '0 0 5px 0', color: '#0A3323', fontSize: '0.9rem' }}>Overall Inventory Value</h4>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <span style={{ fontSize: '0.85em', color: '#555' }}>Total Cost ({editingProduct?.stockQuantity || 0} items)</span><br/>
                                <strong>{formatCurrency(editTotalCost * (Number(editingProduct?.stockQuantity) || 0))}</strong>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <span style={{ fontSize: '0.85em', color: '#0A3323' }}>Total Value ({editingProduct?.stockQuantity || 0} items)</span><br/>
                                <strong style={{ color: '#0A3323' }}>{formatCurrency(editSellingPrice * (Number(editingProduct?.stockQuantity) || 0), true)}</strong>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button onClick={handleSaveEdit} style={saveBtnStyle}>Save Updates</button>
                            <button onClick={() => setEditingProduct(null)} style={cancelBtnStyle}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            {/* Admin actions could go here */}
            
            <ContactRequestModal 
                isOpen={isContactModalOpen} 
                onClose={() => setIsContactModalOpen(false)} 
                initialProduct={contactProduct} 
            />
        </div>
    );
};

// Modal & UI Styles
const overlayStyle = {
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', justifyContent: 'center',
    alignItems: 'center', zIndex: 1000
};
const modalStyle = {
    backgroundColor: '#fafafa', padding: '25px', borderRadius: '10px',
    width: '450px', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
};
const labelStyle = { fontSize: '0.85em', fontWeight: 'bold', color: '#0A3323', marginBottom: '-5px' };
const inputStyle = { padding: '8px', border: '1px solid #0A3323', borderRadius: '5px', width: '100%', boxSizing: 'border-box', backgroundColor: '#F7F4D5', color: '#0A3323', outline: 'none' };
const saveBtnStyle = { flex: 1, padding: '10px', background: '#105666', color: '#F7F4D5', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };
const cancelBtnStyle = { flex: 1, padding: '10px', background: '#D3968C', color: '#F7F4D5', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };
const iconBtnStyle = { background: '#105666', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const addBtnStyle = { marginTop: '10px', padding: '5px 10px', fontSize: '0.8em', cursor: 'pointer', borderRadius: '4px', border: '1px solid #0A3323', background: '#F7F4D5', color: '#0A3323', fontWeight: 'bold' };
const deleteBtnStyle = { color: '#D3968C', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' };
const quickSellBtnStyle = { display: 'flex', alignItems: 'center', background: '#105666', color: '#F7F4D5', border: 'none', borderRadius: '20px', padding: '8px 16px', fontWeight: 'bold', transition: 'background 0.3s' };

export default Products;
