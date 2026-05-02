import React, { useState, useEffect } from 'react';
import { getProducts, deleteProduct, updateProduct} from '../services/api'; 

const Products = () => {
    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);


    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
    try {
        const response = await getProducts();
        // Siguraduhin na array ang data bago i-set
        if (response.data && Array.isArray(response.data)) {
            setProducts(response.data);
        } else {
            console.warn("Backend did not return an array:", response.data);
            setProducts([]); // Ibalik sa empty array kung hindi listahan
        }
    } catch (error) {
        console.error("Error fetching products", error);
        setProducts([]); // Ibalik sa empty array kapag may error
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

    let editTotalCost = 0;
    let editSellingPrice = 0;


    const handleSaveEdit = async () => {
        try {
            await updateProduct(editingProduct._id, editingProduct);
            alert(`✅ "${editingProduct.name}" updated successfully!`);
            setEditingProduct(null); 
            fetchProducts(); 
        } catch (error) {
            console.error("Error updating", error);
            alert("❌ Failed to update product.");
        }
    };

    return (
        <div style={{ padding: '20px'}}>
            <h2 style={{ padding: '20px', fontSize: '2rem', color: '#2d6a4f', fontWeight: 'bold'}}>SUCCULENT INVENTORY</h2>
            
            {/* display products in a grid layout with 3 columns*/}
        
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                
                {products.length === 0 ? <p>No succulents in inventory yet!</p> : null}
                
                {Array.isArray(products) && products.map((product) => (
                    <div key={product._id} style={{ border: '1px solid #ccc', padding: '15px', width: '100%', boxSizing: 'border-box', borderRadius: '8px', backgroundColor: '#fdfdfd', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '10px', right: '10px', display: 'flex', gap: '8px' }} > 
                            {/* Edit Button */}
                        <button 
                            onClick={() => setEditingProduct({
                                    ...product,
                                    plants: product.plants || [],
                                    potCost: product.potCost || 0,
                                    soilCost: product.soilCost || 0,
                                    laborCost: product.laborCost || 0,
                                    markupPercentage: product.markupPercentage || 0
                                })}
                            style={{ 
                                background: '#2be071', 
                                border: 'none', 
                                borderRadius: '4px', 
                                cursor: 'pointer', 
                                padding: '6px', 
                                display: 'flex', 
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <img 
                                src="/svg/edit.svg" 
                                style={{ width: '18px', height: '18px' }} 
                            />
                        </button>
                            <button 
                            onClick={() => handleDelete(product._id, product.name)}
                            style={{
                                background: '#ff4d4f', 
                                border: 'none', 
                                borderRadius: '4px', 
                                cursor: 'pointer', 
                                padding: '6px', 
                                display: 'flex', 
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <img 
                                src="/svg/delete.svg" 
                                style={{ width: '18px', height: '18px' }} 
                            />
                        </button>
                        </div>
                        

                        <h3 style={{ margin: '0 0 5px 0', color: '#1b4332', textAlign: 'left' }}>{product.name}</h3>
                        <p style={{ fontStyle: 'italic', color: 'gray', marginTop: '0', fontSize: '0.9em' }}>{product.type}</p>
                        
                        {/* The Image Tag */}
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
                        
                        <p style={{ margin: 0, color: product.stockQuantity < 5 ? 'red' : 'green', fontWeight: 'bold' }}>
                            Stock: {product.stockQuantity} 
                            {product.stockQuantity < 2 && " Low!"}
                        </p>
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
                                <input name="type" value={editingProduct?.type || ''} onChange={handleEditChange} style={inputStyle} />
                            </div>
                        </div>

                        {/* Plants List inside Modal */}
                        <div style={{ padding: '10px', backgroundColor: '#f8fffb', border: '1px solid #d4edda', borderRadius: '5px', marginTop: '10px' }}>
                            <label style={{...labelStyle, color: '#2d6a4f'}}>Plants & Costs</label>
                            {(editingProduct?.plants || []).map((plant, index) => (
                                <div key={index} style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                                    {/* Added plant?. safety net to prevent crashes! */}
                                    <input value={plant?.name || ''} onChange={(e) => handleEditPlantChange(index, 'name', e.target.value)} style={{...inputStyle, flex: 2}} />
                                    <input type="number" value={plant?.cost || ''} onChange={(e) => handleEditPlantChange(index, 'cost', e.target.value)} style={{...inputStyle, flex: 1}} placeholder="₱" />
                                    <button onClick={() => removeEditPlantRow(index)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
                                </div>
                            ))}
                            <button onClick={addEditPlantRow} style={{ marginTop: '10px', padding: '5px 10px', fontSize: '0.8em', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc' }}>+ Add Plant</button>
                        </div>

                        {/* Supplies & Labor inside Modal */}
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>Pot (₱)</label>
                                <input name="potCost" type="number" value={editingProduct?.potCost || ''} onChange={handleEditChange} style={inputStyle} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>Soil (₱)</label>
                                <input name="soilCost" type="number" value={editingProduct?.soilCost || ''} onChange={handleEditChange} style={inputStyle} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>Labor (₱)</label>
                                <input name="laborCost" type="number" value={editingProduct?.laborCost || ''} onChange={handleEditChange} style={inputStyle} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>Margin (%)</label>
                                <input name="markupPercentage" type="number" value={editingProduct?.markupPercentage || ''} onChange={handleEditChange} style={inputStyle} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>Stock</label>
                                <input name="stockQuantity" type="number" value={editingProduct?.stockQuantity || ''} onChange={handleEditChange} style={inputStyle} />
                            </div>
                        </div>
                        
                        <label style={labelStyle}>Image URL</label>
                        <input name="imageUrl" value={editingProduct?.imageUrl || ''} onChange={handleEditChange} style={inputStyle} />

                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button onClick={handleSaveEdit} style={saveBtnStyle}>Save Updates</button>
                            <button onClick={() => setEditingProduct(null)} style={cancelBtnStyle}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

// Modal 
const overlayStyle = {
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', justifyContent: 'center',
    alignItems: 'center', zIndex: 1000
};
const modalStyle = {
    backgroundColor: 'white', padding: '30px', borderRadius: '10px',
    width: '400px', display: 'flex', flexDirection: 'column', gap: '10px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
};
const labelStyle = { fontSize: '0.85em', fontWeight: 'bold', color: '#555', marginBottom: '-5px' };
const inputStyle = { padding: '10px', border: '1px solid #ccc', borderRadius: '5px', width: '100%', boxSizing: 'border-box' };
const saveBtnStyle = { flex: 1, padding: '10px', background: '#2d6a4f', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };
const cancelBtnStyle = { flex: 1, padding: '10px', background: '#e9ecef', color: '#333', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };
        
    

export default Products;


