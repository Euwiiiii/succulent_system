import React, { useState, useEffect } from 'react';
import { getProducts, deleteProduct, updateProduct, getSupplies, quickSellProduct, createRequest } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { calculateFinalPrices, formatCurrency } from '../utils/calculator';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [suppliesData, setSuppliesData] = useState([]);

    const [editingProduct, setEditingProduct] = useState(null);
    const [editTotalCost, setEditTotalCost] = useState(0);
    const [editSellingPrice, setEditSellingPrice] = useState(0);
    const [showAuthModal, setShowAuthModal] = useState(false);

    const { user } = React.useContext(AuthContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'All' || p.type === filterType;
        return matchesSearch && matchesType;
    });

    const handleRequest = async (product) => {
        if (!user) {
            setShowAuthModal(true);
            return;
        }
        window.dispatchEvent(new CustomEvent('open-chat', {
            detail: { productId: product._id, productName: product.name }
        }));
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
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ padding: '20px 0', fontSize: '2rem', color: '#2d6a4f', fontWeight: 'bold' }}>SUCCULENT SYSTEM INVENTORY</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        placeholder="Search items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '200px', backgroundColor: 'var(--beige)' }}
                    />
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                    >
                        <option value="All">All Types</option>
                        <option value="Single Plant">Single Plant</option>
                        <option value="Arrangement">Arrangement</option>
                    </select>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                {filteredProducts.length === 0 ? <p>No succulents match your search.</p> : null}

                {filteredProducts.map((product) => (
                    <div key={product._id} style={{ border: '1px solid #ccc', padding: '15px', width: '100%', boxSizing: 'border-box', borderRadius: '8px', backgroundColor: '#fdfdfd', position: 'relative' }}>

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
                                <button onClick={() => handleDelete(product._id, product.name)} style={{ ...iconBtnStyle, background: 'var(--rosy-brown)' }}>
                                    <img src="/svg/delete.svg" style={{ width: '18px', height: '18px' }} />
                                </button>
                            </div>
                        )}

                        <h3 style={{ margin: '0 0 5px 0', color: '#1b4332', textAlign: 'left' }}>{product.name}</h3>
                        <p style={{ fontStyle: 'italic', color: 'gray', marginTop: '0', fontSize: '0.9em' }}>{product.type}</p>

                        {product.imageUrl && <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '5px' }} />}

                        {product.plants && product.plants.length > 0 && (
                            <div style={{ margin: '15px 0', padding: '10px', backgroundColor: '#e9ecef', borderRadius: '5px', fontSize: '0.85em', textAlign: 'left' }}>
                                <strong>Varieties:</strong>
                                <ul style={{ margin: '5px 0', paddingLeft: '20px', listStyleType: 'none', left: '10px', textAlign: 'left' }}>
                                    {product.plants.map(plant => (
                                        <li key={plant._id}>{plant.name}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <hr style={{ borderColor: '#eee', margin: '15px 0' }} />

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                            {user?.role === 'Admin' && (
                                <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                                    <strong>Cost Price:</strong> {formatCurrency(calculateFinalPrices({
                                        ...product,
                                        costPrice: Number(product.costPrice) || Number(product.totalCost) || 0,
                                        sellingPrice: Number(product.sellingPrice) || 0,
                                    }).totalCost)}
                                </p>
                            )}

                            <div style={{ color: '#2d6a4f', fontSize: '1.4rem', fontWeight: 'bold' }}>
                                {formatCurrency(calculateFinalPrices({
                                    ...product,
                                    costPrice: Number(product.costPrice) || Number(product.totalCost) || 0,
                                    sellingPrice: Number(product.sellingPrice) || 0,
                                }).sellingPrice, true)}
                            </div>

                            {user?.role === 'Admin' ? (
                                <button
                                    onClick={() => handleQuickSell(product._id, product.name, product.stockQuantity)}
                                    disabled={product.stockQuantity <= 0}
                                    style={{
                                        ...quickSellBtnStyle,
                                        opacity: product.stockQuantity <= 0 ? 0.5 : 1,
                                        cursor: product.stockQuantity <= 0 ? 'not-allowed' : 'pointer',
                                        width: '100%',
                                        justifyContent: 'center'
                                    }}
                                    title="Quick Sell 1 Unit"
                                >
                                    <span style={{ display: 'flex', alignItems: 'center', marginRight: '8px' }}>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M3 2L3 6.58579L10 13.5858L14.5858 9L7.58579 2L3 2ZM2 2C2 1.44772 2.44772 1 3 1H7.58579C7.851 1 8.10536 1.10536 8.29289 1.29289L15.2929 8.29289C15.6834 8.68342 15.6834 9.31658 15.2929 9.70711L10.7071 14.2929C10.3166 14.6834 9.68342 14.6834 9.29289 14.2929L2.29289 7.29289C2.10536 7.10536 2 6.851 2 6.58579V2Z" fill="currentColor"/>
                                            <path d="M5.5 5C5.22386 5 5 4.77614 5 4.5C5 4.22386 5.22386 4 5.5 4C5.77614 4 6 4.22386 6 4.5C6 4.77614 5.77614 5 5.5 5ZM5.5 6C6.32843 6 7 5.32843 7 4.5C7 3.67157 6.32843 3 5.5 3C4.67157 3 4 3.67157 4 4.5C4 5.32843 4.67157 6 5.5 6Z" fill="currentColor"/>
                                            <path d="M1 7.08579C1 7.351 1.10536 7.60536 1.29289 7.79289L8.75 15.25L8.70711 15.2929C8.31658 15.6834 7.68342 15.6834 7.29289 15.2929L0.292892 8.29289C0.105356 8.10536 0 7.851 0 7.58579V3C0 2.44772 0.447715 2 1 2V7.08579Z" fill="currentColor"/>
                                        </svg>
                                    </span> 
                                    Sell 1
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleRequest(product)}
                                    style={{
                                        ...quickSellBtnStyle,
                                        background: 'var(--midnight-green)',
                                        width: '100%',
                                        justifyContent: 'center',
                                        display: 'flex',
                                        gap: '8px'
                                    }}
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M8.39917 8.40002H15.5992M8.39917 13.2H12.5992M21.5992 12C21.5992 13.3801 21.308 14.6921 20.7837 15.878L21.601 21.5991L16.6981 20.3734C15.3091 21.1545 13.7062 21.6 11.9992 21.6C6.69724 21.6 2.39917 17.302 2.39917 12C2.39917 6.69809 6.69724 2.40002 11.9992 2.40002C17.3011 2.40002 21.5992 6.69809 21.5992 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    Request
                                </button>
                            )}

                            <p style={{ margin: 0, color: product.stockQuantity < 5 ? 'var(--rosy-brown)' : 'var(--moss-green)', fontWeight: 'bold', fontSize: '0.9rem' }}>
                                Stock: {product.stockQuantity}
                                {product.stockQuantity < 2 && " Low!"}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {editingProduct && (
                <div style={overlayStyle}>
                    <div style={modalStyle}>
                        <h3 style={{ marginTop: 0, color: '#1b4332', textAlign: 'center' }}> Advanced Edit</h3>

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
                                <div style={{ padding: '10px', backgroundColor: '#f8fffb', border: '1px solid #d4edda', borderRadius: '5px', marginTop: '10px', maxHeight: '150px', overflowY: 'auto' }}>
                                    <label style={{ ...labelStyle, color: '#2d6a4f' }}>Plants & Costs</label>
                                    {(editingProduct?.plants || []).map((plant, index) => (
                                        <div key={index} style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                                            <input value={plant?.name || ''} onChange={(e) => handleEditPlantChange(index, 'name', e.target.value)} style={{ ...inputStyle, flex: 2 }} />
                                            <input type="number" value={plant?.cost || ''} onChange={(e) => handleEditPlantChange(index, 'cost', e.target.value)} style={{ ...inputStyle, flex: 1 }} placeholder="₱" />
                                            <button onClick={() => removeEditPlantRow(index)} style={deleteBtnStyle}>X</button>
                                        </div>
                                    ))}
                                    <button onClick={addEditPlantRow} style={addBtnStyle}>+ Add Plant</button>
                                </div>

                                {/* Supplies inside Modal */}
                                <div style={{ padding: '10px', backgroundColor: '#f8fffb', border: '1px solid #d4edda', borderRadius: '5px', marginTop: '10px', maxHeight: '150px', overflowY: 'auto' }}>
                                    <label style={{ ...labelStyle, color: '#2d6a4f' }}>Supplies</label>
                                    {(editingProduct?.supplies || []).map((item, index) => (
                                        <div key={index} style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                                            <select
                                                value={item.supply?._id || item.supply || ''}
                                                onChange={(e) => handleEditSupplySelection(index, e.target.value)}
                                                style={{ ...inputStyle, flex: 2 }}
                                            >
                                                <option value="">Select...</option>
                                                {suppliesData.filter(s => s.type !== 'Pot').map(s => (
                                                    <option key={s._id} value={s._id}>{s.name}</option>
                                                ))}
                                            </select>
                                            <input type="number" value={item.gramsUsed || ''} onChange={(e) => handleEditSupplyGrams(index, e.target.value)} style={{ ...inputStyle, flex: 1 }} placeholder="g" />
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
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '10px', backgroundColor: '#e9ecef', padding: '10px', borderRadius: '5px' }}>
                            {/* Per Unit Breakdown */}
                            <div style={{ textAlign: 'center', gridColumn: '1 / -1' }}>
                                <h4 style={{ margin: '0 0 5px 0', color: '#1b4332', fontSize: '0.9rem' }}>Per Unit Breakdown</h4>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <span style={{ fontSize: '0.85em', color: '#555' }}>Unit Cost</span><br />
                                <strong>{formatCurrency(editTotalCost)}</strong>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <span style={{ fontSize: '0.85em', color: '#2d6a4f' }}>Unit Selling Price</span><br />
                                <strong style={{ color: '#2d6a4f' }}>{formatCurrency(editSellingPrice, true)}</strong>
                            </div>

                            {/* Overall Inventory Value */}
                            <div style={{ textAlign: 'center', gridColumn: '1 / -1', marginTop: '10px', borderTop: '1px dashed #ccc', paddingTop: '10px' }}>
                                <h4 style={{ margin: '0 0 5px 0', color: '#1b4332', fontSize: '0.9rem' }}>Overall Inventory Value</h4>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <span style={{ fontSize: '0.85em', color: '#555' }}>Total Cost ({editingProduct?.stockQuantity || 0} items)</span><br />
                                <strong>{formatCurrency(editTotalCost * (Number(editingProduct?.stockQuantity) || 0))}</strong>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <span style={{ fontSize: '0.85em', color: '#2d6a4f' }}>Total Value ({editingProduct?.stockQuantity || 0} items)</span><br />
                                <strong style={{ color: '#2d6a4f' }}>{formatCurrency(editSellingPrice * (Number(editingProduct?.stockQuantity) || 0), true)}</strong>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button onClick={handleSaveEdit} style={saveBtnStyle}>Save Updates</button>
                            <button onClick={() => setEditingProduct(null)} style={cancelBtnStyle}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {showAuthModal && (
                <div style={overlayStyle}>
                    <div style={{ ...modalStyle, width: '350px', textAlign: 'center', alignItems: 'center' }}>
                        <h3 style={{ margin: '0 0 10px 0', color: '#2d6a4f' }}>Login Required</h3>
                        <p style={{ color: '#555', fontSize: '0.9rem', marginBottom: '20px' }}>
                            Please login to send a request/inquiry.
                        </p>
                        <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                            <button
                                onClick={() => {
                                    setShowAuthModal(false);
                                    window.location.href = '/login';
                                }}
                                style={saveBtnStyle}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => setShowAuthModal(false)}
                                style={cancelBtnStyle}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
    backgroundColor: 'white', padding: '25px', borderRadius: '10px',
    width: '450px', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
};
const labelStyle = { fontSize: '0.85em', fontWeight: 'bold', color: '#555', marginBottom: '-5px' };
const inputStyle = { padding: '8px', border: '1px solid #ccc', borderRadius: '5px', width: '100%', boxSizing: 'border-box' };
const saveBtnStyle = { flex: 1, padding: '10px', background: 'var(--midnight-green)', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };
const cancelBtnStyle = { flex: 1, padding: '10px', background: '#e9ecef', color: '#333', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };
const iconBtnStyle = { background: 'var(--dark-green)', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const addBtnStyle = { marginTop: '10px', padding: '5px 10px', fontSize: '0.8em', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc', background: 'white' };
const deleteBtnStyle = { color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' };
const quickSellBtnStyle = { display: 'flex', alignItems: 'center', background: 'var(--midnight-green)', color: 'white', border: 'none', borderRadius: '5px', padding: '6px 12px', fontWeight: 'bold', transition: 'background 0.3s' };

export default Products;
