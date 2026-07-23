'use client';

import { Camera, Eye, EyeOff, Loader2, Mail, MapPin, Phone, User } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import type { User as UserType } from '@/app/actions/users';
import { createUser, updateUser } from '@/app/actions/users';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';

export function UserForm({ user }: { user?: UserType }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditing = !!user;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar ?? null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('La imagen no puede superar 2MB');
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async (userId: string): Promise<string | null> => {
    if (!avatarFile) {
      console.log('No new avatar file selected, keeping existing:', user?.avatar);
      return user?.avatar ?? null;
    }

    setUploadingAvatar(true);
    try {
      const supabase = createClient();
      const fileExt = avatarFile.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`; // Removed 'avatars/' prefix since bucket is 'avatars'

      console.log('Uploading avatar to:', filePath);

      // First, try to delete old avatar if exists
      if (user?.avatar) {
        try {
          const oldPath = user.avatar.split('/').pop();
          if (oldPath) {
            await supabase.storage.from('avatars').remove([oldPath]);
          }
        } catch (e) {
          console.log('Could not delete old avatar:', e);
        }
      }

      const { data, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile, {
          upsert: true,
          contentType: avatarFile.type,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        setError(`Error al subir imagen: ${uploadError.message}`);
        return user?.avatar ?? null;
      }

      console.log('Upload successful:', data);

      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(filePath);

      console.log('Public URL:', publicUrl);
      return publicUrl;
    } catch (err) {
      console.error('Avatar upload failed:', err);
      setError('Error al subir la imagen');
      return user?.avatar ?? null;
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const role = formData.get('role') as 'app_admin' | 'user' | 'organization_admin';
    const status = formData.get('status') as 'active' | 'inactive';

    try {
      if (isEditing) {
        // UPDATE MODE
        const avatarUrl = await uploadAvatar(user.id);

        const result = await updateUser(user.id, {
          firstName,
          lastName,
          phone: phone || undefined,
          address: address || undefined,
          avatar: avatarUrl || undefined,
          role,
          status,
        });

        if (!result) {
          setError('Error al actualizar usuario');
          setLoading(false);
          return;
        }

        toast.success('Usuario actualizado exitosamente');
      } else {
        // CREATE MODE
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        const result = await createUser({
          email,
          password,
          firstName,
          lastName,
          phone: phone || undefined,
          address: address || undefined,
          role,
        });

        if (!result.success) {
          setError(result.error || 'Error al crear usuario');
          setLoading(false);
          return;
        }

        // Upload avatar if selected
        if (avatarFile && result.user) {
          const avatarUrl = await uploadAvatar(result.user.id);
          if (avatarUrl) {
            await updateUser(result.user.id, { avatar: avatarUrl });
          }
        }

        toast.success('Usuario creado exitosamente');
      }

      router.push('/admin/users');
      router.refresh();
    } catch (err) {
      console.error('Submit error:', err);
      setError(isEditing ? 'Error al actualizar usuario' : 'Error al crear usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-error/20 bg-error-light p-4 text-sm text-error">
          {error}
        </div>
      )}

      {/* Avatar Upload */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl bg-gradient-brand text-white shadow-lg">
            {avatarPreview ? (
              <Image
                src={avatarPreview}
                alt="Avatar preview"
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <User className="h-10 w-10" />
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-neutral-600 shadow-md transition-colors hover:bg-neutral-50"
          >
            <Camera className="h-4 w-4" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>
        <div>
          <p className="font-medium text-neutral-900">Foto de perfil</p>
          <p className="text-sm text-neutral-500">JPG, PNG o GIF. Máximo 2MB.</p>
          {avatarFile && <p className="mt-1 text-xs text-success">Nueva imagen seleccionada</p>}
        </div>
      </div>

      {/* Form Fields - Row 1: Name */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nombre *</Label>
          <Input
            id="firstName"
            name="firstName"
            placeholder="Juan"
            defaultValue={user?.firstName ?? ''}
            required
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Apellido *</Label>
          <Input
            id="lastName"
            name="lastName"
            placeholder="Pérez"
            defaultValue={user?.lastName ?? ''}
            required
            className="h-11"
          />
        </div>
      </div>

      {/* Row 2: Email & Password (password only for create) */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico {!isEditing && '*'}</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="juan@ejemplo.com"
              defaultValue={user?.email ?? ''}
              disabled={isEditing}
              required={!isEditing}
              className={`h-11 pl-10 ${isEditing ? 'bg-neutral-100 cursor-not-allowed' : ''}`}
            />
          </div>
          {isEditing && (
            <p className="text-xs text-neutral-500">El email no puede ser modificado</p>
          )}
        </div>

        {!isEditing ? (
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña *</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                required
                minLength={8}
                className="h-11 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-xs text-neutral-500">Mínimo 8 caracteres</p>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="status">Estado *</Label>
            <select
              id="status"
              name="status"
              defaultValue={user?.status ?? 'active'}
              required
              className="flex h-11 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-highlight focus-visible:ring-offset-2"
            >
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
          </div>
        )}
      </div>

      {/* Row 3: Phone & Role */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+52 81 1234 5678"
              defaultValue={user?.phone ?? ''}
              className="h-11 pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Rol *</Label>
          <select
            id="role"
            name="role"
            defaultValue={user?.role ?? 'user'}
            required
            className="flex h-11 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-highlight focus-visible:ring-offset-2"
          >
            <option value="user">Usuario</option>
            <option value="organization_admin">Admin de Organización</option>
            <option value="app_admin">Administrador</option>
          </select>
        </div>
      </div>

      {/* Status (only for create, since it's in row 2 for edit) */}
      {!isEditing && (
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="status">Estado *</Label>
            <select
              id="status"
              name="status"
              defaultValue="active"
              required
              className="flex h-11 w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-highlight focus-visible:ring-offset-2"
            >
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
          </div>
          <div /> {/* Empty space for grid alignment */}
        </div>
      )}

      {/* Address */}
      <div className="space-y-2">
        <Label htmlFor="address">Dirección</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-neutral-400" />
          <textarea
            id="address"
            name="address"
            rows={2}
            placeholder="Calle, número, colonia, ciudad..."
            defaultValue={user?.address ?? ''}
            className="flex w-full rounded-md border border-neutral-200 bg-white pl-10 pr-3 py-2 text-sm ring-offset-white placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-highlight focus-visible:ring-offset-2"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 border-t border-neutral-100 pt-6">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-gradient-brand text-white hover:opacity-90"
          disabled={loading || uploadingAvatar}
        >
          {loading || uploadingAvatar ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {uploadingAvatar ? 'Subiendo foto...' : isEditing ? 'Guardando...' : 'Creando...'}
            </>
          ) : isEditing ? (
            'Guardar Cambios'
          ) : (
            'Crear Usuario'
          )}
        </Button>
      </div>
    </form>
  );
}
