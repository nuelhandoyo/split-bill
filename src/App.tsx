import React, { useState, useEffect } from 'react';
import { Calculator, Users, Receipt, Percent, Plus, Minus, Banknote } from 'lucide-react';

interface BillData {
  totalBill: string;
  numberOfPeople: string;
  tipPercentage: string;
  taxPercentage: string;
  serviceCharge: string;
  additionalFees: string;
}

interface CalculationResult {
  subtotal: number;
  tipAmount: number;
  taxAmount: number;
  serviceChargeAmount: number;
  additionalFeesAmount: number;
  totalAmount: number;
  amountPerPerson: number;
}

function App() {
  const [billData, setBillData] = useState<BillData>({
    totalBill: '',
    numberOfPeople: '2',
    tipPercentage: '15',
    taxPercentage: '8.5',
    serviceCharge: '',
    additionalFees: ''
  });

  const [result, setResult] = useState<CalculationResult>({
    subtotal: 0,
    tipAmount: 0,
    taxAmount: 0,
    serviceChargeAmount: 0,
    additionalFeesAmount: 0,
    totalAmount: 0,
    amountPerPerson: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateInput = (name: string, value: string): string => {
    const numValue = parseFloat(value);
    
    if (value === '') return '';
    
    if (isNaN(numValue) || numValue < 0) {
      return 'Please enter a valid positive number';
    }
    
    if (name === 'numberOfPeople' && (numValue === 0 || numValue % 1 !== 0)) {
      return 'Number of people must be a positive whole number';
    }
    
    if ((name === 'tipPercentage' || name === 'taxPercentage') && numValue > 100) {
      return 'Percentage cannot exceed 100%';
    }
    
    return '';
  };

  const handleInputChange = (name: keyof BillData, value: string) => {
    setBillData(prev => ({ ...prev, [name]: value }));
    
    const error = validateInput(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const calculateBill = () => {
    const subtotal = parseFloat(billData.totalBill) || 0;
    const people = parseInt(billData.numberOfPeople) || 1;
    const tipPercent = parseFloat(billData.tipPercentage) || 0;
    const taxPercent = parseFloat(billData.taxPercentage) || 0;
    const serviceCharge = parseFloat(billData.serviceCharge) || 0;
    const additionalFees = parseFloat(billData.additionalFees) || 0;

    const tipAmount = (subtotal * tipPercent) / 100;
    const taxAmount = (subtotal * taxPercent) / 100;
    const totalAmount = subtotal + tipAmount + taxAmount + serviceCharge + additionalFees;
    const amountPerPerson = totalAmount / people;

    setResult({
      subtotal,
      tipAmount,
      taxAmount,
      serviceChargeAmount: serviceCharge,
      additionalFeesAmount: additionalFees,
      totalAmount,
      amountPerPerson
    });
  };

  useEffect(() => {
    calculateBill();
  }, [billData]);

  const adjustValue = (name: keyof BillData, increment: number) => {
    const currentValue = parseFloat(billData[name]) || 0;
    const newValue = Math.max(0, currentValue + increment);
    handleInputChange(name, newValue.toString());
  };

  const formatRupiah = (amount: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const resetCalculator = () => {
    setBillData({
      totalBill: '',
      numberOfPeople: '2',
      tipPercentage: '15',
      taxPercentage: '8.5',
      serviceCharge: '',
      additionalFees: ''
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-800/80 to-emerald-700/80 backdrop-blur-sm border-b border-emerald-600/30 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-2 bg-emerald-600/30 rounded-full">
              <Calculator className="w-6 h-6 text-emerald-300" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-300 to-emerald-100 bg-clip-text text-transparent">
              Split Bill
            </h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-emerald-800/50 to-emerald-900/50 backdrop-blur-sm rounded-3xl p-6 border border-emerald-600/30 shadow-2xl">
                <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2 text-emerald-300">
                  <Receipt className="w-5 h-5" />
                  <span>Detail Tagihan</span>
                </h2>

                {/* Total Bill */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-emerald-200 mb-2">
                    Total Tagihan
                  </label>
                  <div className="relative">
                    <Banknote className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 w-5 h-5" />
                    <input
                      type="number"
                      value={billData.totalBill}
                      onChange={(e) => handleInputChange('totalBill', e.target.value)}
                      placeholder="0"
                      className="w-full pl-10 pr-4 py-3 bg-emerald-900/50 border border-emerald-600/50 rounded-xl text-white placeholder-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                    />
                  </div>
                  {errors.totalBill && (
                    <p className="text-red-400 text-sm mt-1">{errors.totalBill}</p>
                  )}
                </div>

                {/* Number of People */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-emerald-200 mb-2">
                    Jumlah Orang
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => adjustValue('numberOfPeople', -1)}
                      className="p-2 bg-emerald-700/50 hover:bg-emerald-600/50 rounded-lg transition-colors duration-200"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="flex-1 relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 w-5 h-5" />
                      <input
                        type="number"
                        value={billData.numberOfPeople}
                        onChange={(e) => handleInputChange('numberOfPeople', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-emerald-900/50 border border-emerald-600/50 rounded-xl text-white text-center focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                      />
                    </div>
                    <button
                      onClick={() => adjustValue('numberOfPeople', 1)}
                      className="p-2 bg-emerald-700/50 hover:bg-emerald-600/50 rounded-lg transition-colors duration-200"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {errors.numberOfPeople && (
                    <p className="text-red-400 text-sm mt-1">{errors.numberOfPeople}</p>
                  )}
                </div>

                {/* Tip Percentage */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-emerald-200 mb-2">
                    Persentase Tip
                  </label>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => adjustValue('tipPercentage', -1)}
                      className="p-2 bg-emerald-700/50 hover:bg-emerald-600/50 rounded-lg transition-colors duration-200"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="flex-1 relative">
                      <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 w-5 h-5" />
                      <input
                        type="number"
                        value={billData.tipPercentage}
                        onChange={(e) => handleInputChange('tipPercentage', e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-emerald-900/50 border border-emerald-600/50 rounded-xl text-white text-center focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                      />
                    </div>
                    <button
                      onClick={() => adjustValue('tipPercentage', 1)}
                      className="p-2 bg-emerald-700/50 hover:bg-emerald-600/50 rounded-lg transition-colors duration-200"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {errors.tipPercentage && (
                    <p className="text-red-400 text-sm mt-1">{errors.tipPercentage}</p>
                  )}
                </div>

                {/* Quick Tip Buttons */}
                <div className="mb-6">
                  <p className="text-sm text-emerald-300 mb-2">Tip Cepat</p>
                  <div className="grid grid-cols-4 gap-2">
                    {[10, 15, 18, 20].map((tip) => (
                      <button
                        key={tip}
                        onClick={() => handleInputChange('tipPercentage', tip.toString())}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          billData.tipPercentage === tip.toString()
                            ? 'bg-emerald-600 text-white shadow-lg'
                            : 'bg-emerald-800/50 text-emerald-300 hover:bg-emerald-700/50'
                        }`}
                      >
                        {tip}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Additional Charges */}
              <div className="bg-gradient-to-br from-emerald-800/50 to-emerald-900/50 backdrop-blur-sm rounded-3xl p-6 border border-emerald-600/30 shadow-2xl">
                <h3 className="text-lg font-semibold mb-4 text-emerald-300">Biaya Tambahan</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-emerald-200 mb-2">
                      Persentase Pajak
                    </label>
                    <div className="relative">
                      <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 w-5 h-5" />
                      <input
                        type="number"
                        value={billData.taxPercentage}
                        onChange={(e) => handleInputChange('taxPercentage', e.target.value)}
                        placeholder="8.5"
                        className="w-full pl-10 pr-4 py-3 bg-emerald-900/50 border border-emerald-600/50 rounded-xl text-white placeholder-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-200 mb-2">
                      Biaya Layanan
                    </label>
                    <div className="relative">
                      <Banknote className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 w-5 h-5" />
                      <input
                        type="number"
                        value={billData.serviceCharge}
                        onChange={(e) => handleInputChange('serviceCharge', e.target.value)}
                        placeholder="0"
                        className="w-full pl-10 pr-4 py-3 bg-emerald-900/50 border border-emerald-600/50 rounded-xl text-white placeholder-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-emerald-200 mb-2">
                      Biaya Lainnya
                    </label>
                    <div className="relative">
                      <Banknote className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 w-5 h-5" />
                      <input
                        type="number"
                        value={billData.additionalFees}
                        onChange={(e) => handleInputChange('additionalFees', e.target.value)}
                        placeholder="0"
                        className="w-full pl-10 pr-4 py-3 bg-emerald-900/50 border border-emerald-600/50 rounded-xl text-white placeholder-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {/* Main Result */}
              <div className="bg-gradient-to-br from-emerald-600/30 to-emerald-700/30 backdrop-blur-sm rounded-3xl p-8 border border-emerald-500/30 shadow-2xl">
                <h2 className="text-xl font-semibold mb-6 text-center text-emerald-300">
                  Jumlah Per Orang
                </h2>
                <div className="text-center">
                  <div className="text-5xl md:text-6xl font-bold text-emerald-300 mb-2">
                    {formatRupiah(result.amountPerPerson)}
                  </div>
                  <p className="text-emerald-200 text-lg">
                    Dibagi untuk {billData.numberOfPeople || 1} orang
                  </p>
                </div>
              </div>

              {/* Breakdown */}
              <div className="bg-gradient-to-br from-emerald-800/50 to-emerald-900/50 backdrop-blur-sm rounded-3xl p-6 border border-emerald-600/30 shadow-2xl">
                <h3 className="text-lg font-semibold mb-4 text-emerald-300">Rincian Tagihan</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-emerald-700/30">
                    <span className="text-emerald-200">Subtotal</span>
                    <span className="font-semibold">{formatRupiah(result.subtotal)}</span>
                  </div>
                  
                  {result.tipAmount > 0 && (
                    <div className="flex justify-between items-center py-2 border-b border-emerald-700/30">
                      <span className="text-emerald-200">Tip ({billData.tipPercentage}%)</span>
                      <span className="font-semibold text-emerald-300">{formatRupiah(result.tipAmount)}</span>
                    </div>
                  )}
                  
                  {result.taxAmount > 0 && (
                    <div className="flex justify-between items-center py-2 border-b border-emerald-700/30">
                      <span className="text-emerald-200">Pajak ({billData.taxPercentage}%)</span>
                      <span className="font-semibold">{formatRupiah(result.taxAmount)}</span>
                    </div>
                  )}
                  
                  {result.serviceChargeAmount > 0 && (
                    <div className="flex justify-between items-center py-2 border-b border-emerald-700/30">
                      <span className="text-emerald-200">Biaya Layanan</span>
                      <span className="font-semibold">{formatRupiah(result.serviceChargeAmount)}</span>
                    </div>
                  )}
                  
                  {result.additionalFeesAmount > 0 && (
                    <div className="flex justify-between items-center py-2 border-b border-emerald-700/30">
                      <span className="text-emerald-200">Biaya Lainnya</span>
                      <span className="font-semibold">{formatRupiah(result.additionalFeesAmount)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center py-3 border-t-2 border-emerald-600/50 mt-4">
                    <span className="text-lg font-semibold text-emerald-300">Total Keseluruhan</span>
                    <span className="text-lg font-bold text-emerald-300">{formatRupiah(result.totalAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Reset Button */}
              <button
                onClick={resetCalculator}
                className="w-full py-4 bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-600 hover:to-emerald-500 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Reset Kalkulator
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-emerald-800/90 to-emerald-700/90 backdrop-blur-sm border-t border-emerald-600/30 md:hidden">
        <div className="flex justify-center items-center py-4">
          <div className="flex items-center space-x-2 text-emerald-300">
            <Calculator className="w-5 h-5" />
            <span className="font-medium">Kalkulator Bagi Tagihan</span>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default App;