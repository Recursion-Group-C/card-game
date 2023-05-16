import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Database } from '../utils/database.types';

type Profiles =
  Database['public']['Tables']['profiles']['Row'];

const Avatar = ({
  uid,
  url,
  size,
  canUpLoad,
  onUpload
}: {
  uid: string;
  url: Profiles['avatar_url'];
  size: number;
  canUpLoad: boolean;
  onUpload: (url: string) => void;
}) => {
  const supabase = useSupabaseClient<Database>();
  const [avatarUrl, setAvatarUrl] =
    useState<Profiles['avatar_url']>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (url) downloadImage(url); // eslint-disable-line @typescript-eslint/no-use-before-define
  }, [url]);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage
        .from('avatars')
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data); // eslint-disable-line @typescript-eslint/no-shadow
      setAvatarUrl(url);
    } catch (error) {
      console.log('Error downloading image: ', error);
    }
  }

  const uploadAvatar: React.ChangeEventHandler<
    HTMLInputElement
  > = async (event) => {
    try {
      setUploading(true);

      if (
        !event.target.files ||
        event.target.files.length === 0
      ) {
        throw new Error(
          'You must select an image to upload.'
        );
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${uid}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath);
    } catch (error) {
      alert('Error uploading avatar!');
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="inline">
      {avatarUrl && canUpLoad && (
        <Image
          src={avatarUrl}
          alt="Avatar"
          className="image avatar"
          width={size}
          height={size}
        />
      )}
      {avatarUrl && !canUpLoad && (
        <div className="avatar">
          <div className="w-10 rounded-full">
            <Image
              src={avatarUrl}
              alt="Avatar"
              width={size}
              height={size}
            />
          </div>
        </div>
      )}
      {!avatarUrl && (
        <div
          className="no-image avatar"
          style={{ height: size, width: size }}
        />
      )}
      {canUpLoad && (
        <div style={{ width: size }}>
          <label
            className="button primary block"
            htmlFor="single"
          >
            {uploading ? 'Uploading ...' : 'Upload'}
          </label>
          <input
            style={{
              visibility: 'hidden',
              position: 'absolute'
            }}
            type="file"
            id="single"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
          />
        </div>
      )}
    </div>
  );
};

export default Avatar;
