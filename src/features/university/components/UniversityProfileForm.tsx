// components/university/UniversityProfileForm.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, X, Save } from 'lucide-react';
import { University } from '../types/university';
import logo from '@/assets/univ-guelma.png';

interface Props {
  university: University;
  saving: boolean;
  uploadingLogo: boolean;
  updateUniversity: (updates: Partial<University>) => Promise<void>;
  uploadLogo: (file: File) => Promise<void>;
  deleteLogo: () => void;
}

export default function UniversityProfileForm({
  university,
  saving,
  uploadingLogo,
  updateUniversity,
  uploadLogo,
  deleteLogo,
}: Props) {
  const [formData, setFormData] = useState({
    name: university.name,
    address: university.address,
    wilaya: university.wilaya,
    phone: university.phone,
    email: university.email,
    website: university.website || '',
    establishedYear: university.establishedYear || '',
    description: university.description || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUniversity({
      name: formData.name,
      address: formData.address,
      wilaya: formData.wilaya,
      phone: formData.phone,
      email: formData.email,
      website: formData.website || undefined,
      description: formData.description || undefined,
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadLogo(file);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex flex-col gap-6 md:flex-row md:gap-8">
        {/* Logo section */}
        <div className="flex flex-col items-center gap-3 md:w-1/3">
          <div className="relative">
            {university.logo ? (
              <div className="relative">
                <img src={logo} alt="Logo" className="h-24 w-24 rounded-full object-cover border border-white/20" />
                <button
                  type="button"
                  onClick={deleteLogo}
                  className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/10 border border-white/20">
                <Upload className="h-6 w-6 text-white/40" />
              </div>
            )}
          </div>
          <div>
            <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" id="logo-upload" />
            <label htmlFor="logo-upload">
              <Button type="button" variant="outline" disabled={uploadingLogo} className="border-white/20 text-white">
                {uploadingLogo ? 'Uploading...' : 'Upload Logo'}
              </Button>
            </label>
          </div>
        </div>

        {/* Form fields */}
        <div className="flex-1 space-y-4">
          <div>
            <Label className="text-white/80">University Name *</Label>
            <Input name="name" value={formData.name} onChange={handleChange} required className="bg-white/10 border-white/20 text-white" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-white/80">Address</Label>
              <Input name="address" value={formData.address} onChange={handleChange} className="bg-white/10 border-white/20 text-white" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-white/80">Wilaya (State)</Label>
              <Input name="wilaya" value={formData.wilaya} onChange={handleChange} className="bg-white/10 border-white/20 text-white" />
            </div>
            <div>
              <Label className="text-white/80">Phone</Label>
              <Input name="phone" value={formData.phone} onChange={handleChange} className="bg-white/10 border-white/20 text-white" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-white/80">Email</Label>
              <Input name="email" type="email" value={formData.email} onChange={handleChange} className="bg-white/10 border-white/20 text-white" />
            </div>
            <div>
              <Label className="text-white/80">Website</Label>
              <Input name="website" value={formData.website} onChange={handleChange} className="bg-white/10 border-white/20 text-white" />
            </div>
          </div>
          <div>
            <Label className="text-white/80">Established Year</Label>
            <Input name="establishedYear" type="number" value={formData.establishedYear} onChange={handleChange} className="bg-white/10 border-white/20 text-white" />
          </div>
          <div>
            <Label className="text-white/80">Description</Label>
            <Textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="bg-white/10 border-white/20 text-white" />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={saving} className="bg-[#639922] text-white hover:bg-[#4f7a1a]">
          <Save className="mr-2 h-4 w-4" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}