'use client';

import { useState, useEffect } from 'react';
import SidebarAdmin from '@/components/ui/sidebar_admin';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

interface FotoList {
  id: number;
  path: string;
}

interface Produk {
  id: number;
  nama_produk: string;
  kategori_id: number;
  nama_kategori?: string;
  deskripsi: string;
  harga: string;
  kontak: string;
  foto_produk?: string;
  foto_list?: FotoList[];
  status: 'menunggu' | 'diterima' | 'ditolak';
  alasan_penolakan?: string;
  penyedia_name: string;
  penyedia_email: string;
  created_at: string;
}

const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

function DetailProdukPage({ product, onBack, onVerify, onReject }: any) {
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    
    setSubmitting(true);
    try {
      await onReject(product.id, rejectReason);
      setShowRejectForm(false);
      setRejectReason('');
    } finally {
      setSubmitting(false);
    }
  };

  const mainImage = product.foto_produk 
    ? `${API_URL}/${product.foto_produk}` 
    : (product.foto_list && product.foto_list.length > 0)
      ? `${API_URL}/${product.foto_list[0].path}`
      : null;

  const allImages = product.foto_list && product.foto_list.length > 0
    ? product.foto_list.map((f: FotoList) => `${API_URL}/${f.path}`)
    : mainImage ? [mainImage] : [];

  return (
    <div style={{ flex: 1, padding: '24px', overflow: 'auto' }}>
      <button
        onClick={onBack}
        style={{
          marginBottom: '16px',
          padding: '10px 20px',
          backgroundColor: '#64748B',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        ← Kembali
      </button>

      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: '#1F4E73' }}>
          Detail Produk
        </h1>

        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
          <div style={{ flexShrink: 0 }}>
            {allImages.length > 0 ? (
              <div>
                <img
                  src={allImages[currentImageIndex]}
                  alt={product.nama_produk}
                  style={{ width: '320px', height: '320px', borderRadius: '12px', objectFit: 'cover', marginBottom: '12px' }}
                />
                
                {allImages.length > 1 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {allImages.map((img: string, idx: number) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Foto ${idx + 1}`}
                        onClick={() => setCurrentImageIndex(idx)}
                        style={{
                          width: '70px',
                          height: '70px',
                          borderRadius: '8px',
                          objectFit: 'cover',
                          cursor: 'pointer',
                          border: currentImageIndex === idx ? '3px solid #1F4E73' : '2px solid #E2E8F0'
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                width: '320px',
                height: '320px',
                borderRadius: '12px',
                backgroundColor: '#E8F5E9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '64px'
              }}>
                📦
              </div>
            )}
          </div>

          <div style={{ flex: 1, minWidth: '300px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '12px', color: '#1F4E73' }}>
              {product.nama_produk}
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <div>
                <span style={{ color: '#64748B' }}>Kategori: </span>
                <span style={{ fontWeight: '600' }}>{product.nama_kategori || 'Tanpa Kategori'}</span>
              </div>
              
              <div>
                <span style={{ color: '#64748B' }}>Harga: </span>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F4E73' }}>
                  Rp {parseFloat(product.harga).toLocaleString('id-ID')}
                </span>
              </div>
              
              <div>
                <span style={{ color: '#64748B' }}>Kontak: </span>
                <span style={{ fontWeight: '600' }}>{product.kontak}</span>
              </div>

              <div>
                <span style={{ color: '#64748B' }}>Penyedia: </span>
                <span style={{ fontWeight: '600' }}>{product.penyedia_name}</span>
                <span style={{ color: '#64748B', marginLeft: '8px' }}>({product.penyedia_email})</span>
              </div>

              <div>
                <span style={{ color: '#64748B' }}>Status: </span>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: '600',
                  backgroundColor: product.status === 'diterima' ? '#4CAF50' : product.status === 'menunggu' ? '#FF9800' : '#F44336',
                  color: 'white',
                  marginLeft: '8px'
                }}>
                  {product.status === 'diterima' ? 'Terverifikasi' : product.status === 'menunggu' ? 'Menunggu' : 'Ditolak'}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: '#64748B', fontWeight: '600', marginBottom: '8px' }}>Deskripsi:</h3>
              <p style={{ color: '#334155', lineHeight: '1.6' }}>{product.deskripsi}</p>
            </div>

            {product.alasan_penolakan && (
              <div style={{
                marginBottom: '24px',
                padding: '16px',
                backgroundColor: '#FFEBEE',
                border: '1px solid #FFCDD2',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
                  <div style={{ color: '#F44336', marginTop: '2px' }}>⚠️</div>
                  <div>
                    <h3 style={{ fontWeight: '600', color: '#D32F2F', marginBottom: '4px' }}>
                      Alasan Penolakan:
                    </h3>
                    <p style={{ color: '#C62828' }}>{product.alasan_penolakan}</p>
                  </div>
                </div>
              </div>
            )}

            {product.status === 'menunggu' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  onClick={() => onVerify(product.id)}
                  disabled={submitting}
                  style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: submitting ? '#ccc' : '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    fontWeight: '600',
                    fontSize: '15px'
                  }}
                >
                  ✓ Verifikasi Produk
                </button>

                {!showRejectForm ? (
                  <button
                    onClick={() => setShowRejectForm(true)}
                    disabled={submitting}
                    style={{
                      width: '100%',
                      padding: '14px',
                      backgroundColor: submitting ? '#ccc' : '#F44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: submitting ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                      fontSize: '15px'
                    }}
                  >
                    ✗ Tolak Produk
                  </button>
                ) : (
                  <div style={{
                    padding: '16px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '8px'
                  }}>
                    <label style={{
                      display: 'block',
                      color: '#1F4E73',
                      fontWeight: '600',
                      marginBottom: '8px'
                    }}>
                      Alasan Penolakan:
                    </label>
                    <textarea
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="Tuliskan alasan penolakan produk..."
                      style={{
                        width: '100%',
                        padding: '12px',
                        border: '1px solid #CBD5E1',
                        borderRadius: '8px',
                        marginBottom: '12px',
                        minHeight: '100px',
                        boxSizing: 'border-box',
                        fontSize: '14px'
                      }}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={handleReject}
                        disabled={!rejectReason.trim() || submitting}
                        style={{
                          flex: 1,
                          padding: '10px',
                          backgroundColor: !rejectReason.trim() || submitting ? '#ccc' : '#F44336',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: !rejectReason.trim() || submitting ? 'not-allowed' : 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        {submitting ? 'Mengirim...' : 'Konfirmasi Tolak'}
                      </button>
                      <button
                        onClick={() => {
                          setShowRejectForm(false);
                          setRejectReason('');
                        }}
                        disabled={submitting}
                        style={{
                          flex: 1,
                          padding: '10px',
                          backgroundColor: '#E2E8F0',
                          color: '#475569',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: submitting ? 'not-allowed' : 'pointer'
                        }}
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function KatalogProdukAdminPage() {
  const [products, setProducts] = useState<Produk[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Produk | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Semua');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      const response = await fetch(`${API_URL}/api/admin/produk`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      console.log('Admin products data:', data);
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Gagal mengambil data produk');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = getToken();
      
      const response = await fetch(`${API_URL}/api/admin/produk/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menghapus produk');
      }

      alert('Produk berhasil dihapus');
      setShowDeleteConfirm(null);
      if (selectedProduct?.id === id) {
        setSelectedProduct(null);
      }
      fetchProducts();
    } catch (error: any) {
      console.error('Error deleting:', error);
      alert(error.message || 'Gagal menghapus produk');
    }
  };

  const handleVerify = async (id: number) => {
    try {
      const token = getToken();
      
      const response = await fetch(`${API_URL}/api/admin/produk/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal memverifikasi produk');
      }

      alert('Produk berhasil diverifikasi!');
      setSelectedProduct(null);
      fetchProducts();
    } catch (error: any) {
      console.error('Error verifying:', error);
      alert(error.message || 'Gagal memverifikasi produk');
    }
  };

  const handleReject = async (id: number, reason: string) => {
    try {
      const token = getToken();
      
      const response = await fetch(`${API_URL}/api/admin/produk/${id}/reject`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ alasan_penolakan: reason }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menolak produk');
      }

      alert('Produk ditolak!');
      setSelectedProduct(null);
      fetchProducts();
    } catch (error: any) {
      console.error('Error rejecting:', error);
      alert(error.message || 'Gagal menolak produk');
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch = p.nama_produk.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       p.deskripsi.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       p.penyedia_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = selectedStatus === 'Semua' || 
                       (selectedStatus === 'Menunggu' && p.status === 'menunggu') ||
                       (selectedStatus === 'Terverifikasi' && p.status === 'diterima') ||
                       (selectedStatus === 'Ditolak' && p.status === 'ditolak');
    return matchSearch && matchStatus;
  });

  const stats = {
    total: products.length,
    pending: products.filter(p => p.status === 'menunggu').length,
    verified: products.filter(p => p.status === 'diterima').length,
    rejected: products.filter(p => p.status === 'ditolak').length,
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <SidebarAdmin />
        <div style={{ marginLeft: 'var(--sidebar-width, 16rem)', flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ fontSize: '24px', color: '#1F4E73' }}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
    <SidebarAdmin />

    <main className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-8">
        {selectedProduct ? (
          <DetailProdukPage
            product={selectedProduct}
            onBack={() => setSelectedProduct(null)}
            onVerify={handleVerify}
            onReject={handleReject}
          />
        ) : (
          <div style={{ flex: 1, padding: '24px', overflow: 'auto' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '24px', color: '#1F4E73' }}>
              Katalog Produk Admin
            </h1>

            {/* Statistics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div 
                onClick={() => setSelectedStatus('Semua')}
                style={{ 
                  padding: '20px', 
                  backgroundColor: 'white', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
                  borderRadius: '12px',
                  cursor: 'pointer',
                  border: selectedStatus === 'Semua' ? '2px solid #1F4E73' : '2px solid transparent',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
              >
                <h3 style={{ color: '#64748B', fontSize: '14px', marginBottom: '8px' }}>Jumlah Produk</h3>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#1F4E73' }}>{stats.total}</p>
              </div>
              <div 
                onClick={() => setSelectedStatus('Menunggu')}
                style={{ 
                  padding: '20px', 
                  backgroundColor: 'white', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
                  borderRadius: '12px',
                  cursor: 'pointer',
                  border: selectedStatus === 'Menunggu' ? '2px solid #FF9800' : '2px solid transparent',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
              >
                <h3 style={{ color: '#64748B', fontSize: '14px', marginBottom: '8px' }}>Menunggu Verifikasi</h3>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#FF9800' }}>{stats.pending}</p>
              </div>
              <div 
                onClick={() => setSelectedStatus('Terverifikasi')}
                style={{ 
                  padding: '20px', 
                  backgroundColor: 'white', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
                  borderRadius: '12px',
                  cursor: 'pointer',
                  border: selectedStatus === 'Terverifikasi' ? '2px solid #4CAF50' : '2px solid transparent',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
              >
                <h3 style={{ color: '#64748B', fontSize: '14px', marginBottom: '8px' }}>Terverifikasi</h3>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#4CAF50' }}>{stats.verified}</p>
              </div>
              <div 
                onClick={() => setSelectedStatus('Ditolak')}
                style={{ 
                  padding: '20px', 
                  backgroundColor: 'white', 
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
                  borderRadius: '12px',
                  cursor: 'pointer',
                  border: selectedStatus === 'Ditolak' ? '2px solid #F44336' : '2px solid transparent',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
              >
                <h3 style={{ color: '#64748B', fontSize: '14px', marginBottom: '8px' }}>Ditolak</h3>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#F44336' }}>{stats.rejected}</p>
              </div>
            </div>

            {/* Product List */}
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#1F4E73' }}>
                Daftar Produk
              </h2>

              {/* Filters */}
              <div style={{ marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input
                  type="text"
                  placeholder="Cari produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: '600', color: '#475569' }}>Status:</span>
                  {['Semua', 'Menunggu', 'Terverifikasi', 'Ditolak'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: selectedStatus === status ? '#1F4E73' : '#E2E8F0',
                        color: selectedStatus === status ? 'white' : '#475569',
                        cursor: 'pointer',
                        fontWeight: '500',
                        fontSize: '14px'
                      }}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                <p style={{ fontSize: '13px', color: '#64748B' }}>
                  Menampilkan {filteredProducts.length} dari {products.length} produk
                </p>
              </div>

              {/* Product Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {filteredProducts.map((p) => {
                  const mainImage = p.foto_produk 
                    ? `${API_URL}/${p.foto_produk}` 
                    : (p.foto_list && p.foto_list.length > 0)
                      ? `${API_URL}/${p.foto_list[0].path}`
                      : null;

                  return (
                    <div
                      key={p.id}
                      style={{
                        padding: '16px',
                        border: '1px solid #E2E8F0',
                        borderRadius: '12px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        transition: 'box-shadow 0.2s',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                      }}
                    >
                      {mainImage ? (
                        <img
                          src={mainImage}
                          alt={p.nama_produk}
                          onClick={() => setSelectedProduct(p)}
                          style={{
                            width: '100%',
                            height: '160px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            marginBottom: '12px',
                            cursor: 'pointer'
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '160px',
                          backgroundColor: '#E8F5E9',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '48px',
                          marginBottom: '12px'
                        }}>
                          📦
                        </div>
                      )}
                      
                      <h3 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px', color: '#1F4E73' }}>
                        {p.nama_produk}
                      </h3>
                      <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>
                        {p.nama_kategori || 'Tanpa Kategori'}
                      </p>
                      <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '8px' }}>
                        Penyedia: {p.penyedia_name}
                      </p>
                      <p style={{ fontWeight: '600', marginBottom: '8px', color: '#1F4E73' }}>
                        Rp {parseFloat(p.harga).toLocaleString('id-ID')}
                      </p>

                      <span style={{
                        display: 'inline-block',
                        marginTop: '8px',
                        padding: '4px 12px',
                        fontSize: '11px',
                        borderRadius: '20px',
                        fontWeight: '600',
                        backgroundColor: p.status === 'diterima' ? '#4CAF50' : p.status === 'menunggu' ? '#FF9800' : '#F44336',
                        color: 'white'
                      }}>
                        {p.status === 'diterima' ? 'Terverifikasi' : p.status === 'menunggu' ? 'Menunggu' : 'Ditolak'}
                      </span>

                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                        <button
                          onClick={() => setSelectedProduct(p)}
                          style={{
                            flex: 1,
                            padding: '8px',
                            backgroundColor: '#1F4E73',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '13px',
                            fontWeight: '500'
                          }}
                        >
                          👁️ Detail
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(p.id)}
                          style={{
                            padding: '8px 12px',
                            backgroundColor: '#F44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '13px'
                          }}
                        >
                          🗑️
                        </button>
                      </div>

                      {showDeleteConfirm === p.id && (
                        <div style={{
                          marginTop: '12px',
                          padding: '12px',
                          backgroundColor: '#FFEBEE',
                          border: '1px solid #FFCDD2',
                          borderRadius: '8px'
                        }}>
                          <p style={{ fontSize: '13px', color: '#D32F2F', marginBottom: '8px' }}>
                            Hapus produk ini?
                          </p>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => handleDelete(p.id)}
                              style={{
                                flex: 1,
                                padding: '6px',
                                backgroundColor: '#F44336',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: '500'
                              }}
                            >
                              Ya, Hapus
                            </button>
                            <button
                              onClick={() => setShowDeleteConfirm(null)}
                              style={{
                                flex: 1,
                                padding: '6px',
                                backgroundColor: '#E2E8F0',
                                color: '#475569',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '12px'
                              }}
                            >
                              Batal
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              

              {filteredProducts.length === 0 && (
                <div style={{ textAlign: 'center', padding: '48px 16px', color: '#94A3B8' }}>
                  <div style={{ fontSize: '64px', marginBottom: '16px' }}>📦</div>
                  <div style={{ fontSize: '18px' }}>Tidak ada produk ditemukan</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
    </div>
  );
}