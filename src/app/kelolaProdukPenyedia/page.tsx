'use client';

import { useState, useEffect } from 'react';
import SidebarPenyedia from '@/components/ui/sidebar_penyedia';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4001';

interface ImageItem {
  id: number;
  file: File;
  preview: string;
}

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
  harga: number;
  kontak: string;
  foto_produk?: string;
  foto_list?: FotoList[];
  status: 'menunggu' | 'diterima' | 'ditolak';
  alasan_penolakan?: string;
  created_at: string;
}

interface Kategori {
  kategori_id: number;
  nama_kategori: string;
}

const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

function DetailProdukModal({ product, onClose, onEdit, onDelete }: any) {
  const canEdit = product.status === 'ditolak' || product.status === 'menunggu';
  const canDelete = product.status === 'ditolak' || product.status === 'menunggu';
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const allImages = product.foto_list && product.foto_list.length > 0
    ? product.foto_list.map((f: FotoList) => `${API_URL}/${f.path}`)
    : product.foto_produk ? [`${API_URL}/${product.foto_produk}`] : [];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px',
      overflow: 'auto'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '28px',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: 'none',
            backgroundColor: '#F1F5F9',
            color: '#64748B',
            cursor: 'pointer',
            fontSize: '20px',
            zIndex: 10
          }}
        >
          ×
        </button>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F4E73', marginBottom: '24px' }}>
          Detail Produk
        </h2>

        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <div style={{ flexShrink: 0 }}>
            {allImages.length > 0 ? (
              <div>
                <img
                  src={allImages[currentImageIndex]}
                  alt={product.nama_produk}
                  style={{ width: '280px', height: '280px', borderRadius: '12px', objectFit: 'cover', marginBottom: '12px' }}
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
                          width: '60px',
                          height: '60px',
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
                width: '280px',
                height: '280px',
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

          <div style={{ flex: 1, minWidth: '250px' }}>
            <h3 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px', color: '#1F4E73' }}>
              {product.nama_produk}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <span style={{ color: '#64748B', fontSize: '14px' }}>Kategori: </span>
                <span style={{ fontWeight: '600', fontSize: '14px' }}>{product.nama_kategori || 'Tanpa Kategori'}</span>
              </div>
              
              <div>
                <span style={{ color: '#64748B', fontSize: '14px' }}>Harga: </span>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#1F4E73' }}>
                Rp {Number(product.harga).toLocaleString('id-ID')}
                </span>
              </div>
              
              <div>
                <span style={{ color: '#64748B', fontSize: '14px' }}>Kontak: </span>
                <span style={{ fontWeight: '600', fontSize: '14px' }}>{product.kontak}</span>
              </div>

              <div>
                <span style={{ color: '#64748B', fontSize: '14px' }}>Status: </span>
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
                  {product.status === 'diterima' ? '✓ Terverifikasi' : product.status === 'menunggu' ? '⏳ Pending' : '✗ Ditolak'}
                </span>
              </div>

              <div style={{ marginTop: '8px' }}>
                <div style={{ color: '#64748B', fontWeight: '600', marginBottom: '8px', fontSize: '14px' }}>Deskripsi:</div>
                <p style={{ color: '#334155', lineHeight: '1.6', fontSize: '14px' }}>{product.deskripsi}</p>
              </div>

              {product.alasan_penolakan && (
                <div style={{
                  marginTop: '12px',
                  padding: '12px',
                  backgroundColor: '#FFEBEE',
                  border: '1px solid #FFCDD2',
                  borderRadius: '8px'
                }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#F44336', marginBottom: '4px' }}>
                    ✗ Alasan Penolakan:
                  </div>
                  <p style={{ fontSize: '13px', color: '#334155' }}>{product.alasan_penolakan}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: '2px solid #E2E8F0',
              backgroundColor: 'white',
              color: '#64748B',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Tutup
          </button>
          
          {canEdit && (
            <button
              onClick={() => onEdit(product)}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#1F4E73',
                color: 'white',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              ✏️ Edit Produk
            </button>
          )}
          
          {canDelete && (
            <button
              onClick={() => onDelete(product.id)}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#F44336',
                color: 'white',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              🗑️ Hapus
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function KatalogProdukPenyedia() {
  const [products, setProducts] = useState<Produk[]>([]);
  const [categories, setCategories] = useState<Kategori[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [statusFilter, setStatusFilter] = useState<string>('semua');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Produk | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    nama_produk: '',
    kategori_id: '',
    deskripsi: '',
    harga: '',
    kontak: '',
    images: [] as ImageItem[]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = getToken();
      
      const produkRes = await fetch(`${API_URL}/api/produk`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const kategoriRes = await fetch(`${API_URL}/api/kategori`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!produkRes.ok || !kategoriRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const produkData = await produkRes.json();
      const kategoriData = await kategoriRes.json();
      
      console.log('Produk data:', produkData);
      console.log('Kategori data:', kategoriData);
      
      setProducts(produkData);
      setCategories(kategoriData);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Gagal mengambil data. Silakan refresh halaman.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const remainingSlots = 10 - formData.images.length;
    const selectedFiles = Array.from(files).slice(0, remainingSlots);

    const newImages: ImageItem[] = selectedFiles.map((file) => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file),
    }));

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));

    e.target.value = '';
  };

  const removeImage = (id: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== id)
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      if (!formData.nama_produk || !formData.kategori_id || !formData.deskripsi || !formData.harga || !formData.kontak) {
        alert('Harap isi semua field!');
        return;
      }

      const token = getToken();
      const submitData = new FormData();
      submitData.append('nama_produk', formData.nama_produk);
      submitData.append('kategori_id', formData.kategori_id);
      submitData.append('deskripsi', formData.deskripsi);
      submitData.append('harga', formData.harga);
      submitData.append('kontak', formData.kontak);
      
      formData.images.forEach((img) => {
        submitData.append('foto_produk', img.file);
      });

      const response = await fetch(`${API_URL}/api/produk`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: submitData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menambahkan produk');
      }
      
      alert('Produk berhasil ditambahkan! Menunggu verifikasi admin.');
      setShowAddModal(false);
      setFormData({ 
        nama_produk: '', 
        kategori_id: '', 
        deskripsi: '', 
        harga: '', 
        kontak: '', 
        images: [] 
      });
      fetchData();
    } catch (error: any) {
      console.error('Error submitting:', error);
      alert(error.message || 'Gagal menambahkan produk');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!selectedProduct) return;
    
    try {
      setSubmitting(true);

      if (!formData.nama_produk || !formData.kategori_id || !formData.deskripsi || !formData.harga || !formData.kontak) {
        alert('Harap isi semua field!');
        return;
      }

      const token = getToken();
      const submitData = new FormData();
      submitData.append('nama_produk', formData.nama_produk);
      submitData.append('kategori_id', formData.kategori_id);
      submitData.append('deskripsi', formData.deskripsi);
      submitData.append('harga', formData.harga);
      submitData.append('kontak', formData.kontak);
      
      formData.images.forEach((img) => {
        submitData.append('foto_produk', img.file);
      });

      const response = await fetch(`${API_URL}/api/produk/${selectedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: submitData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal mengupdate produk');
      }
      
      alert('Produk berhasil diupdate!');
      setShowEditModal(false);
      setSelectedProduct(null);
      setFormData({ 
        nama_produk: '', 
        kategori_id: '', 
        deskripsi: '', 
        harga: '', 
        kontak: '', 
        images: [] 
      });
      fetchData();
    } catch (error: any) {
      console.error('Error updating:', error);
      alert(error.message || 'Gagal mengupdate produk');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return;

    try {
      const token = getToken();
      
      const response = await fetch(`${API_URL}/api/produk/${id}`, {
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
      setShowDetailModal(false);
      setSelectedProduct(null);
      fetchData();
    } catch (error: any) {
      console.error('Error deleting:', error);
      alert(error.message || 'Gagal menghapus produk');
    }
  };

  const openEditModal = (product: Produk) => {
    setSelectedProduct(product);
    setFormData({
      nama_produk: product.nama_produk,
      kategori_id: product.kategori_id.toString(),
      deskripsi: product.deskripsi,
      harga: String(product.harga),
      kontak: product.kontak,
      images: []
    });
    setShowDetailModal(false);
    setShowEditModal(true);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nama_produk.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'semua' || 
                           product.nama_kategori === selectedCategory;
    const matchesStatus = statusFilter === 'semua' || product.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    total: products.length,
    verified: products.filter(p => p.status === 'diterima').length,
    pending: products.filter(p => p.status === 'menunggu').length,
    rejected: products.filter(p => p.status === 'ditolak').length
  };

  const uniqueCategories = ['semua', ...Array.from(new Set(products.map(p => p.nama_kategori).filter(Boolean)))];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <div style={{ fontSize: '24px', color: '#1F4E73' }}>Loading...</div>
      </div>
    );
  }

  return (
  <div className="flex h-screen overflow-hidden">
    <SidebarPenyedia/>

    <main className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-8">
      
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1F4E73', marginBottom: '8px' }}>
          Katalog Produk Saya
        </h1>
        <p style={{ color: '#64748B', fontSize: '15px' }}>
          Kelola produk inovasi dan riset yang Anda tawarkan
        </p>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            marginTop: '16px',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#1F4E73',
            color: 'white',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px'
          }}
        >
          + Tambah Produk
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div 
          onClick={() => setStatusFilter('semua')}
          style={{ 
            backgroundColor: statusFilter === 'semua' ? '#1F4E73' : '#E2E8F0', 
            padding: '20px', 
            borderRadius: '12px', 
            color: statusFilter === 'semua' ? 'white' : '#1F4E73',
            cursor: 'pointer',
            transition: 'all 0.2s',
            border: statusFilter === 'semua' ? 'none' : '2px solid #CBD5E1'
          }}
        >
          <div style={{ fontSize: '13px', marginBottom: '8px', opacity: 0.9 }}>Total Produk</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{stats.total}</div>
        </div>
        <div 
          onClick={() => setStatusFilter('diterima')}
          style={{ 
            backgroundColor: statusFilter === 'diterima' ? '#1F4E73' : '#E2E8F0', 
            padding: '20px', 
            borderRadius: '12px', 
            color: statusFilter === 'diterima' ? 'white' : '#1F4E73',
            cursor: 'pointer',
            transition: 'all 0.2s',
            border: statusFilter === 'diterima' ? 'none' : '2px solid #CBD5E1'
          }}
        >
          <div style={{ fontSize: '13px', marginBottom: '8px', opacity: 0.9 }}>Terverifikasi</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{stats.verified}</div>
        </div>
        <div 
          onClick={() => setStatusFilter('menunggu')}
          style={{ 
            backgroundColor: statusFilter === 'menunggu' ? '#1F4E73' : '#E2E8F0',  
            padding: '20px', 
            borderRadius: '12px', 
            color: statusFilter === 'menunggu' ? 'white' : '#1F4E73',
            cursor: 'pointer',
            transition: 'all 0.2s',
            border: statusFilter === 'menunggu' ? 'none' : '2px solid #CBD5E1'
          }}
        >
          <div style={{ fontSize: '13px', marginBottom: '8px', opacity: 0.9 }}>Pending Review</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{stats.pending}</div>
        </div>
        <div 
          onClick={() => setStatusFilter('ditolak')}
          style={{ 
            backgroundColor: statusFilter === 'ditolak' ? '#1F4E73' : '#E2E8F0',  
            padding: '20px', 
            borderRadius: '12px', 
            color: statusFilter === 'ditolak' ? 'white' : '#1F4E73',
            cursor: 'pointer',
            transition: 'all 0.2s',
            border: statusFilter === 'ditolak' ? 'none' : '2px solid #CBD5E1'
          }}
        >
          <div style={{ fontSize: '13px', marginBottom: '8px', opacity: 0.9 }}>Perlu Perbaikan</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{stats.rejected}</div>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '12px', marginBottom: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {uniqueCategories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat!)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: selectedCategory === cat ? '#1F4E73' : '#E2E8F0',
                color: selectedCategory === cat ? 'white' : '#1F4E73',
                cursor: 'pointer',
                fontWeight: '500',
                textTransform: 'capitalize'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="🔍 Cari produk..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '14px 16px',
            borderRadius: '8px',
            border: '2px solid #E2E8F0',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {filteredProducts.map(product => {
          const mainImage = product.foto_produk 
            ? `${API_URL}/${product.foto_produk}` 
            : (product.foto_list && product.foto_list.length > 0)
              ? `${API_URL}/${product.foto_list[0].path}`
              : null;

          return (
            <div 
              key={product.id} 
              style={{ 
                backgroundColor: 'white', 
                borderRadius: '12px', 
                overflow: 'hidden', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)', 
                position: 'relative',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onClick={() => {
                setSelectedProduct(product);
                setShowDetailModal(true);
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10 }}>
                <div style={{
                  padding: '6px 12px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: '600',
                  backgroundColor: product.status === 'diterima' ? '#4CAF50' : product.status === 'menunggu' ? '#FF9800' : '#F44336',
                  color: 'white'
                }}>
                  {product.status === 'diterima' ? '✓ Terverifikasi' : product.status === 'menunggu' ? '⏳ Pending' : '✗ Ditolak'}
                </div>
              </div>

              <div style={{ width: '100%', height: '180px', backgroundColor: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {mainImage ? (
                  <img src={mainImage} alt={product.nama_produk} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ fontSize: '64px' }}>📦</div>
                )}
              </div>

              <div style={{ padding: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1F4E73', marginBottom: '8px' }}>
                  {product.nama_produk}
                </h3>
                
                <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>
                  📂 {product.nama_kategori || 'Tanpa Kategori'}
                </div>
                
                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1F4E73', marginBottom: '12px' }}>
                Rp {Number(product.harga).toLocaleString('id-ID')}
                </div>

                <p style={{ fontSize: '14px', color: '#334155', marginBottom: '12px', lineHeight: '1.5' }}>
                  {product.deskripsi.length > 100 ? product.deskripsi.substring(0, 100) + '...' : product.deskripsi}
                </p>

                {product.alasan_penolakan && (
                  <div style={{
                    backgroundColor: '#FFEBEE',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '16px'
                  }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#F44336', marginBottom: '4px' }}>
                      ✗ Catatan Admin
                    </div>
                    <div style={{ fontSize: '13px', color: '#334155' }}>
                      {product.alasan_penolakan.length > 80 ? product.alasan_penolakan.substring(0, 80) + '...' : product.alasan_penolakan}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '64px 16px', color: '#94A3B8' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>📦</div>
          <div style={{ fontSize: '18px' }}>Tidak ada produk ditemukan</div>
        </div>
      )}

      {showDetailModal && selectedProduct && (
        <DetailProdukModal
          product={selectedProduct}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedProduct(null);
          }}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />
      )}

      
      {(showAddModal || showEditModal) && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '28px',
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative'
          }}>
            <button
              onClick={() => {
                setShowAddModal(false);
                setShowEditModal(false);
                setSelectedProduct(null);
                setFormData({ 
                  nama_produk: '', 
                  kategori_id: '', 
                  deskripsi: '', 
                  harga: '', 
                  kontak: '', 
                  images: [] 
                });
              }}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: '#F1F5F9',
                color: '#64748B',
                cursor: 'pointer',
                fontSize: '20px'
              }}
            >
              ×
            </button>

            

            <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1F4E73', marginBottom: '24px' }}>
              {showEditModal ? 'Edit Produk' : 'Tambah Produk Baru'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1F4E73', marginBottom: '8px' }}>
                  Nama Produk
                </label>
                <input
                  type="text"
                  value={formData.nama_produk}
                  onChange={(e) => setFormData({...formData, nama_produk: e.target.value})}
                  placeholder="Masukkan nama produk"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #E2E8F0',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1F4E73', marginBottom: '8px' }}>
                  Kategori
                </label>
                <select
                  value={formData.kategori_id}
                  onChange={(e) => setFormData({...formData, kategori_id: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #E2E8F0',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="">Pilih kategori</option>
                  {categories.map(cat => (
                    <option key={cat.kategori_id} value={cat.kategori_id}>
                      {cat.nama_kategori}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1F4E73', marginBottom: '8px' }}>
                  Deskripsi
                </label>
                <textarea
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                  placeholder="Jelaskan produk Anda..."
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #E2E8F0',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1F4E73', marginBottom: '8px' }}>
                  Harga
                </label>
                <input
  type="number"
  step="1"
  min="0"
  inputMode="numeric"
  value={formData.harga}
  onChange={(e) =>
    setFormData({
      ...formData,
      // hanya angka, buang titik & koma
      harga: e.target.value.replace(/\D/g, '')
    })
  }
  placeholder="0"
  style={{
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '2px solid #E2E8F0',
    fontSize: '14px',
    boxSizing: 'border-box'
  }}
/>

              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1F4E73', marginBottom: '8px' }}>
                  Kontak
                </label>
                <input
                  type="text"
                  value={formData.kontak}
                  onChange={(e) => setFormData({...formData, kontak: e.target.value})}
                  placeholder="Email atau nomor telepon"
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '8px',
                    border: '2px solid #E2E8F0',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1F4E73', marginBottom: '8px' }}>
                  Foto Produk ({formData.images.length}/5)
                </label>
                
                {formData.images.length > 0 && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
                    gap: '12px',
                    marginBottom: '12px'
                  }}>
                    {formData.images.map((image) => (
                      <div key={image.id} style={{
                        position: 'relative',
                        paddingTop: '100%',
                        borderRadius: '8px',
                        overflow: 'hidden'
                      }}>
                        <img
                          src={image.preview}
                          alt="Preview"
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        <button
                          onClick={() => removeImage(image.id)}
                          style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            border: 'none',
                            backgroundColor: '#F44336',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '16px'
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {formData.images.length < 5 && (
                  <label style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px',
                    borderRadius: '8px',
                    border: '2px dashed #CBD5E1',
                    cursor: 'pointer',
                    backgroundColor: '#F8FAFC'
                  }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>📸</div>
                    <div style={{ fontSize: '14px', color: '#64748B' }}>
                      Klik untuk upload foto
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setSelectedProduct(null);
                  setFormData({ 
                    nama_produk: '', 
                    kategori_id: '', 
                    deskripsi: '', 
                    harga: '', 
                    kontak: '', 
                    images: [] 
                  });
                }}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #E2E8F0',
                  backgroundColor: 'white',
                  color: '#64748B',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Batal
              </button>
              
              <button
                onClick={showEditModal ? handleEdit : handleSubmit}
                disabled={submitting}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: submitting ? '#ccc' : '#1F4E73',
                  color: 'white',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  fontWeight: '600'
                }}
              >
                {submitting ? 'Mengirim...' : showEditModal ? 'Update Produk' : 'Tambah Produk'}
              </button>
            </div>
          </div>
        </div>
      )}
        </div>
      </main>
    </div>
  );
}