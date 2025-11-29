import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '../ui/button';
import type { PrintService, PriceMatrix } from '../../types/printshop';
import * as printShopService from '../../services/printshop';

interface PricingMatrixProps {
    services: PrintService[];
}

const PricingMatrixEditor = ({ services }: PricingMatrixProps) => {
    const [selectedService, setSelectedService] = useState<string>('');
    const [pricingData, setPricingData] = useState<PriceMatrix | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedService) {
            loadPricing(selectedService);
        }
    }, [selectedService]);

    const loadPricing = async (serviceId: string) => {
        try {
            setLoading(true);
            const data = await printShopService.getServicePricing(serviceId);
            setPricingData(data);
        } catch (error: any) {
            console.error('Failed to load pricing:', error);
            // Initialize with empty pricing if not found
            setPricingData({
                serviceId,
                sizeModifiers: {},
                materialMarkups: {},
                mediumMarkups: {},
                framePrices: {},
                quantityDiscounts: [],
                rushOrderFee: 0,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!pricingData || !selectedService) return;

        try {
            await printShopService.updateServicePricing(selectedService, pricingData);
            toast.success('Pricing updated successfully');
        } catch (error: any) {
            console.error('Failed to save pricing:', error);
            toast.error(error.message || 'Failed to save pricing');
        }
    };

    if (services.length === 0) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <p style={{ color: '#666' }}>
                    Please create at least one service before configuring pricing.
                </p>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem' }}>
            <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.3rem', fontWeight: 'bold' }}>
                Pricing Configuration
            </h3>

            {/* Service Selector */}
            <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                    Select Service
                </label>
                <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    style={{
                        width: '100%',
                        maxWidth: '400px',
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        fontSize: '1rem',
                    }}
                >
                    <option value="">-- Choose a service --</option>
                    {services.map((service) => (
                        <option key={service.id} value={service.id}>
                            {service.name}
                        </option>
                    ))}
                </select>
            </div>

            {loading && (
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p>Loading pricing configuration...</p>
                </div>
            )}

            {!loading && pricingData && selectedService && (
                <div>
                    {/* Rush Order Fee */}
                    <div style={{
                        background: '#f9f9f9',
                        padding: '1.5rem',
                        borderRadius: '8px',
                        marginBottom: '1.5rem',
                        border: '1px solid #e0e0e0',
                    }}>
                        <h4 style={{ marginTop: 0, marginBottom: '1rem' }}>Rush Order Fee</h4>
                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                Additional fee for rush orders (KES)
                            </label>
                            <input
                                type="number"
                                value={pricingData.rushOrderFee}
                                onChange={(e) => setPricingData({
                                    ...pricingData,
                                    rushOrderFee: parseFloat(e.target.value) || 0,
                                })}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                style={{
                                    width: '200px',
                                    padding: '10px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                }}
                            />
                        </div>
                    </div>

                    {/* Quantity Discounts */}
                    <div style={{
                        background: '#f9f9f9',
                        padding: '1.5rem',
                        borderRadius: '8px',
                        marginBottom: '1.5rem',
                        border: '1px solid #e0e0e0',
                    }}>
                        <h4 style={{ marginTop: 0, marginBottom: '1rem' }}>Quantity Discounts</h4>
                        <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>
                            Set discounts based on order quantity (e.g., 0.1 = 10% discount)
                        </p>

                        {pricingData.quantityDiscounts.map((discount, index) => (
                            <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                                <div>
                                    <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>
                                        Min Quantity
                                    </label>
                                    <input
                                        type="number"
                                        value={discount.minQuantity}
                                        onChange={(e) => {
                                            const newDiscounts = [...pricingData.quantityDiscounts];
                                            newDiscounts[index].minQuantity = parseInt(e.target.value) || 0;
                                            setPricingData({ ...pricingData, quantityDiscounts: newDiscounts });
                                        }}
                                        min="1"
                                        style={{ width: '100px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '5px' }}>
                                        Discount (0-1)
                                    </label>
                                    <input
                                        type="number"
                                        value={discount.discount}
                                        onChange={(e) => {
                                            const newDiscounts = [...pricingData.quantityDiscounts];
                                            newDiscounts[index].discount = parseFloat(e.target.value) || 0;
                                            setPricingData({ ...pricingData, quantityDiscounts: newDiscounts });
                                        }}
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        style={{ width: '100px', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                                    />
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        const newDiscounts = pricingData.quantityDiscounts.filter((_, i) => i !== index);
                                        setPricingData({ ...pricingData, quantityDiscounts: newDiscounts });
                                    }}
                                    style={{ marginTop: '20px', color: '#d32f2f' }}
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}

                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                                setPricingData({
                                    ...pricingData,
                                    quantityDiscounts: [
                                        ...pricingData.quantityDiscounts,
                                        { minQuantity: 1, discount: 0 },
                                    ],
                                });
                            }}
                        >
                            + Add Discount Tier
                        </Button>
                    </div>

                    {/* Note about other pricing */}
                    <div style={{
                        background: '#fff3cd',
                        padding: '1rem',
                        borderRadius: '8px',
                        marginBottom: '1.5rem',
                        border: '1px solid #ffc107',
                    }}>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#856404' }}>
                            <strong>Note:</strong> Size modifiers, material markups, medium markups, and frame prices
                            are configured through the Configuration tab (Materials, Sizes, Frames sections).
                        </p>
                    </div>

                    {/* Save Button */}
                    <div style={{ marginTop: '2rem' }}>
                        <Button
                            onClick={handleSave}
                            style={{ background: '#1a1a1a', color: '#FFD700' }}
                        >
                            Save Pricing Configuration
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PricingMatrixEditor;
