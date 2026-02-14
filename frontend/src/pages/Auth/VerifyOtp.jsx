import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { toast } from 'react-hot-toast';

export default function VerifyOtp() {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const { verifyOtp } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            toast.error("Email not found. Please login again.");
            return navigate('/login');
        }
        setLoading(true);
        try {
            await verifyOtp(email, otp);
            navigate('/dashboard');
        } catch (error) {
            // handled in context
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">Verify OTP</h2>
                    <p className="mt-2 text-gray-600">Enter the code sent to {email}</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <Input
                            label="OTP Code"
                            type="text"
                            required
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            disabled={loading}
                            className="text-center text-2xl tracking-widest"
                        />
                    </div>

                    <Button type="submit" className="w-full" isLoading={loading}>
                        Verify & Continue
                    </Button>
                </form>
            </div>
        </div>
    );
}
