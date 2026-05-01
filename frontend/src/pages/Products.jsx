import React, { useState, useEffect } from 'react';
import { getProducts, deleteProduct } from '../services/api'; 

const Products = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await getProducts();
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products", error);
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

    return (
        <div style={{ padding: '20px'}}>
            <h2 style={{ padding: '20px', fontSize: '2rem', color: '#2d6a4f', fontWeight: 'bold'}}>SUCCULENT INVENTORY</h2>
            
            /// display products in a grid layout with 3 columns
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                
                {products.length === 0 ? <p>No succulents in inventory yet!</p> : null}
                
                {products.map(product => (
                    <div key={product._id} style={{ border: '1px solid #ccc', padding: '15px', width: '100%', boxSizing: 'border-box', borderRadius: '8px', backgroundColor: '#fdfdfd', position: 'relative' }}>
                        
                        <button 
                            onClick={() => handleDelete(product._id, product.name)}
                            style={{ position: 'absolute', top: '10px', right: '10px', background: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '5px 8px', fontWeight: 'bold' }}
                        >
                            Delete
                        </button>

                        <h3 style={{ margin: '0 0 5px 0', color: '#1b4332', paddingRight: '50px' }}>{product.name}</h3>
                        <p style={{ fontStyle: 'italic', color: 'gray', marginTop: '0', fontSize: '0.9em' }}>{product.type}</p>
                        
                        {/* The Image Tag (This was already perfect!) */}
                        {product.imageUrl && <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '5px' }} />}
                        
                        {product.plants && product.plants.length > 0 && (
                            <div style={{ margin: '15px 0', padding: '10px', backgroundColor: '#e9ecef', borderRadius: '5px', fontSize: '0.85em' }}>
                                <strong>🪴 Contents:</strong>
                                <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                                    {product.plants.map(plant => (
                                        <li key={plant._id}>{plant.name}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                            <span><strong>Base Cost:</strong></span>
                            <span>₱{product.totalCost?.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2d6a4f', fontSize: '1.2em' }}>
                            <span><strong>Price:</strong></span>
                            <span><strong>₱{product.sellingPrice?.toFixed(2)}</strong></span>
                        </div>
                        
                        <hr style={{ borderColor: '#eee', margin: '15px 0' }} />
                        
                        <p style={{ margin: 0, color: product.stockQuantity < 5 ? 'red' : 'green', fontWeight: 'bold' }}>
                            Stock: {product.stockQuantity} 
                            {product.stockQuantity < 5 && " ⚠️ Low!"}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Products;