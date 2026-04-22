import { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Download, Search, Loader } from 'lucide-react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '/utils/supabase/info';

interface BookingData {
  trans_id: number;
  booking_date: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  massage_name: string;
  massage_type: string;
  city: string;
  massage_price: number;
  booking_time: string;
}

export default function MISReport() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error('Start date must be before end date');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-86f09702/mis-report`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            startDate,
            endDate,
          }),
        }
      );

      const data = await response.json();
      
      console.log('MIS Report Response:', {
        status: response.status,
        ok: response.ok,
        data: data
      });

      if (!response.ok) {
        console.error('MIS Report Error:', data);
        throw new Error(data.error || `Server error: ${response.status}`);
      }

      setBookings(data.bookings || []);
      
      if (data.bookings.length === 0) {
        toast.info('No bookings found for the selected date range');
      } else {
        toast.success(`Found ${data.bookings.length} booking(s)`);
      }
    } catch (error) {
      console.error('Error fetching MIS report:', error);
      toast.error(`Failed to fetch report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (bookings.length === 0) {
      toast.error('No data to export');
      return;
    }

    // Create CSV content
    const headers = ['Trans ID', 'Date', 'Time', 'Customer Name', 'Email', 'Phone', 'Massage', 'Type', 'City', 'Price'];
    const csvContent = [
      headers.join(','),
      ...bookings.map(booking => [
        booking.trans_id,
        new Date(booking.booking_date).toLocaleDateString(),
        booking.booking_time,
        `"${booking.customer_name}"`,
        booking.customer_email,
        booking.customer_phone,
        `"${booking.massage_name}"`,
        booking.massage_type,
        booking.city,
        booking.massage_price,
      ].join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `savadhika-mis-report-${startDate}-to-${endDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Report exported successfully');
  };

  const totalRevenue = bookings.reduce((sum, booking) => sum + Number(booking.massage_price), 0);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 
          className="text-4xl font-bold mb-2 text-gray-800"
          style={{ fontFamily: 'Archivo Black, sans-serif' }}
        >
          MIS Report
        </h2>
        <p className="text-gray-600">Management Information System - Booking Analytics</p>
      </div>

      {/* Date Filter Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg p-6 mb-6"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                required
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-2" />
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-end">
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Generate Report
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </form>
      </motion.div>

      {/* Summary Cards */}
      {bookings.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <motion.div
            key="total-bookings"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl"
          >
            <p className="text-blue-100 text-sm mb-2">Total Bookings</p>
            <p className="text-4xl font-bold">{bookings.length}</p>
          </motion.div>

          <motion.div
            key="total-revenue"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl"
          >
            <p className="text-green-100 text-sm mb-2">Total Revenue</p>
            <p className="text-4xl font-bold">₹{totalRevenue.toLocaleString()}</p>
          </motion.div>

          <motion.div
            key="avg-booking"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl"
          >
            <p className="text-purple-100 text-sm mb-2">Average Booking</p>
            <p className="text-4xl font-bold">
              ₹{bookings.length > 0 ? Math.round(totalRevenue / bookings.length).toLocaleString() : 0}
            </p>
          </motion.div>
        </div>
      )}

      {/* Export Button */}
      {bookings.length > 0 && (
        <div className="mb-6 flex justify-end">
          <motion.button
            onClick={handleExport}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Export to CSV
          </motion.button>
        </div>
      )}

      {/* Bookings Table */}
      {bookings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold">Trans ID</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Time</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Massage</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">City</th>
                  <th className="px-6 py-4 text-right text-sm font-bold">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookings.map((booking, index) => (
                  <motion.tr
                    key={booking.trans_id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-blue-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      #{booking.trans_id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(booking.booking_date).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {booking.booking_time}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{booking.customer_name}</div>
                      <div className="text-xs text-gray-500">{booking.customer_email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {booking.customer_phone}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{booking.massage_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                        {booking.massage_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {booking.city}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="text-sm font-bold text-green-600">
                        ₹{Number(booking.massage_price).toLocaleString()}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr key="total-footer">
                  <td colSpan={8} className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                    Total Revenue:
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-lg font-bold text-green-600">
                      ₹{totalRevenue.toLocaleString()}
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </motion.div>
      )}

      {/* No Data Message */}
      {!isLoading && bookings.length === 0 && (startDate || endDate) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl shadow-lg p-12 text-center"
        >
          <p className="text-gray-500 text-lg">No bookings found for the selected date range</p>
          <p className="text-gray-400 text-sm mt-2">Try selecting different dates</p>
        </motion.div>
      )}
    </div>
  );
}