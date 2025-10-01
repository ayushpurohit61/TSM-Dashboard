import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Edit,
  Trash2,
  Search,
} from 'lucide-react';

// Fix for default markers in Leaflet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Vehicle {
  id: number;
  vehicleId: string;
  type: string;
  model: string;
  year: number;
  registration: string;
  capacity: number;
  fuelType: string;
  status: string;
  location: string;
  lat: number;
  lng: number;
  driverName: string;
  driverContact: string;
  licenseValidity: string;
  route: string;
  tripId: string;
  cargoType: string;
  eta: string;
  deliveryStatus: string;
  insuranceExpiry: string;
  pollutionCheck: string;
  lastService: string;
  nextService: string;
}

const FleetPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: 1,
      vehicleId: 'V001',
      type: 'Truck',
      model: 'Tata Ace',
      year: 2020,
      registration: 'DL01AB1234',
      capacity: 1000,
      fuelType: 'Diesel',
      status: 'Active',
      location: 'Delhi',
      lat: 28.6139,
      lng: 77.2090,
      driverName: 'Rajesh Kumar',
      driverContact: '+91-9876543210',
      licenseValidity: '2025-12-31',
      route: 'Delhi → Mumbai',
      tripId: 'T001',
      cargoType: 'Goods',
      eta: '2024-10-02 14:00',
      deliveryStatus: 'On-Time',
      insuranceExpiry: '2025-06-15',
      pollutionCheck: '2024-12-01',
      lastService: '2024-08-15',
      nextService: '2024-11-15',
    },
    {
      id: 2,
      vehicleId: 'V002',
      type: 'Van',
      model: 'Mahindra Bolero',
      year: 2019,
      registration: 'MH02CD5678',
      capacity: 500,
      fuelType: 'Diesel',
      status: 'Maintenance',
      location: 'Mumbai',
      lat: 19.0760,
      lng: 72.8777,
      driverName: 'Amit Singh',
      driverContact: '+91-9876543211',
      licenseValidity: '2025-11-20',
      route: 'Mumbai → Pune',
      tripId: 'T002',
      cargoType: 'Fragile',
      eta: '2024-10-01 16:00',
      deliveryStatus: 'Delayed',
      insuranceExpiry: '2025-07-10',
      pollutionCheck: '2024-11-15',
      lastService: '2024-07-20',
      nextService: '2024-10-20',
    },
    {
      id: 3,
      vehicleId: 'V003',
      type: 'Container',
      model: 'Ashok Leyland',
      year: 2021,
      registration: 'KA03EF9012',
      capacity: 2000,
      fuelType: 'Diesel',
      status: 'In Transit',
      location: 'Bangalore',
      lat: 12.9716,
      lng: 77.5946,
      driverName: 'Vikram Singh',
      driverContact: '+91-9876543212',
      licenseValidity: '2026-01-15',
      route: 'Bangalore → Chennai',
      tripId: 'T003',
      cargoType: 'Electronics',
      eta: '2024-10-03 10:00',
      deliveryStatus: 'On-Time',
      insuranceExpiry: '2025-08-20',
      pollutionCheck: '2024-12-10',
      lastService: '2024-09-01',
      nextService: '2024-12-01',
    },
    {
      id: 4,
      vehicleId: 'V004',
      type: 'Truck',
      model: 'Mahindra Scorpio',
      year: 2018,
      registration: 'TN04GH3456',
      capacity: 800,
      fuelType: 'Petrol',
      status: 'Idle',
      location: 'Chennai',
      lat: 13.0827,
      lng: 80.2707,
      driverName: 'Suresh Babu',
      driverContact: '+91-9876543213',
      licenseValidity: '2025-09-30',
      route: 'Chennai → Hyderabad',
      tripId: 'T004',
      cargoType: 'Machinery',
      eta: '2024-10-04 12:00',
      deliveryStatus: 'Pending',
      insuranceExpiry: '2025-05-25',
      pollutionCheck: '2024-10-20',
      lastService: '2024-06-15',
      nextService: '2024-09-15',
    },
    {
      id: 5,
      vehicleId: 'V005',
      type: 'Van',
      model: 'Tata Sumo',
      year: 2022,
      registration: 'UP05IJ7890',
      capacity: 600,
      fuelType: 'Diesel',
      status: 'Active',
      location: 'Delhi',
      lat: 28.6139,
      lng: 77.2090,
      driverName: 'Ravi Kumar',
      driverContact: '+91-9876543214',
      licenseValidity: '2026-03-10',
      route: 'Delhi → Jaipur',
      tripId: 'T005',
      cargoType: 'Textiles',
      eta: '2024-10-05 15:00',
      deliveryStatus: 'On-Time',
      insuranceExpiry: '2025-11-05',
      pollutionCheck: '2024-11-30',
      lastService: '2024-08-20',
      nextService: '2024-11-20',
    },
  ]);

  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: '',
    location: '',
    driver: '',
  });

  const [sortConfig, setSortConfig] = useState<{ key: keyof Vehicle; direction: 'asc' | 'desc' } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState<Partial<Vehicle>>({});

  // Filtered and sorted vehicles
  const filteredVehicles = useMemo(() => {
    const filtered = vehicles.filter((v) => {
      return (
        (filters.search === '' ||
          v.vehicleId.toLowerCase().includes(filters.search.toLowerCase()) ||
          v.driverName.toLowerCase().includes(filters.search.toLowerCase()) ||
          v.location.toLowerCase().includes(filters.search.toLowerCase())) &&
        (filters.type === '' || v.type === filters.type) &&
        (filters.status === '' || v.status === filters.status) &&
        (filters.location === '' || v.location === filters.location) &&
        (filters.driver === '' || v.driverName.toLowerCase().includes(filters.driver.toLowerCase()))
      );
    });

    if (sortConfig) {
      filtered.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [vehicles, filters, sortConfig]);

  // Stats
  const stats = useMemo(() => {
    const total = vehicles.length;
    const active = vehicles.filter((v) => v.status === 'Active').length;
    const inTransit = vehicles.filter((v) => v.status === 'In Transit').length;
    const maintenance = vehicles.filter((v) => v.status === 'Maintenance').length;
    const idle = vehicles.filter((v) => v.status === 'Idle').length;
    return { total, active, inTransit, maintenance, idle };
  }, [vehicles]);

  // Chart data
  const statusData = [
    { name: 'Active', value: stats.active, color: '#10B981' },
    { name: 'In Transit', value: stats.inTransit, color: '#3B82F6' },
    { name: 'Maintenance', value: stats.maintenance, color: '#F59E0B' },
    { name: 'Idle', value: stats.idle, color: '#EF4444' },
  ];

  const efficiencyData = [
    { month: 'Jan', efficiency: 85 },
    { month: 'Feb', efficiency: 88 },
    { month: 'Mar', efficiency: 92 },
    { month: 'Apr', efficiency: 87 },
    { month: 'May', efficiency: 90 },
    { month: 'Jun', efficiency: 93 },
  ];

  // Handle sort
  const handleSort = (key: keyof Vehicle) => {
    setSortConfig((prev) => ({
      key,
      direction: prev?.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };




  // Handle edit vehicle
  const handleEditVehicle = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData(vehicle);
    setShowAddModal(true);
  };

  // Handle delete vehicle
  const handleDeleteVehicle = (id: number) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      setVehicles(vehicles.filter(v => v.id !== id));
    }
  };

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVehicle) {
      setVehicles(vehicles.map(v => v.id === editingVehicle.id ? { ...formData, id: editingVehicle.id } as Vehicle : v));
    } else {
      const newId = Math.max(...vehicles.map(v => v.id)) + 1;
      setVehicles([...vehicles, { ...formData, id: newId } as Vehicle]);
    }
    setShowAddModal(false);
    setEditingVehicle(null);
    setFormData({});
  };

  // Handle close modal
  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingVehicle(null);
    setFormData({});
  };

  // Get lat/lng based on location
  const getLatLng = (location: string) => {
    const locations: { [key: string]: [number, number] } = {
      Delhi: [28.6139, 77.2090],
      Mumbai: [19.0760, 72.8777],
      Chennai: [13.0827, 80.2707],
      Bangalore: [12.9716, 77.5946],
    };
    return locations[location] || [0, 0];
  };

  // Handle form change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let updatedFormData = { ...formData, [name]: value };
    if (name === 'location') {
      const [lat, lng] = getLatLng(value);
      updatedFormData = { ...updatedFormData, lat, lng };
    }
    setFormData(updatedFormData);
  };

  // Export CSV helper
  const exportCSV = () => {
    const headers = [
      'Vehicle ID', 'Type', 'Model', 'Year', 'Registration', 'Capacity', 'Fuel Type', 'Status',
      'Location', 'Driver Name', 'Driver Contact', 'License Validity', 'Route', 'Trip ID',
      'Cargo Type', 'ETA', 'Delivery Status', 'Insurance Expiry', 'Pollution Check',
      'Last Service', 'Next Service'
    ];
    const rows = filteredVehicles.map(v => [
      v.vehicleId, v.type, v.model, v.year, v.registration, v.capacity, v.fuelType, v.status,
      v.location, v.driverName, v.driverContact, v.licenseValidity, v.route, v.tripId,
      v.cargoType, v.eta, v.deliveryStatus, v.insuranceExpiry, v.pollutionCheck,
      v.lastService, v.nextService
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "fleet_vehicles.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 text-gray-900">
      {/* Buttons top right */}
      <div className="flex justify-end mb-4 space-x-2">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Add Vehicle
        </button>
        <button
          onClick={exportCSV}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Export CSV
        </button>
      </div>

      {/* Stats Cards */}  
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-4 hover:shadow-lg transition">
          <h3 className="text-lg font-semibold">Total Vehicles</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-4 hover:shadow-lg transition">
          <h3 className="text-lg font-semibold">Active</h3>
          <p className="text-3xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-4 hover:shadow-lg transition">
          <h3 className="text-lg font-semibold">In Transit</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.inTransit}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-4 hover:shadow-lg transition">
          <h3 className="text-lg font-semibold">Maintenance</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.maintenance}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-4 hover:shadow-lg transition">
          <h3 className="text-lg font-semibold">Idle</h3>
          <p className="text-3xl font-bold text-red-600">{stats.idle}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-4">Fleet Status Distribution</h3>
          <PieChart width={400} height={300}>
            <Pie
              data={statusData}
              cx={200}
              cy={150}
              labelLine={false}
              label={({ name, percent }) => `${name} ${((percent as number) * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-4">
          <h3 className="text-lg font-semibold mb-4">Fleet Efficiency Trend</h3>
          <LineChart width={400} height={300} data={efficiencyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="efficiency" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Vehicle ID, Driver, Location..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              />
            </div>
          </div>
          <select
            className="border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            aria-label="Filter by vehicle type"
          >
            <option value="">All Types</option>
            <option value="Truck">Truck</option>
            <option value="Van">Van</option>
            <option value="Container">Container</option>
          </select>
          <select
            className="border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            aria-label="Filter by vehicle status"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="In Transit">In Transit</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Idle">Idle</option>
          </select>
          <select
            className="border rounded-lg px-3 py-2 dark:bg-gray-700 dark:border-gray-600"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            aria-label="Filter by vehicle location"
          >
            <option value="">All Locations</option>
            <option value="Delhi">Delhi</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Chennai">Chennai</option>
            <option value="Bangalore">Bangalore</option>
          </select>
        </div>
      </div>

      {/* Map */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-4 mb-6">
        <h3 className="text-lg font-semibold mb-4">Live Fleet Locations</h3>
        <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '400px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {filteredVehicles.map((vehicle) => (
            <Marker key={vehicle.id} position={[vehicle.lat, vehicle.lng]}>
              <Popup>
                <div>
                  <h4 className="font-semibold">{vehicle.vehicleId} - {vehicle.type}</h4>
                  <p>Driver: {vehicle.driverName}</p>
                  <p>Status: {vehicle.status}</p>
                  <p>Location: {vehicle.location}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Vehicle Table */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-4 overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4">Vehicles</h3>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-left text-sm">
              <th className="p-2 cursor-pointer" onClick={() => handleSort('vehicleId')}>
                Vehicle ID {sortConfig?.key === 'vehicleId' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="p-2 cursor-pointer" onClick={() => handleSort('type')}>Type</th>
              <th className="p-2 cursor-pointer" onClick={() => handleSort('status')}>Status</th>
              <th className="p-2 cursor-pointer" onClick={() => handleSort('location')}>Location</th>
              <th className="p-2 cursor-pointer" onClick={() => handleSort('driverName')}>Driver</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVehicles.map((v) => (
              <tr key={v.id} className="border-t hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                <td className="p-2">{v.vehicleId}</td>
                <td className="p-2">{v.type}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    v.status === 'Active' ? 'bg-green-100 text-green-800' :
                    v.status === 'In Transit' ? 'bg-blue-100 text-blue-800' :
                    v.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {v.status}
                  </span>
                </td>
                <td className="p-2">{v.location}</td>
                <td className="p-2">{v.driverName}</td>
                <td className="p-2 flex space-x-2">
                  <button onClick={() => handleEditVehicle(v)} className="text-blue-600 hover:text-blue-800 transition" aria-label="Edit vehicle">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeleteVehicle(v.id)} className="text-red-600 hover:text-red-800 transition" aria-label="Delete vehicle">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredVehicles.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No vehicles found</p>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">{editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Vehicle ID</label>
                <input
                  type="text"
                  name="vehicleId"
                  value={formData.vehicleId || ''}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Enter vehicle ID"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  name="type"
                  value={formData.type || ''}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  aria-label="Select vehicle type"
                  required
                >
                  <option value="">Select Type</option>
                  <option value="Truck">Truck</option>
                  <option value="Van">Van</option>
                  <option value="Container">Container</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Model</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model || ''}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Enter vehicle model"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Year</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year || ''}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Enter manufacturing year"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Registration</label>
                <input
                  type="text"
                  name="registration"
                  value={formData.registration || ''}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Enter registration number"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Capacity (kg)</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity || ''}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Enter capacity in kg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Fuel Type</label>
                <select
                  name="fuelType"
                  value={formData.fuelType || ''}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  aria-label="Select fuel type"
                  required
                >
                  <option value="">Select Fuel Type</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Petrol">Petrol</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status || ''}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  aria-label="Select vehicle status"
                  required
                >
                  <option value="Active">Active</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Idle">Idle</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <select
                  name="location"
                  value={formData.location || ''}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  aria-label="Select vehicle location"
                  required
                >
                  <option value="">Select Location</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Bangalore">Bangalore</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Driver Name</label>
                <input
                  type="text"
                  name="driverName"
                  value={formData.driverName || ''}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Enter driver name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Driver Contact</label>
                <input
                  type="text"
                  name="driverContact"
                  value={formData.driverContact || ''}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Enter driver contact"
                  required
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  {editingVehicle ? 'Update' : 'Add'} Vehicle
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FleetPage;
