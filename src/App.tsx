import React, { useState, useEffect } from 'react';
import { Calculator, History, Save, Trash2, ArrowLeft, ArrowRight, HelpCircle } from 'lucide-react';

interface CalculationHistory {
  id: string;
  amount: number;
  gstRate: number;
  gstAmount: number;
  total: number;
  date: Date;
  note: string;
}

function App() {
  const [amount, setAmount] = useState<string>('');
  const [gstRate, setGstRate] = useState<number>(18);
  const [isInclusive, setIsInclusive] = useState<boolean>(false);
  const [note, setNote] = useState<string>('');
  const [history, setHistory] = useState<CalculationHistory[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(false);

  const gstRates = [5, 12, 18, 28];

  const calculateGST = (amount: number, rate: number, inclusive: boolean) => {
    if (inclusive) {
      const baseAmount = amount * (100 / (100 + rate));
      const gstAmount = amount - baseAmount;
      return {
        baseAmount: baseAmount,
        gstAmount: gstAmount,
        total: amount
      };
    } else {
      const gstAmount = amount * (rate / 100);
      return {
        baseAmount: amount,
        gstAmount: gstAmount,
        total: amount + gstAmount
      };
    }
  };

  const handleCalculate = () => {
    if (!amount) return;

    const numAmount = parseFloat(amount);
    const result = calculateGST(numAmount, gstRate, isInclusive);
    
    const newCalculation: CalculationHistory = {
      id: Date.now().toString(),
      amount: result.baseAmount,
      gstRate: gstRate,
      gstAmount: result.gstAmount,
      total: result.total,
      date: new Date(),
      note: note
    };

    setHistory([newCalculation, ...history]);
    setNote('');
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Calculator className="text-white w-8 h-8" />
            <h1 className="text-2xl md:text-3xl font-bold text-white">GST Calculator</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all"
            >
              <History size={20} />
              {showHistory ? 'Calculator' : 'History'}
            </button>
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="p-2 rounded-lg bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all"
            >
              <HelpCircle size={20} />
            </button>
          </div>
        </div>

        {showHelp ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white mb-6">
            <h2 className="text-xl font-semibold mb-4">How to use the GST Calculator</h2>
            <ul className="space-y-3">
              <li>1. Enter the amount in the input field</li>
              <li>2. Select the appropriate GST rate (5%, 12%, 18%, or 28%)</li>
              <li>3. Choose whether the amount is GST inclusive or exclusive</li>
              <li>4. Add an optional note for reference</li>
              <li>5. Click Calculate to see the breakdown</li>
              <li>6. View calculation history by clicking the History button</li>
            </ul>
          </div>
        ) : null}

        {!showHistory ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Input Section */}
              <div className="space-y-4">
                <div>
                  <label className="block text-white mb-2">Amount</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                    placeholder="Enter amount"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">GST Rate</label>
                  <div className="grid grid-cols-4 gap-2">
                    {gstRates.map((rate) => (
                      <button
                        key={rate}
                        onClick={() => setGstRate(rate)}
                        className={`px-4 py-2 rounded-lg ${
                          gstRate === rate
                            ? 'bg-white text-purple-900 font-medium'
                            : 'bg-white/5 text-white hover:bg-white/10'
                        } transition-all`}
                      >
                        {rate}%
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white mb-2">GST Type</label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setIsInclusive(false)}
                      className={`flex-1 px-4 py-2 rounded-lg ${
                        !isInclusive
                          ? 'bg-white text-purple-900 font-medium'
                          : 'bg-white/5 text-white hover:bg-white/10'
                      } transition-all`}
                    >
                      Exclusive
                    </button>
                    <button
                      onClick={() => setIsInclusive(true)}
                      className={`flex-1 px-4 py-2 rounded-lg ${
                        isInclusive
                          ? 'bg-white text-purple-900 font-medium'
                          : 'bg-white/5 text-white hover:bg-white/10'
                      } transition-all`}
                    >
                      Inclusive
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-white mb-2">Note (Optional)</label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                    placeholder="Add a note"
                  />
                </div>

                <button
                  onClick={handleCalculate}
                  className="w-full px-6 py-3 rounded-lg bg-white text-purple-900 font-semibold hover:bg-white/90 transition-all"
                >
                  Calculate
                </button>
              </div>

              {/* Result Section */}
              <div className="bg-white/5 rounded-xl p-6 space-y-4">
                <h2 className="text-xl font-semibold text-white mb-4">Calculation Result</h2>
                {amount && (
                  <>
                    <div className="flex justify-between text-white">
                      <span>Base Amount:</span>
                      <span className="font-medium">
                        {formatCurrency(calculateGST(parseFloat(amount), gstRate, isInclusive).baseAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-white">
                      <span>GST ({gstRate}%):</span>
                      <span className="font-medium">
                        {formatCurrency(calculateGST(parseFloat(amount), gstRate, isInclusive).gstAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-white border-t border-white/10 pt-4">
                      <span>Total Amount:</span>
                      <span className="font-semibold text-xl">
                        {formatCurrency(calculateGST(parseFloat(amount), gstRate, isInclusive).total)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Calculation History</h2>
              <button
                onClick={clearHistory}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-white hover:bg-white/10 transition-all"
              >
                <Trash2 size={18} />
                Clear History
              </button>
            </div>
            <div className="space-y-4">
              {history.length === 0 ? (
                <p className="text-white/60 text-center py-8">No calculations yet</p>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white/5 rounded-xl p-4 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-white/60 text-sm">
                          {formatDate(item.date)}
                        </span>
                        {item.note && (
                          <p className="text-white mt-1">{item.note}</p>
                        )}
                      </div>
                      <span className="text-white font-semibold">
                        {formatCurrency(item.total)}
                      </span>
                    </div>
                    <div className="flex justify-between text-white/80 text-sm">
                      <span>Base: {formatCurrency(item.amount)}</span>
                      <span>GST ({item.gstRate}%): {formatCurrency(item.gstAmount)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;