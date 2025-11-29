import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import type { PrintService } from '../../types/printshop';
import * as printShopService from '../../services/printshop';

const ServiceManager = () => {
    const [services, setServices] = useState<PrintService[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingService, setEditingService] = useState<PrintService | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        technologyType: '',
        basePrice: 0,
        isActive: true,
    });

    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        try {
            setLoading(true);
            const data = await printShopService.getServices();
            setServices(data);
        } catch (error: any) {
            console.error('Failed to load services:', error);
            toast.error(error.message || 'Failed to load services');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingService) {
                await printShopService.updateService(editingService.id, formData);
                toast.success('Service updated successfully');
            } else {
                await printShopService.createService(formData);
                toast.success('Service created successfully');
            }

            resetForm();
            loadServices();
        } catch (error: any) {
            console.error('Failed to save service:', error);
            toast.error(error.message || 'Failed to save service');
        }
    };

    const handleEdit = (service: PrintService) => {
        setEditingService(service);
        setFormData({
            name: service.name,
            description: service.description,
            technologyType: service.technologyType,
            basePrice: service.basePrice,
            isActive: service.isActive,
        });
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this service?')) return;

        try {
            await printShopService.deleteService(id);
            toast.success('Service deleted successfully');
            loadServices();
        } catch (error: any) {
            console.error('Failed to delete service:', error);
            toast.error(error.message || 'Failed to delete service');
        }
    };

    const toggleServiceStatus = async (service: PrintService) => {
        try {
            await printShopService.updateService(service.id, {
                isActive: !service.isActive,
            });
            toast.success(`Service ${!service.isActive ? 'activated' : 'deactivated'}`);
            loadServices();
        } catch (error: any) {
            console.error('Failed to toggle service status:', error);
            toast.error(error.message || 'Failed to update service status');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            description: '',
            technologyType: '',
            basePrice: 0,
            isActive: true,
        });
        setEditingService(null);
        setShowForm(false);
    };

    if (loading) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <p>Loading services...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
            }}>
                <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 'bold' }}>
                    Print Services
                </h3>
                <Button
                    onClick={() => setShowForm(!showForm)}
                    style={{
                        background: '#1a1a1a',
                        color: '#FFD700',
                    }}
                >
                    {showForm ? 'Cancel' : '+ Add Service'}
                </Button>
            </div>

            {/* Service Form */}
            {showForm && (
                <div style={{
                    background: '#f9f9f9',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    marginBottom: '2rem',
                    border: '1px solid #e0e0e0',
                }}>
                    <h4 style={{ marginTop: 0, marginBottom: '1rem' }}>
                        {editingService ? 'Edit Service' : 'New Service'}
                    </h4>
                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                                    Service Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., Canvas Printing"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                                    Technology Type *
                                </label>
                                <input
                                    type="text"
                                    value={formData.technologyType}
                                    onChange={(e) => setFormData({ ...formData, technologyType: e.target.value })}
                                    placeholder="e.g., Digital, Giclée"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                    }}
                                />
                            </div>

                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                                    Description *
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe this printing service..."
                                    required
                                    rows={3}
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                        fontFamily: 'inherit',
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                                    Base Price (KES) *
                                </label>
                                <input
                                    type="number"
                                    value={formData.basePrice}
                                    onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })}
                                    placeholder="0.00"
                                    required
                                    min="0"
                                    step="0.01"
                                    style={{
                                        width: '100%',
                                        padding: '10px',
                                        border: '1px solid #ccc',
                                        borderRadius: '4px',
                                    }}
                                />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="checkbox"
                                    id="serviceActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                />
                                <label htmlFor="serviceActive" style={{ margin: 0, fontSize: '0.9rem' }}>
                                    Service is active
                                </label>
                            </div>
                        </div>

                        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '10px' }}>
                            <Button type="submit" style={{ background: '#1a1a1a', color: '#FFD700' }}>
                                {editingService ? 'Update Service' : 'Create Service'}
                            </Button>
                            <Button
                                type="button"
                                onClick={resetForm}
                                variant="outline"
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Services List */}
            {services.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '3rem',
                    background: '#f9f9f9',
                    borderRadius: '8px',
                    border: '2px dashed #ddd',
                }}>
                    <p style={{ color: '#666', margin: 0 }}>
                        No services yet. Click "Add Service" to create your first print service.
                    </p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '1.5rem',
                }}>
                    {services.map((service) => (
                        <div
                            key={service.id}
                            style={{
                                background: '#fff',
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                padding: '1.5rem',
                                position: 'relative',
                            }}
                        >
                            {/* Status Badge */}
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    background: service.isActive ? '#4caf50' : '#999',
                                    color: '#fff',
                                    padding: '4px 10px',
                                    borderRadius: '12px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                }}
                            >
                                {service.isActive ? 'Active' : 'Inactive'}
                            </div>

                            <h4 style={{ marginTop: 0, marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                                {service.name}
                            </h4>

                            <p style={{
                                fontSize: '0.85rem',
                                color: '#666',
                                marginBottom: '0.5rem',
                            }}>
                                {service.description}
                            </p>

                            <div style={{
                                fontSize: '0.85rem',
                                color: '#888',
                                marginBottom: '1rem',
                            }}>
                                <div>Technology: <strong>{service.technologyType}</strong></div>
                                <div>Base Price: <strong>KES {service.basePrice.toLocaleString()}</strong></div>
                            </div>

                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEdit(service)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => toggleServiceStatus(service)}
                                >
                                    {service.isActive ? 'Deactivate' : 'Activate'}
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDelete(service.id)}
                                    style={{ color: '#d32f2f' }}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ServiceManager;
